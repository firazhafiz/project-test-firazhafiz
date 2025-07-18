import { NextResponse } from "next/server";
import axios from "axios";
import fs from "fs";
import path from "path";

export async function GET(request: Request) {
  console.log("Proxy Endpoint Hit");
  const { searchParams } = new URL(request.url);
  const imageUrl = searchParams.get("url");

  console.log("Proxy Request:", imageUrl);

  if (!imageUrl) {
    console.log("No image URL provided");
    return NextResponse.json(
      { error: "Image URL is required" },
      { status: 400 }
    );
  }

  try {
    const response = await axios.get(imageUrl, {
      responseType: "arraybuffer",
      headers: {
        Referer: "https://project-test-firazhafiz.vercel.app",
        "User-Agent":
          "Mozilla/5.0 (compatible; VercelBot/1.0; +https://vercel.com)",
      },
    });

    const headers = {
      "Content-Type": response.headers["content-type"] || "image/jpeg",
      "Cache-Control": "public, max-age=31536000",
    };

    console.log("Proxy Success:", headers["Content-Type"]);
    return new NextResponse(response.data, { headers, status: 200 });
  } catch (error: unknown) {
    console.error("Image Proxy Error:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch image",
        detail: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
