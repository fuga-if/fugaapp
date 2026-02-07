import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "HSP診断 - 繊細さは才能。あなたの感受性レベルをチェック",
  description: "10個の質問であなたのHSP（繊細さん）度を診断！繊細さは病気じゃない、生まれ持った気質です。",
  openGraph: {
    title: "HSP診断",
    description: "繊細さは才能。あなたの感受性レベルをチェック！",
    images: [{ url: "/api/og/hsp", width: 1200, height: 630, type: "image/png" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "HSP診断",
    images: [{ url: "/api/og/hsp", width: 1200, height: 630, type: "image/png" }],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-purple-50 via-pink-50 to-teal-50">
      <main className="flex-grow">{children}</main>
      <footer className="py-4 text-center text-sm text-gray-400">
        <p>© 2026 HSP診断</p>
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
