import { InkyaYoukyaType } from './questions';

export interface Result {
  type: InkyaYoukyaType;
  title: string;
  subtitle: string;
  description: string;
  traits: string[];
  quote: string;
  emoji: string;
  color: string;
  image: string;
}

export const results: Record<InkyaYoukyaType, Result> = {
  'type-a': {
    type: 'type-a',
    title: "ナチュラルボーン陽キャ",
    subtitle: "太陽みたいに、いるだけで明るくなる",
    description: "あなたは生まれながらの陽キャ。人が集まる場所が好きで、初対面でもすぐ打ち解けられる。無意識に場を盛り上げてしまう天性のムードメーカー。でも実は、一人の時間もちゃんと大事にしてるタイプ。",
    traits: [
      "初対面でも5分で仲良くなれる",
      "グループの中心にいがち",
      "沈黙が苦手で話題を振ってしまう",
      "誘われたら基本YES",
      "人の名前と顔を覚えるのが得意",
    ],
    quote: "「え、人見知り？何それ美味しいの？」",
    emoji: "☀️",
    color: "#FF8C00",
    image: "/images/inkya-youkya/type-a.png",
  },
  'type-b': {
    type: 'type-b',
    title: "選択的陽キャ",
    subtitle: "好きな人の前だけ、スイッチON",
    description: "普段は省エネモードだけど、好きな人やハマってるジャンルの話になると突然スイッチが入る。興味のあることには全力、興味のないことにはとことん省エネ。そのギャップが周りをびっくりさせる。",
    traits: [
      "興味の有無でテンションが激変する",
      "少人数なら最高に楽しい",
      "好きなことの話は止まらない",
      "大人数の飲み会は正直しんどい",
      "「意外とよく喋るね」と言われる",
    ],
    quote: "「興味ないことに使うHPはないんよ」",
    emoji: "⚡",
    color: "#7C3AED",
    image: "/images/inkya-youkya/type-b.png",
  },
  'type-c': {
    type: 'type-c',
    title: "人見知りムードメーカー",
    subtitle: "慣れたら実は一番うるさい",
    description: "最初はおとなしいけど、打ち解けるとグループで一番面白い。信頼関係ができてからの爆発力がすごい。内輪ノリの天才で、仲良しグループでは欠かせない存在。",
    traits: [
      "初対面は壁を作りがち",
      "仲良くなるとボケとツッコミ両方いける",
      "グループLINEでは一番面白い",
      "新しい環境の最初の1ヶ月がつらい",
      "「最初と全然キャラ違うじゃんw」が褒め言葉",
    ],
    quote: "「打ち解けるまでがチュートリアルなんよ」",
    emoji: "🎭",
    color: "#EC4899",
    image: "/images/inkya-youkya/type-c.png",
  },
  'type-d': {
    type: 'type-d',
    title: "社交的インドア派",
    subtitle: "人は好き。でも家はもっと好き。",
    description: "コミュニケーション力はあるけど、本質的にはインドア派。人と会うのも楽しいけど、予定がない休日が一番幸せ。充電式のバッテリーみたいに、外で使った分は家で回復する。",
    traits: [
      "「今日予定ないな…最高」が口癖",
      "人と会った日の夜は即寝落ち",
      "オンライン通話は得意",
      "外出は好きだけど連続は無理",
      "「もう帰りたい」を心の中で3回唱えがち",
    ],
    quote: "「外出は好き。でも帰宅はもっと好き。」",
    emoji: "🏠",
    color: "#06B6D4",
    image: "/images/inkya-youkya/type-d.png",
  },
  'type-e': {
    type: 'type-e',
    title: "一匹狼タイプ",
    subtitle: "群れない。でも孤独じゃない。",
    description: "一人の時間を最も大切にするタイプ。協調性がないわけじゃなく、自分の世界を持っている。少数の深い関係を大事にし、表面的な付き合いは最小限。自分の軸がしっかりしていて、流されない強さがある。",
    traits: [
      "ランチは一人で行ける（むしろ好き）",
      "深い話ができる友達が2〜3人いれば十分",
      "大人数のイベントは早めに帰る",
      "自分の時間を邪魔されるとストレス",
      "「マイペースだよね」がアイデンティティ",
    ],
    quote: "「一人＝寂しいって誰が決めたの？」",
    emoji: "🐺",
    color: "#475569",
    image: "/images/inkya-youkya/type-e.png",
  },
  'type-f': {
    type: 'type-f',
    title: "観察者タイプ",
    subtitle: "見てるだけで楽しいんだよね",
    description: "場の空気を読む力が抜群で、周りをよく観察している。自分が前に出るより、人を見ているのが好き。でも実は誰よりも人間が好きで、人の変化に一番早く気づくのはあなた。",
    traits: [
      "人間観察が趣味レベル",
      "「よく気づくね」と言われる",
      "SNSは見る専が多い",
      "聞き役になりがち",
      "場の空気を一番正確に読んでる自信がある",
    ],
    quote: "「話すより、聞いてる方が情報量多いから」",
    emoji: "👁️",
    color: "#059669",
    image: "/images/inkya-youkya/type-f.png",
  },
};

export function getResultByScores(scores: Record<InkyaYoukyaType, number>): Result {
  let maxType: InkyaYoukyaType = 'type-a';
  let maxScore = 0;

  for (const [type, score] of Object.entries(scores)) {
    if (score > maxScore) {
      maxScore = score;
      maxType = type as InkyaYoukyaType;
    }
  }

  return results[maxType];
}

export function getTopTypes(scores: Record<InkyaYoukyaType, number>, count: number = 3): { type: InkyaYoukyaType; score: number }[] {
  return Object.entries(scores)
    .map(([type, score]) => ({ type: type as InkyaYoukyaType, score }))
    .sort((a, b) => b.score - a.score)
    .slice(0, count);
}
