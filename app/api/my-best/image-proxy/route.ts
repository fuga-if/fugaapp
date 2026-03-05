import { NextRequest } from "next/server";

export async function GET(request: NextRequest): Promise<Response> {
  const url = request.nextUrl.searchParams.get("url");
  if (!url) {
    return new Response("Missing url parameter", { status: 400 });
  }

  try {
    const res = await fetch(url);
    const blob = await res.blob();
    return new Response(blob, {
      headers: {
        "Content-Type": res.headers.get("content-type") || "image/jpeg",
        "Cache-Control": "public, max-age=86400",
      },
    });
  } catch {
    return new Response("Failed to fetch image", { status: 502 });
  }
}
