import { type NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const protectedRoutes = ["/checkout"];

const authRoutes = ["/login", "/signup"];

const getJwtSecretKey = () => {
  const secret = process.env.ACCESS_TOKEN_SECRET;
  if (!secret) throw new Error("ACCESS_TOKEN_SECRET is not set.");
  return new TextEncoder().encode(secret);
};

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.some((route) => path.startsWith(route));
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
    } catch (_) {
    }
  }

  if (refreshToken) {
    if (isProtectedRoute || isAuthRoute) {
      const rotateUrl = new URL("/api/auth/rotate", req.url);
      rotateUrl.searchParams.set("redirect", path);
      return NextResponse.redirect(rotateUrl);
    }

    return NextResponse.next();
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
