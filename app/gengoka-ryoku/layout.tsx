import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "言語化力診断 - あなたの「言葉にする力」を6タイプで診断！",
  description: "8問の質問であなたの言語化タイプを診断。詩人、論理構築、例え話マスター、聞き上手翻訳、直感、沈黙の賢者…あなたはどのタイプ？",
  openGraph: {
    title: "言語化力診断",
    description: "あなたの「言葉にする力」を6タイプで診断！",
    images: [{ url: "/api/og/gengoka-ryoku", width: 1200, height: 630, type: "image/png" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "言語化力診断",
    images: [{ url: "/api/og/gengoka-ryoku", width: 1200, height: 630, type: "image/png" }],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-900 via-cyan-950 to-blue-950 relative overflow-hidden">
      {/* 装飾エフェクト */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[8%] left-[12%] w-1.5 h-1.5 bg-cyan-300 rounded-full animate-pulse opacity-50" />
        <div className="absolute top-[18%] right-[18%] w-1 h-1 bg-blue-200 rounded-full animate-pulse opacity-40" style={{ animationDelay: "0.5s" }} />
        <div className="absolute top-[32%] left-[65%] w-1.5 h-1.5 bg-cyan-200 rounded-full animate-pulse opacity-30" style={{ animationDelay: "1s" }} />
        <div className="absolute top-[48%] left-[8%] w-1 h-1 bg-white rounded-full animate-pulse opacity-50" style={{ animationDelay: "1.5s" }} />
        <div className="absolute top-[12%] left-[48%] w-0.5 h-0.5 bg-cyan-100 rounded-full animate-pulse opacity-60" style={{ animationDelay: "0.3s" }} />
        <div className="absolute top-[58%] right-[12%] w-1 h-1 bg-blue-300 rounded-full animate-pulse opacity-40" style={{ animationDelay: "2s" }} />
        <div className="absolute top-[72%] left-[28%] w-0.5 h-0.5 bg-white rounded-full animate-pulse opacity-50" style={{ animationDelay: "0.8s" }} />
        <div className="absolute top-[5%] right-[38%] w-1 h-1 bg-cyan-400 rounded-full animate-pulse opacity-30" style={{ animationDelay: "1.2s" }} />
        {/* 吹き出しモチーフ */}
        <div className="absolute top-10 right-10 w-14 h-14 rounded-full bg-gradient-to-br from-cyan-300/15 to-transparent border border-cyan-400/10" />
        <div className="absolute bottom-20 left-10 w-10 h-10 rounded-full bg-gradient-to-br from-blue-300/10 to-transparent border border-blue-400/10" />
      </div>
      <main className="flex-grow relative z-10">{children}</main>
      <footer className="py-4 text-center text-sm text-cyan-400/50 relative z-10">
        <p>© 2026 言語化力診断</p>
        <p className="mt-1">
          Created by fuga |{" "}
          <Link href="/privacy" className="text-cyan-300/50 hover:text-cyan-300 transition-colors">プライバシーポリシー</Link>
          {" | "}
          <Link href="/" className="text-cyan-300/50 hover:text-cyan-300 transition-colors">診断一覧</Link>
        </p>
      </footer>
    </div>
  );
}
