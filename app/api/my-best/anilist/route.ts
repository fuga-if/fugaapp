import { NextRequest, NextResponse } from "next/server";

const ANILIST_URL = "https://graphql.anilist.co";

let lastCall = 0;
const MIN_INTERVAL = 1000;

export async function POST(req: NextRequest): Promise<NextResponse> {
  const now = Date.now();
  const wait = MIN_INTERVAL - (now - lastCall);
  if (wait > 0) await new Promise((r) => setTimeout(r, wait));
  lastCall = Date.now();

  const body = await req.json();
  if (!body?.query || typeof body.query !== "string") {
    return NextResponse.json({ error: "missing query" }, { status: 400 });
  }

  const res = await fetch(ANILIST_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query: body.query, variables: body.variables }),
  });

  const data = await res.json();
  return NextResponse.json(data, {
    status: res.status,
    headers: { "Cache-Control": "s-maxage=60, stale-while-revalidate=120" },
  });
}
