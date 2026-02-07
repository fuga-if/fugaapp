export type AdhdType = 'type-a' | 'type-b' | 'type-c' | 'type-d' | 'type-e';

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
    text: "やるべきことがあっても、つい先延ばしにしてしまう",
    options: [
      { label: "いつもそう", score: 3 },
      { label: "よくある", score: 2 },
      { label: "たまにある", score: 1 },
      { label: "ほとんどない", score: 0 },
    ],
  },
  {
    id: 2,
    text: "興味のないことに集中するのは…",
    options: [
      { label: "ほぼ不可能", score: 3 },
      { label: "かなり苦痛", score: 2 },
      { label: "少し大変", score: 1 },
      { label: "特に問題ない", score: 0 },
    ],
  },
  {
    id: 3,
    text: "逆に、興味のあることには…",
    options: [
      { label: "周りが見えなくなるほど没頭する", score: 3 },
      { label: "かなり集中できる", score: 2 },
      { label: "普通に集中できる", score: 1 },
      { label: "他のことと同じくらい", score: 0 },
    ],
  },
  {
    id: 4,
    text: "人の話を最後まで聞くのは…",
    options: [
      { label: "正直かなり難しい", score: 3 },
      { label: "努力が必要", score: 2 },
      { label: "たまに難しい", score: 1 },
      { label: "問題なくできる", score: 0 },
    ],
  },
  {
    id: 5,
    text: "物をなくしたり、忘れ物をしたりする頻度は…",
    options: [
      { label: "しょっちゅう", score: 3 },
      { label: "結構多い", score: 2 },
      { label: "たまにある", score: 1 },
      { label: "ほとんどない", score: 0 },
    ],
  },
  {
    id: 6,
    text: "思いついたことを、すぐ口に出してしまうことは…",
    options: [
      { label: "よくある", score: 3 },
      { label: "時々ある", score: 2 },
      { label: "たまにある", score: 1 },
      { label: "ほとんどない", score: 0 },
    ],
  },
  {
    id: 7,
    text: "じっと座っているのは…",
    options: [
      { label: "かなり苦痛", score: 3 },
      { label: "結構つらい", score: 2 },
      { label: "少し苦手", score: 1 },
      { label: "平気", score: 0 },
    ],
  },
  {
    id: 8,
    text: "複数のことを同時に進めると…",
    options: [
      { label: "パニックになる", score: 3 },
      { label: "混乱しやすい", score: 2 },
      { label: "少し大変", score: 1 },
      { label: "うまくこなせる", score: 0 },
    ],
  },
  {
    id: 9,
    text: "時間の見積もりは…",
    options: [
      { label: "いつも大幅にズレる", score: 3 },
      { label: "よくズレる", score: 2 },
      { label: "たまにズレる", score: 1 },
      { label: "だいたい正確", score: 0 },
    ],
  },
  {
    id: 10,
    text: "退屈を感じると…",
    options: [
      { label: "耐えられない、何かしたくなる", score: 3 },
      { label: "かなりつらい", score: 2 },
      { label: "少し苦手", score: 1 },
      { label: "平気で過ごせる", score: 0 },
    ],
  },
];
