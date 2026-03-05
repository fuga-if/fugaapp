import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const supabase = getSupabase();
    if (!supabase) {
      return NextResponse.json({ success: true });
    }

    const body = await request.json();
    const { seiyuu_mal_id, seiyuu_name, characters } = body;

    if (!seiyuu_mal_id || !seiyuu_name || !Array.isArray(characters)) {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 }
      );
    }

    const { error } = await supabase.from("mybest_shares").insert({
      seiyuu_mal_id,
      seiyuu_name,
      characters,
    });

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json({ error: "Failed to save" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
