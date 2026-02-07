"use client";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { getResultType, results } from "@/lib/dark-triad/results";
import { getRelatedBlogPosts } from "@/lib/blog/posts";

/** SVG三角形レーダーチャート */
function RadarChart({
  m,
  n,
  p,
}: {
  m: number;
  n: number;
  p: number;
}): React.ReactElement {
  const cx = 150;
  const cy = 150;
  const R = 110;

  // 3軸の角度（上=M、右下=N、左下=P）
  // 上: -90deg, 右下: 30deg, 左下: 210deg (= -150deg)
  const angles = [
    (-90 * Math.PI) / 180, // M: top
    (30 * Math.PI) / 180, // N: bottom-right
    (150 * Math.PI) / 180, // P: bottom-left
  ];

  const getPoint = (angle: number, ratio: number) => ({
    x: cx + R * ratio * Math.cos(angle),
    y: cy + R * ratio * Math.sin(angle),
  });

  // 背景のガイドライン（20%, 40%, 60%, 80%, 100%）
  const levels = [0.2, 0.4, 0.6, 0.8, 1.0];

  // データポイント
  const values = [m / 100, n / 100, p / 100];
  const dataPoints = values.map((v, i) => getPoint(angles[i], v));
  const dataPath = `M${dataPoints.map((p) => `${p.x},${p.y}`).join("L")}Z`;

  // 軸のラベル位置
  const labelOffset = 1.2;
  const labelPoints = angles.map((a) => getPoint(a, labelOffset));

  return (
    <svg viewBox="0 0 300 300" className="w-full max-w-[280px] mx-auto">
      {/* 背景グリッド */}
      {levels.map((level) => {
        const pts = angles.map((a) => getPoint(a, level));
        return (
          <polygon
            key={level}
            points={pts.map((p) => `${p.x},${p.y}`).join(" ")}
            fill="none"
            stroke="rgba(168,85,247,0.2)"
            strokeWidth="1"
          />
        );
      })}

      {/* 軸の線 */}
      {angles.map((a, i) => {
        const end = getPoint(a, 1);
        return (
          <line
            key={i}
            x1={cx}
            y1={cy}
            x2={end.x}
            y2={end.y}
            stroke="rgba(168,85,247,0.3)"
            strokeWidth="1"
          />
        );
      })}

      {/* データ塗りつぶし */}
      <polygon
        points={dataPoints.map((p) => `${p.x},${p.y}`).join(" ")}
        fill="rgba(168,85,247,0.25)"
        stroke="rgba(168,85,247,0.8)"
        strokeWidth="2"
      />

      {/* データポイントのドット */}
      {dataPoints.map((p, i) => (
        <circle
          key={i}
          cx={p.x}
          cy={p.y}
          r="5"
          fill="#A855F7"
          stroke="#E9D5FF"
          strokeWidth="2"
        />
      ))}

      {/* ラベル */}
      <text
        x={labelPoints[0].x}
        y={labelPoints[0].y}
        textAnchor="middle"
        fill="#E9D5FF"
        fontSize="13"
        fontWeight="bold"
      >
         M
      </text>
      <text
        x={labelPoints[0].x}
        y={labelPoints[0].y + 14}
        textAnchor="middle"
        fill="#A855F7"
        fontSize="12"
        fontWeight="bold"
      >
        {m}%
      </text>

      <text
        x={labelPoints[1].x}
        y={labelPoints[1].y}
        textAnchor="start"
        fill="#E9D5FF"
        fontSize="13"
        fontWeight="bold"
      >
         N
      </text>
      <text
        x={labelPoints[1].x}
        y={labelPoints[1].y + 14}
        textAnchor="start"
        fill="#A855F7"
        fontSize="12"
        fontWeight="bold"
      >
        {n}%
      </text>

      <text
        x={labelPoints[2].x}
        y={labelPoints[2].y}
        textAnchor="end"
        fill="#E9D5FF"
        fontSize="13"
        fontWeight="bold"
      >
         P
      </text>
      <text
        x={labelPoints[2].x}
        y={labelPoints[2].y + 14}
        textAnchor="end"
        fill="#A855F7"
        fontSize="12"
        fontWeight="bold"
      >
        {p}%
      </text>
    </svg>
  );
}

