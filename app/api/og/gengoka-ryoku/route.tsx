import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

function getTypeColor(type: string): string {
  switch (type) {
    case "type-a": return "#EC4899";
    case "type-b": return "#3B82F6";
    case "type-c": return "#F59E0B";
    case "type-d": return "#10B981";
    case "type-e": return "#8B5CF6";
    case "type-f": return "#6366F1";
    default: return "#06B6D4";
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
  const title = searchParams.get("title") || "言語化力診断";

  const color = type ? getTypeColor(type) : "#06B6D4";
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
          background: "linear-gradient(135deg, #0f172a 0%, #164e63 50%, #0c4a6e 100%)",
          fontFamily: "sans-serif",
          padding: "30px",
        }}
      >
        {/* 装飾 */}
        <div style={{ position: "absolute", top: "40px", left: "60px", width: "8px", height: "8px", borderRadius: "50%", background: "#22D3EE", opacity: 0.6, display: "flex" }} />
        <div style={{ position: "absolute", top: "120px", right: "100px", width: "6px", height: "6px", borderRadius: "50%", background: "#A5F3FC", opacity: 0.4, display: "flex" }} />
        <div style={{ position: "absolute", bottom: "80px", left: "150px", width: "10px", height: "10px", borderRadius: "50%", background: "#67E8F9", opacity: 0.3, display: "flex" }} />
        <div style={{ position: "absolute", top: "200px", left: "200px", width: "4px", height: "4px", borderRadius: "50%", background: "#FFFFFF", opacity: 0.5, display: "flex" }} />
        <div style={{ position: "absolute", bottom: "150px", right: "200px", width: "6px", height: "6px", borderRadius: "50%", background: "#BAE6FD", opacity: 0.4, display: "flex" }} />

        {/* 吹き出しモチーフ */}
        <div style={{
          position: "absolute", top: "30px", right: "50px",
          width: "50px", height: "50px", borderRadius: "50%",
          background: "linear-gradient(135deg, rgba(34,211,238,0.2) 0%, transparent 100%)",
          border: "1px solid rgba(34,211,238,0.15)",
          display: "flex",
        }} />

        {/* メインカード */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "50px 80px",
            border: "2px solid rgba(6,182,212,0.5)",
            borderRadius: "24px",
            background: "rgba(8,145,178,0.3)",
          }}
        >
          <div
            style={{
              fontSize: isResult ? "28px" : "44px",
              fontWeight: "bold",
              color: "#22D3EE",
              marginBottom: "20px",
              textShadow: "0 2px 12px rgba(34,211,238,0.3)",
            }}
          >
             言語化力診断
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
                  color: "#A5F3FC",
                  marginBottom: "12px",
                }}
              >
                 あなたの言語化タイプは... 
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
                  textShadow: `0 2px 12px ${color}44`,
                }}
              >
                {title}
              </div>
              <div
                style={{
                  fontSize: "20px",
                  color: "#22D3EE",
                  marginTop: "20px",
                  opacity: 0.7,
                }}
              >
                #言語化力診断
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
                  color: "#CFFAFE",
                  marginBottom: "16px",
                }}
              >
                あなたの「言葉にする力」を診断
              </div>
              <div
                style={{
                  fontSize: "22px",
                  color: "#22D3EE",
                  opacity: 0.8,
                }}
              >
                8問で判明する6タイプ
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
