"use client";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getResultByScore, results } from "@/lib/adhd/results";
import { AdhdType } from "@/lib/adhd/questions";

const typeOrder: AdhdType[] = ['type-a', 'type-b', 'type-c', 'type-d', 'type-e'];
const scoreRanges: { type: AdhdType; min: number; max: number }[] = [
  { type: 'type-a', min: 26, max: 30 },
  { type: 'type-b', min: 21, max: 25 },
  { type: 'type-c', min: 15, max: 20 },
  { type: 'type-d', min: 9, max: 14 },
  { type: 'type-e', min: 0, max: 8 },
];

export function AdhdResultContent(): React.ReactElement {
  const router = useRouter();
  const searchParams = useSearchParams();
  const score = searchParams.get("score") ? Number(searchParams.get("score")) : 0;
  const result = getResultByScore(score);

  const handleShare = async () => {
    const text = `【ADHD傾向チェック】私は「${result.title}」でした！ ${result.advice} ※これは傾向チェックです #ADHD傾向チェック #fugaapp`;
    const url = `https://fugaapp.site/adhd/result?score=${score}`;
    if (navigator.share) { try { await navigator.share({ text: text + '\n' + url }); return; } catch { /* fallback */ } }
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-lg text-center animate-bounce-in">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-orange-100">
          <div className="mb-6">
            <Image src={result.image} priority alt={result.title} width={180} height={180} className="mx-auto drop-shadow-lg" />
          </div>
          <p className="text-orange-500 text-sm font-medium mb-2">あなたのタイプは...</p>
          <div className="text-5xl mb-4">{result.emoji}</div>
          <h1 className="text-3xl font-bold mb-2 text-gray-800">{result.title}</h1>
          <p className="text-xl mb-4" style={{ color: result.color }}>{result.subtitle}</p>
          <p className="text-gray-600 leading-relaxed mb-6">{result.description}</p>

          <div className="bg-orange-50 rounded-2xl p-5 mb-6 text-left border border-orange-100">
            <p className="text-orange-500 font-bold text-sm mb-3 text-center">🚀 このタイプの特徴</p>
            <ul className="space-y-2">
              {result.traits.map((t, i) => (
                <li key={i} className="flex items-start gap-2 text-gray-600 text-sm">
                  <span className="text-orange-500 mt-0.5">✓</span><span>{t}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-gradient-to-r from-orange-100 to-yellow-100 rounded-2xl p-4 mb-6 border border-orange-200">
            <p className="text-gray-800 text-lg font-bold">💡 {result.advice}</p>
          </div>

          <div className="mb-8">
            <p className="text-orange-500 text-sm mb-3">あなたのスコア: {score}点 / 30点</p>
            <div className="space-y-2">
              {typeOrder.map((type) => {
                const r = results[type];
                const range = scoreRanges.find(sr => sr.type === type)!;
                const isYourType = result.type === type;
                return (
                  <div key={type} className={`flex items-center gap-2 ${isYourType ? 'opacity-100' : 'opacity-50'}`}>
                    <span className="text-xl">{r.emoji}</span>
                    <span className="text-gray-600 text-xs w-40 text-left">{r.title}</span>
                    <span className="text-gray-400 text-xs">({range.min}-{range.max}点)</span>
                    {isYourType && <span className="text-orange-500 text-xs font-bold ml-2">← あなた</span>}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="space-y-4">
            <button onClick={handleShare} className="w-full px-8 py-4 rounded-full font-bold text-lg shadow-lg bg-black text-white hover:bg-gray-800 flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
              結果をXでシェア
            </button>
            <button onClick={() => router.push("/adhd")} className="w-full px-8 py-4 rounded-full font-bold text-lg shadow-lg bg-white text-orange-500 border-2 border-orange-200 hover:bg-orange-50 transition-all hover:scale-105 active:scale-95">
              もう一度診断する
            </button>
          </div>

          <div className="text-xs text-gray-400 mt-8 p-4 bg-gray-50 rounded-lg">
            <p className="mb-1">※このチェックは医学的診断ではありません</p>
            <p className="mb-1">※ADHDの診断は専門医のみが行えます</p>
            <p>※気になる症状がある場合は医療機関にご相談ください</p>
          </div>

          <div className="mt-8 pt-6 border-t border-orange-100">
            <p className="text-xs text-gray-400 mb-3">次の診断もやってみる？</p>
            <div className="flex flex-col gap-2">
              <Link href="/shikou-type" className="px-6 py-3 bg-orange-50 hover:bg-orange-100 rounded-full text-blue-500 font-medium transition-colors text-center">🧠 思考タイプ診断 →</Link>
              <Link href="/stress-taisho" className="px-6 py-3 bg-orange-50 hover:bg-orange-100 rounded-full text-green-500 font-medium transition-colors text-center">🌿 ストレス対処法タイプ診断 →</Link>
              <Link href="/motivation" className="px-6 py-3 bg-orange-50 hover:bg-orange-100 rounded-full text-purple-500 font-medium transition-colors text-center">⚡ モチベーション源泉診断 →</Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
