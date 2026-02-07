import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET(): Promise<ImageResponse> {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background:
            "linear-gradient(135deg, #fff5f7 0%, #fce4ec 30%, #f3e5f5 60%, #e8eaf6 100%)",
          fontFamily: "sans-serif",
          padding: "60px",
        }}
      >
        <div
          style={{
            fontSize: "64px",
            fontWeight: "bold",
            background: "linear-gradient(90deg, #ec4899, #8b5cf6, #6366f1)",
            backgroundClip: "text",
            color: "transparent",
            marginBottom: "24px",
          }}
        >
          診断アプリまとめ
        </div>
        <div
          style={{
            fontSize: "28px",
            color: "#6b7280",
            textAlign: "center",
            maxWidth: "800px",
          }}
        >
          メンヘラ度診断、推し活診断、Vtuberオタク診断など楽しい診断が勢揃い！
        </div>
        <div
          style={{
            fontSize: "24px",
            color: "#a855f7",
            marginTop: "32px",
            fontWeight: "bold",
          }}
        >
          fugaapp.site
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
