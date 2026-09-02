import { NextResponse } from "next/server";
import fs from "node:fs/promises";
import path from "node:path";
import { DATA_DIR } from "@/lib/db";

export const runtime = "nodejs";

const TYPES: Record<string, string> = {
  ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".webp": "image/webp",
  ".gif": "image/gif", ".svg": "image/svg+xml", ".pdf": "application/pdf",
  ".mp4": "video/mp4", ".webm": "video/webm", ".mov": "video/quicktime", ".m4v": "video/mp4",
};

const CACHE = "public, max-age=31536000, immutable";

export async function GET(req: Request, { params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;
  if (!/^[\w.-]+$/.test(name)) return new NextResponse("Not found", { status: 404 });
  const file = path.join(DATA_DIR, "uploads", name);
  const contentType = TYPES[path.extname(name).toLowerCase()] ?? "application/octet-stream";

  let data: Buffer;
  try {
    data = await fs.readFile(file);
  } catch {
    return new NextResponse("Not found", { status: 404 });
  }

  // Range requests — needed for <video> seeking (Safari won't play without it).
  const range = req.headers.get("range");
  const match = range && /^bytes=(\d*)-(\d*)$/.exec(range);
  if (match && contentType.startsWith("video/")) {
    const start = match[1] ? Number(match[1]) : 0;
    const end = match[2] ? Number(match[2]) : data.length - 1;
    if (start >= data.length || end >= data.length || start > end) {
      return new NextResponse("Range not satisfiable", {
        status: 416,
        headers: { "content-range": `bytes */${data.length}` },
      });
    }
    const chunk = data.subarray(start, end + 1);
    return new NextResponse(new Uint8Array(chunk), {
      status: 206,
      headers: {
        "content-type": contentType,
        "content-range": `bytes ${start}-${end}/${data.length}`,
        "accept-ranges": "bytes",
        "content-length": String(chunk.length),
        "cache-control": CACHE,
      },
    });
  }

  return new NextResponse(new Uint8Array(data), {
    headers: {
      "content-type": contentType,
      "cache-control": CACHE,
      ...(contentType.startsWith("video/") ? { "accept-ranges": "bytes" } : {}),
    },
  });
}
