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
    if (error) throw error;

    const latestFile = files.sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )[0];
    const { data: publicUrlData } = supabase.storage
      .from("banners")
      .getPublicUrl(latestFile.name);

    return NextResponse.json({ url: publicUrlData.publicUrl });
  } catch (error: any) {
    console.error("Error fetching banner:", error);
    return NextResponse.json({ url: "/banner.jpg" }, { status: 500 });
  }
}
