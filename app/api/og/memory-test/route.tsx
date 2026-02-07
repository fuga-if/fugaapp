import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

const rankThresholds = [
  { rank: "S", title: "超記憶脳", threshold: 15, emoji: "🧠", color: "#FFD700" },
  { rank: "A", title: "カメラアイ", threshold: 11, emoji: "📸", color: "#FF6B35" },
  { rank: "B", title: "記憶上手", threshold: 8, emoji: "💡", color: "#4ECDC4" },
  { rank: "C", title: "ふつうの脳", threshold: 5, emoji: "🌱", color: "#45B7D1" },
  { rank: "D", title: "サカナ並み？", threshold: 3, emoji: "🐟", color: "#96CEB4" },
  { rank: "E", title: "瞬間記憶…", threshold: 0, emoji: "💨", color: "#A8A8A8" },
];

function getRankFromScore(score: number) {
  return rankThresholds.find((r) => score >= r.threshold) || rankThresholds[rankThresholds.length - 1];
}

export async function GET(request: NextRequest): Promise<ImageResponse> {
  const { searchParams } = new URL(request.url);
  const scoreParam = searchParams.get("score");

  const hasResult = scoreParam !== null;
  const score = hasResult ? parseInt(scoreParam, 10) : 0;
  const rankInfo = hasResult ? getRankFromScore(score) : null;
  const accentColor = rankInfo?.color || "#F59E0B";

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
          background: "linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #0F172A 100%)",
          fontFamily: "sans-serif",
        }}
      >
        {/* Accent line top */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "4px",
            background: "linear-gradient(90deg, transparent, #F59E0B, transparent)",
            display: "flex",
          }}
        />

        {/* Title */}
        <div
          style={{
            fontSize: "28px",
            color: "#94A3B8",
            marginBottom: "16px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          🧠 記憶力テスト
        </div>

        {hasResult && rankInfo ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            {/* Rank */}
            <div
              style={{
                fontSize: "100px",
                fontWeight: "900",
                color: accentColor,
                lineHeight: 1,
                marginBottom: "8px",
              }}
            >
              {rankInfo.rank}
            </div>

            {/* Title */}
            <div
              style={{
                fontSize: "40px",
                fontWeight: "bold",
                color: "#F8FAFC",
                marginBottom: "24px",
              }}
            >
              {rankInfo.emoji} {rankInfo.title}
            </div>

            {/* Score */}
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                gap: "4px",
                background: "rgba(245,158,11,0.1)",
                border: "2px solid rgba(245,158,11,0.3)",
                borderRadius: "20px",
                padding: "16px 40px",
              }}
            >
              <div
                style={{
                  fontSize: "32px",
                  color: "#F59E0B",
                  opacity: 0.7,
                }}
              >
                Level
              </div>
              <div
                style={{
                  fontSize: "72px",
                  fontWeight: "bold",
                  color: "#F59E0B",
                  marginLeft: "8px",
                }}
              >
                {score}
              </div>
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
            {/* Grid preview */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "8px",
                marginBottom: "24px",
                width: "200px",
              }}
            >
              {Array.from({ length: 9 }).map((_, i) => (
                <div
                  key={i}
                  style={{
                    width: "56px",
                    height: "56px",
                    borderRadius: "12px",
                    background: [1, 4, 7].includes(i) ? "#F59E0B" : "#1E293B",
                    boxShadow: [1, 4, 7].includes(i)
                      ? "0 0 12px rgba(245,158,11,0.4)"
                      : "none",
                  }}
                />
              ))}
            </div>
            <div
              style={{
                fontSize: "48px",
                fontWeight: "bold",
                color: "#F8FAFC",
                marginBottom: "16px",
              }}
            >
              記憶力テスト
            </div>
            <div
              style={{
                fontSize: "24px",
                color: "#94A3B8",
              }}
            >
              あなたの記憶力はどのレベル？
            </div>
          </div>
        )}

        {/* Accent line bottom */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "4px",
            background: "linear-gradient(90deg, transparent, #F59E0B, transparent)",
            display: "flex",
          }}
        />
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
