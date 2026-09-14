import "server-only";
import { cookies } from "next/headers";
import { auth, currentUser } from "@clerk/nextjs/server";
import { AUTH_DISABLED, SIMPLE_AUTH_ENABLED, SIMPLE_AUTH_EMAIL } from "./auth-config";
import { SESSION_COOKIE, verifySessionToken } from "./simple-session";

/**
 * Admin access = signed in with Clerk AND (no allowlist configured OR email on ADMIN_EMAILS).
 * ADMIN_EMAILS is a comma-separated list; leave it empty during setup, then lock it down.
 */
export async function requireAdmin() {
  if (AUTH_DISABLED) {
    if (!warned) {
      console.warn("[torotech] AUTH_DISABLED=true — the admin is open without sign-in. Configure Clerk before going live.");
      warned = true;
    }
    return { ok: true as const, email: "local-preview" };
  }
  if (SIMPLE_AUTH_ENABLED) {
    const token = (await cookies()).get(SESSION_COOKIE)?.value;
    if (!(await verifySessionToken(token))) return { ok: false as const, reason: "unauthenticated" as const };
    return { ok: true as const, email: SIMPLE_AUTH_EMAIL ?? null };
  }
  const { userId } = await auth();
  if (!userId) return { ok: false as const, reason: "unauthenticated" as const };
  const allow = (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
  if (allow.length === 0) return { ok: true as const, email: null };
  const user = await currentUser();
  const emails = user?.emailAddresses.map((e) => e.emailAddress.toLowerCase()) ?? [];
  const email = emails.find((e) => allow.includes(e));
  if (!email) return { ok: false as const, reason: "forbidden" as const };
  return { ok: true as const, email };
}

let warned = false;
