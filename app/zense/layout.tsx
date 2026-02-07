import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "前世診断 - あなたの前世の職業は？10問で判明する魂の記憶",
  description: "あなたの前世の職業は？騎士、魔女、旅芸人、巫女、学者、海賊…10問の質問で魂の記憶を呼び覚まそう。",
  openGraph: {
    title: "前世診断",
    description: "あなたの前世の職業は？10問で判明する魂の記憶",
    images: [{ url: "/api/og/zense", width: 1200, height: 630, type: "image/png" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "前世診断",
    images: [{ url: "/api/og/zense", width: 1200, height: 630, type: "image/png" }],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-indigo-950 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* 星のエフェクト */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[10%] left-[15%] w-1 h-1 bg-white rounded-full animate-pulse opacity-60" />
        <div className="absolute top-[20%] right-[20%] w-1.5 h-1.5 bg-amber-200 rounded-full animate-pulse opacity-40" style={{ animationDelay: "0.5s" }} />
        <div className="absolute top-[35%] left-[70%] w-1 h-1 bg-white rounded-full animate-pulse opacity-50" style={{ animationDelay: "1s" }} />
        <div className="absolute top-[50%] left-[10%] w-1 h-1 bg-purple-200 rounded-full animate-pulse opacity-30" style={{ animationDelay: "1.5s" }} />
        <div className="absolute top-[15%] left-[50%] w-0.5 h-0.5 bg-white rounded-full animate-pulse opacity-70" style={{ animationDelay: "0.3s" }} />
        <div className="absolute top-[60%] right-[15%] w-1 h-1 bg-amber-100 rounded-full animate-pulse opacity-40" style={{ animationDelay: "2s" }} />
        <div className="absolute top-[75%] left-[30%] w-0.5 h-0.5 bg-white rounded-full animate-pulse opacity-50" style={{ animationDelay: "0.8s" }} />
        <div className="absolute top-[5%] right-[40%] w-1 h-1 bg-purple-300 rounded-full animate-pulse opacity-30" style={{ animationDelay: "1.2s" }} />
        <div className="absolute top-[45%] left-[85%] w-1 h-1 bg-white rounded-full animate-pulse opacity-60" style={{ animationDelay: "0.7s" }} />
        <div className="absolute top-[80%] right-[60%] w-0.5 h-0.5 bg-amber-200 rounded-full animate-pulse opacity-40" style={{ animationDelay: "1.8s" }} />
        {/* 月のモチーフ */}
        <div className="absolute top-8 right-8 w-16 h-16 rounded-full bg-gradient-to-br from-amber-200/20 to-transparent border border-amber-300/10" />
      </div>
      <main className="flex-grow relative z-10">{children}</main>
      <footer className="py-4 text-center text-sm text-purple-400/50 relative z-10">
        <p>© 2026 前世診断</p>
        <p className="mt-1">
          Created by fuga |{" "}
          <Link href="/privacy" className="text-amber-300/50 hover:text-amber-300 transition-colors">プライバシーポリシー</Link>
          {" | "}
          <Link href="/" className="text-amber-300/50 hover:text-amber-300 transition-colors">診断一覧</Link>
        </p>
      </footer>
    </div>
  );
}
