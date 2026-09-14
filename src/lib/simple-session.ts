import "server-only";
import { SIMPLE_AUTH_EMAIL, SIMPLE_AUTH_PASSWORD } from "./auth-config";

// Web Crypto (not Node's `crypto` module) so this also works from middleware, which runs on the edge runtime.

export const SESSION_COOKIE = "torotech_admin_session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // seconds

function sessionSecret() {
  return process.env.SESSION_SECRET || process.env.ANALYTICS_SALT || "torotech-dev-secret";
}

function bufToHex(buf: ArrayBuffer) {
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function sign(payload: string) {
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(sessionSecret()), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payload));
  return bufToHex(sig);
}

// Constant-time compare — timing attacks aren't Web Crypto's job, so we do it by hand.
function timingSafeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export async function createSessionToken() {
  const expires = Date.now() + SESSION_MAX_AGE * 1000;
  const sig = await sign(`admin.${expires}`);
  return { token: `${expires}.${sig}`, maxAge: SESSION_MAX_AGE };
}

export async function verifySessionToken(token: string | undefined | null): Promise<boolean> {
  if (!token) return false;
  const dot = token.indexOf(".");
  if (dot === -1) return false;
  const expires = Number(token.slice(0, dot));
  if (!Number.isFinite(expires) || Date.now() > expires) return false;
  const expected = await sign(`admin.${expires}`);
  return timingSafeEqual(token.slice(dot + 1), expected);
}

export function verifyCredentials(email: string, password: string) {
  if (!SIMPLE_AUTH_EMAIL || !SIMPLE_AUTH_PASSWORD) return false;
  return timingSafeEqual(email.trim().toLowerCase(), SIMPLE_AUTH_EMAIL.trim().toLowerCase()) && timingSafeEqual(password, SIMPLE_AUTH_PASSWORD);
}
