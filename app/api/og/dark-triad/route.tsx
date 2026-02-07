import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

function getTypeEmoji(type: string): string {
  switch (type) {
    case "saint": return "😇";
    case "strategist": return "🦊";
    case "king": return "👑";
    case "cold": return "🧊";
    case "charisma": return "✨";
    case "dark-hero": return "🦇";
    case "psycho-king": return "💀";
    case "dark-triad": return "🖤";
    default: return "🖤";
  }
}

function getTypeColor(type: string): string {
  switch (type) {
    case "saint": return "#60A5FA";
    case "strategist": return "#F97316";
    case "king": return "#EAB308";
    case "cold": return "#06B6D4";
    case "charisma": return "#A855F7";
    case "dark-hero": return "#6366F1";
    case "psycho-king": return "#DC2626";
    case "dark-triad": return "#7C3AED";
    default: return "#A855F7";
  }
}

export async function GET(request: NextRequest): Promise<ImageResponse> {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");
  const title = searchParams.get("title") || "ダークサイド診断";
  const m = searchParams.get("m");
  const n = searchParams.get("n");
  const p = searchParams.get("p");

  const color = type ? getTypeColor(type) : "#A855F7";
  const emoji = type ? getTypeEmoji(type) : "🖤";
  const isResult = !!type;
  const hasScores = m && n && p;

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
          background: "linear-gradient(135deg, #111827 0%, #1e1b4b 40%, #0a0a0a 100%)",
          fontFamily: "sans-serif",
          padding: "30px",
        }}
      >
        {/* ダーク装飾 */}
        <div style={{ position: "absolute", top: "40px", left: "60px", width: "6px", height: "6px", borderRadius: "50%", background: "#A855F7", opacity: 0.3, display: "flex" }} />
        <div style={{ position: "absolute", top: "120px", right: "100px", width: "8px", height: "8px", borderRadius: "50%", background: "#7C3AED", opacity: 0.2, display: "flex" }} />
        <div style={{ position: "absolute", bottom: "80px", left: "150px", width: "5px", height: "5px", borderRadius: "50%", background: "#A855F7", opacity: 0.25, display: "flex" }} />
        <div style={{ position: "absolute", bottom: "150px", right: "200px", width: "7px", height: "7px", borderRadius: "50%", background: "#6D28D9", opacity: 0.2, display: "flex" }} />

        {/* メインカード */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "40px 80px",
            border: "2px solid rgba(168,85,247,0.4)",
            borderRadius: "24px",
            background: "rgba(0,0,0,0.4)",
          }}
        >
          <div
            style={{
              fontSize: isResult ? "28px" : "44px",
              fontWeight: "bold",
              color: "#A855F7",
              marginBottom: "16px",
              textShadow: "0 2px 12px rgba(168,85,247,0.3)",
            }}
          >
            🖤 ダークサイド診断
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
                  fontSize: "20px",
                  color: "#C4B5FD",
                  marginBottom: "12px",
                }}
              >
                ▸ あなたのダークサイドは... ◂
              </div>
              <div style={{ fontSize: "48px", marginBottom: "8px" }}>{emoji}</div>
              <div
                style={{
                  fontSize: "52px",
                  fontWeight: "bold",
                  color: color,
                  textShadow: `0 2px 12px ${color}44`,
                }}
              >
                {title}
              </div>
              {hasScores && (
                <div
                  style={{
                    display: "flex",
                    gap: "24px",
                    marginTop: "20px",
                    fontSize: "18px",
                  }}
                >
                  <div style={{ color: "#C4B5FD", display: "flex" }}>
                    🦊 M:{m}%
                  </div>
                  <div style={{ color: "#C4B5FD", display: "flex" }}>
                    👑 N:{n}%
                  </div>
                  <div style={{ color: "#C4B5FD", display: "flex" }}>
                    🧊 P:{p}%
                  </div>
                </div>
              )}
              <div
                style={{
                  fontSize: "18px",
                  color: "#A855F7",
                  marginTop: "16px",
                  opacity: 0.7,
                }}
              >
                #ダークサイド診断
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
                  fontSize: "28px",
                  color: "#E9D5FF",
                  marginBottom: "16px",
                }}
              >
                あなたの中の闇、測定します
              </div>
              <div
                style={{
                  fontSize: "20px",
                  color: "#A855F7",
                  opacity: 0.8,
                }}
              >
                マキャベリズム × ナルシシズム × サイコパシー
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
