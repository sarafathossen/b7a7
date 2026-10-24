// src/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("accessToken")?.value;
  const role = request.cookies.get("userRole")?.value;
  const { pathname } = request.nextUrl;

  // ১. ড্যাশবোর্ড রাউটগুলোতে আন-অথেন্টিকেটেড ইউজার আটকানো
  const isProtectedRoute = 
    pathname.startsWith("/admin") || 
    pathname.startsWith("/caller") || 
    pathname.startsWith("/driver");

  if (!token && isProtectedRoute) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // ২. রোল অনুযায়ী প্রোটেকশন
  if (pathname.startsWith("/admin") && role !== "ADMIN") {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (pathname.startsWith("/driver") && role !== "DRIVER") {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (pathname.startsWith("/caller") && role !== "CALLER") {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // ৩. ইতিমধ্যে লগইন থাকলে লগইন/রেজিস্টার পেজে যেতে না দিয়ে স্ব স্ব ড্যাশবোর্ডে পাঠানো
  if (token && (pathname === "/login" || pathname === "/register")) {
    if (role === "ADMIN") return NextResponse.redirect(new URL("/admin", request.url));
    if (role === "DRIVER") return NextResponse.redirect(new URL("/driver", request.url));
    return NextResponse.redirect(new URL("/caller", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/caller/:path*",
    "/driver/:path*",
    "/login",
    "/register",
  ],
};