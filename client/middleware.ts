import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const publicPaths = ["/", "/login", "/register", "/admin/login"];

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const adminToken = req.cookies.get("admin_token")?.value;
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    if (!adminToken) return NextResponse.redirect(new URL("/admin/login", req.url));
  }

  if (pathname.startsWith("/dashboard") && !token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if ((pathname === "/login" || pathname === "/register") && token) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*", "/login", "/register"],
};
