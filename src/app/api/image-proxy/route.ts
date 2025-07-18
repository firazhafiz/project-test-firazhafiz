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
        Referer: "http://localhost:3000",
        // Tambahkan autentikasi jika disediakan oleh Suitmedia
        // "Authorization": `Bearer your-api-token`,
      },
    });

    const headers = {
      "Content-Type": response.headers["content-type"] || "image/jpeg",
      "Cache-Control": "public, max-age=31536000",
    };

    console.log("Proxy Success:", headers["Content-Type"]);
    return new NextResponse(response.data, { headers, status: 200 });
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error("Image Proxy Error:", {
        status: error.response?.status,
        data: error.response?.data?.toString() || error.message,
      });
      if (error.response?.status === 403) {
        console.log("Access Denied, serving fallback");
        try {
          const fallbackPath = path.resolve("");
          if (!fs.existsSync(fallbackPath)) {
            throw new Error("Fallback image not found");
          }
          const fallbackData = fs.readFileSync(fallbackPath);
          const fallbackHeaders = {
            "Content-Type": "image/png", // Pastikan tipe konten sesuai
            "Cache-Control": "public, max-age=31536000",
          };
          console.log("Fallback Served:", fallbackHeaders["Content-Type"]);
          return new NextResponse(fallbackData, {
            headers: fallbackHeaders,
            status: 200,
          });
        } catch (fallbackError) {
          console.error("Fallback Error:", fallbackError);
          return NextResponse.json(
            { error: "Fallback image not found" },
            { status: 500 }
          );
        }
      }
      return NextResponse.json(
        { error: "Failed to fetch image" },
        { status: 500 }
      );
    } else if (error instanceof Error) {
      console.error("Image Proxy Error:", error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    } else {
      console.error("Image Proxy Error:", error);
      return NextResponse.json(
        { error: "Failed to fetch image" },
        { status: 500 }
      );
    }
  }
}
