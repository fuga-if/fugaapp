import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

function getTypeColor(type: string): string {
  switch (type) {
    case "type-a": return "#EF4444";
    case "type-b": return "#8B5CF6";
    case "type-c": return "#059669";
    case "type-d": return "#F59E0B";
    case "type-e": return "#EC4899";
    case "type-f": return "#06B6D4";
    default: return "#FBBF24";
  }
}

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

export async function GET(request: NextRequest): Promise<ImageResponse> {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");
  const title = searchParams.get("title") || "人生RPGジョブ診断";

  const color = type ? getTypeColor(type) : "#FBBF24";
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
          background: "linear-gradient(135deg, #0F172A 0%, #1E293B 100%)",
          fontFamily: "sans-serif",
          padding: "30px",
        }}
      >
        {/* RPG風の枠線 */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "50px 80px",
            border: "6px double #FBBF24",
            borderRadius: "12px",
            background: "rgba(30, 41, 59, 0.8)",
          }}
        >
          <div
            style={{
              fontSize: isResult ? "32px" : "48px",
              fontWeight: "bold",
              color: "#FBBF24",
              marginBottom: "20px",
              textShadow: "0 2px 8px rgba(251,191,36,0.3)",
            }}
          >
             人生RPGジョブ診断
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
                  color: "#94A3B8",
                  marginBottom: "12px",
                }}
              >
                あなたのジョブは...
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
                  textShadow: `0 2px 8px ${color}44`,
                }}
              >
                {title}
              </div>
              <div
                style={{
                  fontSize: "22px",
                  color: "#FBBF24",
                  marginTop: "20px",
                  opacity: 0.8,
                }}
              >
                #人生RPGジョブ診断
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
                  color: "#E2E8F0",
                  marginBottom: "16px",
                }}
              >
                もしあなたの人生がRPGだったら？
              </div>
              <div
                style={{
                  fontSize: "24px",
                  color: "#FBBF24",
                  opacity: 0.8,
                }}
              >
                10問で判明するジョブクラス！
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
