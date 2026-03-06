import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

export async function GET(): Promise<NextResponse> {
  const supabase = getSupabase();
  if (!supabase) {
    return NextResponse.json([]);
  }
  const { data, error } = await supabase.rpc("get_trending_seiyuu", {
    days_back: 7,
    result_limit: 20,
  });
  if (error) {
    console.error("Trending fetch error:", error);
    return NextResponse.json([], { status: 500 });
  }
  return NextResponse.json(data ?? [], {
    headers: {
      "Cache-Control": "s-maxage=300, stale-while-revalidate=600",
    },
  });
}
