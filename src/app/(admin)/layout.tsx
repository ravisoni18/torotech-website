import { ClerkProvider } from "@clerk/nextjs";
import { AUTH_DISABLED, SIMPLE_AUTH_ENABLED } from "@/lib/auth-config";

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  if (AUTH_DISABLED || SIMPLE_AUTH_ENABLED) return <>{children}</>;
  return (
    <ClerkProvider
      appearance={{ variables: { colorPrimary: "#0f9d9d", borderRadius: "10px" } }}
      signInUrl="/sign-in"
      signInFallbackRedirectUrl="/admin"
    >
      {children}
    </ClerkProvider>
  );
}
