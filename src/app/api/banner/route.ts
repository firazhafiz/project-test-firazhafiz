import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Ambil variabel lingkungan
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing SUPABASE_URL or SUPABASE_ANON_KEY in .env");
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function GET() {
  try {
    const { data: files, error } = await supabase.storage
      .from("banners")
      .list();
    console.log("Supabase files:", files);
    console.log("Supabase error:", error);

    if (error) {
      console.error("Detailed error:", JSON.stringify(error, null, 2));
      throw error;
    }

    if (!files || files.length === 0) {
      console.warn(
        "No files found in banners bucket. Check anon policy or bucket visibility."
      );
      return NextResponse.json({ url: "/banner.jpg" }, { status: 200 });
    }

    const latestFile = files.sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )[0];
    console.log("Latest file selected:", latestFile);
    const { data: publicUrlData } = supabase.storage
      .from("banners")
      .getPublicUrl(latestFile.name);

    return NextResponse.json({ url: publicUrlData.publicUrl });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error fetching banner:", error.message);
    } else {
      console.error("Error fetching banner:", error);
    }
    return NextResponse.json({ url: "/banner.jpg" }, { status: 500 });
  }
}
