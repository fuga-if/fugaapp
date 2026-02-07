import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ダークサイド診断 - あなたの中の闇を3軸で測定",
  description:
    "心理学のダークトライアド（マキャベリズム/ナルシシズム/サイコパシー）をポップに測定。12問であなたのダークサイドが判明！",
  openGraph: {
    title: "ダークサイド診断",
    description: "あなたの中の闇を3軸で測定。ダークトライアド診断",
    images: [
      { url: "/api/og/dark-triad", width: 1200, height: 630, type: "image/png" },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ダークサイド診断",
    images: [
      { url: "/api/og/dark-triad", width: 1200, height: 630, type: "image/png" },
    ],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-900 via-gray-950 to-black relative overflow-hidden">
      {/* ダークなパーティクル */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-[8%] left-[12%] w-1 h-1 bg-purple-400 rounded-full animate-pulse opacity-40"
        />
        <div
          className="absolute top-[18%] right-[22%] w-1.5 h-1.5 bg-purple-300 rounded-full animate-pulse opacity-30"
          style={{ animationDelay: "0.5s" }}
        />
        <div
          className="absolute top-[32%] left-[65%] w-1 h-1 bg-purple-500 rounded-full animate-pulse opacity-50"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute top-[55%] left-[8%] w-0.5 h-0.5 bg-white rounded-full animate-pulse opacity-20"
          style={{ animationDelay: "1.5s" }}
        />
        <div
          className="absolute top-[70%] right-[18%] w-1 h-1 bg-purple-400 rounded-full animate-pulse opacity-30"
          style={{ animationDelay: "2s" }}
        />
        <div
          className="absolute top-[42%] left-[80%] w-0.5 h-0.5 bg-purple-300 rounded-full animate-pulse opacity-40"
          style={{ animationDelay: "0.7s" }}
        />
        <div
          className="absolute top-[85%] left-[35%] w-1 h-1 bg-purple-600 rounded-full animate-pulse opacity-20"
          style={{ animationDelay: "1.2s" }}
        />
        {/* 暗い装飾 */}
        <div className="absolute top-12 right-12 w-20 h-20 rounded-full bg-gradient-to-br from-purple-500/10 to-transparent border border-purple-500/10" />
        <div className="absolute bottom-24 left-8 w-12 h-12 rounded-full bg-gradient-to-br from-purple-600/10 to-transparent border border-purple-600/5" />
      </div>

      <main className="flex-grow relative z-10">{children}</main>

      <footer className="py-4 text-center text-sm text-gray-500 relative z-10">
        <p>© 2026 ダークサイド診断</p>
        <p className="mt-1">
          Created by fuga |{" "}
          <Link
            href="/privacy"
            className="text-purple-400/50 hover:text-purple-400 transition-colors"
          >
            プライバシーポリシー
          </Link>
          {" | "}
          <Link
            href="/"
            className="text-purple-400/50 hover:text-purple-400 transition-colors"
          >
            診断一覧
          </Link>
        </p>
      </footer>
    </div>
  );
}
