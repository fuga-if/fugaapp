import { ImageResponse } from "next/og";
import { type Locale, LOCALES, t } from "@/lib/i18n/seiyuu";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const loc = LOCALES.includes(locale as Locale) ? (locale as Locale) : "ja";
  const i18n = t(loc);

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
          backgroundColor: "#000",
          fontFamily: "sans-serif",
        }}
      >
        {/* Site label */}
        <div style={{ fontSize: 20, color: "#666", letterSpacing: 6, marginBottom: 24 }}>
          fugaapp
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: 68,
            fontWeight: 700,
            color: "#fff",
            textAlign: "center",
            lineHeight: 1.15,
            maxWidth: 900,
          }}
        >
          {i18n.title}
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: 28,
            color: "#888",
            textAlign: "center",
            marginTop: 20,
          }}
        >
          {i18n.subtitle}
        </div>

        {/* 3 character slot decorations */}
        <div style={{ display: "flex", gap: 16, marginTop: 48 }}>
          {["1", "2", "3"].map((n) => (
            <div
              key={n}
              style={{
                width: 88,
                height: 120,
                borderRadius: 10,
                border: "2px solid #333",
                backgroundColor: "#111",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 28,
                color: "#333",
              }}
            >
              {n}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size }
  );
}
