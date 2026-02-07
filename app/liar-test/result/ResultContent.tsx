"use client";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { decodeAnswers, analyzeAnswers, questions } from "@/lib/liar-test/questions";
import { getResult } from "@/lib/liar-test/results";
import { getRelatedBlogPosts } from "@/lib/blog/posts";

export function LiarTestResultContent(): React.ReactElement {
  const relatedPosts = getRelatedBlogPosts("liar-test");
  const searchParams = useSearchParams();
  const answers = decodeAnswers(
    searchParams.get("a"),
    searchParams.get("t")
  );

  if (!answers) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center px-4">
        <div className="text-center">
          <p className="text-gray-400 mb-4">データが見つかりません</p>
          <Link href="/liar-test" className="text-white underline">
            もう一度診断する →
          </Link>
        </div>
      </main>
    );
  }

  const result = getResult(answers);
  const analysis = analyzeAnswers(answers);

  const maxTime = Math.max(...analysis.timesMs);

  const handleShare = async () => {
    const text = `【嘘つき度診断】\n嘘つき度 ${result.liarScore}%「${result.title}」でした！${result.emoji}\n${result.hidden === "instinct" ? " 隠し称号「直感の鬼」獲得！" : result.hidden === "yesman" ? " 隠し称号「イエスマン」獲得！" : result.hidden === "rebel" ? " 隠し称号「反逆者」獲得！" : ""}\n\n#嘘つき度診断 #fugaapp`;
    const url = `https://fugaapp.site/liar-test/result?${searchParams.toString()}`;
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
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-600/50 rounded-2xl p-8 shadow-[0_0_40px_rgba(156,163,175,0.1)]">
          {/* 嘘つき度メーター */}
          <p className="text-gray-400 text-sm font-mono mb-2">
             ANALYSIS COMPLETE
          </p>
          <div className="mb-6">
            <p className="text-gray-400 text-sm mb-2">嘘つき度</p>
            <div className="relative w-full h-8 bg-gray-800 rounded-full overflow-hidden border border-gray-600/30 mb-2">
              <div
                className="h-full rounded-full transition-all duration-1000 ease-out"
                style={{
                  width: `${result.liarScore}%`,
                  background: `linear-gradient(90deg, 
                    ${result.liarScore < 30 ? "#22c55e" : result.liarScore < 60 ? "#eab308" : result.liarScore < 80 ? "#f97316" : "#ef4444"} 0%, 
                    ${result.liarScore < 30 ? "#4ade80" : result.liarScore < 60 ? "#facc15" : result.liarScore < 80 ? "#fb923c" : "#f87171"} 100%)`,
                }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-white font-bold text-lg drop-shadow-md font-mono">
                  {result.liarScore}%
                </span>
              </div>
            </div>
          </div>

          {/* タイプ */}
          <div className="text-6xl mb-4">{result.emoji}</div>
          <h1 className="text-3xl font-bold mb-2 text-white">
            {result.title}
          </h1>
          <p className="text-lg mb-4 text-gray-300">{result.subtitle}</p>
          <p className="text-gray-200 leading-relaxed mb-6">
            {result.description}
          </p>

          {/* 隠し要素 */}
          {result.hidden && (
            <div className="bg-yellow-900/30 border border-yellow-500/50 rounded-xl p-4 mb-6 animate-pulse">
              <p className="text-yellow-400 font-bold text-sm mb-1">
                 隠し称号を獲得！
              </p>
              <p className="text-yellow-300 text-lg font-bold">
                {result.hidden === "instinct" && "「直感の鬼」"}
                {result.hidden === "yesman" && "「イエスマン」"}
                {result.hidden === "rebel" && "「反逆者」"}
              </p>
              <p className="text-yellow-400/70 text-xs mt-1">
                {result.hidden === "instinct" &&
                  "全問2秒以内で回答！迷いゼロの直感型"}
                {result.hidden === "yesman" &&
                  "全問「はい」…何でも受け入れるタイプ？"}
                {result.hidden === "rebel" &&
                  "全問「いいえ」…社会への反抗心が凄い"}
              </p>
            </div>
          )}

          {/* Q10特別メッセージ */}
          {result.q10Message && (
            <div className="bg-gray-700/30 border border-gray-500/30 rounded-xl p-4 mb-6">
              <p className="text-gray-300 text-sm whitespace-pre-line">
                {result.q10Message}
              </p>
            </div>
          )}

          {/* 特徴 */}
          <div className="bg-gray-700/30 rounded-xl p-5 mb-6 text-left border border-gray-600/30">
            <p className="text-gray-300 font-bold text-sm mb-3 text-center">
               あなたの特徴
            </p>
            <ul className="space-y-2">
              {result.traits.map((t, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-gray-200 text-sm"
                >
                  <span className="text-gray-400 mt-0.5">•</span>
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* 回答時間グラフ */}
          <div className="bg-gray-700/30 rounded-xl p-5 mb-6 border border-gray-600/30">
            <p className="text-gray-300 font-bold text-sm mb-4 text-center">
               回答時間グラフ
            </p>
            <div className="space-y-2">
              {analysis.timesMs.map((timeMs, i) => {
                const isAboveAvg = timeMs > analysis.avgTimeMs;
                const widthPercent = Math.max(
                  5,
                  Math.min(100, (timeMs / maxTime) * 100)
                );
                const seconds = (timeMs / 1000).toFixed(1);
                return (
                  <div key={i} className="flex items-center gap-2">
                    <span className="text-gray-500 text-xs font-mono w-8 shrink-0">
                      Q{i + 1}
                    </span>
                    <div className="flex-1 h-6 bg-gray-800 rounded overflow-hidden relative">
                      <div
                        className={`h-full rounded transition-all duration-700 ${
                          isAboveAvg
                            ? "bg-gradient-to-r from-red-500/80 to-red-400/60"
                            : analysis.isDesirable[i]
                              ? "bg-gradient-to-r from-yellow-500/60 to-yellow-400/40"
                              : "bg-gradient-to-r from-gray-500/60 to-gray-400/40"
                        }`}
                        style={{
                          width: `${widthPercent}%`,
                        }}
                      />
                      <div className="absolute inset-0 flex items-center px-2">
                        <span
                          className={`text-xs font-mono ${
                            isAboveAvg ? "text-red-200" : "text-gray-300"
                          }`}
                        >
                          {seconds}s
                          {isAboveAvg && " ← 迷い検出"}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-3 flex items-center justify-center gap-4 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 bg-gray-500/60 rounded inline-block" />
                通常
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 bg-yellow-500/60 rounded inline-block" />
                社会的望ましい回答
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 bg-red-500/80 rounded inline-block" />
                平均以上の迷い
              </span>
            </div>
            <p className="text-gray-500 text-xs mt-3 font-mono text-center">
              平均回答時間: {(analysis.avgTimeMs / 1000).toFixed(1)}s
            </p>
          </div>

          {/* 各質問の振り返り */}
          <div className="bg-gray-700/30 rounded-xl p-5 mb-6 border border-gray-600/30">
            <p className="text-gray-300 font-bold text-sm mb-3 text-center">
               回答の振り返り
            </p>
            <div className="space-y-2 text-left">
              {questions.map((q, i) => {
                const isAboveAvg = analysis.timesMs[i] > analysis.avgTimeMs;
                return (
                  <div
                    key={i}
                    className={`text-xs p-2 rounded ${
                      isAboveAvg
                        ? "bg-red-900/20 border border-red-500/20"
                        : "bg-gray-800/30"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">
                        Q{q.id}. {q.text}
                      </span>
                      <span
                        className={`font-mono ${
                          answers[i].answer
                            ? "text-green-400"
                            : "text-red-400"
                        }`}
                      >
                        {answers[i].answer ? "はい" : "いいえ"}
                      </span>
                    </div>
                    {isAboveAvg && (
                      <p className="text-red-400/70 text-xs mt-1">
                         この質問で迷ってますね...？（
                        {(analysis.timesMs[i] / 1000).toFixed(1)}s）
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* シェア & もう一度 */}
          <div className="space-y-4">
            <button
              onClick={handleShare}
              className="w-full px-8 py-4 rounded-xl font-bold text-lg shadow-lg bg-black text-white hover:bg-gray-800 flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95 border border-gray-600/30"
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
              onClick={() => (window.location.href = "/liar-test")}
              className="w-full px-8 py-4 rounded-xl font-bold text-lg shadow-lg bg-gray-700/30 text-gray-300 border border-gray-500/50 hover:border-gray-400 hover:bg-gray-600/30 transition-all hover:scale-105 active:scale-95"
            >
               もう一度診断する
            </button>
          </div>

          {/* 関連ブログ記事 */}
          {relatedPosts.length > 0 && (
            <div className="mt-6 pt-4 border-t border-gray-600/30">
              <p className="text-xs text-gray-500/60 mb-3">
                 この診断をもっと深く知る
              </p>
              <div className="flex flex-col gap-2">
                {relatedPosts.map((post) => (
                  <Link
                    key={post.slug}
                    href={`/blog/${post.slug}`}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-700/30 hover:bg-gray-600/30 rounded-xl text-gray-300 font-medium transition-colors border border-gray-600/30"
                  >
                    {post.emoji} {post.title} →
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* 他の診断 */}
          <div className="mt-8 pt-6 border-t border-gray-600/30">
            <p className="text-xs text-gray-500/50 mb-3">
               次の診断もやってみる？
            </p>
            <div className="flex flex-col gap-2">
              <Link
                href="/hsp"
                className="px-6 py-3 bg-gray-700/30 hover:bg-gray-600/30 rounded-xl text-gray-400/70 hover:text-gray-300 font-medium transition-colors text-center border border-gray-600/20"
              >
                 HSP診断 →
              </Link>
              <Link
                href="/inkya-youkya"
                className="px-6 py-3 bg-gray-700/30 hover:bg-gray-600/30 rounded-xl text-gray-400/70 hover:text-gray-300 font-medium transition-colors text-center border border-gray-600/20"
              >
                 陰キャ陽キャ診断 →
              </Link>
              <Link
                href="/commu-style"
                className="px-6 py-3 bg-gray-700/30 hover:bg-gray-600/30 rounded-xl text-gray-400/70 hover:text-gray-300 font-medium transition-colors text-center border border-gray-600/20"
              >
                 コミュスタイル診断 →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
