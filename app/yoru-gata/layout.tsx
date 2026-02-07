import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "夜型オタク診断 - あなたの夜更かし、何タイプ？",
  description: "10個の質問に答えて、あなたの夜更かしタイプを診断！",
  openGraph: { title: "夜型オタク診断", images: ["/api/og/yoru-gata"] },
  twitter: { card: "summary_large_image", title: "夜型オタク診断", images: ["/api/og/yoru-gata"] },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: "linear-gradient(135deg, #0a0a2e 0%, #1a1a4e 30%, #0d0d3a 60%, #150530 100%)" }}>
      <main className="flex-grow">{children}</main>
      <footer className="py-4 text-center text-sm text-indigo-400">
        <p>© 2026 夜型オタク診断</p>
        <p className="mt-1">Created by fuga | <Link href="/privacy" className="text-purple-400 hover:text-purple-300 transition-colors">プライバシーポリシー</Link>{" | "}<Link href="/" className="text-purple-400 hover:text-purple-300 transition-colors">診断一覧</Link></p>
      </footer>
    </div>
  );
}
