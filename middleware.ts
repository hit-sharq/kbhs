import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  try {
    const sessionId = request.cookies.get("session_id")?.value
    const { pathname } = request.nextUrl

    // Public routes
    const publicRoutes = ["/login", "/register", "/"]

    // Check if the route is public
    if (publicRoutes.includes(pathname)) {
      // If user is logged in and trying to access login/register, redirect to dashboard
      if (sessionId && (pathname === "/login" || pathname === "/register")) {
        return NextResponse.redirect(new URL("/dashboard", request.url))
      }
      return NextResponse.next()
    }

    // Protected routes - check for session
    if (!sessionId) {
      return NextResponse.redirect(new URL("/login", request.url))
    }

    return NextResponse.next()
  } catch (error) {
    console.error("Middleware error:", error)
    // In case of error, redirect to login
    return NextResponse.redirect(new URL("/login", request.url))
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}

