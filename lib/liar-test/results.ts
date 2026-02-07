import { analyzeAnswers, AnswerData } from "./questions";

export type LiarResultType =
  | "honest"
  | "flatterer"
  | "unconscious"
  | "calculating"
  | "master"
  | "chaos";

// 隠しタイプ
export type HiddenType =
  | "instinct" // 直感の鬼
  | "yesman" // イエスマン
  | "rebel" // 反逆者
  | null;

export interface LiarResult {
  type: LiarResultType;
  title: string;
  emoji: string;
  subtitle: string;
  description: string;
  traits: string[];
  liarScore: number; // 0-100
  hidden: HiddenType;
  q10Message: string | null; // Q10特別メッセージ
}

const resultTemplates: Record<
  LiarResultType,
  Omit<LiarResult, "liarScore" | "hidden" | "q10Message">
> = {
  honest: {
    type: "honest",
    title: "正直者タイプ",
    emoji: "😇",
    subtitle: "嘘をつけない、真っ直ぐな魂",
    description:
      "あなたは嘘をつくのが苦手な正直者。回答に迷いがなく、社会的に望ましくない回答もサラッと選べるタイプ。正直すぎて損することもあるけど、周りからの信頼は厚いはず。",
    traits: [
      "思ったことをストレートに言う",
      "嘘をつくと顔に出る",
      "裏表がないと言われる",
      "お世辞が苦手",
      "信頼される存在",
    ],
  },
  flatterer: {
    type: "flatterer",
    title: "お世辞上手タイプ",
    emoji: "😊",
    subtitle: "優しい嘘で世界を円滑に回す人",
    description:
      "社会的に望ましい回答が多めだけど、回答速度からして自覚的。「優しい嘘」を使いこなすコミュニケーション上手。空気を読む力が高く、人間関係を円滑にするスキルの持ち主。",
    traits: [
      "場の空気を読むのが得意",
      "褒め上手と言われる",
      "本音と建前を使い分けられる",
      "人を傷つけたくない気持ちが強い",
      "社交的でそつがない",
    ],
  },
  unconscious: {
    type: "unconscious",
    title: "無意識嘘つきタイプ",
    emoji: "🤥",
    subtitle: "自分でも気づかない嘘をつく天然嘘つき",
    description:
      "社会的に望ましい回答を選びがちだけど、本人は嘘をついてる自覚がない。「自分はいい人」と本気で思ってるタイプ。回答速度も安定してるから、嘘というより「思い込み」に近いかも。",
    traits: [
      "自己評価がやや高め",
      "「自分は普通」と思いがち",
      "過去を美化する傾向あり",
      "悪気はまったくない",
      "指摘されると「え、そう？」",
    ],
  },
  calculating: {
    type: "calculating",
    title: "計算高いタイプ",
    emoji: "🧠",
    subtitle: "嘘つく時だけ回答が遅い…バレバレです",
    description:
      "社会的に望ましい回答を選ぶとき、明らかに回答時間が長くなるあなた。頭では「こう答えるべき」と分かってるけど、良心との葛藤で手が止まってしまう。嘘をつく才能はあるけど、速度でバレるタイプ。",
    traits: [
      "考えてから発言するタイプ",
      "嘘をつくとき目が泳ぐ",
      "正直に言うか迷うことが多い",
      "損得勘定が働く",
      "良心との戦いが日常",
    ],
  },
  master: {
    type: "master",
    title: "嘘つきマスタータイプ",
    emoji: "🎭",
    subtitle: "完璧な嘘をサラッとつく…恐ろしい才能",
    description:
      "社会的に望ましい回答を選んでいるのに、回答速度が全問ほぼ一定。迷いがない。これは「上手に嘘をつける」才能の持ち主。交渉や営業で力を発揮するタイプ。ただし、使い方には注意。",
    traits: [
      "ポーカーフェイスが得意",
      "交渉ごとに強い",
      "演技力が高い",
      "感情をコントロールできる",
      "周りに「何考えてるかわからない」と言われる",
    ],
  },
  chaos: {
    type: "chaos",
    title: "カオスタイプ",
    emoji: "🌀",
    subtitle: "回答パターンが読めない…謎の存在",
    description:
      "回答にも速度にも一貫性がなく、分析不能。適当に答えたか、あるいは本当に予測不可能な人格の持ち主。良く言えば「型にはまらない自由人」、悪く言えば「理解不能」。",
    traits: [
      "気分屋と言われる",
      "自分でも自分がわからない",
      "予想外の行動をとりがち",
      "ルールに縛られない",
      "ミステリアスと言われることも",
    ],
  },
};

/**
 * 回答データから結果タイプを判定
 */
export function getResult(answers: AnswerData[]): LiarResult {
  const analysis = analyzeAnswers(answers);

  // 隠しタイプチェック
  let hidden: HiddenType = null;
  if (analysis.allUnder2s) hidden = "instinct";
  if (analysis.allYes) hidden = "yesman";
  if (analysis.allNo) hidden = "rebel";

  // Q10メッセージ
  const q10Message = analysis.q10Honest
    ? "Q10で「正直に答えてない」と白状しましたね。\nその正直さ、嫌いじゃないです。"
    : null;

  // スコアリングロジック
  const { desirableCount, slowOnDesirable, stdDevMs, avgTimeMs } = analysis;

  // 回答時間のバラつき係数（CV）
  const cv = avgTimeMs > 0 ? stdDevMs / avgTimeMs : 0;

  let type: LiarResultType;
  let liarScore: number;

  if (desirableCount <= 3) {
    // 社会的望ましい回答が少ない → 正直者
    type = "honest";
    liarScore = Math.max(5, desirableCount * 8);
  } else if (desirableCount >= 8 && !slowOnDesirable && cv < 0.4) {
    // 望ましい回答が多く、速度一定 → マスター
    type = "master";
    liarScore = 75 + Math.min(desirableCount * 2, 20);
  } else if (desirableCount >= 6 && slowOnDesirable) {
    // 望ましい回答多め＋望ましい回答のとき遅い → 計算高い
    type = "calculating";
    liarScore = 55 + desirableCount * 3;
  } else if (desirableCount >= 7 && !slowOnDesirable) {
    // 望ましい回答多め＋速度安定 → 無意識嘘つき
    type = "unconscious";
    liarScore = 50 + desirableCount * 3;
  } else if (desirableCount >= 4 && desirableCount <= 6) {
    // 中間 → お世辞上手
    type = "flatterer";
    liarScore = 30 + desirableCount * 5;
  } else if (cv > 0.6) {
    // バラつきが大きい → カオス
    type = "chaos";
    liarScore = 40 + Math.round(Math.random() * 20);
  } else {
    // デフォルト
    type = "flatterer";
    liarScore = 35 + desirableCount * 4;
  }

  // liarScoreを0-100に収める
  liarScore = Math.min(100, Math.max(0, liarScore));

  const template = resultTemplates[type];
  return {
    ...template,
    liarScore,
    hidden,
    q10Message,
  };
}

export function getResultTypeInfo(type: LiarResultType) {
  return resultTemplates[type];
}
