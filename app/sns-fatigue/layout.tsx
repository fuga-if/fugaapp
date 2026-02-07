import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SNS疲れタイプ診断 - あなたのSNS疲労度がわかる！",
  description: "10個の質問に答えるだけで、あなたのSNS疲れタイプが判明！",
  openGraph: { title: "SNS疲れタイプ診断", images: ["/api/og/sns-fatigue"] },
  twitter: { card: "summary_large_image", title: "SNS疲れタイプ診断", images: ["/api/og/sns-fatigue"] },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 50%, #e0e7ff 100%)" }}>
      <main className="flex-grow">{children}</main>
      <footer className="py-4 text-center text-sm text-gray-400">
        <p>© 2026 SNS疲れタイプ診断</p>
        <p className="mt-1">Created by fuga | <Link href="/privacy" className="text-blue-400 hover:text-blue-500 transition-colors">プライバシーポリシー</Link>{" | "}<Link href="/" className="text-blue-400 hover:text-blue-500 transition-colors">診断一覧</Link></p>
      </footer>
    </div>
  );
}
