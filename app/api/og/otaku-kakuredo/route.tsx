import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

function getTypeColor(type: string): string {
  switch (type) {
    case "type-a": return "#8B4513";
    case "type-b": return "#D2691E";
    case "type-c": return "#CD853F";
    case "type-d": return "#DEB887";
    case "type-e": return "#FF8C00";
    case "type-f": return "#A0522D";
    default: return "#FF8C00";
  }
}

export async function GET(request: NextRequest): Promise<ImageResponse> {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");
  const title = searchParams.get("title") || "オタクの隠れ度診断";
  const color = type ? getTypeColor(type) : "#FF8C00";
  const isResult = !!type;

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg, #1a0f00 0%, #2d1a00 30%, #1a0f00 60%, #0d0a05 100%)", fontFamily: "sans-serif", padding: "30px" }}>
        <div style={{ fontSize: isResult ? "36px" : "52px", fontWeight: "bold", color: "#FF8C00", marginBottom: "20px", textShadow: "0 4px 6px rgba(0,0,0,0.3)" }}>
          オタクの隠れ度診断
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "rgba(255,140,0,0.08)", borderRadius: "32px", padding: "40px 60px", border: "2px solid rgba(255,140,0,0.2)" }}>
          {isResult ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div style={{ fontSize: "28px", color: "#FFB366", marginBottom: "12px" }}>あなたのオタク隠れ度は...</div>
              <div style={{ fontSize: "56px", fontWeight: "bold", color: color, textShadow: "0 4px 6px rgba(0,0,0,0.3)" }}>{title}</div>
              <div style={{ fontSize: "24px", color: "#FFB366", marginTop: "16px" }}>#オタク隠れ度診断</div>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div style={{ fontSize: "36px", color: "#FFB366", marginBottom: "16px" }}>あなたのオタク、バレてる？</div>
              <div style={{ fontSize: "24px", color: "#FF9933" }}>10個の質問で診断！</div>
            </div>
          )}
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
