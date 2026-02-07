import { RenaiBrainType } from './questions';

export interface Result {
  type: RenaiBrainType;
  title: string;
  subtitle: string;
  description: string;
  traits: string[];
  quote: string;
  emoji: string;
  color: string;
  image: string;
}

export const results: Record<RenaiBrainType, Result> = {
  'type-a': {
    type: 'type-a',
    title: "恋愛脳MAX型",
    subtitle: "「恋してないと、生きてる意味がない」",
    description: "恋愛が人生の最優先事項。好きな人ができると頭の中が全部その人になる。常に恋をしていたいし、恋愛の話が大好き。生粋のロマンチスト。",
    traits: [
      "好きな人のSNSは毎日チェック",
      "恋愛ドラマ・少女漫画が主食",
      "「好きな人いないの？」が挨拶",
      "恋してないと無気力になる",
      "両思いの瞬間のために生きてる",
    ],
    quote: "「恋してる自分が一番好き」",
    emoji: "💘",
    color: "#EC4899",
    image: "/images/renai-brain/type-a.png",
  },
  'type-b': {
    type: 'type-b',
    title: "ときめき依存型",
    subtitle: "「ドキドキがないと、つまらない」",
    description: "安定した関係より、ドキドキやときめきを求めるタイプ。新しい出会いや恋の始まりが一番楽しい。マンネリが苦手で、刺激を求めてしまう。",
    traits: [
      "付き合うまでが一番楽しい",
      "安定すると冷めがち",
      "「運命の出会い」を信じてる",
      "恋のドキドキが生きるエネルギー",
      "すぐ「この人いいかも」と思う",
    ],
    quote: "「安定より、ときめきが欲しい」",
    emoji: "💓",
    color: "#F43F5E",
    image: "/images/renai-brain/type-b.png",
  },
  'type-c': {
    type: 'type-c',
    title: "理想追求型",
    subtitle: "「妥協するくらいなら、一人でいい」",
    description: "恋愛に対する理想が高く、「この人だ」と思える相手じゃないと動かないタイプ。好きになるハードルが高い分、好きになったときの本気度はすごい。",
    traits: [
      "理想の相手像が明確",
      "「いい人だけど、好きとは違う」",
      "妥協して付き合うのは無理",
      "少女漫画や映画の恋愛が理想",
      "好きになる頻度は低いけど、ハマると深い",
    ],
    quote: "「本当に好きな人にだけ、恋がしたい」",
    emoji: "✨",
    color: "#8B5CF6",
    image: "/images/renai-brain/type-c.png",
  },
  'type-d': {
    type: 'type-d',
    title: "友達スタート型",
    subtitle: "「まずは友達から、が安心する」",
    description: "いきなり恋愛モードに入れない。まず友達として信頼関係を築いて、そこから自然に恋に発展するのが理想。急展開は苦手だけど、その分関係が深い。",
    traits: [
      "「友達→恋人」が黄金ルート",
      "一目惚れの経験がない（少ない）",
      "じっくり相手を知りたい",
      "急に告白されると戸惑う",
      "安心感が恋に変わるタイプ",
    ],
    quote: "「信頼の先に、恋がある」",
    emoji: "🤝",
    color: "#2563EB",
    image: "/images/renai-brain/type-d.png",
  },
  'type-e': {
    type: 'type-e',
    title: "恋愛省エネ型",
    subtitle: "「恋愛？まあ、縁があればね」",
    description: "恋愛に対して積極的ではないけど、否定もしない。縁があれば付き合うし、なければないで困らない。恋愛以外にも楽しいことはたくさんある。",
    traits: [
      "「別に焦ってない」が本音",
      "趣味や仕事の方が優先",
      "出会いを探しに行かない",
      "友達に「恋愛しなよ」と言われがち",
      "でも好きな人ができたらちゃんと動く",
    ],
    quote: "「恋愛だけが人生じゃない」",
    emoji: "😌",
    color: "#059669",
    image: "/images/renai-brain/type-e.png",
  },
  'type-f': {
    type: 'type-f',
    title: "脳内シミュレーション型",
    subtitle: "「妄想の中の恋が、一番楽しい」",
    description: "現実の恋愛より、脳内での妄想やフィクションの恋愛を楽しむタイプ。推しへの愛や二次元キャラへの恋心も立派な「恋愛脳」。リアルは面倒だけど、ときめきは欲しい。",
    traits: [
      "推しが彼氏/彼女（概念）",
      "脳内で恋愛シミュレーション済み",
      "現実の恋はハードルが高い",
      "BL/乙女ゲー/恋愛アニメが栄養",
      "「二次元でいい」は本音",
    ],
    quote: "「推しがいれば、現実の恋愛は要らない」",
    emoji: "💭",
    color: "#F59E0B",
    image: "/images/renai-brain/type-f.png",
  },
};

export function getResultByScores(scores: Record<RenaiBrainType, number>): Result {
  let maxType: RenaiBrainType = 'type-a';
  let maxScore = 0;

  for (const [type, score] of Object.entries(scores)) {
    if (score > maxScore) {
      maxScore = score;
      maxType = type as RenaiBrainType;
    }
  }

  return results[maxType];
}

export function getTopTypes(scores: Record<RenaiBrainType, number>, count: number = 3): { type: RenaiBrainType; score: number }[] {
  return Object.entries(scores)
    .map(([type, score]) => ({ type: type as RenaiBrainType, score }))
    .sort((a, b) => b.score - a.score)
    .slice(0, count);
}
