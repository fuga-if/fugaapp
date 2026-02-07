import { ShikouType } from './questions';

export interface Result {
  type: ShikouType;
  title: string;
  subtitle: string;
  description: string;
  traits: string[];
  quote: string;
  emoji: string;
  color: string;
  image: string;
}

export const results: Record<ShikouType, Result> = {
  'type-a': {
    type: 'type-a',
    title: "ロジカルシンカー",
    subtitle: "「なぜ？を突き詰める知の探求者」",
    description: "物事を論理的に考えるのが得意。データや根拠を大事にして、感情に流されず冷静に判断できる。問題解決では原因分析→仮説→検証のプロセスを自然にやってる。",
    traits: [
      "「なぜ？」が口癖",
      "議論が好き（論破ではなく真理追求）",
      "曖昧な指示が苦手",
      "スプレッドシートが友達",
      "感情的な人を見ると戸惑う",
    ],
    quote: "「感覚じゃなくて、データで語ろう」",
    emoji: "🧮",
    color: "#2563EB",
    image: "/images/shikou-type/type-a.png",
  },
  'type-b': {
    type: 'type-b',
    title: "直感ひらめき型",
    subtitle: "「降ってくるんだよね、アイデアが」",
    description: "論理よりも直感やインスピレーションで動くタイプ。ひらめきの瞬間が何より楽しくて、アイデアが湧いてくるスピードが速い。ただ、詰めの作業は苦手かも。",
    traits: [
      "シャワー中にアイデアが降ってくる",
      "「なんかいける気がする」で動く",
      "計画を立てるのは苦手",
      "クリエイティブな仕事が向いてる",
      "飽き性だけど引き出しが多い",
    ],
    quote: "「理屈はあとからついてくる」",
    emoji: "💡",
    color: "#F59E0B",
    image: "/images/shikou-type/type-b.png",
  },
  'type-c': {
    type: 'type-c',
    title: "共感リーダー型",
    subtitle: "「あの人の気持ち、なんとなくわかる」",
    description: "他人の感情を敏感に察知して、気持ちに寄り添える。チームでは自然とまとめ役になることが多い。論理と感情のバランスが取れていて、人を動かす力がある。",
    traits: [
      "「大丈夫？」をよく言う",
      "空気を読むのが得意すぎて疲れる",
      "人の相談に乗ることが多い",
      "対立を避けたがる",
      "自分のことは後回しにしがち",
    ],
    quote: "「正論より、まず気持ちを聞こう」",
    emoji: "🤝",
    color: "#EC4899",
    image: "/images/shikou-type/type-c.png",
  },
  'type-d': {
    type: 'type-d',
    title: "慎重アナリスト型",
    subtitle: "「石橋を叩いて、さらに調べる」",
    description: "慎重に情報を集めて、あらゆるリスクを検討してから動くタイプ。失敗が少ない反面、決断に時間がかかることも。でもその慎重さが大きな失敗を防いでくれる。",
    traits: [
      "決める前にめっちゃ調べる",
      "比較表を作るのが趣味",
      "「もう少し考えさせて」が口癖",
      "リスク管理が得意",
      "衝動買いはほぼしない",
    ],
    quote: "「急がば回れ。情報は武器だ」",
    emoji: "🔍",
    color: "#059669",
    image: "/images/shikou-type/type-d.png",
  },
  'type-e': {
    type: 'type-e',
    title: "行動ファースト型",
    subtitle: "「考えるより先に体が動いてた」",
    description: "とにかくまず行動。走りながら考えるタイプ。失敗しても「やってみなきゃわからない」精神でリカバリーする。スピード感があって、周りを巻き込む力がある。",
    traits: [
      "「とりあえずやってみよう」が信条",
      "計画は行動しながら修正",
      "待つのが大の苦手",
      "失敗の数も多いけど経験値がすごい",
      "ベンチャー気質",
    ],
    quote: "「完璧を待ってたら一生始まらない」",
    emoji: "🚀",
    color: "#EF4444",
    image: "/images/shikou-type/type-e.png",
  },
  'type-f': {
    type: 'type-f',
    title: "マルチ思考型",
    subtitle: "「全部の視点が見えちゃうんだよね」",
    description: "論理も直感も感情も、複数の視点を同時に持てるタイプ。どんな意見にも「一理あるな」と思える柔軟性がある。ただし、視点が多すぎて迷うこともしばしば。",
    traits: [
      "「それもわかるし、これもわかる」",
      "議論では中立になりがち",
      "適応力が高い",
      "優柔不断と言われることも",
      "多角的に見すぎて結論が出ない",
    ],
    quote: "「答えは一つじゃない」",
    emoji: "🎯",
    color: "#8B5CF6",
    image: "/images/shikou-type/type-f.png",
  },
};

export function getResultByScores(scores: Record<ShikouType, number>): Result {
  let maxType: ShikouType = 'type-a';
  let maxScore = 0;

  for (const [type, score] of Object.entries(scores)) {
    if (score > maxScore) {
      maxScore = score;
      maxType = type as ShikouType;
    }
  }

  return results[maxType];
}

export function getTopTypes(scores: Record<ShikouType, number>, count: number = 3): { type: ShikouType; score: number }[] {
  return Object.entries(scores)
    .map(([type, score]) => ({ type: type as ShikouType, score }))
    .sort((a, b) => b.score - a.score)
    .slice(0, count);
}
