export type StressTaishoType = 'type-a' | 'type-b' | 'type-c' | 'type-d' | 'type-e' | 'type-f';

export interface Question {
  id: number;
  text: string;
  options: {
    label: string;
    scores: Partial<Record<StressTaishoType, number>>;
  }[];
}

export const questions: Question[] = [
  {
    id: 1,
    text: "仕事（or 学校）で嫌なことがあった日の帰り道。まず何する？",
    options: [
      { label: "イヤホンで爆音の音楽を聴きながら早歩き", scores: { 'type-a': 3 } },
      { label: "帰ったらあのゲームの続きやろう…と考える", scores: { 'type-b': 3 } },
      { label: "友達にLINEで「聞いて〜」と送る", scores: { 'type-c': 3 } },
      { label: "コンビニでスイーツを買って帰る", scores: { 'type-f': 3 } },
    ],
  },
  {
    id: 2,
    text: "週末、ストレスが溜まってる。理想の過ごし方は？",
    options: [
      { label: "ジムに行くか走りに行く", scores: { 'type-a': 3 } },
      { label: "一日中好きなことに没頭する", scores: { 'type-b': 3 } },
      { label: "友達と会っておしゃべりする", scores: { 'type-c': 3 } },
      { label: "何も予定を入れずにゴロゴロする", scores: { 'type-e': 3 } },
    ],
  },
  {
    id: 3,
    text: "悩みがあるとき、まず何をする？",
    options: [
      { label: "体を動かして気分を変える", scores: { 'type-a': 2, 'type-e': 1 } },
      { label: "趣味に逃げて一旦忘れる", scores: { 'type-b': 3 } },
      { label: "誰かに相談する", scores: { 'type-c': 2, 'type-d': 1 } },
      { label: "原因と解決策を考える", scores: { 'type-d': 3 } },
    ],
  },
  {
    id: 4,
    text: "「メンタルケア」と聞いて思い浮かぶのは？",
    options: [
      { label: "運動・スポーツ", scores: { 'type-a': 3 } },
      { label: "推し活・趣味", scores: { 'type-b': 3 } },
      { label: "美味しいものを食べる", scores: { 'type-f': 2, 'type-e': 1 } },
      { label: "十分な睡眠", scores: { 'type-e': 3 } },
    ],
  },
  {
    id: 5,
    text: "友達がストレスで悩んでたら、何をすすめる？",
    options: [
      { label: "「一緒に走ろう！」「カラオケ行こう！」", scores: { 'type-a': 3 } },
      { label: "「何か楽しいことしよ！」「推し活しよ！」", scores: { 'type-b': 2, 'type-f': 1 } },
      { label: "「話聞くよ？」「いつでも連絡して」", scores: { 'type-c': 3 } },
      { label: "「ゆっくり休みな」「無理しないで」", scores: { 'type-e': 2, 'type-d': 1 } },
    ],
  },
  {
    id: 6,
    text: "ストレス解消に使うお金、一番多いのは？",
    options: [
      { label: "ジム・運動用品", scores: { 'type-a': 3 } },
      { label: "ゲーム・推しグッズ・趣味", scores: { 'type-b': 3 } },
      { label: "友達との食事・飲み代", scores: { 'type-c': 2, 'type-f': 1 } },
      { label: "スイーツ・ショッピング・エステ", scores: { 'type-f': 3 } },
    ],
  },
  {
    id: 7,
    text: "嫌なことがあった夜、寝る前にやりがちなのは？",
    options: [
      { label: "筋トレかストレッチ", scores: { 'type-a': 2, 'type-e': 1 } },
      { label: "SNSか動画を見漁る", scores: { 'type-b': 2, 'type-f': 1 } },
      { label: "友達にLINE（or 通話）", scores: { 'type-c': 3 } },
      { label: "「なんで嫌だったんだろう」と振り返る", scores: { 'type-d': 3 } },
    ],
  },
  {
    id: 8,
    text: "ストレスが限界に近いサインは？",
    options: [
      { label: "体がソワソワして落ち着かない", scores: { 'type-a': 3 } },
      { label: "何をやっても楽しくない", scores: { 'type-b': 3 } },
      { label: "誰とも話したくなくなる", scores: { 'type-c': 3 } },
      { label: "眠れない・食欲がない", scores: { 'type-e': 2, 'type-d': 1 } },
    ],
  },
  {
    id: 9,
    text: "旅行でストレス解消するなら？",
    options: [
      { label: "アクティビティ系（ラフティング、ハイキング等）", scores: { 'type-a': 3 } },
      { label: "テーマパークや観光名所を巡る", scores: { 'type-b': 2, 'type-f': 1 } },
      { label: "友達とワイワイ温泉旅行", scores: { 'type-c': 3 } },
      { label: "一人で静かな場所でのんびり", scores: { 'type-e': 3 } },
    ],
  },
  {
    id: 10,
    text: "あなたにとって「ストレス解消」とは？",
    options: [
      { label: "エネルギーを使い切ること", scores: { 'type-a': 3 } },
      { label: "楽しいことで上書きすること", scores: { 'type-b': 2, 'type-f': 1 } },
      { label: "誰かと気持ちを共有すること", scores: { 'type-c': 3 } },
      { label: "問題の根本を解決すること", scores: { 'type-d': 2, 'type-e': 1 } },
    ],
  },
];
