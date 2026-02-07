"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { getResultByScore } from "@/lib/menhera/results";
import { getRelatedBlogPosts } from "@/lib/blog/posts";

export function MenheraResultContent(): React.ReactElement {
  const router = useRouter();
  const relatedPosts = getRelatedBlogPosts("menhera");
  const searchParams = useSearchParams();
  const scoreParam = searchParams.get("score");
  const score = scoreParam ? Number(scoreParam) : 25;
  const result = getResultByScore(score);

  const handleShare = async () => {
    const text = `私のメンヘラ度は${result.level}でした!\n「${result.title}」\n\n#メンヘラ度診断 #fugaapp`;
    const url = `https://fugaapp.site/menhera/result?score=${score}`;
    if (navigator.share) {
      try { await navigator.share({ text: text + '\n' + url }); return; } catch {}
    }
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
    window.open(twitterUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-lg text-center animate-bounce-in">

        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-pink-100">
          <div className="mb-6">
            <Image src={result.image} priority alt="メンヘラちゃん" width={160} height={160} className="mx-auto" />
          </div>
          <p className="text-pink-500 text-sm font-medium mb-2">あなたのメンヘラ度は...</p>
          <div className="text-6xl font-bold mb-4" style={{ color: result.color }}>{result.level}</div>
          <div className="text-3xl mb-2">{result.emoji}</div>
          <h1 className="text-2xl font-bold mb-4" style={{ color: result.color }}>{result.title}</h1>
          <p className="text-gray-600 leading-relaxed mb-6">{result.description}</p>

          <div className="bg-pink-50/50 rounded-2xl p-5 mb-6 text-left">
            <p className="text-pink-500 font-bold text-sm mb-3 text-center"> こんなことしがち...?</p>
            <ul className="space-y-2">
              {result.traits.map((trait, i) => (
                <li key={i} className="flex items-start gap-2 text-gray-600 text-sm">
                  <span className="text-pink-400 mt-0.5"></span><span>{trait}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-gradient-to-r from-pink-100 to-purple-100 rounded-2xl p-4 mb-8">
            <p className="text-gray-700 text-sm font-medium"> {result.advice}</p>
          </div>

          <div className="space-y-4">
            <button onClick={handleShare}
              className="w-full px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg bg-black text-white hover:bg-gray-800 flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
              結果をXでシェア
            </button>
            <button onClick={() => router.push("/menhera")}
              className="px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg bg-white text-pink-500 border-2 border-pink-300 hover:bg-pink-50 hover:border-pink-400 w-full">
              もう一度診断する
            </button>
          </div>


          {/* 関連ブログ記事 */}
          {relatedPosts.length > 0 && (
            <div className="mt-6 pt-4 border-t border-pink-100">
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

          <div className="mt-8 pt-6 border-t border-pink-100">
            <p className="text-xs text-gray-400 mb-3">次の診断もやってみる？</p>
            <div className="flex flex-col gap-2">
              <Link href="/oshi" className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-pink-50 hover:bg-pink-100 rounded-full text-pink-500 font-medium transition-colors"> 推し活タイプ診断 →</Link>
              <Link href="/gacha" className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-pink-50 hover:bg-pink-100 rounded-full text-amber-500 font-medium transition-colors"> 課金スタイル診断 →</Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
