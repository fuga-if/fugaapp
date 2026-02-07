export interface SwipeRank {
  rank: string;
  title: string;
  threshold: number; // 正解数以上でこのランク
  description: string;
  emoji: string;
  color: string;
  percentile: number;
}

const ranks: SwipeRank[] = [
  { rank: "S", title: "神経回路直結", threshold: 25, description: "脳と指が直結！一切の迷いなし", emoji: "⚡", color: "#FFD700", percentile: 3 },
  { rank: "A", title: "反射の達人", threshold: 20, description: "素晴らしい反射と判断力！", emoji: "🎯", color: "#FF6B35", percentile: 10 },
  { rank: "B", title: "スワイプマスター", threshold: 15, description: "平均以上！スマホ操作はお手のもの", emoji: "👆", color: "#4ECDC4", percentile: 25 },
  { rank: "C", title: "まあまあスワイパー", threshold: 10, description: "平均的な反応速度。十分！", emoji: "📱", color: "#45B7D1", percentile: 50 },
  { rank: "D", title: "のんびりスワイプ", threshold: 5, description: "もうちょっと素早く！", emoji: "🐌", color: "#96CEB4", percentile: 75 },
  { rank: "E", title: "方向音痴フィンガー", threshold: 0, description: "上下左右、迷いすぎ…？", emoji: "🌀", color: "#A8A8A8", percentile: 95 },
];

export function getRank(correct: number): SwipeRank {
  return ranks.find((r) => correct >= r.threshold) || ranks[ranks.length - 1];
}
