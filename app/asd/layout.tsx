import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ASD傾向チェック - 独自の視点は才能。あなたのコミュニケーションスタイル診断",
  description: "10個の質問であなたのASD傾向をチェック！ASDは「空気が読めない」のではなく、情報処理の仕方が違うだけ。独自の視点は大きな強み。",
  openGraph: {
    title: "ASD傾向チェック",
    description: "独自の視点は才能。あなたのコミュニケーションスタイル診断！",
    images: [{ url: "/api/og/asd", width: 1200, height: 630, type: "image/png" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "ASD傾向チェック",
    images: [{ url: "/api/og/asd", width: 1200, height: 630, type: "image/png" }],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50 via-cyan-50 to-white">
      <main className="flex-grow">{children}</main>
      <footer className="py-4 text-center text-sm text-gray-400">
        <p>© 2026 ASD傾向チェック</p>
        <p className="mt-1">
          Created by fuga |{" "}
          <Link href="/privacy" className="text-blue-400 hover:text-blue-600 transition-colors">プライバシーポリシー</Link>
          {" | "}
          <Link href="/" className="text-blue-400 hover:text-blue-600 transition-colors">診断一覧</Link>
        </p>
      </footer>
    </div>
  );
}
