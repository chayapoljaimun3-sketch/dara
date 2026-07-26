import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const sessionToken = request.cookies.get("better-auth.session_token")
  const { pathname } = request.nextUrl

  // Protect /admin routes
  if (pathname.startsWith("/admin")) {
    if (!sessionToken) {
      return NextResponse.redirect(new URL("/auth/login", request.url))
    }
  }

  // If logged in, redirect away from /auth/* (except /auth/logout) to /admin/dashboard
  if (pathname.startsWith("/auth") && pathname !== "/auth/logout") {
    if (sessionToken) {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*", "/auth/:path*"],
}
