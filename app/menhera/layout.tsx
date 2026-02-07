import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "メンヘラ度診断 - あなたの恋愛依存度をチェック！",
  description: "10個の質問に答えるだけで、あなたのメンヘラ度が判明！恋愛での依存度や束縛度がわかる無料診断。結果をXでシェアしよう！",
  openGraph: {
    title: "メンヘラ度診断 - あなたの恋愛依存度をチェック！",
    description: "10個の質問に答えるだけで、あなたのメンヘラ度が判明！結果をXでシェアしよう！",
    images: [{ url: "/api/og/menhera", width: 1200, height: 630, type: "image/png" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "メンヘラ度診断",
    description: "10個の質問に答えるだけで、あなたのメンヘラ度が判明！",
    images: [{ url: "/api/og/menhera", width: 1200, height: 630, type: "image/png" }],
  },
};

export default function MenheraLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: "linear-gradient(135deg, #fff5f7 0%, #fce4ec 50%, #f3e5f5 100%)" }}>
      <main className="flex-grow">{children}</main>
      <footer className="py-4 text-center text-sm text-gray-400">
        <p>© 2026 メンヘラ度診断</p>
        <p className="mt-1">
          Created by fuga |{" "}
          <Link href="/privacy" className="text-pink-400 hover:text-pink-500 transition-colors">
            プライバシーポリシー
          </Link>
          {" | "}
          <Link href="/" className="text-pink-400 hover:text-pink-500 transition-colors">
            診断一覧
          </Link>
        </p>
      </footer>
    </div>
  );
}
