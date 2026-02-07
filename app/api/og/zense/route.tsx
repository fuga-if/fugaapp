import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

function getTypeColor(type: string): string {
  switch (type) {
    case "type-a": return "#DC2626";
    case "type-b": return "#7C3AED";
    case "type-c": return "#F59E0B";
    case "type-d": return "#EC4899";
    case "type-e": return "#0EA5E9";
    case "type-f": return "#1E293B";
    default: return "#FCD34D";
  }
}

function getTypeEmoji(type: string): string {
  switch (type) {
    case "type-a": return "⚔️";
    case "type-b": return "🔮";
    case "type-c": return "🎭";
    case "type-d": return "🌸";
    case "type-e": return "📜";
    case "type-f": return "🏴‍☠️";
    default: return "🔮";
  }
}

export async function GET(request: NextRequest): Promise<ImageResponse> {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");
  const title = searchParams.get("title") || "前世診断";

  const color = type ? getTypeColor(type) : "#FCD34D";
  const emoji = type ? getTypeEmoji(type) : "🔮";
  const isResult = !!type;

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
          background: "linear-gradient(135deg, #1e1b4b 0%, #581c87 50%, #0f172a 100%)",
          fontFamily: "sans-serif",
          padding: "30px",
        }}
      >
        {/* 星の装飾 */}
        <div style={{ position: "absolute", top: "40px", left: "60px", width: "8px", height: "8px", borderRadius: "50%", background: "#FCD34D", opacity: 0.6, display: "flex" }} />
        <div style={{ position: "absolute", top: "120px", right: "100px", width: "6px", height: "6px", borderRadius: "50%", background: "#E9D5FF", opacity: 0.4, display: "flex" }} />
        <div style={{ position: "absolute", bottom: "80px", left: "150px", width: "10px", height: "10px", borderRadius: "50%", background: "#FCD34D", opacity: 0.3, display: "flex" }} />
        <div style={{ position: "absolute", top: "200px", left: "200px", width: "4px", height: "4px", borderRadius: "50%", background: "#FFFFFF", opacity: 0.5, display: "flex" }} />
        <div style={{ position: "absolute", bottom: "150px", right: "200px", width: "6px", height: "6px", borderRadius: "50%", background: "#C4B5FD", opacity: 0.4, display: "flex" }} />

        {/* 月 */}
        <div style={{
          position: "absolute", top: "30px", right: "50px",
          width: "60px", height: "60px", borderRadius: "50%",
          background: "linear-gradient(135deg, rgba(252,211,77,0.3) 0%, transparent 100%)",
          border: "1px solid rgba(252,211,77,0.15)",
          display: "flex",
        }} />

        {/* メインカード */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "50px 80px",
            border: "2px solid rgba(168,85,247,0.5)",
            borderRadius: "24px",
            background: "rgba(88,28,135,0.4)",
          }}
        >
          <div
            style={{
              fontSize: isResult ? "28px" : "44px",
              fontWeight: "bold",
              color: "#FCD34D",
              marginBottom: "20px",
              textShadow: "0 2px 12px rgba(252,211,77,0.3)",
            }}
          >
            🔮 前世診断
          </div>

          {isResult ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  fontSize: "22px",
                  color: "#D8B4FE",
                  marginBottom: "12px",
                }}
              >
                ✦ あなたの前世は... ✦
              </div>
              <div
                style={{
                  fontSize: "48px",
                  marginBottom: "8px",
                }}
              >
                {emoji}
              </div>
              <div
                style={{
                  fontSize: "56px",
                  fontWeight: "bold",
                  color: color === "#1E293B" ? "#94A3B8" : color,
                  textShadow: `0 2px 12px ${color}44`,
                }}
              >
                {title}
              </div>
              <div
                style={{
                  fontSize: "20px",
                  color: "#FCD34D",
                  marginTop: "20px",
                  opacity: 0.7,
                }}
              >
                #前世診断
              </div>
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  fontSize: "30px",
                  color: "#E9D5FF",
                  marginBottom: "16px",
                }}
              >
                あなたの前世の職業は？
              </div>
              <div
                style={{
                  fontSize: "22px",
                  color: "#FCD34D",
                  opacity: 0.8,
                }}
              >
                10問で判明する魂の記憶
              </div>
            </div>
          )}
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
