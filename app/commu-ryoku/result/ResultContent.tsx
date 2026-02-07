"use client";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getResultByScore, CommuType, results } from "@/lib/commu-ryoku/results";
import { getRelatedBlogPosts } from "@/lib/blog/posts";

const typeLabels: Record<CommuType, string> = { 'type-1': 'オタク外交官', 'type-2': '社交オタク', 'type-3': '内弁慶オタク', 'type-4': '観測者オタク', 'type-5': '一匹狼オタク', 'type-6': '潜伏型オタク' };

export function CommuResultContent(): React.ReactElement {
  const router = useRouter();
  const relatedPosts = getRelatedBlogPosts("commu-ryoku");
  const searchParams = useSearchParams();
  const score = Number(searchParams.get("score") || "0");
  const result = getResultByScore(score);

  const handleShare = async () => {
    const text = `【オタクコミュ力診断】\n私は「${result.title}」タイプでした！（${score}/30点）\n${result.quote}\n\n#オタクコミュ力診断 #fugaapp`;
    const url = `https://fugaapp.site/commu-ryoku/result?score=${score}`;
    if (navigator.share) { try { await navigator.share({ text: text + '\n' + url }); return; } catch {} }
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank', 'noopener,noreferrer');
  };

  // Build score bar for all types
  const allTypes: CommuType[] = ['type-1', 'type-2', 'type-3', 'type-4', 'type-5', 'type-6'];

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-lg text-center animate-bounce-in">
        <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-teal-500/30">
          <div className="mb-6"><Image src={result.image} priority alt={result.title} width={180} height={180} className="mx-auto drop-shadow-[0_0_20px_rgba(0,200,180,0.3)]" /></div>
          <p className="text-teal-400 text-sm font-medium mb-2">あなたのオタクコミュ力は...</p>
          <div className="text-5xl mb-4">{result.emoji}</div>
          <h1 className="text-3xl font-bold mb-2 text-white">{result.title}</h1>
          <p className="text-xl mb-2" style={{ color: result.color }}>{result.subtitle}</p>
          <p className="text-teal-300 text-lg font-bold mb-4">スコア: {score} / 30点</p>
          <p className="text-teal-200 leading-relaxed mb-6">{result.description}</p>

          <div className="bg-teal-500/10 rounded-2xl p-5 mb-6 text-left border border-teal-500/20">
            <p className="text-teal-400 font-bold text-sm mb-3 text-center">🗣️ こんなオタク...?</p>
            <ul className="space-y-2">{result.traits.map((t, i) => (<li key={i} className="flex items-start gap-2 text-teal-200 text-sm"><span className="text-teal-400 mt-0.5">✓</span><span>{t}</span></li>))}</ul>
          </div>
          <div className="bg-gradient-to-r from-teal-500/30 to-emerald-500/30 rounded-2xl p-4 mb-6 border border-teal-500/20"><p className="text-white text-lg font-bold">{result.quote}</p></div>

          <div className="mb-8">
            <p className="text-teal-400 text-sm mb-3">スコア分布</p>
            <div className="bg-teal-900/30 rounded-2xl p-4 border border-teal-500/20">
              <div className="w-full h-4 bg-teal-900/50 rounded-full overflow-hidden mb-2">
                <div className="h-full bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full transition-all" style={{ width: `${(score / 30) * 100}%` }} />
              </div>
              <div className="flex justify-between text-xs text-teal-400">
                <span>0</span>
                <span>30</span>
              </div>
              <div className="mt-3 space-y-1">
                {allTypes.map((t) => {
                  const r = results[t];
                  const isActive = result.type === t;
                  return (
                    <div key={t} className={`flex items-center gap-2 text-xs ${isActive ? 'text-white font-bold' : 'text-teal-500'}`}>
                      <span className="w-4">{isActive ? '→' : ''}</span>
                      <span className="w-24 text-left">{typeLabels[t]}</span>
                      <span>{r.minScore}-{r.maxScore}点</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <button onClick={handleShare} className="w-full px-8 py-4 rounded-full font-bold text-lg shadow-lg bg-black text-white hover:bg-gray-800 flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>結果をXでシェア</button>
            <button onClick={() => router.push("/commu-ryoku")} className="w-full px-8 py-4 rounded-full font-bold text-lg shadow-lg bg-white/10 text-teal-200 border-2 border-teal-500/50 hover:bg-white/20 transition-all hover:scale-105 active:scale-95">もう一度診断する</button>
          </div>

          {/* 関連ブログ記事 */}
          {relatedPosts.length > 0 && (
            <div className="mt-6 pt-4 border-t border-teal-500/30">
              <p className="text-xs text-gray-400 mb-3">📚 この診断をもっと深く知る</p>
              <div className="flex flex-col gap-2">
                {relatedPosts.map(post => (
                  <Link key={post.slug} href={`/blog/${post.slug}`}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white hover:bg-gray-50 rounded-full text-gray-600 font-medium transition-colors border border-gray-200">
                    {post.emoji} {post.title} →
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div className="mt-8 pt-6 border-t border-teal-500/30">
            <p className="text-xs text-teal-600 mb-3">次の診断もやってみる？</p>
            <div className="flex flex-col gap-2">
              <Link href="/otaku-kakuredo" className="px-6 py-3 bg-teal-500/10 hover:bg-teal-500/20 rounded-full text-orange-400 font-medium transition-colors text-center">🥷 オタクの隠れ度診断 →</Link>
              <Link href="/gacha" className="px-6 py-3 bg-teal-500/10 hover:bg-teal-500/20 rounded-full text-amber-400 font-medium transition-colors text-center">💰 課金スタイル診断 →</Link>
              <Link href="/menhera" className="px-6 py-3 bg-teal-500/10 hover:bg-teal-500/20 rounded-full text-pink-400 font-medium transition-colors text-center">🖤 メンヘラ度診断 →</Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
