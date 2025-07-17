import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  const metaPath = path.resolve("./banner-meta.json");
  let url = "/banner.jpg";
  if (fs.existsSync(metaPath)) {
    try {
      const meta = JSON.parse(fs.readFileSync(metaPath, "utf-8"));
      if (meta.url) url = meta.url;
    } catch {}
  }
  return NextResponse.json({ url });
}
