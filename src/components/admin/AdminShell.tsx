"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import { BarChart3, FileText, Inbox, Package, SlidersHorizontal, Terminal, ExternalLink, LogOut } from "lucide-react";
import { Logo } from "@/components/marketing/Logo";

function SignOutButton() {
  const router = useRouter();
  async function onClick() {
    await fetch("/api/simple-auth/logout", { method: "POST" });
    router.push("/sign-in");
    router.refresh();
  }
  return (
    <button type="button" onClick={onClick} className="flex items-center gap-1 text-ink-soft hover:text-ink" title="Sign out">
      <LogOut size={16} />
    </button>
  );
}

const NAV = [
  { href: "/admin", label: "Overview", icon: BarChart3, exact: true },
  { href: "/admin/content", label: "Content", icon: FileText },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/leads", label: "Leads", icon: Inbox },
  { href: "/admin/fields", label: "Fields", icon: SlidersHorizontal },
  { href: "/admin/query", label: "Query", icon: Terminal },
];

export function AdminShell({
  children,
  email,
  authEnabled,
  simpleAuth = false,
}: {
  children: React.ReactNode;
  email: string | null;
  authEnabled: boolean;
  simpleAuth?: boolean;
}) {
  const pathname = usePathname();
  return (
    <div className="flex min-h-screen bg-mist">
      <aside className="hidden w-60 shrink-0 flex-col border-r border-line bg-paper px-4 py-5 md:flex">
        <Link href="/admin" className="px-2">
          <Logo />
        </Link>
        <nav className="mt-8 flex flex-col gap-1">
          {NAV.map((item) => {
            const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-[15px] font-medium ${
                  active ? "bg-teal-tint text-ink" : "text-ink-soft hover:bg-mist hover:text-ink"
                }`}
              >
                <Icon size={17} />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto space-y-3 px-2">
          <Link href="/" className="flex items-center gap-1.5 text-sm text-ink-soft hover:text-ink">
            View site <ExternalLink size={14} />
          </Link>
          <div className="flex items-center gap-2.5 border-t border-line pt-3">
            {authEnabled && (simpleAuth ? <SignOutButton /> : <UserButton />)}
            <span className="truncate text-xs text-muted">{email ?? "admin"}</span>
          </div>
        </div>
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-line bg-paper px-4 py-3 md:hidden">
          <Logo />
          {authEnabled && (simpleAuth ? <SignOutButton /> : <UserButton />)}
        </header>
        <nav className="flex gap-1 overflow-x-auto border-b border-line bg-paper px-3 py-2 md:hidden">
          {NAV.map((item) => (
            <Link key={item.href} href={item.href} className="whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium text-ink-soft">
              {item.label}
            </Link>
          ))}
        </nav>
        <main className="flex-1 p-5 md:p-8">{children}</main>
      </div>
    </div>
  );
}
