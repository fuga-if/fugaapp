import type { Metadata } from "next";
import { Zen_Maru_Gothic, Noto_Sans_JP } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import AdminFeedback from "./components/AdminFeedback";

const zenMaruGothic = Zen_Maru_Gothic({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-zen-maru",
  display: "swap",
});

const notoSansJP = Noto_Sans_JP({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-noto-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://fugaapp.site"),
  title: "診断 & ゲーム | fugaapp",
  description: "メンヘラ度診断、反射神経テストなど、楽しい診断アプリとミニゲームが勢揃い！",
  openGraph: {
    title: "診断 & ゲーム | fugaapp",
    description: "メンヘラ度診断、反射神経テストなど、楽しい診断アプリとミニゲームが勢揃い！",
    type: "website",
    locale: "ja_JP",
    siteName: "fugaapp",
    images: [{ url: "/api/og", width: 1200, height: 630, type: "image/png" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "診断 & ゲーム | fugaapp",
    description: "メンヘラ度診断、反射神経テストなど、楽しい診断アプリとミニゲームが勢揃い！",
    images: [{ url: "/api/og", width: 1200, height: 630, type: "image/png" }],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <head>
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3676716315130216"
          crossOrigin="anonymous"
        />
      </head>
      <body
        className={`${zenMaruGothic.variable} ${notoSansJP.variable} antialiased`}
        style={{ fontFamily: "var(--font-sans)" }}
      >
        {children}
        <AdminFeedback />
        <Analytics />
      </body>
    </html>
  );
}
