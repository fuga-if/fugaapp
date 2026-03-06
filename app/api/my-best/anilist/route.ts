import { NextRequest, NextResponse } from "next/server";

const ANILIST_URL = "https://graphql.anilist.co";
const CACHE_TTL = 5 * 60 * 1000;
const cache = new Map<string, { data: unknown; ts: number }>();

let lastCall = 0;
const MIN_INTERVAL = 1000;

export async function POST(req: NextRequest): Promise<NextResponse> {
  const body = await req.json();
  if (!body?.query || typeof body.query !== "string") {
    return NextResponse.json({ error: "missing query" }, { status: 400 });
  }

  const cacheKey = JSON.stringify({ q: body.query, v: body.variables });
  const cached = cache.get(cacheKey);
  if (cached && Date.now() - cached.ts < CACHE_TTL) {
    return NextResponse.json(cached.data);
  }

  const now = Date.now();
  const wait = MIN_INTERVAL - (now - lastCall);
  if (wait > 0) await new Promise((r) => setTimeout(r, wait));
  lastCall = Date.now();

  const res = await fetch(ANILIST_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query: body.query, variables: body.variables }),
  });

  const data = await res.json();
  if (res.ok) {
    cache.set(cacheKey, { data, ts: Date.now() });
    // Evict old entries
    if (cache.size > 200) {
      const oldest = [...cache.entries()].sort((a, b) => a[1].ts - b[1].ts);
      for (let i = 0; i < 50; i++) cache.delete(oldest[i][0]);
    }
  }

  return NextResponse.json(data, { status: res.status });
}
