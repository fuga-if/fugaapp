import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

function getTypeColor(type: string): string {
  switch (type) {
    case "type-a": return "#FF69B4";
    case "type-b": return "#DDA0DD";
    case "type-c": return "#87CEEB";
    case "type-d": return "#98D8C8";
    case "type-e": return "#FFB347";
    case "type-f": return "#C0C0C0";
    default: return "#FF69B4";
  }
}

const DEFAULT_TITLE = "猫派犬派深層診断";

export async function GET(request: NextRequest): Promise<ImageResponse> {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");
  const title = searchParams.get("title") || DEFAULT_TITLE;

  const color = type ? getTypeColor(type) : "#FF69B4";
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
          background: "linear-gradient(135deg, #fce4ec 0%, #e1f5fe 50%, #f3e5f5 100%)",
          fontFamily: "sans-serif",
          padding: "30px",
        }}
      >
        <div
          style={{
            fontSize: isResult ? "36px" : "52px",
            fontWeight: "bold",
            color: "#d81b60",
            marginBottom: "20px",
            textShadow: "0 2px 4px rgba(0,0,0,0.1)",
          }}
        >
          🐱 猫派犬派深層診断 🐶
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(255,255,255,0.6)",
            borderRadius: "32px",
            padding: "40px 60px",
            border: "2px solid rgba(255,105,180,0.3)",
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
                  color: "#e91e63",
                  marginBottom: "12px",
                }}
              >
                あなたの深層タイプは...
              </div>
              <div
                style={{
                  fontSize: "56px",
                  fontWeight: "bold",
                  color: color,
                  textShadow: "0 2px 4px rgba(0,0,0,0.1)",
                }}
              >
                {title}
              </div>
              <div
                style={{
                  fontSize: "24px",
                  color: "#e91e63",
                  marginTop: "16px",
                }}
              >
                #猫派犬派診断
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
                  color: "#e91e63",
                  marginBottom: "16px",
                }}
              >
                あなたは猫派？犬派？
              </div>
              <div
                style={{
                  fontSize: "24px",
                  color: "#f06292",
                }}
              >
                10個の質問で深層診断！
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
