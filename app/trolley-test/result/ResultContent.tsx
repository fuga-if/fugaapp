"use client";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { getResult, TrolleyScores } from "@/lib/trolley-test/results";
import { AxisType, questions } from "@/lib/trolley-test/questions";
import { getRelatedBlogPosts } from "@/lib/blog/posts";

export function TrolleyResultContent(): React.ReactElement {
  const relatedPosts = getRelatedBlogPosts("trolley-test");
  const searchParams = useSearchParams();

  const u = searchParams.get("u") ? Number(searchParams.get("u")) : 0;
  const d = searchParams.get("d") ? Number(searchParams.get("d")) : 0;
  const answersStr = searchParams.get("a") || "";
  const answers: AxisType[] = answersStr
    .split("")
    .map((c) => (c === "U" ? "utilitarian" : "deontological"));

  const scores: TrolleyScores = { utilitarian: u, deontological: d, answers };
  const result = getResult(scores);
  const total = u + d || 1;
  const uPercent = Math.round((u / total) * 100);
  const dPercent = 100 - uPercent;

  const handleShare = async () => {
    const text = `【思考の癖テスト】\n私は「${result.title}」でした！${result.emoji}\n功利主義 ${uPercent}% vs 義務論 ${dPercent}%\n\n#思考の癖テスト #fugaapp`;
    const url = `https://fugaapp.site/trolley-test/result?${searchParams.toString()}`;
    if (navigator.share) {
      try {
        await navigator.share({ text: text + "\n" + url });
        return;
      } catch {
        /* fallback */
      }
    }
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-lg text-center animate-bounce-in">
        <div className="bg-slate-800/50 backdrop-blur-sm border border-amber-500/30 rounded-2xl p-8 shadow-[0_0_40px_rgba(245,158,11,0.1)]">
          {/* タイプ */}
          <p className="text-amber-300/70 text-sm font-medium mb-2">
            ⚖️ あなたの思考タイプは...
          </p>
          <div className="text-6xl mb-4">{result.emoji}</div>
          <h1 className="text-3xl font-bold mb-2 text-amber-300">
            {result.title}
          </h1>
          {result.isHidden && (
            <span className="inline-block px-3 py-1 bg-yellow-900/40 border border-yellow-500/50 rounded-full text-yellow-400 text-xs font-bold mb-2">
              🏆 隠し結果
            </span>
          )}
          <p className="text-lg mb-4 text-amber-200/80">{result.subtitle}</p>
          <p className="text-slate-200 leading-relaxed mb-6">
            {result.description}
          </p>

          {/* スペクトラムバー */}
          <div className="bg-slate-700/30 rounded-xl p-5 mb-6 border border-amber-500/20">
            <p className="text-amber-300 font-bold text-sm mb-3 text-center">
              ⚖️ あなたの正義のスペクトラム
            </p>
            <div className="flex justify-between text-xs text-slate-300 mb-2">
              <span>📊 功利主義 {uPercent}%</span>
              <span>📜 義務論 {dPercent}%</span>
            </div>
            <div className="w-full h-6 bg-slate-800 rounded-full overflow-hidden flex">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-blue-400 transition-all duration-1000"
                style={{ width: `${uPercent}%` }}
              />
              <div
                className="h-full bg-gradient-to-r from-red-400 to-red-500 transition-all duration-1000"
                style={{ width: `${dPercent}%` }}
              />
            </div>
          </div>

          {/* 特徴 */}
          <div className="bg-slate-700/30 rounded-xl p-5 mb-6 text-left border border-amber-500/20">
            <p className="text-amber-300 font-bold text-sm mb-3 text-center">
              📋 あなたの特徴
            </p>
            <ul className="space-y-2">
              {result.traits.map((t, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-slate-200 text-sm"
                >
                  <span className="text-amber-300 mt-0.5">•</span>
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* 回答の振り返り */}
          <div className="bg-slate-700/30 rounded-xl p-5 mb-6 border border-amber-500/20">
            <p className="text-amber-300 font-bold text-sm mb-3 text-center">
              🔍 あなたの選択
            </p>
            <div className="space-y-2 text-left">
              {questions.map((q, i) => {
                const chosenAxis = answers[i];
                if (!chosenAxis) return null;
                const chosen = q.options.find((o) => o.axis === chosenAxis);
                return (
                  <div key={i} className="text-xs p-2 rounded bg-slate-800/30">
                    <div className="flex items-start gap-2">
                      <span className="text-lg">{q.emoji}</span>
                      <div>
                        <span className="text-slate-400">
                          Q{q.id}. {q.title}
                        </span>
                        <p className="text-slate-300 mt-0.5">
                          → {chosen?.summary || "未回答"}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* シェア & もう一度 */}
          <div className="space-y-4">
            <button
              onClick={handleShare}
              className="w-full px-8 py-4 rounded-xl font-bold text-lg shadow-lg bg-black text-white hover:bg-gray-800 flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95 border border-amber-500/30"
            >
              <svg
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              結果をシェア
            </button>
            <button
              onClick={() => (window.location.href = "/trolley-test")}
              className="w-full px-8 py-4 rounded-xl font-bold text-lg shadow-lg bg-slate-700/30 text-amber-300 border border-amber-400/50 hover:border-amber-400 hover:bg-slate-600/30 transition-all hover:scale-105 active:scale-95"
            >
              ⚖️ もう一度診断する
            </button>
          </div>

          {/* 関連ブログ記事 */}
          {relatedPosts.length > 0 && (
            <div className="mt-6 pt-4 border-t border-amber-500/20">
              <p className="text-xs text-amber-400/50 mb-3">
                📚 この診断をもっと深く知る
              </p>
              <div className="flex flex-col gap-2">
                {relatedPosts.map((post) => (
                  <Link
                    key={post.slug}
                    href={`/blog/${post.slug}`}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-slate-700/30 hover:bg-slate-600/30 rounded-xl text-slate-300 font-medium transition-colors border border-amber-500/20"
                  >
                    {post.emoji} {post.title} →
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* 他の診断 */}
          <div className="mt-8 pt-6 border-t border-amber-500/20">
            <p className="text-xs text-amber-400/40 mb-3">
              ▼ 次の診断もやってみる？
            </p>
            <div className="flex flex-col gap-2">
              <Link
                href="/liar-test"
                className="px-6 py-3 bg-slate-700/30 hover:bg-slate-600/30 rounded-xl text-amber-300/70 hover:text-amber-300 font-medium transition-colors text-center border border-amber-500/10"
              >
                🎭 嘘つき度診断 →
              </Link>
              <Link
                href="/shikou-type"
                className="px-6 py-3 bg-slate-700/30 hover:bg-slate-600/30 rounded-xl text-amber-300/70 hover:text-amber-300 font-medium transition-colors text-center border border-amber-500/10"
              >
                🧠 思考タイプ診断 →
              </Link>
              <Link
                href="/inkya-youkya"
                className="px-6 py-3 bg-slate-700/30 hover:bg-slate-600/30 rounded-xl text-amber-300/70 hover:text-amber-300 font-medium transition-colors text-center border border-amber-500/10"
              >
                🌓 陰キャ陽キャ診断 →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
