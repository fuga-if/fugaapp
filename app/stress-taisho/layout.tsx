import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ストレス対処法タイプ診断 - あなたのストレス解消法、実は性格が出てる！",
  description: "10個の質問であなたのストレス対処法タイプを診断！全力発散型？没頭リセット型？それとも自然回復型？",
  openGraph: {
    title: "ストレス対処法タイプ診断",
    description: "あなたのストレス解消法、実は性格が出てる！10問で判明",
    images: [{ url: "/api/og/stress-taisho", width: 1200, height: 630, type: "image/png" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "ストレス対処法タイプ診断",
    images: [{ url: "/api/og/stress-taisho", width: 1200, height: 630, type: "image/png" }],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-green-50 via-purple-50 to-white">
      <main className="flex-grow">{children}</main>
      <footer className="py-4 text-center text-sm text-gray-400">
        <p>© 2026 ストレス対処法タイプ診断</p>
        <p className="mt-1">
          Created by fuga |{" "}
          <Link href="/privacy" className="text-gray-400 hover:text-green-600 transition-colors">プライバシーポリシー</Link>
          {" | "}
          <Link href="/" className="text-gray-400 hover:text-green-600 transition-colors">診断一覧</Link>
        </p>
      </footer>
    </div>
  );
}
