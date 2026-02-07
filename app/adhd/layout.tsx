import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ADHD傾向チェック - 集中力のクセを知る。あなたの脳タイプ診断",
  description: "10個の質問であなたのADHD傾向をチェック！集中力の凸凹、過集中、衝動性…脳の個性を理解しよう。※医学的診断ではありません",
  openGraph: {
    title: "ADHD傾向チェック",
    description: "集中力のクセを知る。あなたの脳タイプ診断",
    images: [{ url: "/api/og/adhd", width: 1200, height: 630, type: "image/png" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "ADHD傾向チェック",
    images: [{ url: "/api/og/adhd", width: 1200, height: 630, type: "image/png" }],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-orange-50 via-yellow-50 to-white">
      <main className="flex-grow">{children}</main>
      <footer className="py-4 text-center text-sm text-gray-400">
        <p>© 2026 ADHD傾向チェック</p>
        <p className="mt-1">
          Created by fuga |{" "}
          <Link href="/privacy" className="text-gray-400 hover:text-orange-600 transition-colors">プライバシーポリシー</Link>
          {" | "}
          <Link href="/" className="text-gray-400 hover:text-orange-600 transition-colors">診断一覧</Link>
        </p>
      </footer>
    </div>
  );
}
