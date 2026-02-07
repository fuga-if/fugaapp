import { MotivationType } from './questions';

export interface Result {
  type: MotivationType;
  title: string;
  subtitle: string;
  description: string;
  traits: string[];
  quote: string;
  emoji: string;
  color: string;
  image: string;
}

export const results: Record<MotivationType, Result> = {
  'type-a': {
    type: 'type-a',
    title: "達成ドリブン型",
    subtitle: "「ゴールした瞬間が、最高に生きてる感じ」",
    description: "目標を設定して、それを達成する過程にやる気を感じるタイプ。数字や結果が明確なほど燃える。逆に目標がないと一気にやる気がなくなる。ToDoリストのチェックが快感。",
    traits: [
      "目標設定が趣味レベル",
      "ToDoリストを消すのが快感",
      "「で、何がゴール？」をすぐ聞く",
      "期限があるほど頑張れる",
      "達成後の虚無感がすごい",
    ],
    quote: "「次の目標は？」",
    emoji: "🏆",
    color: "#EF4444",
    image: "/images/motivation/type-a.png",
  },
  'type-b': {
    type: 'type-b',
    title: "好奇心エンジン型",
    subtitle: "「知らないことがあるだけでワクワクする」",
    description: "新しいことを学んだり、未知の世界に飛び込んだりするのがモチベーション。「なぜ？」「どうして？」が原動力で、知的好奇心が尽きることがない。飽きっぽいんじゃなくて、興味の幅が広いだけ。",
    traits: [
      "Wikipedia沼に入ったら3時間経ってる",
      "「それ面白い！もっと教えて」が口癖",
      "新しいガジェットや技術に飛びつく",
      "ルーティンワークが苦痛",
      "趣味が3ヶ月ごとに変わる",
    ],
    quote: "「知らないことを知る瞬間が一番楽しい」",
    emoji: "🔬",
    color: "#8B5CF6",
    image: "/images/motivation/type-b.png",
  },
  'type-c': {
    type: 'type-c',
    title: "承認パワー型",
    subtitle: "「誰かに認められると、120%出せる」",
    description: "人から感謝されたり、認められたりすることで力が湧くタイプ。「ありがとう」「すごいね」が最高のガソリン。チームで動くと本領発揮で、一人だとモチベーションが下がりがち。",
    traits: [
      "「ありがとう」で泣きそうになる",
      "褒められると翌日のパフォーマンスが違う",
      "誰にも見てもらえない作業がしんどい",
      "サプライズで人を喜ばせるのが好き",
      "評価されないと不安になる",
    ],
    quote: "「誰かの役に立ててるなら、頑張れる」",
    emoji: "⭐",
    color: "#F59E0B",
    image: "/images/motivation/type-c.png",
  },
  'type-d': {
    type: 'type-d',
    title: "安定基盤型",
    subtitle: "「安心できる環境が、一番いい仕事を生む」",
    description: "安定した環境と明確なルーティンの中で力を発揮するタイプ。急な変化やリスクは避けたい。コツコツ積み上げるのが得意で、長期的な視点を持てる。",
    traits: [
      "ルーティンがあると安心する",
      "急な予定変更にストレスを感じる",
      "「着実に」が信条",
      "貯金が増えるとモチベーション上がる",
      "冒険より安全策を選ぶ",
    ],
    quote: "「積み重ねが、一番強い」",
    emoji: "🏠",
    color: "#059669",
    image: "/images/motivation/type-d.png",
  },
  'type-e': {
    type: 'type-e',
    title: "自由追求型",
    subtitle: "「誰にも縛られたくない」",
    description: "自分のペースで、自分の好きなやり方で物事を進めたいタイプ。管理されると一気にやる気がなくなる。裁量権があると最高のパフォーマンスを出す。フリーランス気質。",
    traits: [
      "マイクロマネジメントが最大の敵",
      "自分で決めたルールは守れる",
      "「好きにやっていい」が最高の褒め言葉",
      "時間に縛られるのが苦手",
      "リモートワーク大賛成",
    ],
    quote: "「自由にやらせてくれたら、結果出すから」",
    emoji: "🦅",
    color: "#06B6D4",
    image: "/images/motivation/type-e.png",
  },
  'type-f': {
    type: 'type-f',
    title: "使命感ドリブン型",
    subtitle: "「意味のあることじゃないと、やる気が出ない」",
    description: "「何のためにやるのか」が明確じゃないと動けないタイプ。社会貢献や大きなビジョンに共感すると、ものすごい力を発揮する。お金や地位より「意義」で動く。",
    traits: [
      "「それ、何のためにやるの？」が口癖",
      "意味のない作業は苦痛",
      "社会問題やSDGsに関心がある",
      "ボランティアや社会貢献に興味",
      "理念のある会社で働きたい",
    ],
    quote: "「意味のあることをしたい」",
    emoji: "🌍",
    color: "#2563EB",
    image: "/images/motivation/type-f.png",
  },
};

export function getResultByScores(scores: Record<MotivationType, number>): Result {
  let maxType: MotivationType = 'type-a';
  let maxScore = 0;

  for (const [type, score] of Object.entries(scores)) {
    if (score > maxScore) {
      maxScore = score;
      maxType = type as MotivationType;
    }
  }

  return results[maxType];
}

export function getTopTypes(scores: Record<MotivationType, number>, count: number = 3): { type: MotivationType; score: number }[] {
  return Object.entries(scores)
    .map(([type, score]) => ({ type: type as MotivationType, score }))
    .sort((a, b) => b.score - a.score)
    .slice(0, count);
}
