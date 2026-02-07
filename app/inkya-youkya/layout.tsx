import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "陰キャ陽キャスペクトラム診断 - あなたは陰と陽のどこにいる？",
  description: "10個の質問であなたの陰キャ・陽キャスペクトラムを診断！ナチュラルボーン陽キャ？選択的陽キャ？それとも観察者タイプ？",
  openGraph: {
    title: "陰キャ陽キャスペクトラム診断",
    description: "あなたは陰と陽のどこにいる？10問で本当の自分を発見！",
    images: [{ url: "/api/og/inkya-youkya", width: 1200, height: 630, type: "image/png" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "陰キャ陽キャスペクトラム診断",
    images: [{ url: "/api/og/inkya-youkya", width: 1200, height: 630, type: "image/png" }],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-purple-50 via-amber-50 to-white">
      <main className="flex-grow">{children}</main>
      <footer className="py-4 text-center text-sm text-gray-400">
        <p>© 2026 陰キャ陽キャスペクトラム診断</p>
        <p className="mt-1">
          Created by fuga |{" "}
          <Link href="/privacy" className="text-purple-400 hover:text-purple-600 transition-colors">プライバシーポリシー</Link>
          {" | "}
          <Link href="/" className="text-purple-400 hover:text-purple-600 transition-colors">診断一覧</Link>
        </p>
      </footer>
    </div>
  );
}
