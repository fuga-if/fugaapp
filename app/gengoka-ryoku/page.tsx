"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function GengokaRyokuHome(): React.ReactElement {
  const router = useRouter();
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-8">
      <div className="text-center animate-fade-in w-full max-w-sm">
        <div className="mb-6 animate-float">
          <div className="text-8xl mx-auto drop-shadow-[0_0_30px_rgba(6,182,212,0.4)]">📝</div>
        </div>

        <div className="bg-cyan-900/50 backdrop-blur-sm border border-cyan-500/50 rounded-2xl p-6 mb-6 shadow-[0_0_40px_rgba(6,182,212,0.15)]">
          <p className="text-cyan-300/70 text-sm mb-2">✦ あなたの言葉の力を測る ✦</p>
          <h1 className="text-3xl font-bold text-cyan-300 mb-2">言語化力診断</h1>
          <p className="text-cyan-100 text-lg mb-4 leading-relaxed">
            あなたの「言葉にする力」を<br />6タイプで診断！
          </p>
          <p className="text-cyan-300/70 text-sm mb-6">
            詩人、論理構築、例え話マスター、<br />聞き上手翻訳、直感、沈黙の賢者…<br />あなたはどのタイプ？
          </p>
          <button
            onClick={() => router.push("/gengoka-ryoku/quiz")}
            className="px-12 py-5 rounded-xl font-bold text-xl shadow-lg bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white transition-all transform hover:scale-105 active:scale-95"
          >
            📝 診断スタート
          </button>
          <p className="text-sm text-cyan-400/60 mt-4">※ 全8問・約1分で完了</p>
        </div>

        <div className="pt-4">
          <p className="text-xs text-cyan-400/50 mb-3">▼ 他の診断もやってみる？</p>
          <div className="flex flex-col gap-2">
            <Link href="/commu-style" className="text-cyan-300/60 hover:text-cyan-300 text-sm transition-colors">💬 コミュニケーションスタイル診断 →</Link>
            <Link href="/motivation" className="text-cyan-300/60 hover:text-cyan-300 text-sm transition-colors">⚡ モチベーション源泉診断 →</Link>
            <Link href="/shikou-type" className="text-cyan-300/60 hover:text-cyan-300 text-sm transition-colors">🧠 思考タイプ診断 →</Link>
          </div>
        </div>
      </div>
    </main>
  );
}
