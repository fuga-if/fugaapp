import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

function getTypeColor(type: string): string {
  switch (type) {
    case "shikkoku-yami": return "#9C27B0";
    case "souen-gouka": return "#2962FF";
    case "itetsuku-hyouga": return "#00B8D4";
    case "shiden-raikou": return "#AA00FF";
    case "seinaru-hikari": return "#FFD600";
    case "kyomu-kaze": return "#78909C";
    default: return "#9C27B0";
  }
}

const DEFAULT_TITLE = "闇属性診断";

export async function GET(request: NextRequest): Promise<ImageResponse> {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");
  const title = searchParams.get("title") || DEFAULT_TITLE;

  const color = type ? getTypeColor(type) : "#FF1744";
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
          background: "linear-gradient(135deg, #1a0000 0%, #2d0a0a 30%, #1a0005 60%, #0d0000 100%)",
          fontFamily: "sans-serif",
          padding: "30px",
        }}
      >
        <div
          style={{
            fontSize: isResult ? "36px" : "52px",
            fontWeight: "bold",
            color: "#EF5350",
            marginBottom: "20px",
            textShadow: "0 4px 6px rgba(0,0,0,0.3)",
          }}
        >
          ⚔️ 闇属性診断
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(244,67,54,0.08)",
            borderRadius: "32px",
            padding: "40px 60px",
            border: "2px solid rgba(244,67,54,0.2)",
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
                  color: "#EF5350",
                  marginBottom: "12px",
                }}
              >
                あなたの魂に宿る属性は...
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
                  color: "#EF5350",
                  marginTop: "16px",
                }}
              >
                #闇属性診断
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
                  color: "#EF5350",
                  marginBottom: "16px",
                }}
              >
                あなたの魂に宿る属性は？
              </div>
              <div
                style={{
                  fontSize: "24px",
                  color: "#C62828",
                }}
              >
                10個の質問で覚醒せよ！
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
