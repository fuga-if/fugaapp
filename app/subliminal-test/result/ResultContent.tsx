"use client";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { getResultByAnswers } from "@/lib/subliminal-test/results";
import type { AnswerData } from "@/lib/subliminal-test/results";
import { AxisKey } from "@/lib/subliminal-test/questions";

function parseAnswers(raw: string | null): AnswerData[] {
  if (!raw) return [];
  return raw.split(",").map((pair) => {
    const [ci, rt] = pair.split(":");
    return { choiceIndex: Number(ci) || 0, responseTimeMs: Number(rt) || 0 };
  });
}

/* ─── SVG Radar Chart ─── */
function RadarChart({ scores }: { scores: Record<AxisKey, number> }) {
  const axes: { key: AxisKey; label: string; color: string }[] = [
    { key: "action", label: "行動", color: "#EF4444" },
    { key: "logic", label: "論理", color: "#3B82F6" },
    { key: "nature", label: "感性", color: "#22C55E" },
    { key: "social", label: "共感", color: "#A855F7" },
  ];

  const cx = 150;
  const cy = 150;
  const maxRadius = 100;
  const maxScore = 24; // 8 questions × 3 max per axis
  const levels = 4;

  // Calculate points for each axis
  const angleStep = (2 * Math.PI) / axes.length;
  const dataPoints = axes.map((axis, i) => {
    const angle = -Math.PI / 2 + i * angleStep;
    const value = Math.min(scores[axis.key] / maxScore, 1);
    return {
      x: cx + maxRadius * value * Math.cos(angle),
      y: cy + maxRadius * value * Math.sin(angle),
      labelX: cx + (maxRadius + 24) * Math.cos(angle),
      labelY: cy + (maxRadius + 24) * Math.sin(angle),
      edgeX: cx + maxRadius * Math.cos(angle),
      edgeY: cy + maxRadius * Math.sin(angle),
      ...axis,
      score: scores[axis.key],
    };
  });

  const polygonPoints = dataPoints.map((p) => `${p.x},${p.y}`).join(" ");

  return (
    <svg viewBox="0 0 300 300" className="w-full max-w-[260px] mx-auto">
      {/* Grid circles */}
      {Array.from({ length: levels }, (_, i) => {
        const r = (maxRadius * (i + 1)) / levels;
        const points = axes
          .map((_, j) => {
            const angle = -Math.PI / 2 + j * angleStep;
            return `${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`;
          })
          .join(" ");
        return (
          <polygon
            key={i}
            points={points}
            fill="none"
            stroke="rgba(129,140,248,0.2)"
            strokeWidth="1"
          />
        );
      })}

      {/* Axis lines */}
      {dataPoints.map((p, i) => (
        <line
          key={i}
          x1={cx}
          y1={cy}
          x2={p.edgeX}
          y2={p.edgeY}
          stroke="rgba(129,140,248,0.15)"
          strokeWidth="1"
        />
      ))}

      {/* Data polygon */}
      <polygon
        points={polygonPoints}
        fill="rgba(99,102,241,0.25)"
        stroke="rgb(129,140,248)"
        strokeWidth="2"
      />

      {/* Data points */}
      {dataPoints.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="4" fill={p.color} />
      ))}

      {/* Labels */}
      {dataPoints.map((p, i) => (
        <text
          key={i}
          x={p.labelX}
          y={p.labelY}
          textAnchor="middle"
          dominantBaseline="middle"
          fill={p.color}
          fontSize="13"
          fontWeight="bold"
        >
          {p.label}
        </text>
      ))}

      {/* Score values */}
      {dataPoints.map((p, i) => (
        <text
          key={`score-${i}`}
          x={p.labelX}
          y={p.labelY + 15}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="rgba(199,210,254,0.7)"
          fontSize="10"
        >
          {p.score}pt
        </text>
      ))}
    </svg>
  );
}

