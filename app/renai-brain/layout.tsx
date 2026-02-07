import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "恋愛脳レベル診断 - あなたの恋愛脳、どのくらい？10問でバレる恋愛への本気度",
  description: "10個の質問であなたの恋愛脳レベルを診断！恋愛脳MAX型？ときめき依存型？それとも脳内シミュレーション型？",
  openGraph: {
    title: "恋愛脳レベル診断",
    description: "あなたの恋愛脳、どのくらい？10問でバレる恋愛への本気度",
    images: [{ url: "/api/og/renai-brain", width: 1200, height: 630, type: "image/png" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "恋愛脳レベル診断",
    images: [{ url: "/api/og/renai-brain", width: 1200, height: 630, type: "image/png" }],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-pink-50 via-purple-50 to-white">
      <main className="flex-grow">{children}</main>
      <footer className="py-4 text-center text-sm text-gray-400">
        <p>© 2026 恋愛脳レベル診断</p>
        <p className="mt-1">
          Created by fuga |{" "}
          <Link href="/privacy" className="text-gray-400 hover:text-pink-600 transition-colors">プライバシーポリシー</Link>
          {" | "}
          <Link href="/" className="text-gray-400 hover:text-pink-600 transition-colors">診断一覧</Link>
        </p>
      </footer>
    </div>
  );
}
