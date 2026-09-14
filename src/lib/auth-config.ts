/**
 * Simple email+password admin login (no third-party auth service). Enabled when both
 * env vars are set; takes priority over Clerk and the local-preview bypass.
 */
export const SIMPLE_AUTH_EMAIL = process.env.SIMPLE_AUTH_EMAIL;
export const SIMPLE_AUTH_PASSWORD = process.env.SIMPLE_AUTH_PASSWORD;
export const SIMPLE_AUTH_ENABLED = Boolean(SIMPLE_AUTH_EMAIL && SIMPLE_AUTH_PASSWORD);

/**
 * Local-preview mode: when no Clerk publishable key or simple-auth credentials are configured
 * AND AUTH_DISABLED=true, the admin opens without sign-in. These conditions are required so a
 * forgotten flag can never expose a configured production deployment.
 */
export const AUTH_DISABLED =
  process.env.AUTH_DISABLED === "true" &&
  !process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY &&
  !SIMPLE_AUTH_ENABLED;
