"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const input =
  "w-full rounded-lg border border-line bg-paper px-3.5 py-2.5 text-[15px] text-ink placeholder:text-muted focus:border-teal focus:outline-none";

export function SimpleSignInForm() {
  const router = useRouter();
  const [state, setState] = useState<"idle" | "sending">("idle");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setState("sending");
    setError(null);
    try {
      const res = await fetch("/api/simple-auth/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email: fd.get("email"), password: fd.get("password") }),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.error ?? "Something went wrong.");
      router.push("/admin");
      router.refresh();
    } catch (err) {
      setState("idle");
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  return (
    <form onSubmit={onSubmit} className="grid w-full max-w-sm gap-4 rounded-[var(--radius-card)] border border-line bg-paper p-8" noValidate>
      <label className="grid gap-1.5 text-sm font-medium text-ink">
        Email
        <input name="email" type="email" required autoComplete="username" className={input} />
      </label>
      <label className="grid gap-1.5 text-sm font-medium text-ink">
        Password
        <input name="password" type="password" required autoComplete="current-password" className={input} />
      </label>
      {error && (
        <p role="alert" className="rounded-lg bg-[#fdecea] px-4 py-3 text-sm text-coral">
          {error}
        </p>
      )}
      <button
        type="submit"
        disabled={state === "sending"}
        className="rounded-full bg-ink px-6 py-3 font-semibold text-white transition-colors hover:bg-teal-deep disabled:opacity-60"
      >
        {state === "sending" ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
