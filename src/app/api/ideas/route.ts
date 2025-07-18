import { NextResponse } from "next/server";
import axios from "axios";

const cache = new Map<string, { data: unknown; timestamp: number }>();
const CACHE_TTL = 30 * 1000; // 30 detik

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = `https://suitmedia-backend.suitdev.com/api/ideas?${searchParams.toString()}`;

  // Caching key per query
  const cacheKey = searchParams.toString();
  const now = Date.now();
  if (cache.has(cacheKey)) {
    const { data, timestamp } = cache.get(cacheKey)!;
    if (now - timestamp < CACHE_TTL) {
      return NextResponse.json(data);
    }
  }

  try {
    const response = await axios.get(url);
    cache.set(cacheKey, { data: response.data, timestamp: now });
    return NextResponse.json(response.data);
  } catch (error) {
    console.error("Ideas API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 }
    );
  }
}
