import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "スマホ依存タイプ診断 - あなたのスマホ依存、何タイプ？",
  description: "10個の質問に答えて、あなたのスマホ依存タイプを診断！",
  openGraph: { title: "スマホ依存タイプ診断", images: ["/api/og/sumaho-izon"] },
  twitter: { card: "summary_large_image", title: "スマホ依存タイプ診断", images: ["/api/og/sumaho-izon"] },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: "linear-gradient(135deg, #0a0a2e 0%, #001a33 30%, #0d1a2e 60%, #000d1a 100%)" }}>
      <main className="flex-grow">{children}</main>
      <footer className="py-4 text-center text-sm text-cyan-600">
        <p>© 2026 スマホ依存タイプ診断</p>
        <p className="mt-1">Created by fuga | <Link href="/privacy" className="text-cyan-400 hover:text-cyan-300 transition-colors">プライバシーポリシー</Link>{" | "}<Link href="/" className="text-cyan-400 hover:text-cyan-300 transition-colors">診断一覧</Link></p>
      </footer>
    </div>
  );
}
