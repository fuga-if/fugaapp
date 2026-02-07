import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "嘘つき度診断 - あなたの嘘、バレてますよ？",
  description:
    "回答の「迷い」を検出。10問の質問に答えるだけで、あなたの嘘つき度が丸わかり。回答速度も計測中…",
  openGraph: {
    title: "嘘つき度診断",
    description: "回答の「迷い」を検出。あなたの嘘、バレてますよ？",
    images: [
      { url: "/api/og/liar-test", width: 1200, height: 630, type: "image/png" },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "嘘つき度診断",
    images: [
      { url: "/api/og/liar-test", width: 1200, height: 630, type: "image/png" },
    ],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-900 via-slate-800 to-gray-900 relative overflow-hidden">
      {/* ノイズ風パターン */}
      <div className="absolute inset-0 pointer-events-none">
        {/* スキャンライン風エフェクト */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.1) 2px, rgba(255,255,255,0.1) 4px)",
          }}
        />
        {/* 赤い点滅（監視カメラ風） */}
        <div className="absolute top-6 right-6 flex items-center gap-2">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
          <span className="text-red-500/50 text-xs font-mono animate-pulse">
            REC
          </span>
        </div>
        {/* 装飾的なドット */}
        <div className="absolute top-[15%] left-[10%] w-1 h-1 bg-gray-500 rounded-full opacity-30 animate-pulse" style={{ animationDelay: "0.5s" }} />
        <div className="absolute top-[25%] right-[15%] w-1 h-1 bg-gray-400 rounded-full opacity-20 animate-pulse" style={{ animationDelay: "1.2s" }} />
        <div className="absolute top-[60%] left-[80%] w-1 h-1 bg-gray-500 rounded-full opacity-25 animate-pulse" style={{ animationDelay: "0.8s" }} />
        <div className="absolute top-[70%] left-[20%] w-1 h-1 bg-gray-400 rounded-full opacity-15 animate-pulse" style={{ animationDelay: "1.5s" }} />
      </div>
      <main className="flex-grow relative z-10">{children}</main>
      <footer className="py-4 text-center text-sm text-gray-500/50 relative z-10">
        <p>© 2026 嘘つき度診断</p>
        <p className="mt-1">
          Created by fuga |{" "}
          <Link
            href="/privacy"
            className="text-gray-400/50 hover:text-gray-300 transition-colors"
          >
            プライバシーポリシー
          </Link>
          {" | "}
          <Link
            href="/"
            className="text-gray-400/50 hover:text-gray-300 transition-colors"
          >
            診断一覧
          </Link>
        </p>
      </footer>
    </div>
  );
}
