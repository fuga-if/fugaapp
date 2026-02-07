import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

function getTypeColor(type: string): string {
  switch (type) {
    case "type-a": return "#00BFFF";
    case "type-b": return "#FF4081";
    case "type-c": return "#76FF03";
    case "type-d": return "#448AFF";
    case "type-e": return "#FF6E40";
    case "type-f": return "#00E5FF";
    default: return "#00E5FF";
  }
}

const DEFAULT_TITLE = "スマホ依存タイプ診断";

export async function GET(request: NextRequest): Promise<ImageResponse> {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");
  const title = searchParams.get("title") || DEFAULT_TITLE;

  const color = type ? getTypeColor(type) : "#00E5FF";
  const isResult = !!type;

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
          background: "linear-gradient(135deg, #0a0a2e 0%, #001a33 30%, #0d1a2e 60%, #000d1a 100%)",
          fontFamily: "sans-serif",
          padding: "30px",
        }}
      >
        <div
          style={{
            fontSize: isResult ? "36px" : "52px",
            fontWeight: "bold",
            color: "#00E5FF",
            marginBottom: "20px",
            textShadow: "0 0 20px rgba(0,229,255,0.5)",
          }}
        >
           スマホ依存タイプ診断
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(0,229,255,0.08)",
            borderRadius: "32px",
            padding: "40px 60px",
            border: "2px solid rgba(0,229,255,0.2)",
          }}
        >
          {isResult ? (
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
                  color: "#00B8D4",
                  marginBottom: "12px",
                }}
              >
                あなたのスマホ依存タイプは...
              </div>
              <div
                style={{
                  fontSize: "56px",
                  fontWeight: "bold",
                  color: color,
                  textShadow: "0 0 20px rgba(0,229,255,0.3)",
                }}
              >
                {title}
              </div>
              <div
                style={{
                  fontSize: "24px",
                  color: "#00B8D4",
                  marginTop: "16px",
                }}
              >
                #スマホ依存診断
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
                  color: "#00B8D4",
                  marginBottom: "16px",
                }}
              >
                あなたのスマホ依存、何タイプ？
              </div>
              <div
                style={{
                  fontSize: "24px",
                  color: "#0097A7",
                }}
              >
                10個の質問で診断！
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
