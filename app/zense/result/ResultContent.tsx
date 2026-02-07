"use client";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getResultByScores } from "@/lib/zense/results";
import { ZenseType } from "@/lib/zense/questions";
import { getRelatedBlogPosts } from "@/lib/blog/posts";

const typeKeys: ZenseType[] = ['type-a', 'type-b', 'type-c', 'type-d', 'type-e', 'type-f'];

export function ZenseResultContent(): React.ReactElement {
  const relatedPosts = getRelatedBlogPosts("zense");
  const searchParams = useSearchParams();
  const scores: Record<ZenseType, number> = { 'type-a': 0, 'type-b': 0, 'type-c': 0, 'type-d': 0, 'type-e': 0, 'type-f': 0 };
  for (const t of typeKeys) { const p = searchParams.get(t); scores[t] = p ? Number(p) : 0; }
  const result = getResultByScores(scores);

  const handleShare = async () => {
    const text = `【前世診断】\n私の前世は「${result.title}」でした！\n${result.quote}\n\n#前世診断 #fugaapp`;
    const url = `https://fugaapp.site/zense/result?${new URLSearchParams(Object.entries(scores).map(([k, v]) => [k, v.toString()])).toString()}`;
    if (navigator.share) { try { await navigator.share({ text: text + '\n' + url }); return; } catch { /* fallback */ } }
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-lg text-center animate-bounce-in">
        <div className="bg-purple-900/50 backdrop-blur-sm border border-purple-500/50 rounded-2xl p-8 shadow-[0_0_40px_rgba(168,85,247,0.15)]">
          {/* メイン画像 */}
          <div className="mb-6">
            <Image src={result.image} priority alt={result.title} width={180} height={180} className="mx-auto drop-shadow-[0_0_30px_rgba(168,85,247,0.4)]" />
          </div>

          {/* タイトル */}
          <p className="text-amber-300/70 text-sm font-medium mb-2"> あなたの前世は... </p>
          <div className="text-5xl mb-4">{result.emoji}</div>
          <h1 className="text-3xl font-bold mb-2 text-amber-300">{result.title}</h1>
          <p className="text-lg mb-4 text-purple-200">{result.subtitle}</p>
          <p className="text-purple-100 leading-relaxed mb-6">{result.description}</p>

          {/* 特徴 */}
          <div className="bg-purple-800/30 rounded-xl p-5 mb-6 text-left border border-purple-500/30">
            <p className="text-amber-300 font-bold text-sm mb-3 text-center"> 前世から受け継いだ特徴 </p>
            <ul className="space-y-2">
              {result.traits.map((t, i) => (
                <li key={i} className="flex items-start gap-2 text-purple-100 text-sm">
                  <span className="text-amber-300 mt-0.5"></span><span>{t}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* 名言 */}
          <div className="bg-purple-800/30 border border-amber-400/30 rounded-xl p-4 mb-6">
            <p className="text-amber-300 text-lg font-bold">{result.quote}</p>
          </div>

          {/* シェア & もう一度 */}
          <div className="space-y-4">
            <button onClick={handleShare} className="w-full px-8 py-4 rounded-xl font-bold text-lg shadow-lg bg-black text-white hover:bg-gray-800 flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95 border border-purple-500/30">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
              結果をシェア
            </button>
            <button onClick={() => window.location.href = "/zense"} className="w-full px-8 py-4 rounded-xl font-bold text-lg shadow-lg bg-purple-800/30 text-amber-300 border border-amber-400/50 hover:border-amber-400 hover:bg-purple-700/30 transition-all hover:scale-105 active:scale-95">
               もう一度占う
            </button>
          </div>

          {/* 関連ブログ記事 */}
          {relatedPosts.length > 0 && (
            <div className="mt-6 pt-4 border-t border-purple-500/30">
              <p className="text-xs text-purple-400/60 mb-3"> この診断をもっと深く知る</p>
              <div className="flex flex-col gap-2">
                {relatedPosts.map(post => (
                  <Link key={post.slug} href={`/blog/${post.slug}`}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-purple-800/30 hover:bg-purple-700/30 rounded-xl text-purple-200 font-medium transition-colors border border-purple-500/30">
                    {post.emoji} {post.title} →
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* 他の診断 */}
          <div className="mt-8 pt-6 border-t border-purple-500/30">
            <p className="text-xs text-purple-400/50 mb-3"> 次の診断もやってみる？</p>
            <div className="flex flex-col gap-2">
              <Link href="/rpg-job" className="px-6 py-3 bg-purple-800/30 hover:bg-purple-700/30 rounded-xl text-amber-300/70 hover:text-amber-300 font-medium transition-colors text-center border border-purple-500/20"> 人生RPGジョブ診断 →</Link>
              <Link href="/yami-zokusei" className="px-6 py-3 bg-purple-800/30 hover:bg-purple-700/30 rounded-xl text-amber-300/70 hover:text-amber-300 font-medium transition-colors text-center border border-purple-500/20"> 闇属性診断 →</Link>
              <Link href="/motivation" className="px-6 py-3 bg-purple-800/30 hover:bg-purple-700/30 rounded-xl text-amber-300/70 hover:text-amber-300 font-medium transition-colors text-center border border-purple-500/20"> モチベーション源泉診断 →</Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
