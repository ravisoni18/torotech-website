"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";

export type PublicField = {
  key: string;
  label: string;
  type: string;
  options: string[];
  required: boolean;
};

const INTERESTS = [
  "AI agents for S/4HANA",
  "BTP extension or integration",
  "Fiori / UI5 application",
  "Web app with AI",
  "Not sure yet",
];

const input =
  "w-full rounded-lg border border-line bg-paper px-3.5 py-2.5 text-[15px] text-ink placeholder:text-muted focus:border-teal focus:outline-none";

export function ContactForm({ fields, defaultInterest }: { fields: PublicField[]; defaultInterest?: string }) {
  const pathname = usePathname();
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const custom: Record<string, unknown> = {};
    for (const f of fields) custom[f.key] = f.type === "boolean" ? fd.get(`f_${f.key}`) === "on" : fd.get(`f_${f.key}`);

    setState("sending");
    setError(null);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name: fd.get("name"),
          email: fd.get("email"),
          company: fd.get("company") || null,
          interest: fd.get("interest") || null,
          message: fd.get("message") || null,
          website: fd.get("website") || "",
          source: "contact-form",
          page: pathname,
          fields: custom,
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.error ?? "Something went wrong.");
      setState("sent");
      form.reset();
    } catch (err) {
      setState("error");
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  if (state === "sent") {
    return (
      <div className="rounded-[var(--radius-card)] border border-teal bg-teal-tint/50 p-8">
        <h3 className="text-xl font-bold text-ink">Message sent</h3>
        <p className="mt-2 text-ink-soft">
          Thanks — you&apos;ll hear from Ravi within one business day. If it&apos;s urgent, email{" "}
          <a className="font-semibold text-teal-deep" href="mailto:hello@torotech.ca">
            hello@torotech.ca
          </a>
          .
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-5" noValidate>
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="grid gap-1.5 text-sm font-medium text-ink">
          Name
          <input name="name" required minLength={2} autoComplete="name" className={input} />
        </label>
        <label className="grid gap-1.5 text-sm font-medium text-ink">
          Work email
          <input name="email" type="email" required autoComplete="email" className={input} />
        </label>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="grid gap-1.5 text-sm font-medium text-ink">
          Company
          <input name="company" autoComplete="organization" className={input} />
        </label>
        <label className="grid gap-1.5 text-sm font-medium text-ink">
          What are you looking at?
          <select name="interest" defaultValue={defaultInterest ?? ""} className={input}>
            <option value="">Choose one</option>
            {INTERESTS.map((i) => (
              <option key={i} value={i}>
                {i}
              </option>
            ))}
          </select>
        </label>
      </div>

      {fields.length > 0 && (
        <div className="grid gap-5 sm:grid-cols-2">
          {fields.map((f) => (
            <CustomField key={f.key} f={f} />
          ))}
        </div>
      )}

      <label className="grid gap-1.5 text-sm font-medium text-ink">
        Tell us about the process
        <textarea
          name="message"
          rows={5}
          className={input}
          placeholder="What happens today, who does it, and what goes wrong."
        />
      </label>

      {/* Honeypot: hidden from people, filled by bots */}
      <div className="absolute left-[-9999px]" aria-hidden="true">
        <label>
          Website
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      {error && (
        <p role="alert" className="rounded-lg bg-[#fdecea] px-4 py-3 text-sm text-coral">
          {error}
        </p>
      )}

      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={state === "sending"}
          className="rounded-full bg-ink px-6 py-3 font-semibold text-white transition-colors hover:bg-teal-deep disabled:opacity-60"
        >
          {state === "sending" ? "Sending…" : "Send message"}
        </button>
        <span className="text-sm text-muted">We reply within one business day.</span>
      </div>
    </form>
  );
}

function CustomField({ f }: { f: PublicField }) {
  const name = `f_${f.key}`;
  if (f.type === "boolean") {
    return (
      <label className="flex items-center gap-2.5 text-sm font-medium text-ink">
        <input type="checkbox" name={name} className="h-4 w-4 accent-[var(--teal)]" />
        {f.label}
      </label>
    );
  }
  if (f.type === "select") {
    return (
      <label className="grid gap-1.5 text-sm font-medium text-ink">
        {f.label}
        <select name={name} required={f.required} className={input} defaultValue="">
          <option value="">Choose one</option>
          {f.options.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      </label>
    );
  }
  if (f.type === "textarea" || f.type === "list") {
    return (
      <label className="grid gap-1.5 text-sm font-medium text-ink sm:col-span-2">
        {f.label}
        <textarea name={name} rows={3} required={f.required} className={input} />
      </label>
    );
  }
  const type = f.type === "number" ? "number" : f.type === "url" ? "url" : f.type === "date" ? "date" : "text";
  return (
    <label className="grid gap-1.5 text-sm font-medium text-ink">
      {f.label}
      <input name={name} type={type} required={f.required} className={input} />
    </label>
  );
}
