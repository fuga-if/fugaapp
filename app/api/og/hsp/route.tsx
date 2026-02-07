import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

function getTypeColor(type: string): string {
  switch (type) {
    case "type-a": return "#E879F9";
    case "type-b": return "#A78BFA";
    case "type-c": return "#34D399";
    case "type-d": return "#FBBF24";
    case "type-e": return "#FB923C";
    default: return "#A78BFA";
  }
}

function getTypeEmoji(type: string): string {
  switch (type) {
    case "type-a": return "";
    case "type-b": return "";
    case "type-c": return "";
    case "type-d": return "";
    case "type-e": return "";
    default: return "";
  }
}

export async function GET(request: NextRequest): Promise<ImageResponse> {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");
  const title = searchParams.get("title") || "HSP診断";

  const color = type ? getTypeColor(type) : "#A78BFA";
  const emoji = type ? getTypeEmoji(type) : "";
  const isResult = !!type;
  
  // 画像URL（結果タイプがあればそのタイプ、なければmain）
  const imageFile = type || "main";
  const imageUrl = `https://fugaapp.site/images/hsp/${imageFile}.png`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "linear-gradient(135deg, #faf5ff 0%, #fdf2f8 50%, #f0fdfa 100%)",
          fontFamily: "sans-serif",
          padding: "40px 60px",
        }}
      >
        {/* 左側: テキスト */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "center",
            flex: 1,
          }}
        >
          <div
            style={{
              fontSize: "32px",
              fontWeight: "bold",
              color: "#A78BFA",
              marginBottom: "16px",
            }}
          >
             HSP診断
          </div>

          {isResult ? (
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ fontSize: "24px", color: "#6B7280", marginBottom: "8px" }}>
                あなたのタイプは...
              </div>
              <div
                style={{
                  fontSize: "48px",
                  fontWeight: "bold",
                  color: color,
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                {emoji} {title}
              </div>
              <div style={{ fontSize: "20px", color: "#EC4899", marginTop: "16px" }}>
                #HSP診断 #fugaapp
              </div>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ fontSize: "36px", color: "#A78BFA", marginBottom: "12px", fontWeight: "bold" }}>
                繊細さは才能。
              </div>
              <div style={{ fontSize: "24px", color: "#6B7280" }}>
                あなたの感受性レベルをチェック！
              </div>
              <div style={{ fontSize: "18px", color: "#9CA3AF", marginTop: "24px" }}>
                ※医学的診断ではありません
              </div>
            </div>
          )}
        </div>

        {/* 右側: キャラクター画像 */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "350px",
            height: "350px",
          }}
        >
          <img
            src={imageUrl}
            width={320}
            height={320}
            style={{
              objectFit: "contain",
              filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.15))",
            }}
          />
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
