import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

function getTypeColor(type: string): string {
  switch (type) {
    case "gachi": return "#FF4500";
    case "enjoy": return "#FF8C00";
    case "story": return "#7B68EE";
    case "collector": return "#FFD700";
    case "streamer": return "#FF6347";
    case "numa": return "#00CED1";
    default: return "#FF4500";
  }
}

const DEFAULT_TITLE = "ゲーマータイプ診断";

export async function GET(request: NextRequest): Promise<ImageResponse> {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");
  const title = searchParams.get("title") || DEFAULT_TITLE;
  const color = type ? getTypeColor(type) : "#FF4500";
  const isResult = !!type;

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg, #1a0000 0%, #2d0a00 30%, #1a0500 60%, #0d0000 100%)", fontFamily: "sans-serif", padding: "30px" }}>
        <div style={{ fontSize: isResult ? "36px" : "52px", fontWeight: "bold", color: "#FF4500", marginBottom: "20px", textShadow: "0 4px 6px rgba(0,0,0,0.3)" }}>
          ゲーマータイプ診断
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "rgba(255,69,0,0.08)", borderRadius: "32px", padding: "40px 60px", border: "2px solid rgba(255,69,0,0.2)" }}>
          {isResult ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div style={{ fontSize: "28px", color: "#FF8C00", marginBottom: "12px" }}>あなたのゲーマータイプは...</div>
              <div style={{ fontSize: "56px", fontWeight: "bold", color: color, textShadow: "0 4px 6px rgba(0,0,0,0.3)" }}>{title}</div>
              <div style={{ fontSize: "24px", color: "#FF8C00", marginTop: "16px" }}>#ゲーマータイプ診断</div>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div style={{ fontSize: "36px", color: "#FF8C00", marginBottom: "16px" }}>あなたはどんなゲーマー？</div>
              <div style={{ fontSize: "24px", color: "#FF6347" }}>10個の質問で診断！</div>
            </div>
          )}
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
