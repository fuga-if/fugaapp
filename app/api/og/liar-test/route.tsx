import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

function getTypeEmoji(type: string): string {
  switch (type) {
    case "honest": return "";
    case "flatterer": return "";
    case "unconscious": return "";
    case "calculating": return "";
    case "master": return "";
    case "chaos": return "";
    default: return "";
  }
}

function getScoreColor(score: number): string {
  if (score < 30) return "#22c55e";
  if (score < 60) return "#eab308";
  if (score < 80) return "#f97316";
  return "#ef4444";
}

export async function GET(request: NextRequest): Promise<ImageResponse> {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");
  const title = searchParams.get("title") || "嘘つき度診断";
  const scoreStr = searchParams.get("score");
  const score = scoreStr ? parseInt(scoreStr, 10) : 0;

  const emoji = type ? getTypeEmoji(type) : "";
  const isResult = !!type;
  const scoreColor = getScoreColor(score);

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
          background: "linear-gradient(135deg, #111827 0%, #1e293b 50%, #0f172a 100%)",
          fontFamily: "sans-serif",
          padding: "30px",
        }}
      >
        {/* スキャンライン風 */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.05,
            backgroundImage:
              "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.1) 2px, rgba(255,255,255,0.1) 4px)",
            display: "flex",
          }}
        />

        {/* REC表示 */}
        <div
          style={{
            position: "absolute",
            top: "30px",
            right: "40px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <div
            style={{
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              background: "#ef4444",
              display: "flex",
            }}
          />
          <span
            style={{
              color: "#ef4444",
              fontSize: "16px",
              fontFamily: "monospace",
              opacity: 0.7,
            }}
          >
            REC
          </span>
        </div>

        {/* メインカード */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "50px 80px",
            border: "2px solid rgba(107,114,128,0.5)",
            borderRadius: "24px",
            background: "rgba(31,41,55,0.6)",
          }}
        >
          <div
            style={{
              fontSize: isResult ? "28px" : "44px",
              fontWeight: "bold",
              color: "#e5e7eb",
              marginBottom: "20px",
            }}
          >
             嘘つき度診断
          </div>

          {isResult ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              {/* スコアバー */}
              <div
                style={{
                  width: "400px",
                  height: "36px",
                  background: "#1f2937",
                  borderRadius: "18px",
                  overflow: "hidden",
                  border: "1px solid rgba(107,114,128,0.3)",
                  marginBottom: "16px",
                  display: "flex",
                  position: "relative",
                }}
              >
                <div
                  style={{
                    width: `${score}%`,
                    height: "100%",
                    background: `linear-gradient(90deg, ${scoreColor}, ${scoreColor}aa)`,
                    borderRadius: "18px",
                    display: "flex",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    fontSize: "18px",
                    fontWeight: "bold",
                    fontFamily: "monospace",
                  }}
                >
                  嘘つき度 {score}%
                </div>
              </div>

              <div style={{ fontSize: "64px", marginBottom: "8px", display: "flex" }}>
                {emoji}
              </div>
              <div
                style={{
                  fontSize: "52px",
                  fontWeight: "bold",
                  color: "#e5e7eb",
                }}
              >
                {title}
              </div>
              <div
                style={{
                  fontSize: "20px",
                  color: "#9ca3af",
                  marginTop: "20px",
                }}
              >
                #嘘つき度診断
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
                  color: "#d1d5db",
                  marginBottom: "16px",
                }}
              >
                あなたの嘘、バレてますよ？
              </div>
              <div
                style={{
                  fontSize: "22px",
                  color: "#9ca3af",
                }}
              >
                回答の「迷い」を検出する新感覚診断
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
