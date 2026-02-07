import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { message, page } = await request.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "message is required" }, { status: 400 });
    }

    const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
    if (!webhookUrl) {
      console.error("DISCORD_WEBHOOK_URL is not set");
      return NextResponse.json({ error: "webhook not configured" }, { status: 500 });
    }

    const payload = {
      embeds: [
        {
          title: "🐛 修正依頼",
          description: message,
          fields: [
            {
              name: "ページ",
              value: page || "不明",
            },
          ],
          color: 16744576, // orange
          timestamp: new Date().toISOString(),
        },
      ],
    };

    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      console.error("Discord webhook failed:", res.status, await res.text());
      return NextResponse.json({ error: "webhook failed" }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("Feedback API error:", e);
    return NextResponse.json({ error: "internal error" }, { status: 500 });
  }
}
