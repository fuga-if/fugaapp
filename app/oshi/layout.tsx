import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "推し活スタイル診断 - あなたの推し活タイプは？",
  description: "8個の質問に答えて、あなたの推し活スタイルを診断！課金戦士？現場至上主義？創作沼？結果をXでシェアしよう！",
  openGraph: {
    title: "推し活スタイル診断 - あなたの推し活タイプは？",
    description: "8個の質問に答えて、あなたの推し活スタイルを診断！結果をXでシェアしよう！",
    images: [{ url: "/api/og/oshi", width: 1200, height: 630, type: "image/png" }],
  },
  twitter: { card: "summary_large_image", title: "推し活スタイル診断", images: ["/api/og/oshi"] },
};

export default function OshiLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: "linear-gradient(135deg, #1a0520 0%, #2d1040 30%, #1a0520 60%, #0d0520 100%)" }}>
      <main className="flex-grow">{children}</main>
      <footer className="py-4 text-center text-sm text-pink-600">
        <p>© 2026 推し活スタイル診断</p>
        <p className="mt-1">
          Created by fuga |{" "}
          <Link href="/privacy" className="text-pink-400 hover:text-pink-300 transition-colors">プライバシーポリシー</Link>
          {" | "}<Link href="/" className="text-pink-400 hover:text-pink-300 transition-colors">診断一覧</Link>
        </p>
      </footer>
    </div>
  );
}
