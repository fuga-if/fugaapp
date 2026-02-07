import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

const DEFAULT_SCORE = "---";
const DEFAULT_RANK = "?";
const DEFAULT_TITLE = "モグラ叩き";

const rankColors: Record<string, string> = {
  S: "#FFD700",
  A: "#FF6B35",
  B: "#4ECDC4",
  C: "#45B7D1",
  D: "#96CEB4",
  E: "#A8A8A8",
};

export async function GET(request: NextRequest): Promise<ImageResponse> {
  const { searchParams } = new URL(request.url);
  const score = searchParams.get("score") || DEFAULT_SCORE;
  const rank = searchParams.get("rank") || DEFAULT_RANK;
  const title = searchParams.get("title") || DEFAULT_TITLE;

  const accentColor = rankColors[rank] || "#8B4513";
  const hasResult = score !== DEFAULT_SCORE;

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
          background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #1a1a2e 100%)",
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
            background: "linear-gradient(90deg, transparent, #8B4513, transparent)",
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
           モグラ叩き
        </div>

        {hasResult ? (
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
              {rank}
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
              {title}
            </div>

            {/* スコア */}
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                gap: "4px",
                background: "rgba(139,69,19,0.2)",
                border: "2px solid rgba(139,69,19,0.4)",
                borderRadius: "20px",
                padding: "16px 40px",
              }}
            >
              <div
                style={{
                  fontSize: "72px",
                  fontWeight: "bold",
                  color: accentColor,
                }}
              >
                {score}
              </div>
              <div
                style={{
                  fontSize: "32px",
                  color: accentColor,
                  opacity: 0.7,
                }}
              >
                匹
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
            {/* Mole SVG representation */}
            <div
              style={{
                width: "100px",
                height: "100px",
                borderRadius: "50%",
                background: "#8B4513",
                marginBottom: "16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "60px",
              }}
            >
              
            </div>
            <div
              style={{
                fontSize: "48px",
                fontWeight: "bold",
                color: "#F8FAFC",
                marginBottom: "16px",
              }}
            >
              モグラ叩き
            </div>
            <div
              style={{
                fontSize: "24px",
                color: "#94A3B8",
              }}
            >
              30秒で何匹叩ける？
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
            background: "linear-gradient(90deg, transparent, #8B4513, transparent)",
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
