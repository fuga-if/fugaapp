"use client";

import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getResultByScores, getTopTypes } from "@/lib/oshi/results";
import { OshiType } from "@/lib/oshi/questions";
import { getRelatedBlogPosts } from "@/lib/blog/posts";

const typeKeys: OshiType[] = ['kakin-senshi', 'genba-shijou', 'sousaku-numa', 'data-chuu', 'fukyou-shi', 'seikan-sei'];
const typeLabels: Record<OshiType, string> = { 'kakin-senshi': '課金戦士', 'genba-shijou': '現場至上主義', 'sousaku-numa': '創作沼', 'data-chuu': 'データ厨', 'fukyou-shi': '布教師', 'seikan-sei': '静観勢' };

export function OshiResultContent(): React.ReactElement {
  const router = useRouter();
  const relatedPosts = getRelatedBlogPosts("oshi");
  const searchParams = useSearchParams();
  const scores: Record<OshiType, number> = { 'kakin-senshi': 0, 'genba-shijou': 0, 'sousaku-numa': 0, 'data-chuu': 0, 'fukyou-shi': 0, 'seikan-sei': 0 };
  for (const type of typeKeys) { const p = searchParams.get(type); scores[type] = p ? Number(p) : 0; }
  const result = getResultByScores(scores);
  const topTypes = getTopTypes(scores, 3);

  const handleShare = async () => {
    const text = `【推し活スタイル診断】\n私は「${result.title}」タイプでした！\n${result.quote}\n\n#推し活診断 #推し活 #fugaapp`;
    const url = `https://fugaapp.site/oshi/result?${new URLSearchParams(Object.entries(scores).map(([k,v])=>[k,v.toString()])).toString()}`;
    if (navigator.share) { try { await navigator.share({ text: text + '\n' + url }); return; } catch {} }
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-lg text-center animate-bounce-in">
        <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-pink-500/30">
          <div className="mb-6"><Image src={result.image} priority alt={result.title} width={180} height={180} className="mx-auto drop-shadow-[0_0_20px_rgba(236,72,153,0.3)]" /></div>
          <p className="text-pink-400 text-sm font-medium mb-2">あなたの推し活タイプは...</p>
          <div className="text-5xl mb-4">{result.emoji}</div>
          <h1 className="text-3xl font-bold mb-2 text-white">{result.title}</h1>
          <p className="text-xl mb-4" style={{ color: result.color }}>{result.subtitle}</p>
          <p className="text-pink-200 leading-relaxed mb-6">{result.description}</p>

          <div className="bg-pink-500/10 rounded-2xl p-5 mb-6 text-left border border-pink-500/20">
            <p className="text-pink-400 font-bold text-sm mb-3 text-center">💭 こんな推し活してない…？</p>
            <ul className="space-y-2">{result.traits.map((t, i) => (<li key={i} className="flex items-start gap-2 text-pink-200 text-sm"><span className="text-pink-400 mt-0.5">✓</span><span>{t}</span></li>))}</ul>
          </div>

          <div className="bg-gradient-to-r from-pink-500/30 to-purple-500/30 rounded-2xl p-4 mb-6 border border-pink-500/20">
            <p className="text-white text-lg font-bold">{result.quote}</p>
          </div>

          <div className="mb-8">
            <p className="text-pink-400 text-sm mb-3">あなたの傾向</p>
            <div className="space-y-2">{topTypes.map((item, i) => (
              <div key={item.type} className="flex items-center gap-2">
                <span className="text-pink-400 text-sm w-6">{i + 1}.</span>
                <div className="flex-1 bg-pink-900/50 rounded-full h-4 overflow-hidden"><div className="h-full bg-gradient-to-r from-pink-500 to-purple-500 rounded-full" style={{ width: `${Math.min(100, (item.score / 24) * 100)}%` }} /></div>
                <span className="text-pink-200 text-xs w-24 text-left">{typeLabels[item.type]}</span>
              </div>
            ))}</div>
          </div>

          <div className="space-y-4">
            <button onClick={handleShare} className="w-full px-8 py-4 rounded-full font-bold text-lg shadow-lg bg-black text-white hover:bg-gray-800 flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
              結果をXでシェア
            </button>
            <button onClick={() => router.push("/oshi")} className="w-full px-8 py-4 rounded-full font-bold text-lg shadow-lg bg-white/10 text-pink-200 border-2 border-pink-500/50 hover:bg-white/20 transition-all hover:scale-105 active:scale-95">もう一度診断する</button>
          </div>


          {/* 関連ブログ記事 */}
          {relatedPosts.length > 0 && (
            <div className="mt-6 pt-4 border-t border-pink-100">
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

          <div className="mt-8 pt-6 border-t border-pink-500/30">
            <p className="text-xs text-pink-600 mb-3">次の診断もやってみる？</p>
            <div className="flex flex-col gap-2">
              <Link href="/menhera" className="px-6 py-3 bg-pink-500/10 hover:bg-pink-500/20 rounded-full text-pink-400 font-medium transition-colors text-center">🖤 メンヘラ度診断 →</Link>
              <Link href="/vtuber" className="px-6 py-3 bg-pink-500/10 hover:bg-pink-500/20 rounded-full text-purple-400 font-medium transition-colors text-center">🎮 Vtuberオタク診断 →</Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
