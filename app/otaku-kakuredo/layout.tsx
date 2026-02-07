import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "オタクの隠れ度診断 - あなたのオタク、バレてる？",
  description: "10個の質問に答えて、あなたのオタク隠れ度を診断！",
  openGraph: { title: "オタクの隠れ度診断", images: ["/api/og/otaku-kakuredo"] },
  twitter: { card: "summary_large_image", title: "オタクの隠れ度診断", images: ["/api/og/otaku-kakuredo"] },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: "linear-gradient(135deg, #1a0f00 0%, #2d1a00 30%, #1a0f00 60%, #0d0a05 100%)" }}>
      <main className="flex-grow">{children}</main>
      <footer className="py-4 text-center text-sm text-orange-600">
        <p>© 2026 オタクの隠れ度診断</p>
        <p className="mt-1">Created by fuga | <Link href="/privacy" className="text-orange-400 hover:text-orange-300 transition-colors">プライバシーポリシー</Link>{" | "}<Link href="/" className="text-orange-400 hover:text-orange-300 transition-colors">診断一覧</Link></p>
      </footer>
    </div>
  );
}
