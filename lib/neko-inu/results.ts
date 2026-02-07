import { NekoInuType } from './questions';

export interface Result {
  type: NekoInuType;
  title: string;
  subtitle: string;
  description: string;
  traits: string[];
  quote: string;
  emoji: string;
  color: string;
  image: string;
}

export const results: Record<NekoInuType, Result> = {
  'type-a': {
    type: 'type-a',
    title: "完全猫タイプ",
    subtitle: "甘えたい時だけ甘える",
    description: "あなたはマイペースの極み！自分の時間と空間を大切にし、誰にも邪魔されたくないタイプ。でも本当に信頼した人には、ふとした瞬間に甘えることも。そのギャップがたまらなく魅力的。",
    traits: [
      "1人の時間が何より大切",
      "気まぐれに見えて実は繊細",
      "興味ないことには徹底的に無関心",
      "距離感を詰められると逃げたくなる",
      "甘えモードのON/OFFが激しい",
    ],
    quote: "「甘えたい時だけ甘える」",
    emoji: "🐱",
    color: "#FF69B4",
    image: "/images/neko-inu/type-a.png",
  },
  'type-b': {
    type: 'type-b',
    title: "猫寄りの猫犬",
    subtitle: "1人が好き。でも孤独は嫌",
    description: "基本は自由人だけど、信頼した人には驚くほど忠実。ツンデレ？いいえ、これは「選択的な愛情表現」です。あなたの信頼を勝ち取った人は本当に特別な存在。",
    traits: [
      "普段はクール、心を許すと甘え上手",
      "少数精鋭の人間関係を好む",
      "興味があることには即レス、ないと既読スルー",
      "気分屋に見えるけど芯がある",
      "人見知りだけど仲良くなると変わる",
    ],
    quote: "「1人が好き。でも孤独は嫌」",
    emoji: "🐱🐕",
    color: "#DDA0DD",
    image: "/images/neko-inu/type-b.png",
  },
  'type-c': {
    type: 'type-c',
    title: "バランス型",
    subtitle: "場に合わせて生きるタイプ",
    description: "猫の自由さと犬の社交性を兼ね備えた器用なあなた！状況に応じて最適な距離感を取れる天才。みんなに合わせすぎて疲れることもあるけど、その適応力は最強の武器。",
    traits: [
      "場の空気を読むのが得意",
      "1人の時間も友達との時間も楽しめる",
      "相手によって態度を自然に変えられる",
      "争いごとを避ける平和主義者",
      "実は一番疲れやすいタイプかも",
    ],
    quote: "「場に合わせて生きるタイプ」",
    emoji: "🐱🐶",
    color: "#87CEEB",
    image: "/images/neko-inu/type-c.png",
  },
  'type-d': {
    type: 'type-d',
    title: "犬寄りの猫犬",
    subtitle: "みんな好き。でもたまに1人にして",
    description: "社交的で人が好きだけど、たまに電池切れを起こすタイプ。基本は尻尾を振って駆け寄るけど、ふとした瞬間に窓辺で外を眺めたくなる。その人間らしさが魅力。",
    traits: [
      "社交的だけど定期的に充電が必要",
      "素直に感情を表現できる",
      "人といると楽しいけど疲れることも",
      "1人の時間で回復してまた元気に",
      "頼られると断れないタイプ",
    ],
    quote: "「みんな好き。でもたまに1人にして」",
    emoji: "🐕🐱",
    color: "#98D8C8",
    image: "/images/neko-inu/type-d.png",
  },
  'type-e': {
    type: 'type-e',
    title: "完全犬タイプ",
    subtitle: "好きな人には全力で尻尾振る",
    description: "忠誠心MAX！好きな人にはとにかく全力で愛情表現するあなた。素直で社交的で、みんなに愛されるタイプ。その裏表のなさ、ちょっと眩しいくらい。",
    traits: [
      "好きな人への愛情表現がストレート",
      "友達が多くて社交的",
      "褒められるとテンション爆上がり",
      "寂しがり屋で1人が苦手",
      "忠誠心が強く裏切りは許せない",
    ],
    quote: "「好きな人には全力で尻尾振る」",
    emoji: "🐶",
    color: "#FFB347",
    image: "/images/neko-inu/type-e.png",
  },
  'type-f': {
    type: 'type-f',
    title: "野良猫タイプ",
    subtitle: "束縛？知らない概念",
    description: "どこにも属さない自由人。気まぐれにふらっと現れて、気が済んだらまた旅に出るタイプ。その掴みどころのなさが逆に人を惹きつける。自由こそあなたの酸素。",
    traits: [
      "束縛されると逃げ出したくなる",
      "行動が予測不能で自由奔放",
      "気が合う人とは一瞬で仲良くなる",
      "興味が移り変わるのが早い",
      "冒険好きで未知の場所に惹かれる",
    ],
    quote: "「束縛？知らない概念」",
    emoji: "🐾",
    color: "#C0C0C0",
    image: "/images/neko-inu/type-f.png",
  },
};

export function getResultByScores(scores: Record<NekoInuType, number>): Result {
  let maxType: NekoInuType = 'type-a';
  let maxScore = 0;

  for (const [type, score] of Object.entries(scores)) {
    if (score > maxScore) {
      maxScore = score;
      maxType = type as NekoInuType;
    }
  }

  return results[maxType];
}

export function getTopTypes(scores: Record<NekoInuType, number>, count: number = 3): { type: NekoInuType; score: number }[] {
  return Object.entries(scores)
    .map(([type, score]) => ({ type: type as NekoInuType, score }))
    .sort((a, b) => b.score - a.score)
    .slice(0, count);
}
