import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

function getTypeColor(type: string): string {
  switch (type) {
    case "kakin-senshi": return "#FF6B9D";
    case "genba-shijou": return "#FF9F43";
    case "sousaku-numa": return "#A855F7";
    case "data-chuu": return "#3B82F6";
    case "fukyou-shi": return "#10B981";
    case "seikan-sei": return "#8B5CF6";
    default: return "#EC4899";
  }
}

const DEFAULT_TITLE = "推し活スタイル診断";

export async function GET(request: NextRequest): Promise<ImageResponse> {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");
  const title = searchParams.get("title") || DEFAULT_TITLE;
  
  const color = type ? getTypeColor(type) : "#EC4899";
  const isResult = !!type;

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
          background: "linear-gradient(135deg, #1a0520 0%, #2d1040 30%, #1a0520 60%, #0d0520 100%)",
          fontFamily: "sans-serif",
          padding: "30px",
        }}
      >
        {/* タイトル（上部） */}
        <div
          style={{
            fontSize: isResult ? "36px" : "52px",
            fontWeight: "bold",
            color: "#EC4899",
            marginBottom: "20px",
            textShadow: "0 4px 6px rgba(0,0,0,0.3)",
          }}
        >
          推し活スタイル診断
        </div>

        {/* メインコンテンツ */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(236,72,153,0.08)",
            borderRadius: "32px",
            padding: "40px 60px",
            border: "2px solid rgba(236,72,153,0.2)",
          }}
        >
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
                  fontSize: "28px",
                  color: "#F9A8D4",
                  marginBottom: "12px",
                }}
              >
                あなたの推し活タイプは...
              </div>
              <div
                style={{
                  fontSize: "56px",
                  fontWeight: "bold",
                  color: color,
                  textShadow: "0 4px 6px rgba(0,0,0,0.3)",
                }}
              >
                {title}
              </div>
              <div
                style={{
                  fontSize: "24px",
                  color: "#F9A8D4",
                  marginTop: "16px",
                }}
              >
                #推し活診断
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
                  fontSize: "36px",
                  color: "#F9A8D4",
                  marginBottom: "16px",
                }}
              >
                あなたの推し活タイプは？
              </div>
              <div
                style={{
                  fontSize: "24px",
                  color: "#F472B6",
                }}
              >
                8個の質問で診断！
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
