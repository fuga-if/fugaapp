"use client";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getResultByScores } from "@/lib/sainou/results";
import { SainouType } from "@/lib/sainou/questions";
import { getRelatedBlogPosts } from "@/lib/blog/posts";

const typeKeys: SainouType[] = ['type-a', 'type-b', 'type-c', 'type-d', 'type-e', 'type-f'];

export function SainouResultContent(): React.ReactElement {
  const relatedPosts = getRelatedBlogPosts("sainou");
  const searchParams = useSearchParams();
  const scores: Record<SainouType, number> = { 'type-a': 0, 'type-b': 0, 'type-c': 0, 'type-d': 0, 'type-e': 0, 'type-f': 0 };
  for (const t of typeKeys) { const p = searchParams.get(t); scores[t] = p ? Number(p) : 0; }
  const result = getResultByScores(scores);

  const handleShare = async () => {
    const text = `【隠れ才能診断】\n私の隠れた才能は「${result.title}」でした！\n${result.quote}\n\n#隠れ才能診断 #fugaapp`;
    const url = `https://fugaapp.site/sainou/result?${new URLSearchParams(Object.entries(scores).map(([k, v]) => [k, v.toString()])).toString()}`;
    if (navigator.share) { try { await navigator.share({ text: text + '\n' + url }); return; } catch { /* fallback */ } }
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-lg text-center animate-bounce-in">
        {/* メイン結果カード */}
        <div className="bg-white/80 backdrop-blur border border-amber-200 rounded-2xl p-8 shadow-lg">
          <div className="mb-6">
            <Image src={result.image} priority alt={result.title} width={180} height={180} className="mx-auto drop-shadow-[0_0_20px_rgba(245,158,11,0.3)]" />
          </div>
          <p className="text-amber-500/70 text-sm font-medium mb-2">あなたの隠れた才能は...</p>
          <div className="text-5xl mb-4">{result.emoji}</div>
          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-amber-500 to-purple-500 bg-clip-text text-transparent">{result.title}</h1>
          <p className="text-lg mb-4 font-medium" style={{ color: result.color }}>{result.subtitle}</p>
          <p className="text-gray-600 leading-relaxed mb-6">{result.description}</p>

          {/* 特徴 */}
          <div className="bg-amber-50/80 rounded-xl p-5 mb-6 text-left border border-amber-100">
            <p className="text-amber-600 font-bold text-sm mb-3 text-center">💎 あなたの才能の特徴</p>
            <ul className="space-y-2">
              {result.traits.map((t, i) => (
                <li key={i} className="flex items-start gap-2 text-gray-700 text-sm">
                  <span className="text-amber-500 mt-0.5">✦</span><span>{t}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* 名言 */}
          <div className="bg-gradient-to-r from-amber-50 to-purple-50 border border-amber-200 rounded-xl p-4 mb-6">
            <p className="text-amber-700 text-lg font-bold">{result.quote}</p>
          </div>

          {/* シェア & もう一度 */}
          <div className="space-y-4">
            <button onClick={handleShare} className="w-full px-8 py-4 rounded-xl font-bold text-lg shadow-lg bg-black text-white hover:bg-gray-800 flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
              結果をシェア
            </button>
          </div>

          {/* 関連ブログ記事 */}
          {relatedPosts.length > 0 && (
            <div className="mt-6 pt-4 border-t border-amber-100">
              <p className="text-xs text-gray-400 mb-3">📚 この診断をもっと深く知る</p>
              <div className="flex flex-col gap-2">
                {relatedPosts.map(post => (
                  <Link key={post.slug} href={`/blog/${post.slug}`}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-amber-50 hover:bg-amber-100 rounded-xl text-gray-700 font-medium transition-colors border border-amber-200">
                    {post.emoji} {post.title} →
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* 他の診断 */}
          <div className="mt-8 pt-6 border-t border-amber-100">
            <p className="text-xs text-gray-400 mb-3">▼ 次の診断もやってみる？</p>
            <div className="flex flex-col gap-2">
              <Link href="/motivation" className="px-6 py-3 bg-amber-50 hover:bg-amber-100 rounded-xl text-amber-600 hover:text-amber-700 font-medium transition-colors text-center border border-amber-100">⚡ モチベーション源泉診断 →</Link>
              <Link href="/shikou-type" className="px-6 py-3 bg-amber-50 hover:bg-amber-100 rounded-xl text-amber-600 hover:text-amber-700 font-medium transition-colors text-center border border-amber-100">🧠 思考タイプ診断 →</Link>
              <Link href="/commu-style" className="px-6 py-3 bg-amber-50 hover:bg-amber-100 rounded-xl text-amber-600 hover:text-amber-700 font-medium transition-colors text-center border border-amber-100">💬 コミュニケーションスタイル診断 →</Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
