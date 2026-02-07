import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "隠れ才能診断 - まだ気づいてない才能がある",
  description: "10問で見つかるあなたの隠れた力。言語・分析・共感・創造・観察・リーダーシップ——あなたの才能はどれ？",
  openGraph: {
    title: "隠れ才能診断",
    description: "まだ気づいてない才能がある。10問で見つかるあなたの隠れた力！",
    images: [{ url: "/api/og/sainou", width: 1200, height: 630, type: "image/png" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "隠れ才能診断",
    images: [{ url: "/api/og/sainou", width: 1200, height: 630, type: "image/png" }],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-amber-50 via-white to-purple-50">
      <main className="flex-grow">{children}</main>
      <footer className="py-4 text-center text-sm text-gray-400">
        <p>© 2026 隠れ才能診断</p>
        <p className="mt-1">
          Created by fuga |{" "}
          <Link href="/privacy" className="text-amber-500/60 hover:text-amber-500 transition-colors">プライバシーポリシー</Link>
          {" | "}
          <Link href="/" className="text-amber-500/60 hover:text-amber-500 transition-colors">診断一覧</Link>
        </p>
      </footer>
    </div>
  );
}
