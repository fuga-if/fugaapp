import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

const rankColors: Record<string, string> = {
  S: "#FFD700",
  A: "#FF6B35",
  B: "#4ECDC4",
  C: "#45B7D1",
  D: "#96CEB4",
  E: "#A8A8A8",
};

const rankThresholds: { rank: string; title: string; threshold: number; emoji: string }[] = [
  { rank: "S", title: "連打の神", threshold: 100, emoji: "" },
  { rank: "A", title: "高速タッパー", threshold: 80, emoji: "" },
  { rank: "B", title: "なかなかの腕前", threshold: 60, emoji: "" },
  { rank: "C", title: "まあまあ", threshold: 45, emoji: "" },
  { rank: "D", title: "のんびりタッパー", threshold: 30, emoji: "" },
  { rank: "E", title: "省エネモード", threshold: 0, emoji: "" },
];

function getRankFromScore(score: number) {
  return rankThresholds.find((r) => score >= r.threshold) || rankThresholds[rankThresholds.length - 1];
}

export async function GET(request: NextRequest): Promise<ImageResponse> {
  const { searchParams } = new URL(request.url);
  const scoreStr = searchParams.get("score");
  const hasResult = scoreStr !== null && scoreStr !== "";
  const score = hasResult ? parseInt(scoreStr, 10) : 0;
  const rankInfo = hasResult ? getRankFromScore(score) : null;
  const cps = hasResult ? (score / 10).toFixed(1) : "0";
  const accentColor = rankInfo ? rankColors[rankInfo.rank] || "#8B5CF6" : "#8B5CF6";

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
        {/* Top accent line */}
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
           タップ速度テスト
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
              {rankInfo.title}
            </div>

            {/* Score */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "24px",
                background: "rgba(139,92,246,0.1)",
                border: "2px solid rgba(139,92,246,0.3)",
                borderRadius: "20px",
                padding: "16px 40px",
              }}
            >
              <div style={{ display: "flex", alignItems: "baseline", gap: "4px" }}>
                <div style={{ fontSize: "72px", fontWeight: "bold", color: "#8B5CF6" }}>
                  {score}
                </div>
                <div style={{ fontSize: "28px", color: "#8B5CF6", opacity: 0.7 }}>回</div>
              </div>
              <div style={{ fontSize: "32px", color: "#64748B" }}>|</div>
              <div style={{ display: "flex", alignItems: "baseline", gap: "4px" }}>
                <div style={{ fontSize: "52px", fontWeight: "bold", color: "#A78BFA" }}>
                  {cps}
                </div>
                <div style={{ fontSize: "24px", color: "#A78BFA", opacity: 0.7 }}>CPS</div>
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
            <div style={{ fontSize: "80px", marginBottom: "16px" }}></div>
            <div
              style={{
                fontSize: "48px",
                fontWeight: "bold",
                color: "#F8FAFC",
                marginBottom: "16px",
              }}
            >
              タップ速度テスト
            </div>
            <div style={{ fontSize: "24px", color: "#94A3B8" }}>
              10秒間で何回タップできる？
            </div>
          </div>
        )}

        {/* Bottom accent line */}
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
