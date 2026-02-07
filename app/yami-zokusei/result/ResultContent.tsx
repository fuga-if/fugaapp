"use client";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getResultByScores, getTopTypes } from "@/lib/yami-zokusei/results";
import { YamiType } from "@/lib/yami-zokusei/questions";
import { getRelatedBlogPosts } from "@/lib/blog/posts";

const typeKeys: YamiType[] = ['shikkoku-yami', 'souen-gouka', 'itetsuku-hyouga', 'shiden-raikou', 'seinaru-hikari', 'kyomu-kaze'];
const typeLabels: Record<YamiType, string> = { 'shikkoku-yami': '漆黒の闇', 'souen-gouka': '蒼炎の業火', 'itetsuku-hyouga': '凍てつく氷牙', 'shiden-raikou': '紫電の雷光', 'seinaru-hikari': '聖なる光', 'kyomu-kaze': '虚無の風' };

export function YamiZokuseiResultContent(): React.ReactElement {
  const router = useRouter();
  const relatedPosts = getRelatedBlogPosts("yami-zokusei");
  const searchParams = useSearchParams();
  const scores: Record<YamiType, number> = { 'shikkoku-yami': 0, 'souen-gouka': 0, 'itetsuku-hyouga': 0, 'shiden-raikou': 0, 'seinaru-hikari': 0, 'kyomu-kaze': 0 };
  for (const t of typeKeys) { const p = searchParams.get(t); scores[t] = p ? Number(p) : 0; }
  const result = getResultByScores(scores);
  const topTypes = getTopTypes(scores, 3);

  const handleShare = async () => {
    const text = `【闇属性診断】\n私の属性は「${result.title}」！${result.emoji}\n${result.quote}\n\n#闇属性診断 #fugaapp`;
    const url = `https://fugaapp.site/yami-zokusei/result?${new URLSearchParams(Object.entries(scores).map(([k,v])=>[k,v.toString()])).toString()}`;
    if (navigator.share) { try { await navigator.share({ text: text + '\n' + url }); return; } catch {} }
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-lg text-center animate-bounce-in">
        <div className="mb-6"><button onClick={() => router.push("/yami-zokusei")} className="w-full bg-gradient-to-r from-red-800 via-red-700 to-red-900 text-white font-bold py-4 px-6 rounded-full shadow-lg shadow-red-900/50 hover:opacity-90 transition-opacity animate-pulse border border-red-600/50">👆 タップして属性を覚醒！</button></div>
        <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-red-900/50">
          <div className="mb-6"><Image src={result.image} priority alt={result.title} width={180} height={180} className="mx-auto drop-shadow-[0_0_20px_rgba(255,0,0,0.3)]" /></div>
          <p className="text-red-400 text-sm font-medium mb-2">あなたの魂に宿る属性は...</p>
          <div className="text-5xl mb-4">{result.emoji}</div>
          <h1 className="text-3xl font-bold mb-2 text-white">{result.title}</h1>
          <p className="text-xl mb-4" style={{ color: result.color }}>{result.subtitle}</p>
          <p className="text-red-200 leading-relaxed mb-6">{result.description}</p>

          <div className="bg-red-900/20 rounded-2xl p-5 mb-6 text-left border border-red-900/30">
            <p className="text-red-400 font-bold text-sm mb-3 text-center">⚔️ この属性の特徴</p>
            <ul className="space-y-2">{result.traits.map((t, i) => (<li key={i} className="flex items-start gap-2 text-red-200 text-sm"><span className="text-red-500 mt-0.5">✓</span><span>{t}</span></li>))}</ul>
          </div>
          <div className="bg-gradient-to-r from-red-900/40 to-red-800/30 rounded-2xl p-4 mb-6 border border-red-800/30"><p className="text-white text-lg font-bold">{result.quote}</p></div>

          <div className="mb-8">
            <p className="text-red-400 text-sm mb-3">あなたの属性傾向</p>
            <div className="space-y-2">{topTypes.map((item, i) => (
              <div key={item.type} className="flex items-center gap-2">
                <span className="text-red-400 text-sm w-6">{i + 1}.</span>
                <div className="flex-1 bg-red-900/50 rounded-full h-4 overflow-hidden"><div className="h-full bg-gradient-to-r from-red-700 to-red-500 rounded-full" style={{ width: `${Math.min(100, (item.score / 30) * 100)}%` }} /></div>
                <span className="text-red-200 text-xs w-24 text-left">{typeLabels[item.type]}</span>
              </div>
            ))}</div>
          </div>

          <div className="space-y-4">
            <button onClick={handleShare} className="w-full px-8 py-4 rounded-full font-bold text-lg shadow-lg bg-black text-white hover:bg-gray-800 flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>結果をXでシェア</button>
            <button onClick={() => router.push("/yami-zokusei")} className="w-full px-8 py-4 rounded-full font-bold text-lg shadow-lg bg-white/10 text-red-200 border-2 border-red-800/50 hover:bg-white/20 transition-all hover:scale-105 active:scale-95">もう一度覚醒する</button>
          </div>

          {/* 関連ブログ記事 */}
          {relatedPosts.length > 0 && (
            <div className="mt-6 pt-4 border-t border-red-900/50">
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

          <div className="mt-8 pt-6 border-t border-red-900/50">
            <p className="text-xs text-red-800 mb-3">次の診断もやってみる？</p>
            <div className="flex flex-col gap-2">
              <Link href="/yoru-gata" className="px-6 py-3 bg-red-900/20 hover:bg-red-900/30 rounded-full text-indigo-400 font-medium transition-colors text-center">🌙 夜型オタク診断 →</Link>
              <Link href="/menhera" className="px-6 py-3 bg-red-900/20 hover:bg-red-900/30 rounded-full text-pink-400 font-medium transition-colors text-center">🖤 メンヘラ度診断 →</Link>
              <Link href="/gacha" className="px-6 py-3 bg-red-900/20 hover:bg-red-900/30 rounded-full text-amber-400 font-medium transition-colors text-center">💰 課金スタイル診断 →</Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
