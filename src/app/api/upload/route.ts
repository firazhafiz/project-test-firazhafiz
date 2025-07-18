import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env");
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

const allowedMimeTypes = ["image/jpeg", "image/png", "image/jpg"];

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("file") as File | null;
  if (!file) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  if (!allowedMimeTypes.includes(file.type)) {
    return NextResponse.json(
      {
        error: `Invalid file type. Allowed types: ${allowedMimeTypes.join(
          ", "
        )}`,
      },
      { status: 400 }
    );
  }

  const fileName = `${Date.now()}-${file.name}`;
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  try {
    const { error } = await supabase.storage
      .from("banners")
      .upload(fileName, buffer, {
        contentType: file.type,
        upsert: true,
      });

    if (error) throw error;

    const { data: publicUrlData } = supabase.storage
      .from("banners")
      .getPublicUrl(fileName);
    return NextResponse.json({ url: publicUrlData.publicUrl }, { status: 200 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Upload error:", error.message);
      return NextResponse.json(
        { error: `Failed to upload file: ${error.message}` },
        { status: 500 }
      );
    } else {
      console.error("Upload error:", error);
      return NextResponse.json(
        { error: `Failed to upload file.` },
        { status: 500 }
      );
    }
  }
}
