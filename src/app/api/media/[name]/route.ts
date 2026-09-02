import { NextResponse } from "next/server";
import fs from "node:fs/promises";
import path from "node:path";
import { DATA_DIR } from "@/lib/db";

export const runtime = "nodejs";

const TYPES: Record<string, string> = {
  ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".webp": "image/webp",
  ".gif": "image/gif", ".svg": "image/svg+xml", ".pdf": "application/pdf",
};

export async function GET(_req: Request, { params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;
  if (!/^[\w.-]+$/.test(name)) return new NextResponse("Not found", { status: 404 });
  const file = path.join(DATA_DIR, "uploads", name);
  try {
    const data = await fs.readFile(file);
    return new NextResponse(new Uint8Array(data), {
      headers: {
        "content-type": TYPES[path.extname(name).toLowerCase()] ?? "application/octet-stream",
        "cache-control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new NextResponse("Not found", { status: 404 });
  }
}
