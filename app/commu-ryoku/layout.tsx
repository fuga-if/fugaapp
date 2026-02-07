import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "オタクコミュ力診断 - あなたのオタクコミュニケーション力は？",
  description: "10個の質問に答えて、あなたのオタクコミュ力を診断！",
  openGraph: { title: "オタクコミュ力診断", images: ["/api/og/commu-ryoku"] },
  twitter: { card: "summary_large_image", title: "オタクコミュ力診断", images: ["/api/og/commu-ryoku"] },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: "linear-gradient(135deg, #001a1a 0%, #002626 30%, #001a1a 60%, #000d0d 100%)" }}>
      <main className="flex-grow">{children}</main>
      <footer className="py-4 text-center text-sm text-teal-600">
        <p>© 2026 オタクコミュ力診断</p>
        <p className="mt-1">Created by fuga | <Link href="/privacy" className="text-teal-400 hover:text-teal-300 transition-colors">プライバシーポリシー</Link>{" | "}<Link href="/" className="text-teal-400 hover:text-teal-300 transition-colors">診断一覧</Link></p>
      </footer>
    </div>
  );
}
