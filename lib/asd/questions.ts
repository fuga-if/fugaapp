export type AsdType = 'type-a' | 'type-b' | 'type-c' | 'type-d' | 'type-e';

export interface Question {
  id: number;
  text: string;
  options: {
    label: string;
    score: number;
  }[];
}

export const questions: Question[] = [
  {
    id: 1,
    text: "暗黙のルールや「空気」を読むのは…",
    options: [
      { label: "正直よくわからない", score: 3 },
      { label: "意識して頑張ればできる", score: 2 },
      { label: "少し苦手", score: 1 },
      { label: "自然にできる", score: 0 },
    ],
  },
  {
    id: 2,
    text: "特定の分野への興味は…",
    options: [
      { label: "一つのことを深く深く追求する", score: 3 },
      { label: "かなり深掘りするほう", score: 2 },
      { label: "そこそこ詳しくなる", score: 1 },
      { label: "広く浅くが好き", score: 0 },
    ],
  },
  {
    id: 3,
    text: "急な予定変更があると…",
    options: [
      { label: "パニックになる、とても困る", score: 3 },
      { label: "かなりストレスを感じる", score: 2 },
      { label: "少し戸惑う", score: 1 },
      { label: "特に問題ない", score: 0 },
    ],
  },
  {
    id: 4,
    text: "雑談（天気の話など意味のない会話）は…",
    options: [
      { label: "正直苦痛、意味がわからない", score: 3 },
      { label: "結構苦手", score: 2 },
      { label: "少し苦手", score: 1 },
      { label: "普通にできる", score: 0 },
    ],
  },
  {
    id: 5,
    text: "毎日同じルーティンで過ごすのは…",
    options: [
      { label: "とても安心する、そうしたい", score: 3 },
      { label: "好き、落ち着く", score: 2 },
      { label: "まあ楽", score: 1 },
      { label: "変化があるほうが好き", score: 0 },
    ],
  },
  {
    id: 6,
    text: "相手の表情や声のトーンから気持ちを読むのは…",
    options: [
      { label: "正直よくわからない", score: 3 },
      { label: "意識しないと難しい", score: 2 },
      { label: "少し苦手", score: 1 },
      { label: "自然にできる", score: 0 },
    ],
  },
  {
    id: 7,
    text: "光、音、触感などの感覚で苦手なものは…",
    options: [
      { label: "たくさんある、日常生活に影響する", score: 3 },
      { label: "いくつかある", score: 2 },
      { label: "少しある", score: 1 },
      { label: "特にない", score: 0 },
    ],
  },
  {
    id: 8,
    text: "言葉を文字通りに受け取ってしまうことは…",
    options: [
      { label: "よくある（冗談が通じないと言われる）", score: 3 },
      { label: "時々ある", score: 2 },
      { label: "たまにある", score: 1 },
      { label: "ほとんどない", score: 0 },
    ],
  },
  {
    id: 9,
    text: "人と目を合わせて話すのは…",
    options: [
      { label: "とても苦手、緊張する", score: 3 },
      { label: "結構苦手", score: 2 },
      { label: "少し苦手", score: 1 },
      { label: "自然にできる", score: 0 },
    ],
  },
  {
    id: 10,
    text: "自分の興味のあることを話すと…",
    options: [
      { label: "止まらなくなる、相手の反応を忘れる", score: 3 },
      { label: "かなり熱くなる", score: 2 },
      { label: "少し熱くなる", score: 1 },
      { label: "相手に合わせて話せる", score: 0 },
    ],
  },
];
