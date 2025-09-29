import { NextRequest, NextResponse } from "next/server";
import { auth } from "./utils/actions/auth/auth";

export async function middleware(request: NextRequest) {
  console.log("Middleware is running");

  const session = await auth();
  console.log("Session:", session);

  const path = request.nextUrl.pathname;
  const isPublic = path === "/" || path === "/sign-in";

  // 1. Unauthenticated users should not access protected routes
  if (!session && !isPublic) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  // 2. Logged-in users should not access public routes

  // if (session && isPublic) {
  //   const role = session.user.role === "admin" ? "admin" : "dashboard";
  //   return NextResponse.redirect(new URL(`/${role}`, request.url));
  // }

  if (session && path === "/sign-in") {
    const callbackUrl = request.nextUrl.searchParams.get("callbackUrl");

    // ✅ Let user through if callbackUrl is present (don't redirect them away)
    if (callbackUrl) {
      return NextResponse.next(); // allow NextAuth to handle redirect
    }

    // Otherwise redirect manually
    const role = session.user.role === "admin" ? "admin" : "dashboard";
    return NextResponse.redirect(new URL(`/${role}`, request.url));
  }
  // 3. Admin should be redirected away from /dashboard root
  if (session?.user.role === "admin" && path === "/dashboard") {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  // 4. Non-admin users should not access /admin routes
  if (session?.user.role !== "admin" && path.startsWith("/admin")) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/sign-in", "/dashboard/:path*", "/admin/:path*"],
  runtime: "nodejs", // instead of edge
};