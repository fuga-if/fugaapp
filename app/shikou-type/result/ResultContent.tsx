"use client";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getResultByScores, getTopTypes } from "@/lib/shikou-type/results";
import { ShikouType } from "@/lib/shikou-type/questions";
import { getRelatedBlogPosts } from "@/lib/blog/posts";

const typeKeys: ShikouType[] = ['type-a', 'type-b', 'type-c', 'type-d', 'type-e', 'type-f'];
const typeLabels: Record<ShikouType, string> = {
  'type-a': 'ロジカルシンカー',
  'type-b': '直感ひらめき型',
  'type-c': '共感リーダー型',
  'type-d': '慎重アナリスト型',
  'type-e': '行動ファースト型',
  'type-f': 'マルチ思考型',
};

export function ShikouTypeResultContent(): React.ReactElement {
  const router = useRouter();
  const relatedPosts = getRelatedBlogPosts("shikou-type");
  const searchParams = useSearchParams();
  const scores: Record<ShikouType, number> = { 'type-a': 0, 'type-b': 0, 'type-c': 0, 'type-d': 0, 'type-e': 0, 'type-f': 0 };
  for (const t of typeKeys) { const p = searchParams.get(t); scores[t] = p ? Number(p) : 0; }
  const result = getResultByScores(scores);
  const topTypes = getTopTypes(scores, 3);

  const handleShare = async () => {
    const text = `【思考タイプ診断】\n私は「${result.title}」タイプでした！\n${result.quote}\n\n#思考タイプ診断 #fugaapp`;
    const url = `https://fugaapp.site/shikou-type/result?${new URLSearchParams(Object.entries(scores).map(([k, v]) => [k, v.toString()])).toString()}`;
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

          <div className="bg-blue-50 rounded-2xl p-5 mb-6 text-left border border-blue-100">
            <p className="text-blue-500 font-bold text-sm mb-3 text-center">🧠 このタイプの特徴</p>
            <ul className="space-y-2">
              {result.traits.map((t, i) => (
                <li key={i} className="flex items-start gap-2 text-gray-600 text-sm">
                  <span className="text-blue-500 mt-0.5">✓</span><span>{t}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-gradient-to-r from-blue-100 to-amber-100 rounded-2xl p-4 mb-6 border border-blue-200">
            <p className="text-gray-800 text-lg font-bold">{result.quote}</p>
          </div>

          <div className="mb-8">
            <p className="text-blue-500 text-sm mb-3">あなたの思考傾向</p>
            <div className="space-y-2">
              {topTypes.map((item, i) => (
                <div key={item.type} className="flex items-center gap-2">
                  <span className="text-blue-500 text-sm w-6">{i + 1}.</span>
                  <div className="flex-1 bg-blue-100 rounded-full h-4 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-blue-500 to-amber-500 rounded-full" style={{ width: `${Math.min(100, (item.score / 30) * 100)}%` }} />
                  </div>
                  <span className="text-gray-600 text-xs w-32 text-left">{typeLabels[item.type]}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <button onClick={handleShare} className="w-full px-8 py-4 rounded-full font-bold text-lg shadow-lg bg-black text-white hover:bg-gray-800 flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
              結果をXでシェア
            </button>
            <button onClick={() => router.push("/shikou-type")} className="w-full px-8 py-4 rounded-full font-bold text-lg shadow-lg bg-white text-blue-500 border-2 border-blue-200 hover:bg-blue-50 transition-all hover:scale-105 active:scale-95">
              もう一度診断する
            </button>
          </div>


          {/* 関連ブログ記事 */}
          {relatedPosts.length > 0 && (
            <div className="mt-6 pt-4 border-t border-blue-100">
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

          <div className="mt-8 pt-6 border-t border-blue-100">
            <p className="text-xs text-gray-400 mb-3">次の診断もやってみる？</p>
            <div className="flex flex-col gap-2">
              <Link href="/inkya-youkya" className="px-6 py-3 bg-blue-50 hover:bg-blue-100 rounded-full text-purple-500 font-medium transition-colors text-center">🌓 陰キャ陽キャスペクトラム診断 →</Link>
              <Link href="/menhera" className="px-6 py-3 bg-blue-50 hover:bg-blue-100 rounded-full text-pink-500 font-medium transition-colors text-center">🖤 メンヘラ度診断 →</Link>
              <Link href="/gamer-type" className="px-6 py-3 bg-blue-50 hover:bg-blue-100 rounded-full text-red-500 font-medium transition-colors text-center">🎮 ゲーマータイプ診断 →</Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
