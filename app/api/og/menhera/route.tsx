import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

// 結果に応じた画像パスを返す
function getCharacterImage(level: string): string {
  switch (level) {
    case "0%":
      return "/images/menhera/menhera-02-happy.png";
    case "25%":
      return "/images/menhera/menhera-03-worried.png";
    case "50%":
      return "/images/menhera/menhera-01-sad.png";
    case "75%":
      return "/images/menhera/menhera-04-crying.png";
    case "100%":
      return "/images/menhera/menhera-05-dark.png";
    default:
      return "/images/menhera/menhera-01-sad.png";
  }
}

// デフォルト結果
const DEFAULT_LEVEL = "50%";
const DEFAULT_TITLE = "かまってちゃん予備軍";

export async function GET(request: NextRequest): Promise<ImageResponse> {
  const { searchParams, origin } = new URL(request.url);
  const level = searchParams.get("level") || DEFAULT_LEVEL;
  const title = searchParams.get("title") || DEFAULT_TITLE;
  
  const characterImagePath = getCharacterImage(level);
  const characterImageUrl = `${origin}${characterImagePath}`;
  const logoUrl = `${origin}/images/menhera/logo.png`;

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
          background: "linear-gradient(135deg, #fff5f7 0%, #fce4ec 50%, #f3e5f5 100%)",
          fontFamily: "sans-serif",
          padding: "30px",
        }}
      >
        {/* ロゴ（上部） */}
        <img
          src={logoUrl}
          width={500}
          height={140}
          style={{
            objectFit: "contain",
            marginBottom: "20px",
          }}
        />

        {/* メインコンテンツ */}
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            background: "white",
            borderRadius: "32px",
            padding: "30px 50px",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)",
          }}
        >
          {/* キャラクター画像 */}
          <img
            src={characterImageUrl}
            width={200}
            height={200}
            style={{
              objectFit: "contain",
              marginRight: "30px",
              borderRadius: "20px",
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
                fontSize: "24px",
                color: "#ec4899",
                marginBottom: "8px",
              }}
            >
              私のメンヘラ度は...
            </div>
            <div
              style={{
                fontSize: "80px",
                fontWeight: "bold",
                background: "linear-gradient(90deg, #ec4899, #a855f7)",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              {level}
            </div>
            <div
              style={{
                fontSize: "32px",
                fontWeight: "bold",
                color: "#374151",
                marginTop: "8px",
              }}
            >
              {title}
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
