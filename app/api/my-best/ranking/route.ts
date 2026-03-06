import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

const VALID_AGE_RANGES = new Set(["teens", "20s", "30s", "40s", "50s+"]);
const VALID_GENDERS = new Set(["male", "female", "other"]);

export async function GET(request: NextRequest): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const seiyuuMalId = Number(searchParams.get("seiyuu_mal_id"));
  if (!seiyuuMalId || !Number.isInteger(seiyuuMalId) || seiyuuMalId <= 0) {
    return NextResponse.json({ error: "seiyuu_mal_id is required" }, { status: 400 });
  }
  const ageRaw = searchParams.get("age_range");
  const genderRaw = searchParams.get("gender");
  const ageRange = ageRaw && VALID_AGE_RANGES.has(ageRaw) ? ageRaw : undefined;
  const gender = genderRaw && VALID_GENDERS.has(genderRaw) ? genderRaw : undefined;
  const limit = Math.min(Number(searchParams.get("limit")) || 10, 50);

  const supabase = getSupabase();
  if (!supabase) {
    return NextResponse.json([]);
  }
  const { data, error } = await supabase.rpc("get_character_ranking", {
    p_seiyuu_mal_id: seiyuuMalId,
    p_age_range: ageRange ?? null,
    p_gender: gender ?? null,
    p_limit: limit,
  });
  if (error) {
    console.error("Ranking fetch error:", error);
    return NextResponse.json([], { status: 500 });
  }
  return NextResponse.json(data ?? [], {
    headers: {
      "Cache-Control": "s-maxage=300, stale-while-revalidate=600",
    },
  });
}
