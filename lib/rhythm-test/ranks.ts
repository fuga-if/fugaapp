export interface RhythmRank {
  rank: string;
  title: string;
  threshold: number; // 平均ズレ(ms)以下でこのランク
  description: string;
  emoji: string;
  color: string;
  percentile: number;
}

// thresholdは「平均ズレが何ms以下」（小さいほど良い）
const ranks: RhythmRank[] = [
  { rank: "S", title: "人間メトロノーム", threshold: 20, description: "機械並みの正確さ！音楽の才能あり", emoji: "🎵", color: "#FFD700", percentile: 3 },
  { rank: "A", title: "リズムマスター", threshold: 40, description: "素晴らしいリズム感！バンド組もう", emoji: "🥁", color: "#FF6B35", percentile: 10 },
  { rank: "B", title: "ビートキーパー", threshold: 70, description: "平均以上のリズム感。ノリがいい！", emoji: "🎶", color: "#4ECDC4", percentile: 25 },
  { rank: "C", title: "カラオケ好き", threshold: 100, description: "平均的なリズム感。楽しければOK！", emoji: "🎤", color: "#45B7D1", percentile: 50 },
  { rank: "D", title: "マイペース", threshold: 150, description: "ちょっとズレがち。でも味がある？", emoji: "🐢", color: "#96CEB4", percentile: 75 },
  { rank: "E", title: "フリースタイル", threshold: Infinity, description: "リズム？自分だけのビートを刻んでる", emoji: "🌀", color: "#A8A8A8", percentile: 95 },
];

export function getRank(avgDeviation: number): RhythmRank {
  return ranks.find((r) => avgDeviation <= r.threshold) || ranks[ranks.length - 1];
}
