import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

function getTypeColor(type: string): string {
  switch (type) {
    case "type-a": return "#EC4899";
    case "type-b": return "#F43F5E";
    case "type-c": return "#8B5CF6";
    case "type-d": return "#2563EB";
    case "type-e": return "#059669";
    case "type-f": return "#F59E0B";
    default: return "#EC4899";
  }
}

export async function GET(request: NextRequest): Promise<ImageResponse> {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");
  const title = searchParams.get("title") || "恋愛脳レベル診断";

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
          background: "linear-gradient(135deg, #fdf2f8 0%, #faf5ff 50%, #ffffff 100%)",
          fontFamily: "sans-serif",
          padding: "30px",
        }}
      >
        <div
          style={{
            fontSize: isResult ? "36px" : "52px",
            fontWeight: "bold",
            color: "#EC4899",
            marginBottom: "20px",
            textShadow: "0 2px 4px rgba(0,0,0,0.1)",
          }}
        >
           恋愛脳レベル診断
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background: "linear-gradient(135deg, rgba(236,72,153,0.08), rgba(139,92,246,0.08))",
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
                  color: "#EC4899",
                  marginBottom: "12px",
                }}
              >
                あなたのタイプは...
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
                  color: "#8B5CF6",
                  marginTop: "16px",
                }}
              >
                #恋愛脳診断
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
                  color: "#EC4899",
                  marginBottom: "16px",
                }}
              >
                あなたの恋愛脳、どのくらい？
              </div>
              <div
                style={{
                  fontSize: "24px",
                  color: "#8B5CF6",
                }}
              >
                10問でバレる恋愛への本気度
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
