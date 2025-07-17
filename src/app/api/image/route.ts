import { NextResponse } from "next/server";
import axios from "axios";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const imageUrl = searchParams.get("url");

  if (!imageUrl) {
    return NextResponse.json(
      { error: "Image URL is required" },
      { status: 400 }
    );
  }

  try {
    const response = await axios.get(imageUrl, {
      responseType: "arraybuffer",
      headers: {},
    });

    const headers = {
      "Content-Type": response.headers["content-type"],
      "Cache-Control": "public, max-age=31536000",
    };

    return new NextResponse(response.data, { headers, status: 200 });
  } catch (error) {
    console.error("Image Fetch Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch image" },
      { status: 500 }
    );
  }
}
