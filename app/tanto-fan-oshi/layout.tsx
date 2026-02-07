import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "担当/ファン/推し診断 - あなたの応援スタイルは？",
  description: "7つの質問に答えて、あなたのアイドル応援スタイルを診断！",
  openGraph: { title: "担当/ファン/推し診断", images: ["/api/og/tanto-fan-oshi"] },
  twitter: { card: "summary_large_image", title: "担当/ファン/推し診断", images: ["/api/og/tanto-fan-oshi"] },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: "linear-gradient(135deg, #0f0520 0%, #1a0530 30%, #200840 60%, #0f0520 100%)" }}>
      <main className="flex-grow">{children}</main>
      <footer className="py-4 text-center text-sm text-purple-400/60">
        <p>© 2026 担当/ファン/推し診断</p>
        <p className="mt-1">Created by fuga | <Link href="/privacy" className="text-purple-300/60 hover:text-purple-200 transition-colors">プライバシーポリシー</Link>{" | "}<Link href="/" className="text-purple-300/60 hover:text-purple-200 transition-colors">診断一覧</Link></p>
      </footer>
    </div>
  );
}
