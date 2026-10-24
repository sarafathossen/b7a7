import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("accessToken")?.value;
  const role = request.cookies.get("userRole")?.value;
  const { pathname } = request.nextUrl;

  if (!token && (pathname.startsWith("/admin") || pathname.startsWith("/caller") || pathname.startsWith("/driver"))) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (pathname.startsWith("/admin") && role !== "ADMIN") {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (pathname.startsWith("/driver") && role !== "DRIVER") {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (pathname.startsWith("/caller") && role !== "CALLER") {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/caller/:path*", "/driver/:path*"],
};