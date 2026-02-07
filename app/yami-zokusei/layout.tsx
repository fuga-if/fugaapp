import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "闇属性診断 - あなたの魂に宿る属性は？",
  description: "10個の質問に答えて、あなたの闇属性を診断！厨二病全開で楽しもう！",
  openGraph: { title: "闇属性診断", images: ["/api/og/yami-zokusei"] },
  twitter: { card: "summary_large_image", title: "闇属性診断", images: ["/api/og/yami-zokusei"] },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: "linear-gradient(135deg, #1a0000 0%, #2d0a0a 30%, #1a0005 60%, #0d0000 100%)" }}>
      <main className="flex-grow">{children}</main>
      <footer className="py-4 text-center text-sm text-red-800">
        <p>© 2026 闇属性診断</p>
        <p className="mt-1">Created by fuga | <Link href="/privacy" className="text-red-600 hover:text-red-400 transition-colors">プライバシーポリシー</Link>{" | "}<Link href="/" className="text-red-600 hover:text-red-400 transition-colors">診断一覧</Link></p>
      </footer>
    </div>
  );
}
