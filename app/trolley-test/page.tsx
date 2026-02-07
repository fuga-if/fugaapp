"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function TrolleyTestHome(): React.ReactElement {
  const router = useRouter();
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-8">
      <div className="text-center animate-fade-in w-full max-w-sm">
        {/* メインビジュアル */}
        <div className="mb-6">
          <div className="text-8xl mb-4 animate-float">🧩</div>
          <div className="flex justify-center gap-3 text-4xl opacity-60">
            <span>⚖️</span>
            <span>🚂</span>
            <span>🔮</span>
          </div>
        </div>

        <div className="bg-slate-800/60 backdrop-blur-sm border border-amber-500/30 rounded-2xl p-6 mb-6 shadow-[0_0_40px_rgba(245,158,11,0.1)]">
          <p className="text-amber-400/70 text-sm mb-2">
            ✦ 10問の倫理的ジレンマ ✦
          </p>
          <h1 className="text-3xl font-bold text-amber-300 mb-2">
            思考の癖テスト
          </h1>
          <p className="text-slate-200 text-lg mb-4 leading-relaxed">
            あなたの正義は、どっち寄り？
            <br />
            <span className="text-amber-400/80">功利主義 vs 義務論</span>
          </p>
          <p className="text-slate-400 text-sm mb-6">
            トロッコ問題から始まる10問の二択。
            <br />
            あなたの思考パターンを可視化します。
            <br />
            <span className="text-amber-400/60">隠し結果あり…？</span>
          </p>
          <button
            onClick={() => router.push("/trolley-test/quiz")}
            className="px-12 py-5 rounded-xl font-bold text-xl shadow-lg bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white transition-all transform hover:scale-105 active:scale-95"
          >
            ⚖️ テストを始める
          </button>
          <p className="text-sm text-slate-500 mt-4">
            ※ 全10問・約2分で完了
          </p>
        </div>

        {/* 説明 */}
        <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-4 mb-6 text-left">
          <p className="text-amber-400/80 text-sm font-bold mb-2">
            📊 功利主義とは？
          </p>
          <p className="text-slate-400 text-xs mb-3">
            「結果」が大事。より多くの人が幸せになる方を選ぶ考え方。
          </p>
          <p className="text-amber-400/80 text-sm font-bold mb-2">
            📜 義務論とは？
          </p>
          <p className="text-slate-400 text-xs">
            「プロセス」が大事。正しいことは結果に関係なく正しいという考え方。
          </p>
        </div>

        <div className="pt-4">
          <p className="text-xs text-slate-500 mb-3">
            ▼ 他の診断もやってみる？
          </p>
          <div className="flex flex-col gap-2">
            <Link
              href="/shikou-type"
              className="text-amber-300/60 hover:text-amber-300 text-sm transition-colors"
            >
              🧠 思考タイプ診断 →
            </Link>
            <Link
              href="/sainou"
              className="text-amber-300/60 hover:text-amber-300 text-sm transition-colors"
            >
              💎 隠れ才能診断 →
            </Link>
            <Link
              href="/hsp"
              className="text-amber-300/60 hover:text-amber-300 text-sm transition-colors"
            >
              🌸 HSP診断 →
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
