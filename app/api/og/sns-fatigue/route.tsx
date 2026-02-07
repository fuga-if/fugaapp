import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

function getCharacterImage(type: string): string {
  const validTypes = ["A", "B", "C", "D", "E", "F"];
  const t = validTypes.includes(type) ? type.toLowerCase() : "a";
  return `/images/sns-fatigue/type-${t}.png`;
}

const DEFAULT_TYPE = "A";
const DEFAULT_NAME = "比較疲れ型";
const DEFAULT_TITLE = "他人の芝生が青すぎる";

export async function GET(request: NextRequest): Promise<ImageResponse> {
  const { searchParams, origin } = new URL(request.url);
  const type = searchParams.get("type") || DEFAULT_TYPE;
  const name = searchParams.get("name") || DEFAULT_NAME;
  const title = searchParams.get("title") || DEFAULT_TITLE;
  
  const characterImagePath = getCharacterImage(type);
  const characterImageUrl = `${origin}${characterImagePath}`;
  const logoUrl = `${origin}/images/sns-fatigue/main.png`;

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
          background: "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 50%, #e0e7ff 100%)",
          fontFamily: "sans-serif",
          padding: "30px",
        }}
      >
        {/* ロゴ（上部） */}
        <img
          src={logoUrl}
          width={300}
          height={300}
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
            width={240}
            height={240}
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
                color: "#0288d1",
                marginBottom: "8px",
              }}
            >
              あなたのSNS疲れタイプは...
            </div>
            <div
              style={{
                fontSize: "56px",
                fontWeight: "bold",
                background: "linear-gradient(90deg, #06b6d4, #6366f1)",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              {name}
            </div>
            <div
              style={{
                fontSize: "24px",
                fontWeight: "bold",
                color: "#374151",
                marginTop: "8px",
              }}
            >
              「{title}」
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
