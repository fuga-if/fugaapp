import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

function getTypeColor(type: string): string {
  switch (type) {
    case "type-a": return "#F97316";
    case "type-b": return "#FBBF24";
    case "type-c": return "#34D399";
    case "type-d": return "#06B6D4";
    case "type-e": return "#64748B";
    default: return "#F97316";
  }
}

function getTypeEmoji(type: string): string {
  switch (type) {
    case "type-a": return "🚀";
    case "type-b": return "⚡";
    case "type-c": return "💫";
    case "type-d": return "🌿";
    case "type-e": return "🏔️";
    default: return "🧠";
  }
}

export async function GET(request: NextRequest): Promise<ImageResponse> {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");
  const title = searchParams.get("title") || "ADHD傾向チェック";

  const color = type ? getTypeColor(type) : "#F97316";
  const emoji = type ? getTypeEmoji(type) : "🧠";
  const isResult = !!type;
  
  const imageFile = type || "main";
  const imageUrl = `https://fugaapp.site/images/adhd/${imageFile}.png`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "linear-gradient(135deg, #fff7ed 0%, #fef3c7 50%, #ffffff 100%)",
          fontFamily: "sans-serif",
          padding: "40px 60px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "center",
            flex: 1,
          }}
        >
          <div
            style={{
              fontSize: "32px",
              fontWeight: "bold",
              color: "#F97316",
              marginBottom: "16px",
            }}
          >
            🧠 ADHD傾向チェック
          </div>

          {isResult ? (
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ fontSize: "24px", color: "#6B7280", marginBottom: "8px" }}>
                あなたのタイプは...
              </div>
              <div
                style={{
                  fontSize: "48px",
                  fontWeight: "bold",
                  color: color,
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                {emoji} {title}
              </div>
              <div style={{ fontSize: "20px", color: "#F97316", marginTop: "16px" }}>
                #ADHD傾向チェック #fugaapp
              </div>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ fontSize: "36px", color: "#F97316", marginBottom: "12px", fontWeight: "bold" }}>
                集中力のクセを知る。
              </div>
              <div style={{ fontSize: "24px", color: "#6B7280" }}>
                あなたの脳タイプ診断
              </div>
              <div style={{ fontSize: "18px", color: "#9CA3AF", marginTop: "24px" }}>
                ※医学的診断ではありません
              </div>
            </div>
          )}
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "350px",
            height: "350px",
          }}
        >
          <img
            src={imageUrl}
            width={320}
            height={320}
            style={{
              objectFit: "contain",
              filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.15))",
            }}
          />
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
