import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

const DEFAULT_SCORE = "---";

const rankThresholds = [
  { rank: "S", title: "鷹の目", threshold: 25, emoji: "🦅", color: "#FFD700" },
  { rank: "A", title: "色彩マスター", threshold: 20, emoji: "🎨", color: "#FF6B35" },
  { rank: "B", title: "目利き", threshold: 15, emoji: "👁️", color: "#4ECDC4" },
  { rank: "C", title: "カラフル一般人", threshold: 10, emoji: "🌈", color: "#45B7D1" },
  { rank: "D", title: "ざっくり派", threshold: 5, emoji: "😎", color: "#96CEB4" },
  { rank: "E", title: "色より形派", threshold: 0, emoji: "🙈", color: "#A8A8A8" },
];

function getRankFromScore(score: number) {
  return rankThresholds.find((r) => score >= r.threshold) || rankThresholds[rankThresholds.length - 1];
}

export async function GET(request: NextRequest): Promise<ImageResponse> {
  const { searchParams } = new URL(request.url);
  const scoreParam = searchParams.get("score");

  const hasResult = scoreParam !== null && scoreParam !== DEFAULT_SCORE;
  const score = hasResult ? parseInt(scoreParam, 10) : 0;
  const rankInfo = hasResult ? getRankFromScore(score) : null;
  const accentColor = rankInfo?.color || "#E94560";

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
          background: "linear-gradient(135deg, #1A1A2E 0%, #16213E 50%, #1A1A2E 100%)",
          fontFamily: "sans-serif",
        }}
      >
        {/* アクセントライン上部 */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "4px",
            background: "linear-gradient(90deg, transparent, #E94560, transparent)",
            display: "flex",
          }}
        />

        {/* タイトル */}
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
          🎨 色覚テスト
        </div>

        {hasResult && rankInfo ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            {/* ランク */}
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

            {/* 称号 */}
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

            {/* スコア */}
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                gap: "4px",
                background: "rgba(233,69,96,0.1)",
                border: "2px solid rgba(233,69,96,0.3)",
                borderRadius: "20px",
                padding: "16px 40px",
              }}
            >
              <div
                style={{
                  fontSize: "32px",
                  color: "#E94560",
                  opacity: 0.7,
                }}
              >
                Level
              </div>
              <div
                style={{
                  fontSize: "72px",
                  fontWeight: "bold",
                  color: "#E94560",
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
            {/* カラフルグリッドイメージ */}
            <div
              style={{
                display: "flex",
                gap: "8px",
                marginBottom: "24px",
              }}
            >
              {["#E94560", "#E94560", "#E94560", "#FF6B8A"].map((c, i) => (
                <div
                  key={i}
                  style={{
                    width: "60px",
                    height: "60px",
                    borderRadius: "12px",
                    background: c,
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
              色覚テスト
            </div>
            <div
              style={{
                fontSize: "24px",
                color: "#94A3B8",
              }}
            >
              あなたの目はどこまで見分けられる？
            </div>
          </div>
        )}

        {/* アクセントライン下部 */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "4px",
            background: "linear-gradient(90deg, transparent, #E94560, transparent)",
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
