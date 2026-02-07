import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "コミュニケーションスタイル診断 - あなたの「伝え方」のクセ、知ってる？",
  description: "10個の質問であなたのコミュニケーションスタイルを診断！共感マスター？ムードメーカー？それとも静かな信頼構築型？",
  openGraph: {
    title: "コミュニケーションスタイル診断",
    description: "あなたの「伝え方」のクセ、知ってる？10問で判明！",
    images: [{ url: "/api/og/commu-style", width: 1200, height: 630, type: "image/png" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "コミュニケーションスタイル診断",
    images: [{ url: "/api/og/commu-style", width: 1200, height: 630, type: "image/png" }],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-amber-50 via-pink-50 to-white">
      <main className="flex-grow">{children}</main>
      <footer className="py-4 text-center text-sm text-gray-400">
        <p>© 2026 コミュニケーションスタイル診断</p>
        <p className="mt-1">
          Created by fuga |{" "}
          <Link href="/privacy" className="text-amber-400 hover:text-amber-600 transition-colors">プライバシーポリシー</Link>
          {" | "}
          <Link href="/" className="text-amber-400 hover:text-amber-600 transition-colors">診断一覧</Link>
        </p>
      </footer>
    </div>
  );
}
