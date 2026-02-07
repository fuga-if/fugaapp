import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "思考タイプ診断 - あなたの脳はどう考えてる？",
  description: "10個の質問であなたの思考タイプを診断！ロジカルシンカー？直感ひらめき型？それとも行動ファースト型？",
  openGraph: {
    title: "思考タイプ診断",
    description: "あなたの脳はどう考えてる？10問で思考のクセが丸わかり！",
    images: [{ url: "/api/og/shikou-type", width: 1200, height: 630, type: "image/png" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "思考タイプ診断",
    images: [{ url: "/api/og/shikou-type", width: 1200, height: 630, type: "image/png" }],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50 via-amber-50 to-white">
      <main className="flex-grow">{children}</main>
      <footer className="py-4 text-center text-sm text-gray-400">
        <p>© 2026 思考タイプ診断</p>
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
