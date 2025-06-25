import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const protectedRoutes = ["/"];

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("auth-token")?.value;
  const { pathname } = request.nextUrl;
  const isAuthPage =
    pathname.startsWith("/auth/login") ||
    pathname.startsWith("/auth/register") ||
    pathname.startsWith("/auth/forgot-password") ||
    pathname.startsWith("/auth/reset-password");

  if (token && isAuthPage) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  const isProtectedRoute = protectedRoutes.some((route) => {
    return pathname.startsWith(route) && !isAuthPage;
  });

  if (!isProtectedRoute) {
    return NextResponse.next();
  }

  if (!token) {
    const url = new URL("/auth/login", request.url);
    url.searchParams.set("from", pathname);
    return NextResponse.redirect(url);
  }

  try {
    const secretKey = process.env.SECRET_KEY;
    const encodedKey = new TextEncoder().encode(secretKey);

    await jwtVerify(token, encodedKey, {
      algorithms: ["HS256"],
    });

    return NextResponse.next();
  } catch (error) {
    // If token is invalid, redirect to login
    const url = new URL("/auth/login", request.url);
    url.searchParams.set("from", pathname);
    return NextResponse.redirect(url);
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public directory)
     */
    "/((?!_next/static|_next/image|favicon.ico|public).*)",
  ],
};
