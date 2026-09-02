import { NextResponse } from "next/server";
import fs from "node:fs/promises";
import path from "node:path";
import { adminRoute } from "@/lib/admin-api";
import { DATA_DIR } from "@/lib/db";

export const runtime = "nodejs";

const ALLOWED = new Set(["image/png", "image/jpeg", "image/webp", "image/gif", "image/svg+xml", "application/pdf"]);

export const POST = adminRoute(async (req) => {
  const form = await req.formData();
  const file = form.get("file");
  if (!(file instanceof File)) return NextResponse.json({ ok: false, error: "No file" }, { status: 400 });
  if (!ALLOWED.has(file.type)) return NextResponse.json({ ok: false, error: "Unsupported file type" }, { status: 400 });
  if (file.size > 15 * 1024 * 1024) return NextResponse.json({ ok: false, error: "File larger than 15 MB" }, { status: 400 });

  const ext = path.extname(file.name).toLowerCase() || "." + file.type.split("/")[1];
  const name = `${Date.now().toString(36)}-${crypto.randomUUID().slice(0, 8)}${ext}`;
  const dir = path.join(DATA_DIR, "uploads");
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(path.join(dir, name), Buffer.from(await file.arrayBuffer()));
  return NextResponse.json({ ok: true, url: `/api/media/${name}`, name });
});
