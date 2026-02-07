"use client";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getResultByScores, RpgJobStats } from "@/lib/rpg-job/results";
import { RpgJobType } from "@/lib/rpg-job/questions";
import { getRelatedBlogPosts } from "@/lib/blog/posts";

const typeKeys: RpgJobType[] = ['type-a', 'type-b', 'type-c', 'type-d', 'type-e', 'type-f'];

const statColors: Record<keyof RpgJobStats, string> = {
  STR: "#EF4444",
  INT: "#8B5CF6",
  DEX: "#059669",
  VIT: "#F59E0B",
  LUK: "#EC4899",
  CHA: "#06B6D4",
};

function StatBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="flex items-center gap-2 font-mono">
      <span className="w-10 text-xs text-amber-400">{label}</span>
      <div className="flex-1 h-3 bg-slate-700 rounded overflow-hidden">
        <div
          className="h-full rounded transition-all duration-1000"
          style={{ width: `${value}%`, backgroundColor: color }}
        />
      </div>
      <span className="w-8 text-xs text-slate-400 text-right">{value}</span>
    </div>
  );
}

export function RpgJobResultContent(): React.ReactElement {
  const router = useRouter();
  const relatedPosts = getRelatedBlogPosts("rpg-job");
  const searchParams = useSearchParams();
  const scores: Record<RpgJobType, number> = { 'type-a': 0, 'type-b': 0, 'type-c': 0, 'type-d': 0, 'type-e': 0, 'type-f': 0 };
  for (const t of typeKeys) { const p = searchParams.get(t); scores[t] = p ? Number(p) : 0; }
  const result = getResultByScores(scores);

  const handleShare = async () => {
    const text = `【人生RPGジョブ診断】\n私のジョブは「${result.title}」でした！\n${result.quote}\n\n#人生RPGジョブ診断 #fugaapp`;
    const url = `https://fugaapp.site/rpg-job/result?${new URLSearchParams(Object.entries(scores).map(([k, v]) => [k, v.toString()])).toString()}`;
    if (navigator.share) { try { await navigator.share({ text: text + '\n' + url }); return; } catch { /* fallback */ } }
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-lg text-center animate-bounce-in">
        {/* メインステータスウィンドウ */}
        <div className="border-double border-4 border-amber-400 bg-slate-800/80 rounded-lg p-8 shadow-xl">
          <div className="mb-6">
            <Image src={result.image} priority alt={result.title} width={180} height={180} className="mx-auto drop-shadow-[0_0_20px_rgba(251,191,36,0.3)]" />
          </div>
          <p className="text-amber-400/70 text-sm font-medium mb-2">あなたのジョブは...</p>
          <div className="text-5xl mb-4">{result.emoji}</div>
          <h1 className="text-3xl font-bold mb-2 text-amber-400">{result.title}</h1>
          <p className="text-lg mb-4" style={{ color: result.color }}>{result.subtitle}</p>
          <p className="text-slate-300 leading-relaxed mb-6">{result.description}</p>

          {/* ステータスバー */}
          <div className="border-double border-4 border-slate-600 bg-slate-900/60 rounded-lg p-5 mb-6">
            <p className="text-amber-400 font-bold text-sm mb-4 text-center">─ ＳＴＡＴＵＳ ─</p>
            <div className="space-y-2">
              {(Object.keys(statColors) as (keyof RpgJobStats)[]).map((stat) => (
                <StatBar key={stat} label={stat} value={result.stats[stat]} color={statColors[stat]} />
              ))}
            </div>
          </div>

          {/* 特徴 */}
          <div className="bg-slate-900/60 rounded-lg p-5 mb-6 text-left border border-slate-600">
            <p className="text-amber-400 font-bold text-sm mb-3 text-center"> このジョブの特徴</p>
            <ul className="space-y-2">
              {result.traits.map((t, i) => (
                <li key={i} className="flex items-start gap-2 text-slate-300 text-sm">
                  <span className="text-amber-400 mt-0.5"></span><span>{t}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* 名言 */}
          <div className="border-double border-4 border-amber-400/50 bg-slate-900/60 rounded-lg p-4 mb-6">
            <p className="text-amber-400 text-lg font-bold">{result.quote}</p>
          </div>

          {/* シェア & もう一度 */}
          <div className="space-y-4">
            <button onClick={handleShare} className="w-full px-8 py-4 rounded font-bold text-lg shadow-lg bg-black text-white hover:bg-gray-800 flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95 border border-slate-600">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
               けっかをシェア
            </button>
            <button onClick={() => router.push("/rpg-job")} className="w-full px-8 py-4 rounded font-bold text-lg shadow-lg bg-slate-700 text-amber-400 border-2 border-amber-400/50 hover:border-amber-400 hover:bg-slate-600 transition-all hover:scale-105 active:scale-95">
               もういちど ぼうけんする
            </button>
          </div>

          {/* 関連ブログ記事 */}
          {relatedPosts.length > 0 && (
            <div className="mt-6 pt-4 border-t border-slate-600">
              <p className="text-xs text-slate-500 mb-3"> この診断をもっと深く知る</p>
              <div className="flex flex-col gap-2">
                {relatedPosts.map(post => (
                  <Link key={post.slug} href={`/blog/${post.slug}`}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-slate-700/50 hover:bg-slate-600/50 rounded text-slate-300 font-medium transition-colors border border-slate-600">
                    {post.emoji} {post.title} →
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* 他の診断 */}
          <div className="mt-8 pt-6 border-t border-slate-600">
            <p className="text-xs text-slate-500 mb-3"> 次の診断もやってみる？</p>
            <div className="flex flex-col gap-2">
              <Link href="/motivation" className="px-6 py-3 bg-slate-700/50 hover:bg-slate-600/50 rounded text-amber-400/70 hover:text-amber-400 font-medium transition-colors text-center"> モチベーション源泉診断 →</Link>
              <Link href="/gamer-type" className="px-6 py-3 bg-slate-700/50 hover:bg-slate-600/50 rounded text-amber-400/70 hover:text-amber-400 font-medium transition-colors text-center"> ゲーマータイプ診断 →</Link>
              <Link href="/yami-zokusei" className="px-6 py-3 bg-slate-700/50 hover:bg-slate-600/50 rounded text-amber-400/70 hover:text-amber-400 font-medium transition-colors text-center"> 闘属性診断 →</Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
