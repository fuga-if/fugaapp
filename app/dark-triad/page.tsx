"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function DarkTriadHome(): React.ReactElement {
  const router = useRouter();
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-8">
      <div className="text-center animate-fade-in w-full max-w-sm">
        {/* アイコン */}
        <div className="mb-6 animate-float">
          <div className="text-8xl mx-auto drop-shadow-[0_0_30px_rgba(168,85,247,0.5)]">
            🖤
          </div>
        </div>

        <div className="bg-black/50 backdrop-blur-sm border border-purple-500/40 rounded-2xl p-6 mb-6 shadow-[0_0_40px_rgba(168,85,247,0.15)]">
          <p className="text-purple-400/70 text-sm mb-2">
            ▸ あなたの中の闇、測定します ◂
          </p>
          <h1 className="text-3xl font-bold text-white mb-2">ダークサイド診断</h1>
          <p className="text-gray-300 text-lg mb-4 leading-relaxed">
            マキャベリズム・ナルシシズム
            <br />
            サイコパシーの3軸で測定
          </p>
          <p className="text-gray-400/70 text-sm mb-6">
            心理学の「ダークトライアド」を
            <br />
            12問でポップに診断。
            <br />
            あなたの闇タイプは8種のどれ？
          </p>
          <button
            onClick={() => router.push("/dark-triad/quiz")}
            className="px-12 py-5 rounded-xl font-bold text-xl shadow-lg bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-500 hover:to-purple-700 text-white transition-all transform hover:scale-105 active:scale-95 border border-purple-400/30"
          >
            🖤 闇を測定する
          </button>
          <p className="text-sm text-gray-500 mt-4">※ 全12問・約2分で完了</p>
        </div>

        {/* 3軸の説明 */}
        <div className="bg-black/30 border border-purple-500/20 rounded-xl p-4 mb-6">
          <p className="text-purple-400 text-xs font-bold mb-3">
            ▸ 3つの闇の軸 ◂
          </p>
          <div className="space-y-2 text-left">
            <div className="flex items-center gap-2">
              <span className="text-lg">🦊</span>
              <div>
                <p className="text-white text-sm font-medium">マキャベリズム</p>
                <p className="text-gray-400 text-xs">
                  目的のために手段を選ばない
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg">👑</span>
              <div>
                <p className="text-white text-sm font-medium">ナルシシズム</p>
                <p className="text-gray-400 text-xs">
                  自己への過大な関心と自信
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg">🧊</span>
              <div>
                <p className="text-white text-sm font-medium">サイコパシー</p>
                <p className="text-gray-400 text-xs">共感性の低さと大胆さ</p>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-4">
          <p className="text-xs text-gray-500 mb-3">▼ 他の診断もやってみる？</p>
          <div className="flex flex-col gap-2">
            <Link
              href="/hsp"
              className="text-purple-400/60 hover:text-purple-400 text-sm transition-colors"
            >
              🌸 HSP診断 →
            </Link>
            <Link
              href="/adhd"
              className="text-purple-400/60 hover:text-purple-400 text-sm transition-colors"
            >
              🚀 ADHD傾向チェック →
            </Link>
            <Link
              href="/yami-zokusei"
              className="text-purple-400/60 hover:text-purple-400 text-sm transition-colors"
            >
              ⚔️ 闇属性診断 →
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
