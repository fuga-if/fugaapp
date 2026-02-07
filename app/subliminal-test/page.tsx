"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SubliminalTestHome(): React.ReactElement {
  const router = useRouter();
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-8">
      <div className="text-center animate-fade-in w-full max-w-sm">
        {/* アイコン */}
        <div className="mb-6">
          <div className="mx-auto w-32 h-32 relative">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-indigo-500/30 to-purple-500/30 animate-pulse" />
            <div className="absolute inset-2 rounded-full bg-gradient-to-br from-indigo-600/20 to-purple-600/20 flex items-center justify-center">
              <span className="text-6xl drop-shadow-[0_0_20px_rgba(99,102,241,0.5)]">
                👁️
              </span>
            </div>
          </div>
        </div>

        <div className="bg-indigo-900/40 backdrop-blur-sm border border-indigo-500/40 rounded-2xl p-6 mb-6 shadow-[0_0_40px_rgba(99,102,241,0.15)]">
          <p className="text-indigo-300/70 text-sm mb-2">
            ◈ 0.1秒の真実 ◈
          </p>
          <h1 className="text-3xl font-bold text-white mb-2">
            潜在意識テスト
          </h1>
          <p className="text-indigo-100 text-lg mb-4 leading-relaxed">
            0.1秒で見えたものが、
            <br />
            本当のあなた
          </p>
          <p className="text-indigo-300/70 text-sm mb-2">
            一瞬だけ表示される映像に直感で答えてね。
            <br />
            <span className="text-purple-300 font-bold">
              考えちゃダメ！
            </span>
          </p>
          <p className="text-indigo-400/50 text-xs mb-6">
            ※ 8問のテストがフラッシュ表示されます
          </p>

          <button
            onClick={() => router.push("/subliminal-test/quiz")}
            className="px-12 py-5 rounded-xl font-bold text-xl shadow-lg bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white transition-all transform hover:scale-105 active:scale-95"
          >
            👁️ テストを始める
          </button>
          <p className="text-sm text-indigo-400/50 mt-4">
            ※ 全8問・約1分で完了
          </p>
        </div>

        {/* レアタイプ告知 */}
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-3 mb-6">
          <p className="text-yellow-300/80 text-xs">
            🎯 隠しレアタイプが存在します。出現率 0.0015%…
          </p>
        </div>

        <div className="pt-4">
          <p className="text-xs text-indigo-400/40 mb-3">
            ▼ 他の診断もやってみる？
          </p>
          <div className="flex flex-col gap-2">
            <Link
              href="/zense"
              className="text-purple-300/50 hover:text-purple-300 text-sm transition-colors"
            >
              🔮 前世診断 →
            </Link>
            <Link
              href="/rpg-job"
              className="text-purple-300/50 hover:text-purple-300 text-sm transition-colors"
            >
              ⚔️ 人生RPGジョブ診断 →
            </Link>
            <Link
              href="/flash-memory"
              className="text-purple-300/50 hover:text-purple-300 text-sm transition-colors"
            >
              📸 瞬間記憶テスト →
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
