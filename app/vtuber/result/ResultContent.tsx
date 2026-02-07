"use client";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getResultByScores, getTopTypes } from "@/lib/vtuber/results";
import { OtakuType } from "@/lib/vtuber/questions";
import { getRelatedBlogPosts } from "@/lib/blog/posts";

const typeKeys: OtakuType[] = ['gachi-koi', 'hako-oshi', 'archive', 'shokunin', 'teetee', 'kosan'];
const typeLabelsMap: Record<OtakuType, string> = { 'gachi-koi': 'ガチ恋勢', 'hako-oshi': '箱推し', 'archive': 'アーカイブ', 'shokunin': '鑑賞勢', 'teetee': 'てぇてぇ', 'kosan': '発掘勢' };

export function VtuberResultContent(): React.ReactElement {
  const router = useRouter();
  const relatedPosts = getRelatedBlogPosts("vtuber");
  const searchParams = useSearchParams();
  const scores: Record<OtakuType, number> = { 'gachi-koi': 0, 'hako-oshi': 0, 'archive': 0, 'shokunin': 0, 'teetee': 0, 'kosan': 0 };
  for (const t of typeKeys) { const p = searchParams.get(t); scores[t] = p ? Number(p) : 0; }
  const result = getResultByScores(scores);
  const topTypes = getTopTypes(scores, 3);

  const handleShare = async () => {
    const text = `【Vtuberオタク診断】\n私は「${result.title}」タイプでした！\n${result.quote}\n\n#Vtuberオタク診断 #Vtuber #fugaapp`;
    const url = `https://fugaapp.site/vtuber/result?${new URLSearchParams(Object.entries(scores).map(([k,v])=>[k,v.toString()])).toString()}`;
    if (navigator.share) { try { await navigator.share({ text: text + '\n' + url }); return; } catch {} }
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-lg text-center animate-bounce-in">
        <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-purple-500/30">
          <div className="mb-6"><Image src={result.image} priority alt={result.title} width={180} height={180} className="mx-auto drop-shadow-lg" /></div>
          <p className="text-purple-300 text-sm font-medium mb-2">あなたのタイプは...</p>
          <div className="text-5xl mb-4">{result.emoji}</div>
          <h1 className="text-3xl font-bold mb-2 text-white">{result.title}</h1>
          <p className="text-xl mb-4" style={{ color: result.color }}>{result.subtitle}</p>
          <p className="text-purple-200 leading-relaxed mb-6">{result.description}</p>

          <div className="bg-purple-500/20 rounded-2xl p-5 mb-6 text-left">
            <p className="text-pink-400 font-bold text-sm mb-3 text-center">💭 こんなリスナー...?</p>
            <ul className="space-y-2">{result.traits.map((t, i) => (<li key={i} className="flex items-start gap-2 text-purple-200 text-sm"><span className="text-pink-400 mt-0.5">✓</span><span>{t}</span></li>))}</ul>
          </div>
          <div className="bg-gradient-to-r from-pink-500/30 to-purple-500/30 rounded-2xl p-4 mb-6"><p className="text-white text-lg font-bold">{result.quote}</p></div>

          <div className="mb-8">
            <p className="text-purple-300 text-sm mb-3">あなたの傾向</p>
            <div className="space-y-2">{topTypes.map((item, i) => (
              <div key={item.type} className="flex items-center gap-2">
                <span className="text-purple-300 text-sm w-6">{i + 1}.</span>
                <div className="flex-1 bg-purple-900/50 rounded-full h-4 overflow-hidden"><div className="h-full bg-gradient-to-r from-pink-500 to-purple-500 rounded-full" style={{ width: `${Math.min(100, (item.score / 30) * 100)}%` }} /></div>
                <span className="text-purple-200 text-xs w-20 text-left">{typeLabelsMap[item.type]}</span>
              </div>
            ))}</div>
          </div>

          <div className="space-y-4">
            <button onClick={handleShare} className="w-full px-8 py-4 rounded-full font-bold text-lg shadow-lg bg-black text-white hover:bg-gray-800 flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>結果をXでシェア</button>
            <button onClick={() => router.push("/vtuber")} className="w-full px-8 py-4 rounded-full font-bold text-lg shadow-lg bg-white/10 text-purple-200 border-2 border-purple-400/50 hover:bg-white/20 transition-all hover:scale-105 active:scale-95">もう一度診断する</button>
          </div>

          {/* 関連ブログ記事 */}
          {relatedPosts.length > 0 && (
            <div className="mt-6 pt-4 border-t border-purple-400/30">
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

          <div className="mt-8 pt-6 border-t border-purple-500/30">
            <p className="text-xs text-purple-400 mb-3">次の診断もやってみる？</p>
            <div className="flex flex-col gap-2">
              <Link href="/menhera" className="px-6 py-3 bg-purple-500/20 hover:bg-purple-500/40 rounded-full text-pink-400 font-medium transition-colors text-center">🖤 メンヘラ度診断 →</Link>
              <Link href="/oshi" className="px-6 py-3 bg-purple-500/20 hover:bg-purple-500/40 rounded-full text-pink-400 font-medium transition-colors text-center">💖 推し活診断 →</Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
