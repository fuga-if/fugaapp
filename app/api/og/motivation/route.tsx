import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

function getTypeColor(type: string): string {
  switch (type) {
    case "type-a": return "#EF4444";
    case "type-b": return "#8B5CF6";
    case "type-c": return "#F59E0B";
    case "type-d": return "#059669";
    case "type-e": return "#06B6D4";
    case "type-f": return "#2563EB";
    default: return "#8B5CF6";
  }
}

export async function GET(request: NextRequest): Promise<ImageResponse> {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");
  const title = searchParams.get("title") || "モチベーション源泉診断";

  const color = type ? getTypeColor(type) : "#8B5CF6";
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
          background: "linear-gradient(135deg, #faf5ff 0%, #fffbeb 50%, #ffffff 100%)",
          fontFamily: "sans-serif",
          padding: "30px",
        }}
      >
        <div
          style={{
            fontSize: isResult ? "36px" : "52px",
            fontWeight: "bold",
            color: "#8B5CF6",
            marginBottom: "20px",
            textShadow: "0 2px 4px rgba(0,0,0,0.1)",
          }}
        >
           モチベーション源泉診断
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background: "linear-gradient(135deg, rgba(139,92,246,0.08), rgba(245,158,11,0.08))",
            borderRadius: "32px",
            padding: "40px 60px",
            border: "2px solid rgba(139,92,246,0.2)",
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
                  color: "#8B5CF6",
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
                  color: "#F59E0B",
                  marginTop: "16px",
                }}
              >
                #モチベーション源泉診断
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
                  color: "#8B5CF6",
                  marginBottom: "16px",
                }}
              >
                あなたのやる気スイッチ、どこにある？
              </div>
              <div
                style={{
                  fontSize: "24px",
                  color: "#F59E0B",
                }}
              >
                10問で源泉を特定！
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
