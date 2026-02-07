import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

function getTypeEmoji(type: string): string {
  switch (type) {
    case "type-a": return "";
    case "type-b": return "";
    case "type-c": return "";
    case "type-d": return "";
    case "type-e": return "";
    case "type-f": return "";
    default: return "";
  }
}

function getTypeColor(type: string): string {
  switch (type) {
    case "type-a": return "#8B5CF6";
    case "type-b": return "#0EA5E9";
    case "type-c": return "#EC4899";
    case "type-d": return "#F59E0B";
    case "type-e": return "#059669";
    case "type-f": return "#DC2626";
    default: return "#F59E0B";
  }
}

export async function GET(request: NextRequest): Promise<ImageResponse> {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");
  const title = searchParams.get("title") || "隠れ才能診断";

  const color = type ? getTypeColor(type) : "#F59E0B";
  const emoji = type ? getTypeEmoji(type) : "";
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
          background: "linear-gradient(135deg, #FFFBEB 0%, #FFFFFF 40%, #FAF5FF 100%)",
          fontFamily: "sans-serif",
          padding: "30px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "50px 80px",
            border: "3px solid #FCD34D",
            borderRadius: "24px",
            background: "rgba(255, 255, 255, 0.8)",
            boxShadow: "0 20px 60px rgba(245, 158, 11, 0.15)",
          }}
        >
          <div
            style={{
              fontSize: isResult ? "32px" : "48px",
              fontWeight: "bold",
              background: "linear-gradient(to right, #F59E0B, #A855F7)",
              backgroundClip: "text",
              color: "transparent",
              marginBottom: "20px",
            }}
          >
             隠れ才能診断
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
                  fontSize: "24px",
                  color: "#9CA3AF",
                  marginBottom: "12px",
                }}
              >
                あなたの隠れた才能は...
              </div>
              <div
                style={{
                  fontSize: "48px",
                  marginBottom: "8px",
                }}
              >
                {emoji}
              </div>
              <div
                style={{
                  fontSize: "56px",
                  fontWeight: "bold",
                  color: color,
                }}
              >
                {title}
              </div>
              <div
                style={{
                  fontSize: "22px",
                  color: "#F59E0B",
                  marginTop: "20px",
                  opacity: 0.8,
                }}
              >
                #隠れ才能診断
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
                  fontSize: "32px",
                  color: "#374151",
                  marginBottom: "16px",
                }}
              >
                まだ気づいてない才能がある。
              </div>
              <div
                style={{
                  fontSize: "24px",
                  color: "#F59E0B",
                  opacity: 0.8,
                }}
              >
                10問で見つかるあなたの隠れた力！
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
