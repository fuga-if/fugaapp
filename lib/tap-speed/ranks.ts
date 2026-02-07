export interface TapRank {
  rank: string;
  title: string;
  threshold: number; // タップ回数以上でこのランク
  description: string;
  emoji: string;
  color: string;
}

const ranks: TapRank[] = [
  { rank: "S", title: "連打の神", threshold: 100, description: "人間の限界に挑む超高速連打！", emoji: "🏆", color: "#FFD700" },
  { rank: "A", title: "高速タッパー", threshold: 80, description: "素晴らしい連打速度！上位層の実力", emoji: "⚡", color: "#FF6B35" },
  { rank: "B", title: "なかなかの腕前", threshold: 60, description: "平均以上！ゲームもうまそう", emoji: "🔥", color: "#4ECDC4" },
  { rank: "C", title: "まあまあ", threshold: 45, description: "一般的なタップ速度。十分！", emoji: "👆", color: "#45B7D1" },
  { rank: "D", title: "のんびりタッパー", threshold: 30, description: "ゆったりペース。力を抜きすぎ？", emoji: "🐌", color: "#96CEB4" },
  { rank: "E", title: "省エネモード", threshold: 0, description: "本当にタップしてた？", emoji: "😴", color: "#A8A8A8" },
];

export function getRank(taps: number): TapRank {
  return ranks.find((r) => taps >= r.threshold) || ranks[ranks.length - 1];
}
