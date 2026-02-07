import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "猫派犬派深層診断 - あなたの本当の性格は猫？犬？",
  description: "10個の質問に答えて、あなたが猫派か犬派か深層から診断！",
  openGraph: { title: "猫派犬派深層診断", images: ["/api/og/neko-inu"] },
  twitter: { card: "summary_large_image", title: "猫派犬派深層診断", images: ["/api/og/neko-inu"] },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: "linear-gradient(135deg, #fce4ec 0%, #e1f5fe 50%, #f3e5f5 100%)" }}>
      <main className="flex-grow">{children}</main>
      <footer className="py-4 text-center text-sm text-pink-400">
        <p>© 2026 猫派犬派深層診断</p>
        <p className="mt-1">Created by fuga | <Link href="/privacy" className="text-pink-500 hover:text-pink-600 transition-colors">プライバシーポリシー</Link>{" | "}<Link href="/" className="text-pink-500 hover:text-pink-600 transition-colors">診断一覧</Link></p>
      </footer>
    </div>
  );
}
