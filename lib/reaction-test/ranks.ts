export interface ReactionRank {
  rank: string;
  title: string;
  threshold: number; // ms以下でこのランク
  description: string;
  emoji: string;
  color: string;
}

// PC基準（マウスクリック）
const pcRanks: ReactionRank[] = [
  { rank: "S", title: "電光石火", threshold: 150, description: "プロゲーマー級の反射神経！上位1%の領域", emoji: "⚡", color: "#FFD700" },
  { rank: "A", title: "韋駄天", threshold: 200, description: "素晴らしい反射神経！平均を大きく上回る", emoji: "🔥", color: "#FF6B35" },
  { rank: "B", title: "スナイパー", threshold: 250, description: "平均的〜やや速い。十分な反応速度", emoji: "🎯", color: "#4ECDC4" },
  { rank: "C", title: "のんびり屋", threshold: 350, description: "平均よりちょっと遅め。練習すれば伸びる！", emoji: "🐢", color: "#45B7D1" },
  { rank: "D", title: "スロースターター", threshold: 500, description: "かなりゆっくり。眠い？コーヒー飲もう", emoji: "💤", color: "#96CEB4" },
  { rank: "E", title: "不動明王", threshold: Infinity, description: "500ms超え。禅の境地に達しているのかも…", emoji: "🪨", color: "#A8A8A8" },
];

// スマホ基準（タッチ遅延+60ms考慮）
const mobileRanks: ReactionRank[] = [
  { rank: "S", title: "電光石火", threshold: 210, description: "スマホでこの速さはヤバい！上位1%の領域", emoji: "⚡", color: "#FFD700" },
  { rank: "A", title: "韋駄天", threshold: 260, description: "素晴らしい反射神経！スマホ勢トップクラス", emoji: "🔥", color: "#FF6B35" },
  { rank: "B", title: "スナイパー", threshold: 310, description: "平均的〜やや速い。十分な反応速度", emoji: "🎯", color: "#4ECDC4" },
  { rank: "C", title: "のんびり屋", threshold: 410, description: "平均よりちょっと遅め。練習すれば伸びる！", emoji: "🐢", color: "#45B7D1" },
  { rank: "D", title: "スロースターター", threshold: 560, description: "かなりゆっくり。眠い？コーヒー飲もう", emoji: "💤", color: "#96CEB4" },
  { rank: "E", title: "不動明王", threshold: Infinity, description: "500ms超え。禅の境地に達しているのかも…", emoji: "🪨", color: "#A8A8A8" },
];

export function isMobileDevice(): boolean {
  if (typeof navigator === "undefined") return false;
  return navigator.maxTouchPoints > 0;
}

export function getRank(scoreMs: number, mobile?: boolean): ReactionRank {
  const ranks = mobile ? mobileRanks : pcRanks;
  return (
    ranks.find((r) => scoreMs <= r.threshold) ||
    ranks[ranks.length - 1]
  );
}

export function getMedian(values: number[]): number {
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  if (sorted.length % 2 === 0) {
    return Math.round((sorted[mid - 1] + sorted[mid]) / 2);
  }
  return Math.round(sorted[mid]);
}
