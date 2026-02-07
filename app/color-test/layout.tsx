import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "色覚テスト - あなたの目はどこまで見分けられる？",
  description:
    "NxNグリッドの中から微妙に異なる色のパネルを見つけよう！レベルが上がるほど色の差が小さくなる。到達レベルでS〜Eランク判定。",
  openGraph: {
    title: "色覚テスト - あなたの目はどこまで見分けられる？",
    description:
      "微妙に異なる色のパネルを見つけよう！結果をXでシェア！",
    images: [
      {
        url: "/api/og/color-test",
        width: 1200,
        height: 630,
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "色覚テスト",
    description: "あなたの目はどこまで見分けられる？",
    images: [
      {
        url: "/api/og/color-test",
        width: 1200,
        height: 630,
        type: "image/png",
      },
    ],
  },
};

export default function ColorTestLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "#1A1A2E" }}
    >
      <main className="flex-grow">{children}</main>
      <footer className="py-4 text-center text-sm text-gray-500">
        <p>© 2026 色覚テスト</p>
        <p className="mt-1">
          Created by fuga |{" "}
          <Link
            href="/privacy"
            className="text-pink-400 hover:text-pink-300 transition-colors"
          >
            プライバシーポリシー
          </Link>
          {" | "}
          <Link
            href="/"
            className="text-pink-400 hover:text-pink-300 transition-colors"
          >
            診断一覧
          </Link>
        </p>
      </footer>
    </div>
  );
}
