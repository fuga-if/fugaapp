import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

function getTypeInfo(type: string): { title: string; color: string; catchphrase: string } {
  switch (type) {
    case "tanto":
      return { title: "担当", color: "#6366F1", catchphrase: 'あなたは"担当"タイプ' };
    case "fan":
      return { title: "ファン", color: "#10B981", catchphrase: 'あなたは"ファン"タイプ' };
    case "oshi":
      return { title: "推し", color: "#EC4899", catchphrase: 'あなたは"推し"タイプ' };
    default:
      return { title: "", color: "#EC4899", catchphrase: "" };
  }
}

export async function GET(request: NextRequest): Promise<ImageResponse> {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");

  const typeInfo = type ? getTypeInfo(type) : null;
  const isResult = !!typeInfo?.title;

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
          background: "linear-gradient(135deg, #0f0520 0%, #1a0530 30%, #200840 60%, #0f0520 100%)",
          fontFamily: "sans-serif",
          padding: "30px",
        }}
      >
        {/* タイトル（上部） */}
        <div
          style={{
            fontSize: isResult ? "36px" : "52px",
            fontWeight: "bold",
            color: "#E9D5FF",
            marginBottom: "20px",
            textShadow: "0 4px 6px rgba(0,0,0,0.3)",
          }}
        >
          担当/ファン/推し診断
        </div>

        {/* メインコンテンツ */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(168,85,247,0.1)",
            borderRadius: "32px",
            padding: "40px 60px",
            border: "2px solid rgba(168,85,247,0.25)",
          }}
        >
          {isResult && typeInfo ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  fontSize: "28px",
                  color: "#C4B5FD",
                  marginBottom: "12px",
                }}
              >
                あなたの応援スタイルは...
              </div>
              <div
                style={{
                  fontSize: "56px",
                  fontWeight: "bold",
                  color: typeInfo.color,
                  textShadow: "0 4px 6px rgba(0,0,0,0.3)",
                }}
              >
                {typeInfo.catchphrase}
              </div>
              <div
                style={{
                  fontSize: "24px",
                  color: "#C4B5FD",
                  marginTop: "16px",
                }}
              >
                #担当ファン推し診断
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
                  fontSize: "36px",
                  color: "#C4B5FD",
                  marginBottom: "16px",
                }}
              >
                あなたの応援スタイルは？
              </div>
              <div
                style={{
                  fontSize: "24px",
                  color: "#A78BFA",
                }}
              >
                7つの質問で診断！
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
