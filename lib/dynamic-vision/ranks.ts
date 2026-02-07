export interface DynamicVisionRank {
  rank: string;
  title: string;
  threshold: number; // レベル以上でこのランク
  description: string;
  emoji: string;
  color: string;
  percentile: number;
}

const ranks: DynamicVisionRank[] = [
  { rank: "S", title: "鷹の目", threshold: 20, description: "プロアスリート級！高速の動きも見逃さない", emoji: "🦅", color: "#FFD700", percentile: 3 },
  { rank: "A", title: "動体視力マスター", threshold: 15, description: "素晴らしい動体視力！上位層の実力", emoji: "👁️", color: "#FF6B35", percentile: 10 },
  { rank: "B", title: "目がいい人", threshold: 11, description: "平均以上の動体視力。スポーツも得意？", emoji: "🏃", color: "#4ECDC4", percentile: 25 },
  { rank: "C", title: "ふつうの目", threshold: 7, description: "平均的な動体視力。日常には十分！", emoji: "👀", color: "#45B7D1", percentile: 50 },
  { rank: "D", title: "スロー再生希望", threshold: 4, description: "速い動きはちょっと苦手かも", emoji: "🎥", color: "#96CEB4", percentile: 75 },
  { rank: "E", title: "静止画専門", threshold: 0, description: "動くものより止まってるものが好き？", emoji: "🖼️", color: "#A8A8A8", percentile: 95 },
];

export function getRank(level: number): DynamicVisionRank {
  return ranks.find((r) => level >= r.threshold) || ranks[ranks.length - 1];
}
