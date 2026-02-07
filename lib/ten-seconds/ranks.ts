export interface TenSecondsRank {
  rank: string;
  title: string;
  threshold: number; // 誤差ms以下でこのランク
  description: string;
  emoji: string;
  color: string;
}

const ranks: TenSecondsRank[] = [
  { rank: "S", title: "人間原子時計", threshold: 100, description: "誤差0.1秒以内！超人的な体内時計", emoji: "🎯", color: "#FFD700" },
  { rank: "A", title: "時の番人", threshold: 250, description: "誤差0.25秒以内。かなり正確！", emoji: "⏱️", color: "#FF6B35" },
  { rank: "B", title: "リズムキーパー", threshold: 500, description: "まあまあ正確。いい感覚してる", emoji: "⏰", color: "#4ECDC4" },
  { rank: "C", title: "だいたい時計", threshold: 1000, description: "1秒以内のズレ。悪くないけど…", emoji: "🕰️", color: "#45B7D1" },
  { rank: "D", title: "時間迷子", threshold: 2000, description: "2秒もズレてる！体内時計壊れてない？", emoji: "⌛", color: "#96CEB4" },
  { rank: "E", title: "異次元の住人", threshold: Infinity, description: "2秒超えのズレ。別の時間軸に住んでそう", emoji: "🌀", color: "#A8A8A8" },
];

export function getRank(errorMs: number): TenSecondsRank {
  return ranks.find((r) => errorMs <= r.threshold) || ranks[ranks.length - 1];
}
