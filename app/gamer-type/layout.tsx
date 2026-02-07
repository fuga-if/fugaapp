import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ゲーマータイプ診断 - あなたはどんなゲーマー？",
  description: "10個の質問に答えて、あなたのゲーマータイプを診断！",
  openGraph: { title: "ゲーマータイプ診断", images: ["/api/og/gamer-type"] },
  twitter: { card: "summary_large_image", title: "ゲーマータイプ診断", images: ["/api/og/gamer-type"] },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: "linear-gradient(135deg, #1a0000 0%, #2d0a00 30%, #1a0500 60%, #0d0000 100%)" }}>
      <main className="flex-grow">{children}</main>
      <footer className="py-4 text-center text-sm text-red-400/70">
        <p>© 2026 ゲーマータイプ診断</p>
        <p className="mt-1">Created by fuga | <Link href="/privacy" className="text-orange-400 hover:text-orange-300 transition-colors">プライバシーポリシー</Link>{" | "}<Link href="/" className="text-orange-400 hover:text-orange-300 transition-colors">診断一覧</Link></p>
      </footer>
    </div>
  );
}
