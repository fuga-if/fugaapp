import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "モチベーション源泉診断 - あなたのやる気スイッチ、どこにある？",
  description: "10個の質問であなたのモチベーションの源泉を診断！達成ドリブン型？好奇心エンジン型？それとも自由追求型？",
  openGraph: {
    title: "モチベーション源泉診断",
    description: "あなたのやる気スイッチ、どこにある？10問で源泉を特定！",
    images: [{ url: "/api/og/motivation", width: 1200, height: 630, type: "image/png" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "モチベーション源泉診断",
    images: [{ url: "/api/og/motivation", width: 1200, height: 630, type: "image/png" }],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-purple-50 via-amber-50 to-white">
      <main className="flex-grow">{children}</main>
      <footer className="py-4 text-center text-sm text-gray-400">
        <p>© 2026 モチベーション源泉診断</p>
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
