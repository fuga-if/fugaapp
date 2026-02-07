"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LiarTestHome(): React.ReactElement {
  const router = useRouter();
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-8">
      <div className="text-center animate-fade-in w-full max-w-sm">
        {/* アイコン */}
        <div className="mb-6 animate-float">
          <div className="text-8xl mx-auto drop-shadow-[0_0_30px_rgba(156,163,175,0.4)]">
            🎭
          </div>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-600/50 rounded-2xl p-6 mb-6 shadow-[0_0_40px_rgba(156,163,175,0.1)]">
          <p className="text-gray-400 text-sm mb-2 font-mono">
            ▶ ANALYSIS MODE
          </p>
          <h1 className="text-3xl font-bold text-white mb-2">嘘つき度診断</h1>
          <p className="text-gray-300 text-lg mb-4 leading-relaxed">
            あなたの嘘、バレてますよ？
          </p>
          <p className="text-gray-400/70 text-sm mb-2 leading-relaxed">
            10問の質問に<span className="text-white font-bold">正直に</span>
            答えてください。
          </p>
          <p className="text-gray-500/60 text-xs mb-6">
            ※ 深層心理を独自のアルゴリズムで分析します
          </p>

          <button
            onClick={() => router.push("/liar-test/quiz")}
            className="px-12 py-5 rounded-xl font-bold text-xl shadow-lg bg-gradient-to-r from-gray-600 to-gray-800 hover:from-gray-500 hover:to-gray-700 text-white transition-all transform hover:scale-105 active:scale-95 border border-gray-500/30"
          >
            🔍 診断をはじめる
          </button>
          <p className="text-sm text-gray-500/60 mt-4 font-mono">
            ※ 全10問・約2分で完了
          </p>
        </div>

        {/* 注意書き風 */}
        <div className="bg-gray-800/30 border border-gray-700/30 rounded-xl p-4 mb-6">
          <p className="text-gray-500 text-xs leading-relaxed">
            ⚠️ この診断はエンターテインメントです。
            <br />
            心理学的な根拠に基づくものではありません。
          </p>
        </div>

        <div className="pt-4">
          <p className="text-xs text-gray-500/50 mb-3">
            ▼ 他の診断もやってみる？
          </p>
          <div className="flex flex-col gap-2">
            <Link
              href="/hsp"
              className="text-gray-400/60 hover:text-gray-300 text-sm transition-colors"
            >
              🌸 HSP診断 →
            </Link>
            <Link
              href="/inkya-youkya"
              className="text-gray-400/60 hover:text-gray-300 text-sm transition-colors"
            >
              🌓 陰キャ陽キャ診断 →
            </Link>
            <Link
              href="/commu-style"
              className="text-gray-400/60 hover:text-gray-300 text-sm transition-colors"
            >
              💬 コミュスタイル診断 →
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
