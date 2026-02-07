export interface AccuracyTapRank {
  rank: string;
  title: string;
  threshold: number; // レベル以上でこのランク
  description: string;
  emoji: string;
  color: string;
  percentile: number;
}

const ranks: AccuracyTapRank[] = [
  { rank: "S", title: "精密機械", threshold: 20, description: "ミリ単位の正確さ！外科医になれる", emoji: "🎯", color: "#FFD700", percentile: 3 },
  { rank: "A", title: "スナイパー", threshold: 15, description: "素晴らしい精度！狙ったところを外さない", emoji: "🔫", color: "#FF6B35", percentile: 10 },
  { rank: "B", title: "器用な指先", threshold: 11, description: "平均以上の正確さ。細かい作業も得意？", emoji: "👆", color: "#4ECDC4", percentile: 25 },
  { rank: "C", title: "まあまあ正確", threshold: 7, description: "平均的な精度。普通に使える指", emoji: "✋", color: "#45B7D1", percentile: 50 },
  { rank: "D", title: "大雑把タッチ", threshold: 4, description: "ちょっとずれがち。大きいボタンが好き", emoji: "🖐️", color: "#96CEB4", percentile: 75 },
  { rank: "E", title: "ミスタップ王", threshold: 0, description: "隣のボタン押しちゃう系…", emoji: "💥", color: "#A8A8A8", percentile: 95 },
];

export function getRank(level: number): AccuracyTapRank {
  return ranks.find((r) => level >= r.threshold) || ranks[ranks.length - 1];
}
