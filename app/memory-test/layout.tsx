import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "記憶力テスト - あなたの記憶力はどのレベル？",
  description:
    "NxNグリッドのパネルが順番に光る！覚えて同じ順にタップしよう。レベルが上がるほど難しくなる。到達レベルでS〜Eランク判定。",
  openGraph: {
    title: "記憶力テスト - あなたの記憶力はどのレベル？",
    description:
      "パネルが光る順番を覚えてタップ！結果をXでシェア！",
    images: [
      {
        url: "/api/og/memory-test",
        width: 1200,
        height: 630,
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "記憶力テスト",
    description: "あなたの記憶力はどのレベル？",
    images: [
      {
        url: "/api/og/memory-test",
        width: 1200,
        height: 630,
        type: "image/png",
      },
    ],
  },
};

export default function MemoryTestLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "#0F172A" }}
    >
      <main className="flex-grow">{children}</main>
      <footer className="py-4 text-center text-sm text-gray-500">
        <p>© 2026 記憶力テスト</p>
        <p className="mt-1">
          Created by fuga |{" "}
          <Link
            href="/privacy"
            className="text-amber-400 hover:text-amber-300 transition-colors"
          >
            プライバシーポリシー
          </Link>
          {" | "}
          <Link
            href="/"
            className="text-amber-400 hover:text-amber-300 transition-colors"
          >
            診断一覧
          </Link>
        </p>
      </footer>
    </div>
  );
}
