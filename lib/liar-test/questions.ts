export interface LiarQuestion {
  id: number;
  text: string;
  // 「はい」が社会的に望ましい回答の場合 true、「いいえ」が望ましい場合 false
  // null = 中立（社会的望ましさの判定対象外）
  desirableAnswer: boolean | null;
  // 社会的望ましさが高い質問か
  highDesirability: boolean;
}

export const questions: LiarQuestion[] = [
  {
    id: 1,
    text: "約束は必ず守る方だ",
    desirableAnswer: true,
    highDesirability: false,
  },
  {
    id: 2,
    text: "人の悪口を言ったことがない",
    desirableAnswer: true,
    highDesirability: true,
  },
  {
    id: 3,
    text: "SNSで盛った写真を投稿したことがある",
    desirableAnswer: false, // 「いいえ」が望ましい
    highDesirability: false,
  },
  {
    id: 4,
    text: "友達の服がダサくても褒める",
    desirableAnswer: true,
    highDesirability: false,
  },
  {
    id: 5,
    text: "落ちてる100円は届ける",
    desirableAnswer: true,
    highDesirability: true,
  },
  {
    id: 6,
    text: "嫌いな人にも笑顔で接する",
    desirableAnswer: true,
    highDesirability: false,
  },
  {
    id: 7,
    text: "過去の恋人の数を正直に答えられる",
    desirableAnswer: true,
    highDesirability: false,
  },
  {
    id: 8,
    text: "仕事/学校をサボりたいと思ったことがない",
    desirableAnswer: true,
    highDesirability: true,
  },
  {
    id: 9,
    text: "好きな人の前で自分を良く見せたことがある",
    desirableAnswer: false, // 「いいえ」が望ましい（自分を飾らない）
    highDesirability: false,
  },
  {
    id: 10,
    text: "この診断に正直に答えた",
    desirableAnswer: true,
    highDesirability: false,
  },
];

export interface AnswerData {
  answer: boolean; // true = はい, false = いいえ
  timeMs: number; // 回答にかかった時間（ミリ秒）
}

/**
 * 回答データを分析してスコアリングする
 */
export function analyzeAnswers(answers: AnswerData[]): {
  desirableCount: number; // 社会的望ましい回答の数
  avgTimeMs: number; // 全体の平均回答時間
  stdDevMs: number; // 回答時間の標準偏差
  desirableAvgTimeMs: number; // 社会的望ましい回答時の平均時間
  honestAvgTimeMs: number; // 正直な回答時の平均時間
  slowOnDesirable: boolean; // 望ましい回答のとき遅いか
  allUnder2s: boolean; // 全問2秒以内か
  allYes: boolean; // 全問「はい」か
  allNo: boolean; // 全問「いいえ」か
  q10Honest: boolean; // Q10で「いいえ」（正直に答えてない）を選んだか
  timesMs: number[]; // 各問の回答時間
  isDesirable: boolean[]; // 各問で社会的望ましい回答をしたか
} {
  const timesMs = answers.map((a) => a.timeMs);
  const avgTimeMs = timesMs.reduce((a, b) => a + b, 0) / timesMs.length;
  const variance =
    timesMs.reduce((sum, t) => sum + Math.pow(t - avgTimeMs, 2), 0) /
    timesMs.length;
  const stdDevMs = Math.sqrt(variance);

  const isDesirable = answers.map((a, i) => {
    const q = questions[i];
    if (q.desirableAnswer === null) return false;
    return a.answer === q.desirableAnswer;
  });

  const desirableCount = isDesirable.filter(Boolean).length;

  // 社会的望ましい回答のときの平均時間
  const desirableTimes = answers
    .filter((_, i) => isDesirable[i])
    .map((a) => a.timeMs);
  const desirableAvgTimeMs =
    desirableTimes.length > 0
      ? desirableTimes.reduce((a, b) => a + b, 0) / desirableTimes.length
      : 0;

  // 正直な回答のときの平均時間
  const honestTimes = answers
    .filter((_, i) => !isDesirable[i])
    .map((a) => a.timeMs);
  const honestAvgTimeMs =
    honestTimes.length > 0
      ? honestTimes.reduce((a, b) => a + b, 0) / honestTimes.length
      : 0;

  const slowOnDesirable =
    desirableAvgTimeMs > 0 &&
    honestAvgTimeMs > 0 &&
    desirableAvgTimeMs > honestAvgTimeMs * 1.3;

  const allUnder2s = timesMs.every((t) => t <= 2000);
  const allYes = answers.every((a) => a.answer === true);
  const allNo = answers.every((a) => a.answer === false);
  const q10Honest = answers.length >= 10 && answers[9].answer === false;

  return {
    desirableCount,
    avgTimeMs,
    stdDevMs,
    desirableAvgTimeMs,
    honestAvgTimeMs,
    slowOnDesirable,
    allUnder2s,
    allYes,
    allNo,
    q10Honest,
    timesMs,
    isDesirable,
  };
}

/**
 * URLパラメータ用にエンコード
 */
export function encodeAnswers(answers: AnswerData[]): string {
  // a=1001101010&t=1200,800,1500,...
  const answerBits = answers.map((a) => (a.answer ? "1" : "0")).join("");
  const times = answers.map((a) => a.timeMs).join(",");
  return `a=${answerBits}&t=${times}`;
}

/**
 * URLパラメータからデコード
 */
export function decodeAnswers(
  answerStr: string | null,
  timesStr: string | null
): AnswerData[] | null {
  if (!answerStr || !timesStr) return null;
  const answers = answerStr.split("").map((c) => c === "1");
  const times = timesStr.split(",").map(Number);
  if (answers.length !== 10 || times.length !== 10) return null;
  if (times.some(isNaN)) return null;
  return answers.map((answer, i) => ({
    answer,
    timeMs: times[i],
  }));
}
