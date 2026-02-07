import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

function getTypeColor(type: string): string {
  switch (type) {
    case "type-1": return "#009688";
    case "type-2": return "#26A69A";
    case "type-3": return "#4DB6AC";
    case "type-4": return "#80CBC4";
    case "type-5": return "#B2DFDB";
    case "type-6": return "#E0F2F1";
    default: return "#009688";
  }
}

export async function GET(request: NextRequest): Promise<ImageResponse> {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");
  const title = searchParams.get("title") || "オタクコミュ力診断";
  const color = type ? getTypeColor(type) : "#009688";
  const isResult = !!type;

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg, #001a1a 0%, #002626 30%, #001a1a 60%, #000d0d 100%)", fontFamily: "sans-serif", padding: "30px" }}>
        <div style={{ fontSize: isResult ? "36px" : "52px", fontWeight: "bold", color: "#009688", marginBottom: "20px", textShadow: "0 4px 6px rgba(0,0,0,0.3)" }}>
          オタクコミュ力診断
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "rgba(0,150,136,0.08)", borderRadius: "32px", padding: "40px 60px", border: "2px solid rgba(0,150,136,0.2)" }}>
          {isResult ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div style={{ fontSize: "28px", color: "#4DB6AC", marginBottom: "12px" }}>あなたのオタクコミュ力は...</div>
              <div style={{ fontSize: "56px", fontWeight: "bold", color: color, textShadow: "0 4px 6px rgba(0,0,0,0.3)" }}>{title}</div>
              <div style={{ fontSize: "24px", color: "#4DB6AC", marginTop: "16px" }}>#オタクコミュ力診断</div>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div style={{ fontSize: "36px", color: "#4DB6AC", marginBottom: "16px" }}>あなたのオタクコミュ力は？</div>
              <div style={{ fontSize: "24px", color: "#26A69A" }}>10個の質問で診断！</div>
            </div>
          )}
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
