/**
 * @module theomachia/layout
 * @description テオマキアのレイアウトコンポーネント。
 * OGPメタデータとビューポート設定を定義する。
 */

import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "テオマキア - 神々の戦い",
  description: "神話カードで激突する2人対戦ゲーム。オンラインで友達と対戦しよう！",
  openGraph: {
    title: "テオマキア - 神々の戦い",
    description: "神話カードで激突する2人対戦ゲーム",
    type: "website",
    images: [
      {
        url: "https://fugaapp.site/theomachia/ogp.png",
        width: 1200,
        height: 630,
        alt: "THEOMACHIA - Battle of the Gods",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "テオマキア - 神々の戦い",
    description: "神話カードで激突する2人対戦ゲーム",
    images: ["https://fugaapp.site/theomachia/ogp.png"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function OlympusClashLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{ 
      background: "#0a0a1a", 
      minHeight: "100dvh",
    }}>
      {children}
    </div>
  );
}
