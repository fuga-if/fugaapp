import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "オタク散財タイプ診断 - あなたのお金、どこに消えてる？",
  description: "10個の質問に答えて、あなたのオタク散財タイプを診断！",
  openGraph: { title: "オタク散財タイプ診断", images: ["/api/og/sanzai-type"] },
  twitter: { card: "summary_large_image", title: "オタク散財タイプ診断", images: ["/api/og/sanzai-type"] },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: "linear-gradient(135deg, #1a0a1a 0%, #2d1040 30%, #1a0a2d 60%, #0d0520 100%)" }}>
      <main className="flex-grow">{children}</main>
      <footer className="py-4 text-center text-sm text-purple-400/70">
        <p>© 2026 オタク散財タイプ診断</p>
        <p className="mt-1">Created by fuga | <Link href="/privacy" className="text-yellow-400 hover:text-yellow-300 transition-colors">プライバシーポリシー</Link>{" | "}<Link href="/" className="text-yellow-400 hover:text-yellow-300 transition-colors">診断一覧</Link></p>
      </footer>
    </div>
  );
}
