import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "思考の癖テスト - あなたの正義は、どっち寄り？",
  description:
    "トロッコ問題であなたの正義を可視化。功利主義 vs 義務論、10問の倫理的ジレンマであなたの思考タイプが判明。",
  openGraph: {
    title: "思考の癖テスト",
    description: "あなたの正義は、どっち寄り？功利主義 vs 義務論",
    images: [
      {
        url: "/api/og/trolley-test",
        width: 1200,
        height: 630,
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "思考の癖テスト",
    images: [
      {
        url: "/api/og/trolley-test",
        width: 1200,
        height: 630,
        type: "image/png",
      },
    ],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-900 via-amber-950/30 to-slate-900 relative overflow-hidden">
      {/* 背景の装飾 */}
      <div className="absolute inset-0 pointer-events-none">
        {/* 線路パターン */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-full bg-gradient-to-b from-transparent via-amber-500/10 to-transparent" />
        <div className="absolute top-0 left-[calc(50%-20px)] w-px h-full bg-gradient-to-b from-transparent via-amber-500/5 to-transparent" />
        <div className="absolute top-0 left-[calc(50%+20px)] w-px h-full bg-gradient-to-b from-transparent via-amber-500/5 to-transparent" />

        {/* 光の粒子 */}
        <div
          className="absolute top-[15%] left-[20%] w-2 h-2 bg-amber-400 rounded-full animate-pulse opacity-30"
          style={{ animationDelay: "0s" }}
        />
        <div
          className="absolute top-[25%] right-[15%] w-1.5 h-1.5 bg-orange-300 rounded-full animate-pulse opacity-40"
          style={{ animationDelay: "0.7s" }}
        />
        <div
          className="absolute top-[45%] left-[10%] w-1 h-1 bg-amber-200 rounded-full animate-pulse opacity-25"
          style={{ animationDelay: "1.4s" }}
        />
        <div
          className="absolute top-[60%] right-[25%] w-1.5 h-1.5 bg-orange-400 rounded-full animate-pulse opacity-35"
          style={{ animationDelay: "0.3s" }}
        />
        <div
          className="absolute top-[75%] left-[30%] w-1 h-1 bg-amber-300 rounded-full animate-pulse opacity-20"
          style={{ animationDelay: "2.1s" }}
        />
        <div
          className="absolute top-[10%] left-[60%] w-1 h-1 bg-orange-200 rounded-full animate-pulse opacity-30"
          style={{ animationDelay: "1.8s" }}
        />
        <div
          className="absolute top-[85%] right-[40%] w-2 h-2 bg-amber-500 rounded-full animate-pulse opacity-15"
          style={{ animationDelay: "0.9s" }}
        />

        {/* 天秤のモチーフ */}
        <div className="absolute top-8 right-8 text-4xl opacity-10">⚖️</div>
        <div className="absolute bottom-16 left-8 text-3xl opacity-10">🚂</div>
      </div>

      <main className="flex-grow relative z-10">{children}</main>

      <footer className="py-4 text-center text-sm text-amber-400/30 relative z-10">
        <p>© 2026 思考の癖テスト</p>
        <p className="mt-1">
          Created by fuga |{" "}
          <Link
            href="/privacy"
            className="text-amber-300/40 hover:text-amber-300 transition-colors"
          >
            プライバシーポリシー
          </Link>
          {" | "}
          <Link
            href="/"
            className="text-amber-300/40 hover:text-amber-300 transition-colors"
          >
            診断一覧
          </Link>
        </p>
      </footer>
    </div>
  );
}
