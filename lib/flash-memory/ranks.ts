export interface FlashMemoryRank {
  rank: string;
  title: string;
  threshold: number; // レベル以上でこのランク
  description: string;
  emoji: string;
  color: string;
  percentile: number;
}

const ranks: FlashMemoryRank[] = [
  { rank: "S", title: "写真記憶の持ち主", threshold: 12, description: "一瞬で全て記憶！驚異的な瞬間記憶力", emoji: "📸", color: "#FFD700", percentile: 3 },
  { rank: "A", title: "フラッシュブレイン", threshold: 9, description: "素晴らしい瞬間記憶！見た瞬間に焼き付く", emoji: "⚡", color: "#FF6B35", percentile: 10 },
  { rank: "B", title: "記憶上手", threshold: 7, description: "平均以上の記憶力。頼りになる脳", emoji: "💡", color: "#4ECDC4", percentile: 25 },
  { rank: "C", title: "ふつうの記憶力", threshold: 5, description: "平均的な瞬間記憶。日常には十分！", emoji: "🌱", color: "#45B7D1", percentile: 50 },
  { rank: "D", title: "ぼんやりさん", threshold: 3, description: "一瞬だとちょっと厳しい…", emoji: "💭", color: "#96CEB4", percentile: 75 },
  { rank: "E", title: "瞬間忘却", threshold: 0, description: "見た瞬間に消える。ある意味才能", emoji: "💨", color: "#A8A8A8", percentile: 95 },
];

export function getRank(level: number): FlashMemoryRank {
  return ranks.find((r) => level >= r.threshold) || ranks[ranks.length - 1];
}
