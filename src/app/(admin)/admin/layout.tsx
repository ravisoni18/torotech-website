import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { AUTH_DISABLED } from "@/lib/auth-config";
import { AdminShell } from "@/components/admin/AdminShell";

export const metadata = { title: "Admin", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const gate = await requireAdmin();
  if (!gate.ok) {
    if (gate.reason === "unauthenticated") redirect("/sign-in");
    return (
      <div className="flex min-h-screen items-center justify-center bg-mist px-4">
        <div className="max-w-md rounded-[var(--radius-card)] bg-paper p-8 text-center">
          <h1 className="text-xl font-bold text-ink">This account isn&apos;t an admin</h1>
          <p className="mt-2 text-ink-soft">
            Add your email to <code className="font-mono text-sm">ADMIN_EMAILS</code> in the server environment to open the content workspace.
          </p>
        </div>
      </div>
    );
  }
  return (
    <AdminShell email={gate.email} authEnabled={!AUTH_DISABLED}>
      {children}
    </AdminShell>
  );
}
