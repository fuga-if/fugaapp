import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

function getTypeColor(type: string): string {
  switch (type) {
    case "leader": return "#EF4444";
    case "analyst": return "#3B82F6";
    case "nature": return "#22C55E";
    case "healer": return "#A855F7";
    case "balance": return "#6B7280";
    case "chaos": return "#F97316";
    case "awakened": return "#EAB308";
    case "void": return "#1F2937";
    default: return "#818CF8";
  }
}

export async function GET(request: NextRequest): Promise<ImageResponse> {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");
  const title = searchParams.get("title") || "潜在意識テスト";
  const emoji = searchParams.get("emoji") || "👁️";
  const isRare = searchParams.get("rare") === "1";
  const isResult = !!type;

  const color = type ? getTypeColor(type) : "#818CF8";

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
          background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #0f172a 100%)",
          fontFamily: "sans-serif",
          padding: "30px",
          position: "relative",
        }}
      >
        {/* Decorative particles */}
        <div style={{ position: "absolute", top: "50px", left: "80px", width: "8px", height: "8px", borderRadius: "50%", background: "#818CF8", opacity: 0.4, display: "flex" }} />
        <div style={{ position: "absolute", top: "150px", right: "120px", width: "6px", height: "6px", borderRadius: "50%", background: "#C4B5FD", opacity: 0.3, display: "flex" }} />
        <div style={{ position: "absolute", bottom: "100px", left: "200px", width: "10px", height: "10px", borderRadius: "50%", background: "#818CF8", opacity: 0.2, display: "flex" }} />
        <div style={{ position: "absolute", top: "250px", left: "150px", width: "4px", height: "4px", borderRadius: "50%", background: "#FFFFFF", opacity: 0.4, display: "flex" }} />
        <div style={{ position: "absolute", bottom: "180px", right: "250px", width: "6px", height: "6px", borderRadius: "50%", background: "#A78BFA", opacity: 0.3, display: "flex" }} />

        {/* Center glow */}
        <div style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "400px",
          height: "400px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)",
          display: "flex",
        }} />

        {/* Rare border */}
        {isRare && (
          <div style={{
            position: "absolute",
            inset: "10px",
            border: "3px solid rgba(234,179,8,0.6)",
            borderRadius: "20px",
            display: "flex",
          }} />
        )}

        {/* Main card */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "50px 80px",
            border: isRare ? "2px solid rgba(234,179,8,0.4)" : "2px solid rgba(99,102,241,0.4)",
            borderRadius: "24px",
            background: isRare ? "rgba(234,179,8,0.08)" : "rgba(49,46,129,0.4)",
          }}
        >
          {isRare && (
            <div style={{
              fontSize: "18px",
              fontWeight: "bold",
              color: "#EAB308",
              marginBottom: "8px",
            }}>
              🎯 レアタイプ！
            </div>
          )}

          <div
            style={{
              fontSize: isResult ? "28px" : "44px",
              fontWeight: "bold",
              color: "#C7D2FE",
              marginBottom: "20px",
              textShadow: "0 2px 12px rgba(99,102,241,0.3)",
            }}
          >
            👁️ 潜在意識テスト
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
                  color: "#C7D2FE",
                  marginBottom: "12px",
                }}
              >
                ◈ あなたの潜在意識タイプは... ◈
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
                  color: color === "#1F2937" ? "#94A3B8" : color,
                  textShadow: `0 2px 12px ${color}44`,
                }}
              >
                {title}
              </div>
              <div
                style={{
                  fontSize: "20px",
                  color: "#818CF8",
                  marginTop: "20px",
                  opacity: 0.7,
                }}
              >
                #潜在意識テスト
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
                  color: "#E0E7FF",
                  marginBottom: "16px",
                }}
              >
                0.1秒で見えたものが、本当のあなた
              </div>
              <div
                style={{
                  fontSize: "22px",
                  color: "#818CF8",
                  opacity: 0.8,
                }}
              >
                直感で答える8問のテスト
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
