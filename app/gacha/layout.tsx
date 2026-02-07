import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ソシャゲ課金スタイル診断 - あなたの課金タイプは？",
  description: "10個の質問に答えて、あなたのソシャゲ課金スタイルを診断！",
  openGraph: { title: "ソシャゲ課金スタイル診断", images: ["/api/og/gacha"] },
  twitter: { card: "summary_large_image", title: "ソシャゲ課金スタイル診断", images: ["/api/og/gacha"] },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: "linear-gradient(135deg, #1a0a00 0%, #2d1800 30%, #1a0a00 60%, #0d0520 100%)" }}>
      <main className="flex-grow">{children}</main>
      <footer className="py-4 text-center text-sm text-amber-600">
        <p>© 2026 ソシャゲ課金スタイル診断</p>
        <p className="mt-1">Created by fuga | <Link href="/privacy" className="text-amber-400 hover:text-amber-300 transition-colors">プライバシーポリシー</Link>{" | "}<Link href="/" className="text-amber-400 hover:text-amber-300 transition-colors">診断一覧</Link></p>
      </footer>
    </div>
  );
}
