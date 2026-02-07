"use client";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getResultByScores, getTopTypes } from "@/lib/gacha/results";
import { KakinType } from "@/lib/gacha/questions";
import { getRelatedBlogPosts } from "@/lib/blog/posts";

const typeKeys: KakinType[] = ['tenjou-kyouto', 'shoudou-kakin', 'bi-kakin', 'mu-kakin', 'gentei-killer', 'hai-kakin'];
const typeLabels: Record<KakinType, string> = { 'tenjou-kyouto': '天井教徒', 'shoudou-kakin': '衝動課金', 'bi-kakin': '微課金勢', 'mu-kakin': '完全無課金', 'gentei-killer': '限定キラー', 'hai-kakin': '廃課金戦士' };

export function GachaResultContent(): React.ReactElement {
  const router = useRouter();
  const relatedPosts = getRelatedBlogPosts("gacha");
  const searchParams = useSearchParams();
  const scores: Record<KakinType, number> = { 'tenjou-kyouto': 0, 'shoudou-kakin': 0, 'bi-kakin': 0, 'mu-kakin': 0, 'gentei-killer': 0, 'hai-kakin': 0 };
  for (const t of typeKeys) { const p = searchParams.get(t); scores[t] = p ? Number(p) : 0; }
  const result = getResultByScores(scores);
  const topTypes = getTopTypes(scores, 3);

  const handleShare = async () => {
    const text = `【課金スタイル診断】\n私は「${result.title}」タイプでした！\n${result.quote}\n\n#課金スタイル診断 #ソシャゲ #fugaapp`;
    const url = `https://fugaapp.site/gacha/result?${new URLSearchParams(Object.entries(scores).map(([k,v])=>[k,v.toString()])).toString()}`;
    if (navigator.share) { try { await navigator.share({ text: text + '\n' + url }); return; } catch {} }
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-lg text-center animate-bounce-in">
        <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-amber-500/30">
          <div className="mb-6"><Image src={result.image} priority alt={result.title} width={180} height={180} className="mx-auto drop-shadow-[0_0_20px_rgba(255,215,0,0.3)]" /></div>
          <p className="text-amber-400 text-sm font-medium mb-2">あなたの課金タイプは...</p>
          <div className="text-5xl mb-4">{result.emoji}</div>
          <h1 className="text-3xl font-bold mb-2 text-white">{result.title}</h1>
          <p className="text-xl mb-4" style={{ color: result.color }}>{result.subtitle}</p>
          <p className="text-amber-200 leading-relaxed mb-6">{result.description}</p>

          <div className="bg-amber-500/10 rounded-2xl p-5 mb-6 text-left border border-amber-500/20">
            <p className="text-amber-400 font-bold text-sm mb-3 text-center">💭 こんな課金者...?</p>
            <ul className="space-y-2">{result.traits.map((t, i) => (<li key={i} className="flex items-start gap-2 text-amber-200 text-sm"><span className="text-amber-400 mt-0.5">✓</span><span>{t}</span></li>))}</ul>
          </div>
          <div className="bg-gradient-to-r from-amber-500/30 to-orange-500/30 rounded-2xl p-4 mb-6 border border-amber-500/20"><p className="text-white text-lg font-bold">{result.quote}</p></div>

          <div className="mb-8">
            <p className="text-amber-400 text-sm mb-3">あなたの傾向</p>
            <div className="space-y-2">{topTypes.map((item, i) => (
              <div key={item.type} className="flex items-center gap-2">
                <span className="text-amber-400 text-sm w-6">{i + 1}.</span>
                <div className="flex-1 bg-amber-900/50 rounded-full h-4 overflow-hidden"><div className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full" style={{ width: `${Math.min(100, (item.score / 30) * 100)}%` }} /></div>
                <span className="text-amber-200 text-xs w-20 text-left">{typeLabels[item.type]}</span>
              </div>
            ))}</div>
          </div>

          <div className="space-y-4">
            <button onClick={handleShare} className="w-full px-8 py-4 rounded-full font-bold text-lg shadow-lg bg-black text-white hover:bg-gray-800 flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>結果をXでシェア</button>
            <button onClick={() => router.push("/gacha")} className="w-full px-8 py-4 rounded-full font-bold text-lg shadow-lg bg-white/10 text-amber-200 border-2 border-amber-500/50 hover:bg-white/20 transition-all hover:scale-105 active:scale-95">もう一度診断する</button>
          </div>

          {/* 関連ブログ記事 */}
          {relatedPosts.length > 0 && (
            <div className="mt-6 pt-4 border-t border-amber-500/30">
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

          <div className="mt-8 pt-6 border-t border-amber-500/30">
            <p className="text-xs text-amber-600 mb-3">次の診断もやってみる？</p>
            <div className="flex flex-col gap-2">
              <Link href="/menhera" className="px-6 py-3 bg-amber-500/10 hover:bg-amber-500/20 rounded-full text-pink-400 font-medium transition-colors text-center">🖤 メンヘラ度診断 →</Link>
              <Link href="/sns-fatigue" className="px-6 py-3 bg-amber-500/10 hover:bg-amber-500/20 rounded-full text-blue-400 font-medium transition-colors text-center">📱 SNS疲れ診断 →</Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
