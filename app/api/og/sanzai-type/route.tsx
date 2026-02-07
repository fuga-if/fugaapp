import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

function getTypeColor(type: string): string {
  switch (type) {
    case "goods": return "#FFD700";
    case "ensei": return "#9C27B0";
    case "gacha": return "#FF6F00";
    case "doujin": return "#E91E63";
    case "superchat": return "#7C4DFF";
    case "collab": return "#00BCD4";
    default: return "#FFD700";
  }
}

const DEFAULT_TITLE = "オタク散財タイプ診断";

export async function GET(request: NextRequest): Promise<ImageResponse> {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");
  const title = searchParams.get("title") || DEFAULT_TITLE;
  const color = type ? getTypeColor(type) : "#FFD700";
  const isResult = !!type;

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg, #1a0a1a 0%, #2d1040 30%, #1a0a2d 60%, #0d0520 100%)", fontFamily: "sans-serif", padding: "30px" }}>
        <div style={{ fontSize: isResult ? "36px" : "52px", fontWeight: "bold", color: "#FFD700", marginBottom: "20px", textShadow: "0 4px 6px rgba(0,0,0,0.3)" }}>
          オタク散財タイプ診断
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "rgba(255,215,0,0.08)", borderRadius: "32px", padding: "40px 60px", border: "2px solid rgba(255,215,0,0.2)" }}>
          {isResult ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div style={{ fontSize: "28px", color: "#FFB300", marginBottom: "12px" }}>あなたの散財タイプは...</div>
              <div style={{ fontSize: "56px", fontWeight: "bold", color: color, textShadow: "0 4px 6px rgba(0,0,0,0.3)" }}>{title}</div>
              <div style={{ fontSize: "24px", color: "#FFB300", marginTop: "16px" }}>#オタク散財診断</div>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div style={{ fontSize: "36px", color: "#FFB300", marginBottom: "16px" }}>あなたのお金、どこに消えてる？</div>
              <div style={{ fontSize: "24px", color: "#CE93D8" }}>10個の質問で診断！</div>
            </div>
          )}
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
