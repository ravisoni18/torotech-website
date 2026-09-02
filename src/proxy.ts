import { NextResponse } from "next/server";
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { AUTH_DISABLED } from "@/lib/auth-config";

const isProtected = createRouteMatcher(["/admin(.*)", "/api/admin(.*)"]);

// Clerk only runs on the admin surface; the public site has no auth dependency.
const withClerk = clerkMiddleware(async (auth, req) => {
  if (isProtected(req)) await auth.protect();
});

export default AUTH_DISABLED ? () => NextResponse.next() : withClerk;

export const config = {
  matcher: ["/admin(.*)", "/api/admin(.*)", "/sign-in(.*)"],
};
