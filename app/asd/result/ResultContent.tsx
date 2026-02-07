"use client";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getResultByScore, getAsdPercentage } from "@/lib/asd/results";
import { getRelatedBlogPosts } from "@/lib/blog/posts";

export function AsdResultContent(): React.ReactElement {
  const router = useRouter();
  const relatedPosts = getRelatedBlogPosts("asd");
  const searchParams = useSearchParams();
  const scoreParam = searchParams.get("score");
  const totalScore = scoreParam ? Number(scoreParam) : 0;
  const result = getResultByScore(totalScore);
  const asdPercentage = getAsdPercentage(totalScore);

  const handleShare = async () => {
    const text = `【ASD傾向チェック】私は「${result.title}」でした！ ${result.advice} ※これは傾向チェックです #ASD傾向チェック #fugaapp`;
    const url = `https://fugaapp.site/asd/result?score=${totalScore}`;
    if (navigator.share) { try { await navigator.share({ text: text + '\n' + url }); return; } catch { /* fallback */ } }
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-lg text-center animate-bounce-in">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-blue-100">
          <div className="mb-6">
            <Image src={result.image} priority alt={result.title} width={180} height={180} className="mx-auto drop-shadow-lg" />
          </div>
          <p className="text-blue-500 text-sm font-medium mb-2">あなたのタイプは...</p>
          <div className="text-5xl mb-4">{result.emoji}</div>
          <h1 className="text-3xl font-bold mb-2 text-gray-800">{result.title}</h1>
          <p className="text-xl mb-4" style={{ color: result.color }}>{result.subtitle}</p>
          <p className="text-gray-600 leading-relaxed mb-6">{result.description}</p>

          {/* ASD傾向度メーター */}
          <div className="bg-blue-50 rounded-2xl p-5 mb-6 border border-blue-100">
            <p className="text-blue-500 font-bold text-sm mb-3 text-center">🔷 あなたのASD傾向度</p>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-500 w-16">低い</span>
              <div className="flex-1 bg-gray-200 rounded-full h-4 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full transition-all duration-1000" 
                  style={{ width: `${asdPercentage}%` }} 
                />
              </div>
              <span className="text-sm text-gray-500 w-16 text-right">高い</span>
            </div>
            <p className="text-2xl font-bold mt-3" style={{ color: result.color }}>{asdPercentage}%</p>
          </div>

          <div className="bg-blue-50 rounded-2xl p-5 mb-6 text-left border border-blue-100">
            <p className="text-blue-500 font-bold text-sm mb-3 text-center">🔹 このタイプの特徴</p>
            <ul className="space-y-2">
              {result.traits.map((t, i) => (
                <li key={i} className="flex items-start gap-2 text-gray-600 text-sm">
                  <span className="text-blue-500 mt-0.5">✓</span><span>{t}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-gradient-to-r from-blue-100 to-cyan-100 rounded-2xl p-4 mb-6 border border-blue-200">
            <p className="text-gray-800 text-lg font-bold">💭 {result.advice}</p>
          </div>

          <div className="space-y-4">
            <button onClick={handleShare} className="w-full px-8 py-4 rounded-full font-bold text-lg shadow-lg bg-black text-white hover:bg-gray-800 flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
              結果をXでシェア
            </button>
            <button onClick={() => router.push("/asd")} className="w-full px-8 py-4 rounded-full font-bold text-lg shadow-lg bg-white text-blue-500 border-2 border-blue-200 hover:bg-blue-50 transition-all hover:scale-105 active:scale-95">
              もう一度チェックする
            </button>
          </div>

          {/* 関連ブログ記事 */}
          {relatedPosts.length > 0 && (
            <div className="mt-6 pt-4 border-t border-blue-100">
              <p className="text-xs text-gray-400 mb-3">📚 ASDをもっと深く知る</p>
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

          <div className="mt-8 pt-6 border-t border-blue-100">
            <p className="text-xs text-gray-400 mb-3">次の診断もやってみる？</p>
            <div className="flex flex-col gap-2">
              <Link href="/hsp" className="px-6 py-3 bg-blue-50 hover:bg-blue-100 rounded-full text-purple-600 font-medium transition-colors text-center">🌸 HSP診断 →</Link>
              <Link href="/stress-taisho" className="px-6 py-3 bg-blue-50 hover:bg-blue-100 rounded-full text-green-600 font-medium transition-colors text-center">🌿 ストレス対処法タイプ診断 →</Link>
              <Link href="/shikou-type" className="px-6 py-3 bg-blue-50 hover:bg-blue-100 rounded-full text-blue-600 font-medium transition-colors text-center">🧠 思考タイプ診断 →</Link>
            </div>
          </div>
        </div>

        {/* 注意書き */}
        <div className="text-xs text-gray-400 mt-8 p-4 bg-gray-50 rounded-lg">
          <p className="mb-1">※このチェックは医学的診断ではありません</p>
          <p className="mb-1">※ASDの診断は専門医のみが行えます</p>
          <p>※気になる症状がある場合は医療機関にご相談ください</p>
        </div>
      </div>
    </main>
  );
}
