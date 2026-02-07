export type DarkTriadAxis = "M" | "N" | "P";

export interface DarkTriadQuestion {
  id: number;
  axis: DarkTriadAxis;
  text: string;
}

export const questions: DarkTriadQuestion[] = [
  // マキャベリズム（M）— 目的のために手段を選ばない
  { id: 1, axis: "M", text: "目的のためなら多少のルール違反は仕方ない" },
  { id: 2, axis: "M", text: "人の弱みを知っておくと何かと便利" },
  { id: 3, axis: "M", text: "本音と建前は使い分けるのが大人" },
  { id: 4, axis: "M", text: "勝てない勝負はしない主義だ" },
  // ナルシシズム（N）— 自己への過大な関心
  { id: 5, axis: "N", text: "自分は平均以上の人間だと思う" },
  { id: 6, axis: "N", text: "注目されるのが好き" },
  { id: 7, axis: "N", text: "自分の話をするのが好き" },
  { id: 8, axis: "N", text: "特別扱いされて当然だと感じる時がある" },
  // サイコパシー（P）— 共感性の低さ
  { id: 9, axis: "P", text: "他人の失敗を見ても特に何も感じない" },
  { id: 10, axis: "P", text: "感動する映画でも泣かない" },
  { id: 11, axis: "P", text: "退屈だと危険なことをしたくなる" },
  { id: 12, axis: "P", text: "謝るのは負けた気がする" },
];

export const answerLabels = [
  "全く当てはまらない",
  "あまり当てはまらない",
  "どちらともいえない",
  "やや当てはまる",
  "とても当てはまる",
];

export interface DarkTriadScores {
  M: number; // 4-20 raw, 0-100 normalized
  N: number;
  P: number;
}

/** Raw scores (4-20) を 0-100 に正規化 */
export function normalizeScore(raw: number): number {
  return Math.round(((raw - 4) / 16) * 100);
}
