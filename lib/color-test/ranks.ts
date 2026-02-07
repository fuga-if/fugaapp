export interface ColorRank {
  rank: string;
  title: string;
  threshold: number; // このレベル以上でこのランク
  description: string;
  emoji: string;
  color: string;
  percentile: number; // 上位何%か（推定）
}

const ranks: ColorRank[] = [
  { rank: "S", title: "鷹の目", threshold: 25, description: "人間の限界を超えた色覚！デザイナーも脱帽", emoji: "🦅", color: "#FFD700", percentile: 1 },
  { rank: "A", title: "色彩マスター", threshold: 20, description: "素晴らしい色覚！微妙な色の違いも見逃さない", emoji: "🎨", color: "#FF6B35", percentile: 5 },
  { rank: "B", title: "目利き", threshold: 15, description: "平均以上の色覚。日常生活で困ることはない", emoji: "👁️", color: "#4ECDC4", percentile: 20 },
  { rank: "C", title: "カラフル一般人", threshold: 10, description: "平均的な色覚。十分見えてる！", emoji: "🌈", color: "#45B7D1", percentile: 50 },
  { rank: "D", title: "ざっくり派", threshold: 5, description: "大まかには分かるけど細かいのは苦手", emoji: "😎", color: "#96CEB4", percentile: 75 },
  { rank: "E", title: "色より形派", threshold: 0, description: "色の違いより形で判断するタイプ？", emoji: "🙈", color: "#A8A8A8", percentile: 95 },
];

export function getRank(level: number): ColorRank {
  return ranks.find((r) => level >= r.threshold) || ranks[ranks.length - 1];
}

/** パーセンタイルの分布データ（グラフ表示用） */
export const percentileDistribution = [
  { level: 0, label: "Lv.0-4", percent: 20 },
  { level: 5, label: "Lv.5-9", percent: 25 },
  { level: 10, label: "Lv.10-14", percent: 30 },
  { level: 15, label: "Lv.15-19", percent: 15 },
  { level: 20, label: "Lv.20-24", percent: 7 },
  { level: 25, label: "Lv.25+", percent: 3 },
];

/** レベルからグリッドサイズを返す */
export function getGridSize(level: number): number {
  if (level <= 1) return 2;
  if (level <= 5) return 3;
  if (level <= 10) return 4;
  if (level <= 15) return 5;
  if (level <= 20) return 6;
  return 7;
}

/** レベルから色差（HSL Lightness差）を返す */
export function getColorDelta(level: number): number {
  if (level <= 1) return 40;
  if (level <= 2) return 30;
  if (level <= 3) return 25;
  if (level <= 5) return 20;
  if (level <= 6) return 15;
  if (level <= 8) return 12;
  if (level <= 10) return 10;
  if (level <= 12) return 8;
  if (level <= 15) return 5;
  if (level <= 17) return 4;
  if (level <= 20) return 3;
  if (level <= 23) return 2;
  return 1;
}

/** ランダムなベースカラーを生成 (HSL) */
export function generateBaseColor(): { h: number; s: number; l: number } {
  return {
    h: Math.floor(Math.random() * 360),
    s: 50 + Math.floor(Math.random() * 30), // 50-80%
    l: 50 + Math.floor(Math.random() * 20), // 50-70%
  };
}

/** HSLをCSS文字列に変換 */
export function hslToString(h: number, s: number, l: number): string {
  return `hsl(${h}, ${s}%, ${l}%)`;
}
