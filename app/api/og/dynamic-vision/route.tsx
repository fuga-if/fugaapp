import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest): Promise<ImageResponse> {
  const { searchParams } = new URL(request.url);
  const score = searchParams.get("score");
  const rank = searchParams.get("rank");
  const title = searchParams.get("title");
  const hasResult = score && rank;

  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: `linear-gradient(135deg, ${"#FB7185"}, ${"#DC2626"})`,
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ fontSize: "80px", marginBottom: "16px" }}>
          👁️
        </div>
        {hasResult ? (
          <>
            <div style={{ color: "white", fontSize: "56px", fontWeight: "bold", textAlign: "center", lineHeight: 1.2 }}>
              {rank}ランク「{decodeURIComponent(title || "")}」
            </div>
            <div style={{ color: "rgba(255,255,255,0.8)", fontSize: "32px", marginTop: "16px" }}>
              スコア: {score}
            </div>
          </>
        ) : (
          <>
            <div style={{ color: "white", fontSize: "56px", fontWeight: "bold", textAlign: "center", lineHeight: 1.2 }}>
              動体視力テスト
            </div>
            <div style={{ color: "rgba(255,255,255,0.8)", fontSize: "28px", marginTop: "16px" }}>
              高速で動くターゲットを見極めろ！
            </div>
          </>
        )}
        <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "22px", marginTop: "40px" }}>
          fugaapp.site
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
