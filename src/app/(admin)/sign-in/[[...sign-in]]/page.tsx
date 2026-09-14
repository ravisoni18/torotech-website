import { SignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { Logo } from "@/components/marketing/Logo";
import { AUTH_DISABLED, SIMPLE_AUTH_ENABLED } from "@/lib/auth-config";
import { SimpleSignInForm } from "@/components/admin/SimpleSignInForm";

export const metadata = { title: "Sign in", robots: { index: false } };

export default function SignInPage() {
  if (AUTH_DISABLED) redirect("/admin");
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 bg-mist px-4">
      <Logo />
      {SIMPLE_AUTH_ENABLED ? <SimpleSignInForm /> : <SignIn />}
    </div>
  );
}
