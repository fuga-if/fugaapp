import { NextRequest, NextResponse } from "next/server";

const ANILIST_URL = "https://graphql.anilist.co";
const QUERY = `query ($page: Int) { Page(page: $page, perPage: 50) { pageInfo { hasNextPage } staff(sort: FAVOURITES_DESC) { id name { full native } image { large } characterMedia(perPage: 0) { pageInfo { total } } } } }`;

export async function GET(req: NextRequest): Promise<NextResponse> {
  const page = Math.max(1, Number(req.nextUrl.searchParams.get("page")) || 1);
  if (page > 100) {
    return NextResponse.json({ error: "page too large" }, { status: 400 });
  }

  const res = await fetch(ANILIST_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query: QUERY, variables: { page } }),
  });

  if (!res.ok) {
    return NextResponse.json(
      { error: "upstream error" },
      { status: res.status === 429 ? 429 : 502 }
    );
  }

  const json = await res.json();
  const pageData = json?.data?.Page;
  const staff = (pageData?.staff ?? [])
    .filter((s: { characterMedia: { pageInfo: { total: number } } }) =>
      s.characterMedia?.pageInfo?.total > 10
    )
    .map((s: { id: number; name: { full: string; native: string }; image: { large: string } }) => ({
      id: s.id,
      name: { full: s.name.full, native: s.name.native },
      image: { large: s.image.large },
    }));

  return NextResponse.json(
    { staff, hasNextPage: pageData?.pageInfo?.hasNextPage ?? false },
    {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=7200",
      },
    }
  );
}
