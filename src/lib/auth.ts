import "server-only";
import { auth, currentUser } from "@clerk/nextjs/server";
import { AUTH_DISABLED } from "./auth-config";

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