/* ─── Result Content ─── */
export function SubliminalResultContent(): React.ReactElement {
  const searchParams = useSearchParams();
  const answers = parseAnswers(searchParams.get("a"));

  // Fallback if no valid answers
  if (answers.length !== 8) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center px-4 py-8">
        <div className="text-center">
          <p className="text-indigo-300 mb-4">結果が見つかりません</p>
          <Link
            href="/subliminal-test"
            className="text-purple-300 hover:text-purple-200 underline"
          >
            テストをやり直す
          </Link>
        </div>
      </main>
    );
  }

  const { result, axisScores } = getResultByAnswers(answers);

  // Calculate average response time
  const avgTime = Math.round(
    answers.reduce((sum, a) => sum + a.responseTimeMs, 0) / answers.length
  );

  const handleShare = async () => {
    const text = `【潜在意識テスト】\n私の潜在意識タイプは「${result.emoji} ${result.title}」でした！\n${result.subtitle}\n${result.isRare ? "🎯 レアタイプ！" : ""}\n\n#潜在意識テスト #fugaapp`;
    const url = `https://fugaapp.site/subliminal-test/result?${searchParams.toString()}`;
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
        {/* Rare type glow */}
        {result.isRare && (
          <div className="mb-4 animate-pulse">
            <div className="inline-block px-4 py-2 bg-yellow-500/20 border-2 border-yellow-400 rounded-full">
              <span className="text-yellow-300 font-bold text-sm">
                🎯 レアタイプ出現！
              </span>
            </div>
          </div>
        )}

        <div
          className={`backdrop-blur-sm rounded-2xl p-8 shadow-[0_0_40px_rgba(99,102,241,0.15)] ${
            result.isRare
              ? "bg-yellow-900/20 border-2 border-yellow-400/50"
              : "bg-indigo-900/40 border border-indigo-500/40"
          }`}
        >
          {/* Type emoji & title */}
          <p className="text-indigo-300/70 text-sm font-medium mb-2">
            ◈ あなたの潜在意識タイプは... ◈
          </p>
          <div className="text-6xl mb-4">{result.emoji}</div>
          <h1
            className="text-3xl font-bold mb-2"
            style={{ color: result.color }}
          >
            {result.title}
          </h1>
          <p className="text-lg mb-4 text-indigo-200">{result.subtitle}</p>

          {/* Rarity info */}
          {result.isRare && result.rarity && (
            <p className="text-yellow-300/80 text-xs mb-4 bg-yellow-500/10 rounded-lg py-2 px-3">
              {result.rarity}
            </p>
          )}

          <p className="text-indigo-100 leading-relaxed mb-6">
            {result.description}
          </p>

          {/* Radar chart (only for non-rare types) */}
          {!result.isRare && (
            <div className="bg-indigo-800/20 rounded-xl p-4 mb-6 border border-indigo-500/20">
              <p className="text-indigo-300 font-bold text-sm mb-3">
                ◈ 潜在意識マップ ◈
              </p>
              <RadarChart scores={axisScores} />
            </div>
          )}

          {/* Traits */}
          <div className="bg-indigo-800/20 rounded-xl p-5 mb-6 text-left border border-indigo-500/20">
            <p className="text-indigo-300 font-bold text-sm mb-3 text-center">
              ◈ あなたの潜在意識の特徴 ◈
            </p>
            <ul className="space-y-2">
              {result.traits.map((t, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-indigo-100 text-sm"
                >
                  <span className="text-purple-300 mt-0.5">◇</span>
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Response time stats */}
          <div className="bg-indigo-800/20 rounded-xl p-4 mb-6 border border-indigo-500/20">
            <p className="text-indigo-300 font-bold text-sm mb-2">
              ⚡ 平均反応速度
            </p>
            <p className="text-2xl font-bold text-white">
              {avgTime}
              <span className="text-sm text-indigo-400 ml-1">ms</span>
            </p>
            <p className="text-indigo-400/60 text-xs mt-1">
              {avgTime < 1000
                ? "超直感的！考える前に答えてる"
                : avgTime < 2000
                  ? "いい反応速度。直感が活きてる"
                  : avgTime < 3000
                    ? "しっかり見てから答えるタイプ"
                    : "じっくり考える慎重派"}
            </p>
          </div>

          {/* Share & Retry */}
          <div className="space-y-4">
            <button
              onClick={handleShare}
              className="w-full px-8 py-4 rounded-xl font-bold text-lg shadow-lg bg-black text-white hover:bg-gray-800 flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95 border border-indigo-500/30"
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
              onClick={() => (window.location.href = "/subliminal-test")}
              className="w-full px-8 py-4 rounded-xl font-bold text-lg shadow-lg bg-indigo-800/30 text-indigo-200 border border-indigo-400/50 hover:border-indigo-400 hover:bg-indigo-700/30 transition-all hover:scale-105 active:scale-95"
            >
              👁️ もう一度テストする
            </button>
          </div>

          {/* Other diagnoses */}
          <div className="mt-8 pt-6 border-t border-indigo-500/30">
            <p className="text-xs text-indigo-400/40 mb-3">
              ▼ 次の診断もやってみる？
            </p>
            <div className="flex flex-col gap-2">
              <Link
                href="/zense"
                className="px-6 py-3 bg-indigo-800/20 hover:bg-indigo-700/30 rounded-xl text-purple-300/60 hover:text-purple-300 font-medium transition-colors text-center border border-indigo-500/20"
              >
                🔮 前世診断 →
              </Link>
              <Link
                href="/flash-memory"
                className="px-6 py-3 bg-indigo-800/20 hover:bg-indigo-700/30 rounded-xl text-purple-300/60 hover:text-purple-300 font-medium transition-colors text-center border border-indigo-500/20"
              >
                📸 瞬間記憶テスト →
              </Link>
              <Link
                href="/reaction-test"
                className="px-6 py-3 bg-indigo-800/20 hover:bg-indigo-700/30 rounded-xl text-purple-300/60 hover:text-purple-300 font-medium transition-colors text-center border border-indigo-500/20"
              >
                ⚡ 反射神経テスト →
              </Link>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes bounce-in {
          0% {
            opacity: 0;
            transform: scale(0.9);
          }
          60% {
            transform: scale(1.02);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-bounce-in {
          animation: bounce-in 0.5s ease-out;
        }
      `}</style>
    </main>
  );
}
