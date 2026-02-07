import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

const DEFAULT_SCORE = "---";
const DEFAULT_RANK = "?";
const DEFAULT_TITLE = "10秒チャレンジ";

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

  const accentColor = rankColors[rank] || "#8B5CF6";
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
          background: "linear-gradient(135deg, #0F172A 0%, #1E1B4B 50%, #0F172A 100%)",
          fontFamily: "sans-serif",
        }}
      >
        {/* 紫のアクセントライン上部 */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "4px",
            background: "linear-gradient(90deg, transparent, #8B5CF6, transparent)",
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
          ⏱️ 10秒チャレンジ
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
                background: "rgba(139,92,246,0.1)",
                border: "2px solid rgba(139,92,246,0.3)",
                borderRadius: "20px",
                padding: "16px 40px",
              }}
            >
              <div
                style={{
                  fontSize: "32px",
                  color: "#A78BFA",
                  opacity: 0.7,
                }}
              >
                誤差
              </div>
              <div
                style={{
                  fontSize: "72px",
                  fontWeight: "bold",
                  color: "#8B5CF6",
                }}
              >
                {score}
              </div>
              <div
                style={{
                  fontSize: "32px",
                  color: "#8B5CF6",
                  opacity: 0.7,
                }}
              >
                ms
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
            <div
              style={{
                fontSize: "80px",
                marginBottom: "16px",
              }}
            >
              ⏱️
            </div>
            <div
              style={{
                fontSize: "48px",
                fontWeight: "bold",
                color: "#F8FAFC",
                marginBottom: "16px",
              }}
            >
              10秒チャレンジ
            </div>
            <div
              style={{
                fontSize: "24px",
                color: "#94A3B8",
              }}
            >
              あなたの体内時計は正確？
            </div>
          </div>
        )}

        {/* 紫のアクセントライン下部 */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "4px",
            background: "linear-gradient(90deg, transparent, #8B5CF6, transparent)",
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
