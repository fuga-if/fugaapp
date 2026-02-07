"use client";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { results, getResultByScores } from "@/lib/sns-fatigue/results";
import type { FatigueType } from "@/lib/sns-fatigue/questions";
import { getRelatedBlogPosts } from "@/lib/blog/posts";

const typeKeys: FatigueType[] = ['A', 'B', 'C', 'D', 'E', 'F'];

export function SnsResultContent(): React.ReactElement {
  const router = useRouter();
  const relatedPosts = getRelatedBlogPosts("sns-fatigue");
  const searchParams = useSearchParams();
  const type = (searchParams.get("type") || "A") as FatigueType;
  const result = results[type] || results.A;

  // Build scores from params (for bar chart) or fallback to highlighting the type
  const scores: Record<FatigueType, number> = { A: 0, B: 0, C: 0, D: 0, E: 0, F: 0 };
  let hasScores = false;
  for (const t of typeKeys) {
    const p = searchParams.get(t);
    if (p) { scores[t] = Number(p); hasScores = true; }
  }
  if (!hasScores) {
    // If only type param, highlight that type
    scores[type] = 10;
  }

  const topTypes = Object.entries(scores)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .filter(([, v]) => v > 0);

  const handleShare = async () => {
    const text = `【SNS疲れタイプ診断】\n私は「${result.name}」でした！\n${result.title}\n\n#SNS疲れ診断 #診断 #fugaapp`;
    const url = `https://fugaapp.site/sns-fatigue/result?type=${type}`;
    if (navigator.share) {
      try { await navigator.share({ text: text + "\n" + url }); return; } catch {}
    }
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-8" style={{ background: "linear-gradient(135deg, #e0f2fe 0%, #bae6fd 30%, #7dd3fc 60%, #1e3a5f 100%)" }}>
      <div className="w-full max-w-lg text-center animate-bounce-in">

        <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-blue-400/30">
          {/* 画像 */}
          <div className="mb-6">
            <Image
              src={result.image}
              alt={result.name}
              width={180}
              height={180}
              className="mx-auto drop-shadow-[0_0_20px_rgba(56,189,248,0.4)]"
            />
          </div>

          <p className="text-sky-300 text-sm font-medium mb-2">あなたのSNS疲れタイプは...</p>
          <div className="text-5xl mb-4">{result.emoji}</div>
          <h1 className="text-3xl font-bold mb-2 text-white">{result.name}</h1>
          <p className="text-xl mb-4" style={{ color: result.color }}>{result.title}</p>
          <p className="text-blue-100 leading-relaxed mb-6">{result.description}</p>

          {/* 特徴 */}
          <div className="bg-blue-500/10 rounded-2xl p-5 mb-6 text-left border border-blue-400/20">
            <p className="text-sky-300 font-bold text-sm mb-3 text-center"> こんな特徴があるかも</p>
            <ul className="space-y-2">
              {result.traits.map((t, i) => (
                <li key={i} className="flex items-start gap-2 text-blue-100 text-sm">
                  <span className="text-sky-400 mt-0.5"></span>
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* アドバイス */}
          <div className="bg-gradient-to-r from-sky-500/30 to-indigo-500/30 rounded-2xl p-4 mb-6 border border-blue-400/20">
            <p className="text-sky-300 font-bold text-sm mb-2"> アドバイス</p>
            <p className="text-white text-lg font-bold">{result.advice}</p>
          </div>

          {/* 傾向バー */}
          {topTypes.length > 0 && (
            <div className="mb-8">
              <p className="text-sky-300 text-sm mb-3">あなたの傾向</p>
              <div className="space-y-2">
                {topTypes.map(([t, score], i) => {
                  const r = results[t as FatigueType];
                  return (
                    <div key={t} className="flex items-center gap-2">
                      <span className="text-sky-300 text-sm w-6">{i + 1}.</span>
                      <div className="flex-1 bg-blue-900/50 rounded-full h-4 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-sky-400 to-blue-600 rounded-full"
                          style={{ width: `${Math.min(100, (score / 10) * 100)}%` }}
                        />
                      </div>
                      <span className="text-blue-100 text-xs w-28 text-left">{r.emoji} {r.name}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ボタン */}
          <div className="space-y-4">
            <button
              onClick={handleShare}
              className="w-full px-8 py-4 rounded-full font-bold text-lg shadow-lg bg-black text-white hover:bg-gray-800 flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              結果をXでシェア
            </button>
            <button
              onClick={() => router.push("/sns-fatigue")}
              className="w-full px-8 py-4 rounded-full font-bold text-lg shadow-lg bg-white/10 text-blue-100 border-2 border-blue-400/50 hover:bg-white/20 transition-all hover:scale-105 active:scale-95"
            >
              もう一度診断する
            </button>
          </div>

          {/* 相互リンク */}

          {/* 関連ブログ記事 */}
          {relatedPosts.length > 0 && (
            <div className="mt-6 pt-4 border-t border-blue-400/30">
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

          <div className="mt-8 pt-6 border-t border-blue-400/30">
            <p className="text-xs text-blue-400 mb-3">次の診断もやってみる？</p>
            <div className="flex flex-col gap-2">
              <Link href="/menhera" className="px-6 py-3 bg-blue-500/10 hover:bg-blue-500/20 rounded-full text-pink-400 font-medium transition-colors text-center"> メンヘラ度診断 →</Link>
              <Link href="/gacha" className="px-6 py-3 bg-blue-500/10 hover:bg-blue-500/20 rounded-full text-amber-400 font-medium transition-colors text-center"> 課金スタイル診断 →</Link>
              <Link href="/vtuber" className="px-6 py-3 bg-blue-500/10 hover:bg-blue-500/20 rounded-full text-purple-400 font-medium transition-colors text-center"> VTuberオタク診断 →</Link>
              <Link href="/oshi" className="px-6 py-3 bg-blue-500/10 hover:bg-blue-500/20 rounded-full text-red-400 font-medium transition-colors text-center"> 推し活タイプ診断 →</Link>
              <Link href="/tanto-fan-oshi" className="px-6 py-3 bg-blue-500/10 hover:bg-blue-500/20 rounded-full text-yellow-400 font-medium transition-colors text-center"> 担当ファン推し診断 →</Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
