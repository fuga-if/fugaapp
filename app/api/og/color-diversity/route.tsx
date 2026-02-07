import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

const resultTypes: Record<
  string,
  { title: string; subtitle: string; emoji: string; color: string }
> = {
  "type-c": {
    title: "一般型色覚（C型）",
    subtitle: "最も一般的な色の見え方",
    emoji: "",
    color: "#10B981",
  },
  "type-p": {
    title: "P型傾向",
    subtitle: "赤系が見えにくい傾向",
    emoji: "",
    color: "#EF4444",
  },
  "type-d": {
    title: "D型傾向",
    subtitle: "緑系が見えにくい傾向",
    emoji: "",
    color: "#22C55E",
  },
  "type-t": {
    title: "T型傾向",
    subtitle: "青系が見えにくい傾向",
    emoji: "",
    color: "#3B82F6",
  },
};

export async function GET(request: NextRequest): Promise<ImageResponse> {
  const { searchParams } = new URL(request.url);
  const typeParam = searchParams.get("type");
  const totalParam = searchParams.get("total");

  const hasResult = typeParam !== null;
  const result = hasResult ? resultTypes[typeParam] || resultTypes["type-c"] : null;
  const total = totalParam ? parseInt(totalParam, 10) : 0;

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
          background: "linear-gradient(135deg, #FEF2F2 0%, #F0FDF4 50%, #EFF6FF 100%)",
          fontFamily: "sans-serif",
        }}
      >
        {/* 上部装飾 */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "6px",
            background: "linear-gradient(90deg, #EF4444, #22C55E, #3B82F6)",
            display: "flex",
          }}
        />

        {/* タイトル */}
        <div
          style={{
            fontSize: "28px",
            color: "#6B7280",
            marginBottom: "24px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
           色覚多様性チェック
        </div>

        {hasResult && result ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            {/* 結果絵文字 */}
            <div
              style={{
                fontSize: "100px",
                marginBottom: "8px",
              }}
            >
              {result.emoji}
            </div>

            {/* タイプ名 */}
            <div
              style={{
                fontSize: "48px",
                fontWeight: "bold",
                color: result.color,
                marginBottom: "8px",
              }}
            >
              {result.title}
            </div>

            {/* サブタイトル */}
            <div
              style={{
                fontSize: "28px",
                color: "#6B7280",
                marginBottom: "24px",
              }}
            >
              {result.subtitle}
            </div>

            {/* スコア */}
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                gap: "8px",
                background: "rgba(255,255,255,0.8)",
                borderRadius: "20px",
                padding: "16px 40px",
                boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
              }}
            >
              <div
                style={{
                  fontSize: "48px",
                  fontWeight: "bold",
                  color: "#374151",
                }}
              >
                {total}
              </div>
              <div
                style={{
                  fontSize: "24px",
                  color: "#9CA3AF",
                }}
              >
                / 10 問正解
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
            {/* ドットパターンイメージ */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                width: "200px",
                gap: "8px",
                marginBottom: "32px",
              }}
            >
              {Array.from({ length: 25 }).map((_, i) => (
                <div
                  key={i}
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "50%",
                    background: i % 3 === 0 ? "#EF4444" : i % 3 === 1 ? "#22C55E" : "#3B82F6",
                    opacity: 0.7 + Math.random() * 0.3,
                  }}
                />
              ))}
            </div>

            <div
              style={{
                fontSize: "56px",
                fontWeight: "bold",
                color: "#374151",
                marginBottom: "16px",
              }}
            >
              色覚多様性チェック
            </div>

            <div
              style={{
                fontSize: "28px",
                color: "#6B7280",
              }}
            >
              石原式風テストであなたの色覚タイプをチェック！
            </div>
          </div>
        )}

        {/* 下部装飾 */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "6px",
            background: "linear-gradient(90deg, #EF4444, #22C55E, #3B82F6)",
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
