/**
 * Local-preview mode: when no Clerk publishable key is configured AND AUTH_DISABLED=true,
 * the admin opens without sign-in. Both conditions are required so a forgotten flag can never
 * expose a configured production deployment.
 */
export const AUTH_DISABLED =
  process.env.AUTH_DISABLED === "true" && !process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