export function DarkTriadResultContent(): React.ReactElement {
  const relatedPosts = getRelatedBlogPosts("dark-triad");
  const searchParams = useSearchParams();
  const m = Number(searchParams.get("m") || 0);
  const n = Number(searchParams.get("n") || 0);
  const p = Number(searchParams.get("p") || 0);
  const type = getResultType(m, n, p);
  const result = results[type];

  const handleShare = async () => {
    const text = `【ダークサイド診断】\n${result.emoji} 私は「${result.title}」でした！\nM:${m}% / N:${n}% / P:${p}%\n${result.quote}\n\n#ダークサイド診断 #fugaapp`;
    const url = `https://fugaapp.site/dark-triad/result?m=${m}&n=${n}&p=${p}`;
    if (navigator.share) {
      try {
        await navigator.share({ text: text + "\n" + url });
        return;
      } catch {
        /* fallback */
      }
    }
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-lg text-center animate-bounce-in">
        <div className="bg-black/50 backdrop-blur-sm border border-purple-500/40 rounded-2xl p-8 shadow-[0_0_40px_rgba(168,85,247,0.15)]">
          {/* タイトル */}
          <p className="text-purple-400/70 text-sm font-medium mb-2">
             あなたのダークサイドは... 
          </p>
          <div className="text-6xl mb-4">{result.emoji}</div>
          <h1 className="text-3xl font-bold mb-1 text-white">{result.title}</h1>
          <p className="text-lg mb-6 text-purple-300">{result.subtitle}</p>

          {/* レーダーチャート */}
          <div className="mb-6">
            <RadarChart m={m} n={n} p={p} />
          </div>

          {/* スコアバー */}
          <div className="bg-gray-900/50 rounded-xl p-4 mb-6 border border-purple-500/20">
            <div className="space-y-3">
              <ScoreBar label=" マキャベリズム" value={m} />
              <ScoreBar label=" ナルシシズム" value={n} />
              <ScoreBar label=" サイコパシー" value={p} />
            </div>
          </div>

          {/* 説明 */}
          <p className="text-gray-300 leading-relaxed mb-6 text-left">
            {result.description}
          </p>

          {/* 特徴 */}
          <div className="bg-gray-900/50 rounded-xl p-5 mb-6 text-left border border-purple-500/20">
            <p className="text-purple-400 font-bold text-sm mb-3 text-center">
               あなたの闇の特徴 
            </p>
            <ul className="space-y-2">
              {result.traits.map((t, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-gray-300 text-sm"
                >
                  <span className="text-purple-400 mt-0.5"></span>
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* 名言 */}
          <div className="bg-gray-900/50 border border-purple-400/30 rounded-xl p-4 mb-6">
            <p className="text-purple-300 text-lg font-bold">{result.quote}</p>
          </div>

          {/* シェア & もう一度 */}
          <div className="space-y-4">
            <button
              onClick={handleShare}
              className="w-full px-8 py-4 rounded-xl font-bold text-lg shadow-lg bg-black text-white hover:bg-gray-800 flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95 border border-purple-500/30"
            >
              <svg
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              結果をシェア
            </button>
            <button
              onClick={() => (window.location.href = "/dark-triad")}
              className="w-full px-8 py-4 rounded-xl font-bold text-lg shadow-lg bg-gray-900/50 text-purple-300 border border-purple-400/50 hover:border-purple-400 hover:bg-gray-800/50 transition-all hover:scale-105 active:scale-95"
            >
               もう一度診断する
            </button>
          </div>

          {/* 関連ブログ記事 */}
          {relatedPosts.length > 0 && (
            <div className="mt-6 pt-4 border-t border-purple-500/30">
              <p className="text-xs text-gray-500 mb-3">
                 この診断をもっと深く知る
              </p>
              <div className="flex flex-col gap-2">
                {relatedPosts.map((post) => (
                  <Link
                    key={post.slug}
                    href={`/blog/${post.slug}`}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-900/50 hover:bg-gray-800/50 rounded-xl text-gray-300 font-medium transition-colors border border-purple-500/20"
                  >
                    {post.emoji} {post.title} →
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* 他の診断 */}
          <div className="mt-8 pt-6 border-t border-purple-500/30">
            <p className="text-xs text-gray-500 mb-3">
               次の診断もやってみる？
            </p>
            <div className="flex flex-col gap-2">
              <Link
                href="/hsp"
                className="px-6 py-3 bg-gray-900/50 hover:bg-gray-800/50 rounded-xl text-purple-400/70 hover:text-purple-400 font-medium transition-colors text-center border border-purple-500/20"
              >
                 HSP診断 →
              </Link>
              <Link
                href="/adhd"
                className="px-6 py-3 bg-gray-900/50 hover:bg-gray-800/50 rounded-xl text-purple-400/70 hover:text-purple-400 font-medium transition-colors text-center border border-purple-500/20"
              >
                 ADHD傾向チェック →
              </Link>
              <Link
                href="/yami-zokusei"
                className="px-6 py-3 bg-gray-900/50 hover:bg-gray-800/50 rounded-xl text-purple-400/70 hover:text-purple-400 font-medium transition-colors text-center border border-purple-500/20"
              >
                 闘属性診断 →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function ScoreBar({
  label,
  value,
}: {
  label: string;
  value: number;
}): React.ReactElement {
  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="text-gray-300">{label}</span>
        <span className="text-purple-400 font-bold">{value}%</span>
      </div>
      <div className="w-full h-2.5 bg-gray-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-purple-600 to-purple-400 rounded-full transition-all duration-700"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}
