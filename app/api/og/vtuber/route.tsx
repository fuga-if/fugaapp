import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

// タイプに応じた画像パスを返す
function getCharacterImage(type: string): string {
  switch (type) {
    case "gachi-koi":
      return "/images/vtuber/gachi-koi.png";
    case "hako-oshi":
      return "/images/vtuber/hako-oshi.png";
    case "archive":
      return "/images/vtuber/archive-zei.png";
    case "shokunin":
      return "/images/vtuber/haishin-shokunin.png";
    case "teetee":
      return "/images/vtuber/teetee-min.png";
    case "kosan":
      return "/images/vtuber/kosan-hakkutsu.png";
    default:
      return "/images/vtuber/main-visual.png";
  }
}

// タイプに応じた色を返す
function getTypeColor(type: string): string {
  switch (type) {
    case "gachi-koi":
      return "#E91E63";
    case "hako-oshi":
      return "#9C27B0";
    case "archive":
      return "#607D8B";
    case "shokunin":
      return "#2196F3";
    case "teetee":
      return "#FF4081";
    case "kosan":
      return "#4CAF50";
    default:
      return "#9C27B0";
  }
}

// デフォルト結果
const DEFAULT_TYPE = "gachi-koi";
const DEFAULT_TITLE = "ガチ恋勢";

export async function GET(request: NextRequest): Promise<ImageResponse> {
  const { searchParams, origin } = new URL(request.url);
  const type = searchParams.get("type") || DEFAULT_TYPE;
  const title = searchParams.get("title") || DEFAULT_TITLE;
  
  const characterImagePath = getCharacterImage(type);
  const characterImageUrl = `${origin}${characterImagePath}`;
  const color = getTypeColor(type);

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
          background: "linear-gradient(135deg, #1a0a2e 0%, #2d1b4e 50%, #1a0a2e 100%)",
          fontFamily: "sans-serif",
          padding: "30px",
        }}
      >
        {/* タイトル（上部） */}
        <div
          style={{
            fontSize: "40px",
            fontWeight: "bold",
            color: "white",
            marginBottom: "20px",
            textShadow: "0 4px 6px rgba(0,0,0,0.3)",
          }}
        >
          Vtuberオタクタイプ診断
        </div>

        {/* メインコンテンツ */}
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(255,255,255,0.1)",
            borderRadius: "32px",
            padding: "40px 60px",
            border: "2px solid rgba(168,85,247,0.3)",
          }}
        >
          {/* キャラクター画像 */}
          <img
            src={characterImageUrl}
            width={220}
            height={220}
            style={{
              objectFit: "contain",
              marginRight: "40px",
            }}
          />

          {/* 結果テキスト */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                fontSize: "28px",
                color: "#c4b5fd",
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
                textShadow: "0 4px 6px rgba(0,0,0,0.3)",
              }}
            >
              {title}
            </div>
            <div
              style={{
                fontSize: "24px",
                color: "#a78bfa",
                marginTop: "16px",
              }}
            >
              #Vtuberオタク診断
            </div>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
