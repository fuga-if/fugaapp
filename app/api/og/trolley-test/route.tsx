import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest): Promise<ImageResponse> {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  const title = searchParams.get("title") || "思考の癖テスト";
  const emoji = searchParams.get("emoji") || "🧩";
  const u = searchParams.get("u") ? Number(searchParams.get("u")) : 0;
  const d = searchParams.get("d") ? Number(searchParams.get("d")) : 0;
  const isResult = !!id;

  const total = u + d || 1;
  const uPercent = Math.round((u / total) * 100);
  const dPercent = 100 - uPercent;

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
          background:
            "linear-gradient(135deg, #0f172a 0%, #451a03 50%, #0f172a 100%)",
          fontFamily: "sans-serif",
          padding: "30px",
        }}
      >
        {/* 装飾 */}
        <div
          style={{
            position: "absolute",
            top: "40px",
            left: "60px",
            width: "8px",
            height: "8px",
            borderRadius: "50%",
            background: "#f59e0b",
            opacity: 0.4,
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "120px",
            right: "100px",
            width: "6px",
            height: "6px",
            borderRadius: "50%",
            background: "#fb923c",
            opacity: 0.3,
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "80px",
            left: "150px",
            width: "10px",
            height: "10px",
            borderRadius: "50%",
            background: "#f59e0b",
            opacity: 0.2,
            display: "flex",
          }}
        />

        {/* 天秤モチーフ */}
        <div
          style={{
            position: "absolute",
            top: "30px",
            right: "50px",
            fontSize: "40px",
            opacity: 0.15,
            display: "flex",
          }}
        >
          ⚖️
        </div>

        {/* メインカード */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "50px 80px",
            border: "2px solid rgba(245,158,11,0.3)",
            borderRadius: "24px",
            background: "rgba(30,41,59,0.6)",
          }}
        >
          <div
            style={{
              fontSize: isResult ? "28px" : "44px",
              fontWeight: "bold",
              color: "#fbbf24",
              marginBottom: "20px",
              textShadow: "0 2px 12px rgba(245,158,11,0.3)",
              display: "flex",
            }}
          >
            🧩 思考の癖テスト
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
                  color: "#94a3b8",
                  marginBottom: "12px",
                  display: "flex",
                }}
              >
                ✦ あなたの思考タイプは... ✦
              </div>
              <div
                style={{
                  fontSize: "48px",
                  marginBottom: "8px",
                  display: "flex",
                }}
              >
                {emoji}
              </div>
              <div
                style={{
                  fontSize: "56px",
                  fontWeight: "bold",
                  color: "#fbbf24",
                  textShadow: "0 2px 12px rgba(245,158,11,0.3)",
                  display: "flex",
                }}
              >
                {title}
              </div>

              {/* バランスバー */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  marginTop: "24px",
                }}
              >
                <div
                  style={{
                    fontSize: "16px",
                    color: "#fb923c",
                    display: "flex",
                  }}
                >
                  📜 義務論 {d}
                </div>
                <div
                  style={{
                    width: "200px",
                    height: "20px",
                    borderRadius: "10px",
                    background: "#1e293b",
                    display: "flex",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: `${dPercent}%`,
                      height: "100%",
                      background:
                        "linear-gradient(90deg, #f59e0b, #ea580c)",
                      display: "flex",
                    }}
                  />
                  <div
                    style={{
                      width: `${uPercent}%`,
                      height: "100%",
                      background:
                        "linear-gradient(90deg, #3b82f6, #6366f1)",
                      display: "flex",
                    }}
                  />
                </div>
                <div
                  style={{
                    fontSize: "16px",
                    color: "#60a5fa",
                    display: "flex",
                  }}
                >
                  功利主義 {u} 📊
                </div>
              </div>

              <div
                style={{
                  fontSize: "20px",
                  color: "#fbbf24",
                  marginTop: "20px",
                  opacity: 0.7,
                  display: "flex",
                }}
              >
                #思考の癖テスト
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
                  color: "#cbd5e1",
                  marginBottom: "16px",
                  display: "flex",
                }}
              >
                あなたの正義は、どっち寄り？
              </div>
              <div
                style={{
                  fontSize: "22px",
                  color: "#fbbf24",
                  opacity: 0.8,
                  display: "flex",
                }}
              >
                功利主義 vs 義務論 — 10問の倫理的ジレンマ
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
