import { type NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const protectedRoutes = ["/checkout"];

const authRoutes = ["/login", "/signup"];

const ACCESS_TOKEN_SECRET = new TextEncoder().encode(
  process.env.ACCESS_TOKEN_SECRET,
);

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  const accessToken = req.cookies.get("accessToken")?.value;
  const refreshToken = req.cookies.get("refreshToken")?.value;

  let isAuthenticated = false;

  if (accessToken) {
    try {
      await jwtVerify(accessToken, ACCESS_TOKEN_SECRET);
      isAuthenticated = true;
    } catch (_) {
      if (refreshToken) isAuthenticated = true;
    }
  } else if (refreshToken) {
    isAuthenticated = true;
  }

  const isProtectedRoute = protectedRoutes.some((route) =>
    path.startsWith(route),
  );

  if (isProtectedRoute && !isAuthenticated) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("from", path);
    return NextResponse.redirect(loginUrl);
  }

  const isAuthRoute = authRoutes.includes(path);

  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
