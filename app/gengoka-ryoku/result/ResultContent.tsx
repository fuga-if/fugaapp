"use client";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { getResultByScores } from "@/lib/gengoka-ryoku/results";
import { GengokaType } from "@/lib/gengoka-ryoku/questions";
import { getRelatedBlogPosts } from "@/lib/blog/posts";

const typeKeys: GengokaType[] = ['type-a', 'type-b', 'type-c', 'type-d', 'type-e', 'type-f'];

export function GengokaResultContent(): React.ReactElement {
  const relatedPosts = getRelatedBlogPosts("gengoka-ryoku");
  const searchParams = useSearchParams();
  const scores: Record<GengokaType, number> = { 'type-a': 0, 'type-b': 0, 'type-c': 0, 'type-d': 0, 'type-e': 0, 'type-f': 0 };
  for (const t of typeKeys) { const p = searchParams.get(t); scores[t] = p ? Number(p) : 0; }
  const result = getResultByScores(scores);

  const handleShare = async () => {
    const text = `【言語化力診断】\n${result.shareText}\n\n#言語化力診断 #fugaapp`;
    const url = `https://fugaapp.site/gengoka-ryoku/result?${new URLSearchParams(Object.entries(scores).map(([k, v]) => [k, v.toString()])).toString()}`;
    if (navigator.share) { try { await navigator.share({ text: text + '\n' + url }); return; } catch { /* fallback */ } }
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-lg text-center animate-bounce-in">
        <div className="bg-cyan-900/50 backdrop-blur-sm border border-cyan-500/50 rounded-2xl p-8 shadow-[0_0_40px_rgba(6,182,212,0.15)]">
          {/* タイトル */}
          <p className="text-cyan-300/70 text-sm font-medium mb-2"> あなたの言語化タイプは... </p>
          <div className="text-5xl mb-4">{result.emoji}</div>
          <h1 className="text-3xl font-bold mb-2 text-cyan-300">{result.title}</h1>
          <p className="text-lg mb-4 text-cyan-200">{result.subtitle}</p>
          <p className="text-cyan-100 leading-relaxed mb-6">{result.description}</p>

          {/* 特徴 */}
          <div className="bg-cyan-800/30 rounded-xl p-5 mb-6 text-left border border-cyan-500/30">
            <p className="text-cyan-300 font-bold text-sm mb-3 text-center"> あなたの言語化スタイル </p>
            <ul className="space-y-2">
              {result.traits.map((t, i) => (
                <li key={i} className="flex items-start gap-2 text-cyan-100 text-sm">
                  <span className="text-cyan-300 mt-0.5"></span><span>{t}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* アドバイス */}
          <div className="bg-cyan-800/30 border border-cyan-300/30 rounded-xl p-4 mb-6">
            <p className="text-cyan-300/70 text-xs mb-2"> 言語化力アップのヒント</p>
            <p className="text-cyan-300 text-base font-bold">{result.advice}</p>
          </div>

          {/* シェア & もう一度 */}
          <div className="space-y-4">
            <button onClick={handleShare} className="w-full px-8 py-4 rounded-xl font-bold text-lg shadow-lg bg-black text-white hover:bg-gray-800 flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95 border border-cyan-500/30">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
              結果をシェア
            </button>
            <button onClick={() => window.location.href = "/gengoka-ryoku"} className="w-full px-8 py-4 rounded-xl font-bold text-lg shadow-lg bg-cyan-800/30 text-cyan-300 border border-cyan-400/50 hover:border-cyan-400 hover:bg-cyan-700/30 transition-all hover:scale-105 active:scale-95">
               もう一度診断する
            </button>
          </div>

          {/* 関連ブログ記事 */}
          {relatedPosts.length > 0 && (
            <div className="mt-6 pt-4 border-t border-cyan-500/30">
              <p className="text-xs text-cyan-400/60 mb-3"> この診断をもっと深く知る</p>
              <div className="flex flex-col gap-2">
                {relatedPosts.map(post => (
                  <Link key={post.slug} href={`/blog/${post.slug}`}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-cyan-800/30 hover:bg-cyan-700/30 rounded-xl text-cyan-200 font-medium transition-colors border border-cyan-500/30">
                    {post.emoji} {post.title} →
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* 他の診断 */}
          <div className="mt-8 pt-6 border-t border-cyan-500/30">
            <p className="text-xs text-cyan-400/50 mb-3"> 次の診断もやってみる？</p>
            <div className="flex flex-col gap-2">
              <Link href="/commu-style" className="px-6 py-3 bg-cyan-800/30 hover:bg-cyan-700/30 rounded-xl text-cyan-300/70 hover:text-cyan-300 font-medium transition-colors text-center border border-cyan-500/20"> コミュニケーションスタイル診断 →</Link>
              <Link href="/motivation" className="px-6 py-3 bg-cyan-800/30 hover:bg-cyan-700/30 rounded-xl text-cyan-300/70 hover:text-cyan-300 font-medium transition-colors text-center border border-cyan-500/20"> モチベーション源泉診断 →</Link>
              <Link href="/shikou-type" className="px-6 py-3 bg-cyan-800/30 hover:bg-cyan-700/30 rounded-xl text-cyan-300/70 hover:text-cyan-300 font-medium transition-colors text-center border border-cyan-500/20"> 思考タイプ診断 →</Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
