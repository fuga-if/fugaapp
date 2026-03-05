import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

const VALID_AGE_RANGES = new Set(["10代", "20代", "30代", "40代", "50代〜"]);
const VALID_GENDERS = new Set(["男性", "女性", "他"]);
const MAX_CHARACTERS = 3;
const MAX_NAME_LENGTH = 200;
const TOKEN_SECRET = "mybest-k8x2v";
const TOKEN_MAX_AGE_MS = 5 * 60 * 1000;
const ALLOWED_ORIGINS = new Set([
  "https://fugaapp.site",
  "http://localhost:3000",
]);

function isValidString(val: unknown, maxLen: number): val is string {
  return typeof val === "string" && val.length > 0 && val.length <= maxLen;
}

async function verifyToken(token: string): Promise<boolean> {
  const dot = token.indexOf(".");
  if (dot === -1) return false;
  const ts = token.slice(0, dot);
  const hash = token.slice(dot + 1);
  const timestamp = Number(ts);
  if (Number.isNaN(timestamp) || Date.now() - timestamp > TOKEN_MAX_AGE_MS) {
    return false;
  }
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(TOKEN_SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(ts)
  );
  const expected = btoa(String.fromCharCode(...new Uint8Array(sig))).slice(
    0,
    16
  );
  return hash === expected;
}

const REJECT = NextResponse.json({ error: "Forbidden" }, { status: 403 });

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // Origin check
    const origin = request.headers.get("origin");
    if (!origin || !ALLOWED_ORIGINS.has(origin)) {
      return REJECT;
    }

    // Token check
    const token = request.headers.get("x-mybest-token");
    if (!token || !(await verifyToken(token))) {
      return REJECT;
    }

    const supabase = getSupabase();
    if (!supabase) {
      return NextResponse.json({ success: true });
    }

    const body = await request.json();
    const { seiyuu_mal_id, seiyuu_name, characters, age_range, gender } = body;

    if (
      typeof seiyuu_mal_id !== "number" ||
      !Number.isInteger(seiyuu_mal_id) ||
      seiyuu_mal_id <= 0
    ) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    if (!isValidString(seiyuu_name, MAX_NAME_LENGTH)) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    if (
      !Array.isArray(characters) ||
      characters.length === 0 ||
      characters.length > MAX_CHARACTERS ||
      !characters.every(
        (c: unknown) =>
          typeof c === "object" &&
          c !== null &&
          typeof (c as Record<string, unknown>).mal_id === "number" &&
          isValidString((c as Record<string, unknown>).name, MAX_NAME_LENGTH) &&
          isValidString(
            (c as Record<string, unknown>).anime_title,
            MAX_NAME_LENGTH
          )
      )
    ) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const sanitizedAgeRange =
      age_range && VALID_AGE_RANGES.has(age_range) ? age_range : null;
    const sanitizedGender =
      gender && VALID_GENDERS.has(gender) ? gender : null;

    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "unknown";

    const { count } = await supabase
      .from("mybest_shares")
      .select("*", { count: "exact", head: true })
      .eq("ip", ip)
      .eq("seiyuu_mal_id", seiyuu_mal_id);

    if (count && count > 0) {
      return NextResponse.json({ success: true, skipped: true });
    }

    const { error } = await supabase.from("mybest_shares").insert({
      seiyuu_mal_id,
      seiyuu_name: seiyuu_name.slice(0, MAX_NAME_LENGTH),
      characters,
      ip,
      ...(sanitizedAgeRange && { age_range: sanitizedAgeRange }),
      ...(sanitizedGender && { gender: sanitizedGender }),
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
