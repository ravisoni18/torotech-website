import "server-only";
import { NextResponse } from "next/server";
import { requireAdmin } from "./auth";

/** Wrap an admin API handler with the auth check and uniform error handling. */
export function adminRoute<Ctx>(handler: (req: Request, ctx: Ctx) => Promise<Response>) {
  return async (req: Request, ctx: Ctx) => {
    const gate = await requireAdmin();
    if (!gate.ok) {
      return NextResponse.json(
        { ok: false, error: gate.reason === "forbidden" ? "This account is not an admin." : "Sign in required." },
        { status: gate.reason === "forbidden" ? 403 : 401 },
      );
    }
    try {
      return await handler(req, ctx);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      return NextResponse.json({ ok: false, error: message }, { status: 400 });
    }
  };
}
