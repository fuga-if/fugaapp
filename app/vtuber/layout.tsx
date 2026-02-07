import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Vtuberオタクタイプ診断 - あなたはどんなリスナー？",
  description: "10個の質問に答えて、あなたのVtuberリスナータイプを診断！",
  openGraph: { title: "Vtuberオタクタイプ診断", images: ["/api/og/vtuber"] },
  twitter: { card: "summary_large_image", title: "Vtuberオタクタイプ診断", images: ["/api/og/vtuber"] },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: "linear-gradient(135deg, #1a0a2e 0%, #2d1b4e 50%, #1a0a2e 100%)" }}>
      <main className="flex-grow">{children}</main>
      <footer className="py-4 text-center text-sm text-purple-400">
        <p>© 2026 Vtuberオタクタイプ診断</p>
        <p className="mt-1">Created by fuga | <Link href="/privacy" className="text-pink-400 hover:text-pink-300 transition-colors">プライバシーポリシー</Link>{" | "}<Link href="/" className="text-pink-400 hover:text-pink-300 transition-colors">診断一覧</Link></p>
      </footer>
    </div>
  );
}
