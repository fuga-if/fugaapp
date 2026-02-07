import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

function getTypeColor(type: string): string {
  switch (type) {
    case "type-a": return "#F59E0B";
    case "type-b": return "#EF4444";
    case "type-c": return "#2563EB";
    case "type-d": return "#EC4899";
    case "type-e": return "#8B5CF6";
    case "type-f": return "#475569";
    default: return "#F59E0B";
  }
}

export async function GET(request: NextRequest): Promise<ImageResponse> {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");
  const title = searchParams.get("title") || "コミュニケーションスタイル診断";

  const color = type ? getTypeColor(type) : "#F59E0B";
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
          background: "linear-gradient(135deg, #fffbeb 0%, #fdf2f8 50%, #ffffff 100%)",
          fontFamily: "sans-serif",
          padding: "30px",
        }}
      >
        <div
          style={{
            fontSize: isResult ? "36px" : "52px",
            fontWeight: "bold",
            color: "#F59E0B",
            marginBottom: "20px",
            textShadow: "0 2px 4px rgba(0,0,0,0.1)",
          }}
        >
           コミュニケーションスタイル診断
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background: "linear-gradient(135deg, rgba(245,158,11,0.08), rgba(236,72,153,0.08))",
            borderRadius: "32px",
            padding: "40px 60px",
            border: "2px solid rgba(245,158,11,0.2)",
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
                  color: "#F59E0B",
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
                  color: "#EC4899",
                  marginTop: "16px",
                }}
              >
                #コミュスタイル診断
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
                  color: "#F59E0B",
                  marginBottom: "16px",
                }}
              >
                あなたの「伝え方」のクセ、知ってる？
              </div>
              <div
                style={{
                  fontSize: "24px",
                  color: "#EC4899",
                }}
              >
                10問で判明！
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
