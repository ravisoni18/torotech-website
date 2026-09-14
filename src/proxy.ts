import { NextRequest, NextResponse } from "next/server";
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { AUTH_DISABLED, SIMPLE_AUTH_ENABLED } from "@/lib/auth-config";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/simple-session";

const isProtected = createRouteMatcher(["/admin(.*)", "/api/admin(.*)"]);

// Clerk only runs on the admin surface; the public site has no auth dependency.
const withClerk = clerkMiddleware(async (auth, req) => {
  if (isProtected(req)) await auth.protect();
});

async function withSimpleAuth(req: NextRequest) {
  if (isProtected(req) && !(await verifySessionToken(req.cookies.get(SESSION_COOKIE)?.value))) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }
  return NextResponse.next();
}

export default AUTH_DISABLED ? () => NextResponse.next() : SIMPLE_AUTH_ENABLED ? withSimpleAuth : withClerk;

export const config = {
  matcher: ["/admin(.*)", "/api/admin(.*)", "/sign-in(.*)"],
};
