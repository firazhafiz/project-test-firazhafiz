import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("file") as File;
  if (!file) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  // Simpan file ke /public/banner.jpg
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const publicPath = path.resolve("./public/banner.jpg");
  fs.writeFileSync(publicPath, buffer);

  // Update banner-meta.json
  const metaPath = path.resolve("./banner-meta.json");
  fs.writeFileSync(metaPath, JSON.stringify({ url: "/banner.jpg" }));

  return NextResponse.json({ url: "/banner.jpg" });
}
