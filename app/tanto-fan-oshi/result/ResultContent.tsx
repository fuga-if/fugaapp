"use client";

import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { results } from "@/lib/tanto-fan-oshi/results";
import { ResultType } from "@/lib/tanto-fan-oshi/questions";
import { getRelatedBlogPosts } from "@/lib/blog/posts";

export function TantoResultContent(): React.ReactElement {
  const router = useRouter();
  const relatedPosts = getRelatedBlogPosts("tanto-fan-oshi");
  const searchParams = useSearchParams();
  const type = (searchParams.get("type") || 'tanto') as ResultType;
  const result = results[type] || results.tanto;

  const handleShare = () => {
    const text = `【担当/ファン/推し診断】\n${result.catchphrase}でした！\n${result.quote}\n\n#担当ファン推し診断 #fugaapp`;
    const url = `https://fugaapp.site/tanto-fan-oshi/result?type=${result.type}`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-lg text-center animate-bounce-in">
        <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-purple-500/30">
          <div className="mb-6"><Image src={result.image} priority alt={result.title} width={200} height={200} className="mx-auto drop-shadow-[0_0_20px_rgba(236,72,153,0.3)]" /></div>
          <p className="text-purple-300 text-sm font-medium mb-2">あなたの応援スタイルは...</p>
          <h1 className="text-3xl font-bold mb-2 text-white">{result.catchphrase}</h1>
          <p className="text-xl mb-4 font-bold" style={{ color: result.color }}>{result.title}</p>
          <p className="text-purple-200 leading-relaxed mb-6">{result.description}</p>

          <div className="bg-purple-500/10 rounded-2xl p-5 mb-6 text-left border border-purple-500/20">
            <p className="text-purple-300 font-bold text-sm mb-3 text-center"> あなたの特徴</p>
            <ul className="space-y-2">{result.traits.map((t, i) => (<li key={i} className="flex items-start gap-2 text-purple-200 text-sm"><span className="text-pink-400 mt-0.5"></span><span>{t}</span></li>))}</ul>
          </div>

          <div className="bg-gradient-to-r from-pink-500/30 to-purple-500/30 rounded-2xl p-4 mb-6 border border-purple-500/20">
            <p className="text-white text-lg font-bold">{result.quote}</p>
          </div>

          <div className="space-y-4">
            <button onClick={handleShare} className="w-full px-8 py-4 rounded-full font-bold text-lg shadow-lg bg-black text-white hover:bg-gray-800 flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
              結果をXでシェア
            </button>
            <button onClick={() => router.push("/tanto-fan-oshi/quiz")} className="w-full px-8 py-4 rounded-full font-bold text-lg shadow-lg bg-white/10 text-purple-200 border-2 border-purple-500/50 hover:bg-white/20 transition-all hover:scale-105 active:scale-95">もう一度診断する</button>
          </div>


          {/* 関連ブログ記事 */}
          {relatedPosts.length > 0 && (
            <div className="mt-6 pt-4 border-t border-purple-500/30">
              <p className="text-xs text-gray-400 mb-3"> この診断をもっと深く知る</p>
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
            <p className="text-xs text-purple-500 mb-3">他の診断もやってみる？</p>
            <div className="flex flex-col gap-2">
              <Link href="/gacha" className="px-6 py-3 bg-purple-500/10 hover:bg-purple-500/20 rounded-full text-amber-400 font-medium transition-colors text-center"> 課金スタイル診断 →</Link>
              <Link href="/menhera" className="px-6 py-3 bg-purple-500/10 hover:bg-purple-500/20 rounded-full text-pink-400 font-medium transition-colors text-center"> メンヘラ度診断 →</Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
