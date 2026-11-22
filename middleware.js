import { NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

// First line of defence: if there is no login cookie, go to Sign In.
// (Roles are checked again in the dashboard layout AND on the Express server.)
export function middleware(request) {
  const hasSession = getSessionCookie(request);
  if (!hasSession) {
    const url = new URL("/signin", request.url);
    url.searchParams.set("redirect", request.nextUrl.pathname + request.nextUrl.search);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/services/:id", "/payment/:path*"],
};
