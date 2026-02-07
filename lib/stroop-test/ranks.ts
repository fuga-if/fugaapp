export interface StroopRank {
  rank: string;
  title: string;
  threshold: number; // 正解数以上でこのランク
  description: string;
  emoji: string;
  color: string;
  percentile: number;
}

const ranks: StroopRank[] = [
  { rank: "S", title: "鋼の集中力", threshold: 30, description: "惑わされない鉄の意志！脳の処理速度が異常", emoji: "🧠", color: "#FFD700", percentile: 3 },
  { rank: "A", title: "冷静沈着", threshold: 24, description: "素晴らしい判断力！混乱に強い脳", emoji: "🎯", color: "#FF6B35", percentile: 10 },
  { rank: "B", title: "なかなかの脳力", threshold: 18, description: "平均以上！脳トレの成果が出てる", emoji: "💡", color: "#4ECDC4", percentile: 25 },
  { rank: "C", title: "普通の脳", threshold: 12, description: "平均的な処理速度。十分！", emoji: "🌱", color: "#45B7D1", percentile: 50 },
  { rank: "D", title: "うっかりさん", threshold: 7, description: "ちょっと惑わされやすいかも", emoji: "😵", color: "#96CEB4", percentile: 75 },
  { rank: "E", title: "脳がバグった", threshold: 0, description: "色と文字に翻弄されまくり…！", emoji: "🌀", color: "#A8A8A8", percentile: 95 },
];

export function getRank(correct: number): StroopRank {
  return ranks.find((r) => correct >= r.threshold) || ranks[ranks.length - 1];
}
