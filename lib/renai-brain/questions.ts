export type RenaiBrainType = 'type-a' | 'type-b' | 'type-c' | 'type-d' | 'type-e' | 'type-f';

export interface Question {
  id: number;
  text: string;
  options: {
    label: string;
    scores: Partial<Record<RenaiBrainType, number>>;
  }[];
}

export const questions: Question[] = [
  {
    id: 1,
    text: "好きな人ができたら、まず何する？",
    options: [
      { label: "SNSを全チェック。相手のことを全部知りたい", scores: { 'type-a': 3 } },
      { label: "ドキドキしてる自分を楽しむ", scores: { 'type-b': 3 } },
      { label: "「本当に好きかな？」と自分の気持ちを慎重に確かめる", scores: { 'type-c': 2, 'type-d': 1 } },
      { label: "特に何もしない。自然に任せる", scores: { 'type-e': 2, 'type-f': 1 } },
    ],
  },
  {
    id: 2,
    text: "恋愛映画やドラマを見てるとき…",
    options: [
      { label: "感情移入しすぎて毎回泣く", scores: { 'type-a': 3 } },
      { label: "「こんな恋がしたい！」とテンション上がる", scores: { 'type-b': 2, 'type-c': 1 } },
      { label: "フィクションとして純粋に楽しむ", scores: { 'type-f': 2, 'type-e': 1 } },
      { label: "あんまり見ない / 興味ない", scores: { 'type-e': 3 } },
    ],
  },
  {
    id: 3,
    text: "友達が「恋人できた！」と報告。あなたの反応は？",
    options: [
      { label: "「え！？詳しく聞かせて！！」と大興奮", scores: { 'type-a': 3 } },
      { label: "「いいな〜私も恋したい」と刺激を受ける", scores: { 'type-b': 3 } },
      { label: "「おめでとう！」と普通に祝う", scores: { 'type-e': 2, 'type-d': 1 } },
      { label: "「推しがいるからいいや」と思う", scores: { 'type-f': 3 } },
    ],
  },
  {
    id: 4,
    text: "「恋人がいなくて寂しい」と思うことは？",
    options: [
      { label: "しょっちゅう思う", scores: { 'type-a': 3 } },
      { label: "たまに思う（イベント時期とか）", scores: { 'type-b': 2, 'type-d': 1 } },
      { label: "あんまり思わない", scores: { 'type-e': 3 } },
      { label: "推し（or 二次元）がいるから寂しくない", scores: { 'type-f': 3 } },
    ],
  },
  {
    id: 5,
    text: "恋愛で一番大事なのは？",
    options: [
      { label: "情熱と愛情の深さ", scores: { 'type-a': 3 } },
      { label: "ドキドキとときめき", scores: { 'type-b': 3 } },
      { label: "信頼と安心感", scores: { 'type-d': 3 } },
      { label: "お互いの自由を尊重すること", scores: { 'type-e': 2, 'type-c': 1 } },
    ],
  },
  {
    id: 6,
    text: "気になる人のSNS、どのくらい見る？",
    options: [
      { label: "毎日チェック。過去の投稿も遡る", scores: { 'type-a': 3 } },
      { label: "気になったときだけ見る", scores: { 'type-b': 1, 'type-d': 2 } },
      { label: "特に見ない", scores: { 'type-e': 3 } },
      { label: "リアルの人よりVtuberや推しの方が見る", scores: { 'type-f': 3 } },
    ],
  },
  {
    id: 7,
    text: "「運命の人」を信じる？",
    options: [
      { label: "信じてる。いつか出会える", scores: { 'type-a': 2, 'type-c': 2 } },
      { label: "出会いの数を増やせば見つかると思う", scores: { 'type-b': 3 } },
      { label: "運命より、一緒に過ごす時間が大事", scores: { 'type-d': 3 } },
      { label: "現実にはいないかも（二次元にはいる）", scores: { 'type-f': 2, 'type-e': 1 } },
    ],
  },
  {
    id: 8,
    text: "デートの妄想、どのくらいする？",
    options: [
      { label: "毎日のようにしてる", scores: { 'type-a': 3 } },
      { label: "好きな人がいるときはよくする", scores: { 'type-b': 2, 'type-c': 1 } },
      { label: "あんまりしない", scores: { 'type-e': 2, 'type-d': 1 } },
      { label: "妄想は得意。実行は苦手", scores: { 'type-f': 3 } },
    ],
  },
  {
    id: 9,
    text: "恋愛の優先順位は、人生の中でどのくらい？",
    options: [
      { label: "かなり高い。上位3位以内", scores: { 'type-a': 3 } },
      { label: "そこそこ。趣味や仕事と同じくらい", scores: { 'type-b': 2, 'type-d': 1 } },
      { label: "低め。他にやりたいことがある", scores: { 'type-e': 3 } },
      { label: "二次元の恋は高い。リアルは低い", scores: { 'type-f': 3 } },
    ],
  },
  {
    id: 10,
    text: "あなたの恋愛を一言で表すと？",
    options: [
      { label: "「全力で愛したい」", scores: { 'type-a': 3 } },
      { label: "「ときめきを求めて」", scores: { 'type-b': 3 } },
      { label: "「理想の人を待ってる」", scores: { 'type-c': 3 } },
      { label: "「縁があれば」", scores: { 'type-e': 2, 'type-d': 1 } },
    ],
  },
];
