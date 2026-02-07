export interface MemoryMatchRank {
  rank: string;
  title: string;
  threshold: number; // ターン数以下でこのランク（少ないほど良い）
  description: string;
  emoji: string;
  color: string;
  percentile: number;
}

// ターン数が少ないほど良いので、thresholdは「この数以下なら」の意味
const ranks: MemoryMatchRank[] = [
  { rank: "S", title: "超記憶力", threshold: 12, description: "驚異的！ほぼ完璧な記憶", emoji: "🧠", color: "#FFD700", percentile: 3 },
  { rank: "A", title: "記憶の達人", threshold: 16, description: "素晴らしい記憶力！", emoji: "🌟", color: "#FF6B35", percentile: 10 },
  { rank: "B", title: "なかなかの記憶力", threshold: 20, description: "平均以上！よく覚えてる", emoji: "💡", color: "#4ECDC4", percentile: 25 },
  { rank: "C", title: "普通の記憶力", threshold: 26, description: "平均的なペース", emoji: "🃏", color: "#45B7D1", percentile: 50 },
  { rank: "D", title: "ちょっと忘れっぽい", threshold: 34, description: "もう少し集中！", emoji: "🤔", color: "#96CEB4", percentile: 75 },
  { rank: "E", title: "記憶リセット", threshold: Infinity, description: "めくった瞬間忘れてない？", emoji: "💨", color: "#A8A8A8", percentile: 95 },
];

export function getRank(turns: number): MemoryMatchRank {
  return ranks.find((r) => turns <= r.threshold) || ranks[ranks.length - 1];
}

// カードのシンボル（8ペア = 16枚）
export const cardSymbols = [
  { id: "star", shape: "★", color: "#FFD700" },
  { id: "heart", shape: "♥", color: "#EF4444" },
  { id: "diamond", shape: "◆", color: "#3B82F6" },
  { id: "club", shape: "♣", color: "#22C55E" },
  { id: "spade", shape: "♠", color: "#1F2937" },
  { id: "moon", shape: "☾", color: "#8B5CF6" },
  { id: "sun", shape: "☀", color: "#F59E0B" },
  { id: "circle", shape: "●", color: "#EC4899" },
];
