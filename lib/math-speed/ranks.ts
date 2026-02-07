export interface MathSpeedRank {
  rank: string;
  title: string;
  threshold: number; // 正解数以上でこのランク
  description: string;
  emoji: string;
  color: string;
  percentile: number;
}

const ranks: MathSpeedRank[] = [
  { rank: "S", title: "電卓不要", threshold: 35, description: "人間計算機！暗算の天才", emoji: "🧮", color: "#FFD700", percentile: 3 },
  { rank: "A", title: "そろばん名人", threshold: 28, description: "素晴らしい計算速度！脳がフル回転", emoji: "⚡", color: "#FF6B35", percentile: 10 },
  { rank: "B", title: "暗算得意", threshold: 22, description: "平均以上の計算力！数字に強い", emoji: "📊", color: "#4ECDC4", percentile: 25 },
  { rank: "C", title: "普通の計算力", threshold: 16, description: "平均的な速度。日常には十分！", emoji: "🔢", color: "#45B7D1", percentile: 50 },
  { rank: "D", title: "電卓派", threshold: 10, description: "ちょっとゆっくり。スマホ電卓の出番", emoji: "📱", color: "#96CEB4", percentile: 75 },
  { rank: "E", title: "計算アレルギー", threshold: 0, description: "数字を見ると眠くなるタイプ？", emoji: "😴", color: "#A8A8A8", percentile: 95 },
];

export function getRank(correct: number): MathSpeedRank {
  return ranks.find((r) => correct >= r.threshold) || ranks[ranks.length - 1];
}
