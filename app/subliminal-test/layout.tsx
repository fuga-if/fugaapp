import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "潜在意識テスト - 0.1秒で見えたものが、本当のあなた",
  description:
    "一瞬だけ表示される映像に直感で答えるテスト。8問であなたの潜在意識タイプが判明。レアタイプも存在。",
  openGraph: {
    title: "潜在意識テスト",
    description: "0.1秒で見えたものが、本当のあなた",
    images: [
      {
        url: "/api/og/subliminal-test",
        width: 1200,
        height: 630,
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "潜在意識テスト",
    images: [
      {
        url: "/api/og/subliminal-test",
        width: 1200,
        height: 630,
        type: "image/png",
      },
    ],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-indigo-950 via-purple-950 to-slate-950 relative overflow-hidden">
      {/* パーティクルエフェクト */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-[8%] left-[12%] w-2 h-2 bg-indigo-400 rounded-full animate-pulse opacity-30"
        />
        <div
          className="absolute top-[22%] right-[18%] w-1 h-1 bg-purple-300 rounded-full animate-pulse opacity-50"
          style={{ animationDelay: "0.4s" }}
        />
        <div
          className="absolute top-[40%] left-[75%] w-1.5 h-1.5 bg-indigo-300 rounded-full animate-pulse opacity-40"
          style={{ animationDelay: "0.8s" }}
        />
        <div
          className="absolute top-[55%] left-[8%] w-1 h-1 bg-purple-400 rounded-full animate-pulse opacity-25"
          style={{ animationDelay: "1.2s" }}
        />
        <div
          className="absolute top-[70%] right-[25%] w-2 h-2 bg-indigo-200 rounded-full animate-pulse opacity-20"
          style={{ animationDelay: "1.6s" }}
        />
        <div
          className="absolute top-[15%] left-[45%] w-0.5 h-0.5 bg-white rounded-full animate-pulse opacity-60"
          style={{ animationDelay: "0.2s" }}
        />
        <div
          className="absolute top-[85%] left-[35%] w-1 h-1 bg-purple-200 rounded-full animate-pulse opacity-30"
          style={{ animationDelay: "2s" }}
        />
        {/* 中心の光 */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-gradient-to-r from-indigo-500/5 to-purple-500/5 blur-3xl" />
      </div>
      <main className="flex-grow relative z-10">{children}</main>
      <footer className="py-4 text-center text-sm text-indigo-400/40 relative z-10">
        <p>© 2026 潜在意識テスト</p>
        <p className="mt-1">
          Created by fuga |{" "}
          <Link
            href="/privacy"
            className="text-purple-300/40 hover:text-purple-300 transition-colors"
          >
            プライバシーポリシー
          </Link>
          {" | "}
          <Link
            href="/"
            className="text-purple-300/40 hover:text-purple-300 transition-colors"
          >
            診断一覧
          </Link>
        </p>
      </footer>
    </div>
  );
}
