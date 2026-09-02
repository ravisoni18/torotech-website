import { NextResponse } from "next/server";
import fs from "node:fs/promises";
import path from "node:path";
import { adminRoute } from "@/lib/admin-api";
import { DATA_DIR } from "@/lib/db";

export const runtime = "nodejs";

const IMAGE = new Set(["image/png", "image/jpeg", "image/webp", "image/gif", "image/svg+xml", "application/pdf"]);
const VIDEO = new Set(["video/mp4", "video/webm", "video/quicktime"]);

const EXT_BY_TYPE: Record<string, string> = {
  "video/mp4": ".mp4",
  "video/webm": ".webm",
  "video/quicktime": ".mov",
  "image/svg+xml": ".svg",
  "application/pdf": ".pdf",
};

export const POST = adminRoute(async (req) => {
  const form = await req.formData();
  const file = form.get("file");
  if (!(file instanceof File)) return NextResponse.json({ ok: false, error: "No file" }, { status: 400 });

  const isVideo = VIDEO.has(file.type);
  if (!IMAGE.has(file.type) && !isVideo) {
    return NextResponse.json({ ok: false, error: "Unsupported file type" }, { status: 400 });
  }
  const limitMb = isVideo ? 50 : 15;
  if (file.size > limitMb * 1024 * 1024) {
    return NextResponse.json({ ok: false, error: `File larger than ${limitMb} MB` }, { status: 400 });
  }

  const ext = path.extname(file.name).toLowerCase() || EXT_BY_TYPE[file.type] || "." + file.type.split("/")[1];
  const name = `${Date.now().toString(36)}-${crypto.randomUUID().slice(0, 8)}${ext}`;
  const dir = path.join(DATA_DIR, "uploads");
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(path.join(dir, name), Buffer.from(await file.arrayBuffer()));
  return NextResponse.json({ ok: true, url: `/api/media/${name}`, name, kind: isVideo ? "video" : "image" });
});
