export interface MoguraRank {
  rank: string;
  title: string;
  threshold: number; // スコア以上でこのランク
  description: string;
  emoji: string;
  color: string;
}

const ranks: MoguraRank[] = [
  { rank: "S", title: "モグラハンター", threshold: 40, description: "神業！モグラ界に伝説として語り継がれる", emoji: "👑", color: "#FFD700" },
  { rank: "A", title: "達人", threshold: 30, description: "素晴らしい！プロ級の腕前", emoji: "🔥", color: "#FF6B35" },
  { rank: "B", title: "ハンマー使い", threshold: 20, description: "なかなかの腕前！モグラも油断できない", emoji: "🔨", color: "#4ECDC4" },
  { rank: "C", title: "見習い", threshold: 12, description: "まだまだこれから！練習あるのみ", emoji: "🌱", color: "#45B7D1" },
  { rank: "D", title: "ドジっ子", threshold: 5, description: "モグラに遊ばれてる…？", emoji: "💦", color: "#96CEB4" },
  { rank: "E", title: "モグラの友達", threshold: 0, description: "叩くのが可哀想になった説", emoji: "🤝", color: "#A8A8A8" },
];

export function getRank(score: number): MoguraRank {
  // 高いスコアから順にチェック
  for (const r of ranks) {
    if (score >= r.threshold) {
      return r;
    }
  }
  return ranks[ranks.length - 1];
}
