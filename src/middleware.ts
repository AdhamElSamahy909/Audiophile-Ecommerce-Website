import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { checkEdgeRateLimit } from "./server/redis/rate-limit-edge";

const protectedRoutes = ["/orders", "/checkout"];

const authRoutes = ["/login", "/signup"];

const getJwtSecretKey = () => {
  const secret = process.env.ACCESS_TOKEN_SECRET;
  if (!secret) throw new Error("ACCESS_TOKEN_SECRET is not set.");
  return new TextEncoder().encode(secret);
};

export async function middleware(req: NextRequest) {
  const ipAddress = req.headers.get("x-forwarded-for") || "anonymous";
  const { success } = await checkEdgeRateLimit(ipAddress);

  if (!success) {
    return new NextResponse(
      "Too Many Requests. Please try again in a minute.",
      {
        status: 429,
        headers: {
          "Retry-After": "60",
        },
      },
    );
  }

  const path = req.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.some((route) =>
    path.startsWith(route),
  );
  const isAuthRoute = authRoutes.includes(path);

  const accessToken = req.cookies.get("accessToken")?.value;
  const refreshToken = req.cookies.get("refreshToken")?.value;

  if (accessToken) {
    try {
      await jwtVerify(accessToken, getJwtSecretKey());

      if (isAuthRoute) {
        return NextResponse.redirect(new URL("/", req.url));
      }

      return NextResponse.next();
    } catch (_) {}
  }

  if (refreshToken) {
    let baseUrl = req.nextUrl.origin;
    if (process.env.NODE_ENV === "development") {
      baseUrl = baseUrl.replace("localhost", "127.0.0.1");
    }

    const rotateApiUrl = new URL("/api/auth/rotate", baseUrl);

    try {
      const rotationResponse = await fetch(rotateApiUrl.toString(), {
        method: "POST",
        headers: {
          cookie: req.headers.get("cookie") || "",
        },
      });

      if (!rotationResponse.ok) {
        const loginUrl = new URL("/login", req.url);
        loginUrl.searchParams.set("from", path);
        const response = NextResponse.redirect(loginUrl);
        response.cookies.delete("accessToken");
        response.cookies.delete("refreshToken");
        return response;
      }

      let finalResponse;
      if (isAuthRoute) {
        finalResponse = NextResponse.redirect(new URL("/", req.url));
      } else {
        finalResponse = NextResponse.next();
      }

      const setCookieHeaders = rotationResponse.headers.getSetCookie();

      for (const cookieStr of setCookieHeaders) {
        finalResponse.headers.append("Set-Cookie", cookieStr);
      }

      return finalResponse;
    } catch (error) {
      console.error("Middleware fetch error: ", error);
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("from", path);
      return NextResponse.redirect(loginUrl);
    }
  }

  if (isProtectedRoute) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("from", path);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

// if (refreshToken) {
//   // 1. Construct a safe Base URL that forces IPv4 in local development
//   let baseUrl = req.nextUrl.origin;
//   if (process.env.NODE_ENV === "development") {
//     baseUrl = baseUrl.replace("localhost", "127.0.0.1");
//   }

//   // 2. Build the exact API URL
//   const rotateApiUrl = new URL("/api/auth/rotate", baseUrl);

//   try {
//     // 3. Execute the fetch inside a try/catch to gracefully handle future network blips
//     const rotationResponse = await fetch(rotateApiUrl.toString(), {
//       method: "POST",
//       headers: {
//         cookie: req.headers.get("cookie") || "",
//       },
//     });

//     if (!rotationResponse.ok) {
//       const loginUrl = new URL("/login", req.url);
//       loginUrl.searchParams.set("from", path);
//       const response = NextResponse.redirect(loginUrl);
//       response.cookies.delete("accessToken");
//       response.cookies.delete("refreshToken");
//       return response;
//     }

//     let finalResponse;
//     if (isAuthRoute) {
//       finalResponse = NextResponse.redirect(new URL("/", req.url));
//     } else {
//       finalResponse = NextResponse.next();
//     }

//     const setCookieHeaders = rotationResponse.headers.getSetCookie();
//     for (const cookieStr of setCookieHeaders) {
//       finalResponse.headers.append("Set-Cookie", cookieStr);
//     }

//     return finalResponse;
//   } catch (error) {
//     // If the fetch fails entirely (e.g., network down), fallback to login
//     console.error("Middleware fetch error:", error);
//     const loginUrl = new URL("/login", req.url);
//     loginUrl.searchParams.set("from", path);
//     return NextResponse.redirect(loginUrl);
//   }
// }
