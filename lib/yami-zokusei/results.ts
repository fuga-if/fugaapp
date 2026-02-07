import { YamiType } from './questions';

export interface Result {
  type: YamiType;
  title: string;
  subtitle: string;
  description: string;
  traits: string[];
  quote: string;
  emoji: string;
  color: string;
  image: string;
}

export const results: Record<YamiType, Result> = {
  'shikkoku-yami': {
    type: 'shikkoku-yami',
    title: "漆黒の闇",
    subtitle: "この力…制御できない…",
    description: "あなたの魂には深い闇が宿っている。孤独を愛し、夜の静寂の中でこそ本来の力を発揮する。その神秘的なオーラは、周囲の人間を惹きつけてやまない。",
    traits: [
      "深夜に一番テンションが上がる",
      "黒い服が多い（否定できない）",
      "孤独を楽しめるタイプ",
      "厨二病は卒業してない（むしろ極めた）",
      "闇堕ちキャラに感情移入しがち",
    ],
    quote: "「この力…制御できない…」",
    emoji: "🖤",
    color: "#9C27B0",
    image: "/images/yami-zokusei/type-a.png",
  },
  'souen-gouka': {
    type: 'souen-gouka',
    title: "蒼炎の業火",
    subtitle: "全てを焼き尽くす覚悟はあるか",
    description: "あなたの魂は燃え盛る炎そのもの。情熱と覚悟で全てを切り開くタイプ。感情がダイレクトに力になる、最も攻撃的で最も真っ直ぐな属性。",
    traits: [
      "感情が顔に出やすい（隠せない）",
      "熱い展開で泣きがち",
      "やると決めたら全力",
      "負けず嫌い（絶対に）",
      "友達のために本気で怒れる",
    ],
    quote: "「全てを焼き尽くす覚悟はあるか」",
    emoji: "🔥",
    color: "#2962FF",
    image: "/images/yami-zokusei/type-b.png",
  },
  'itetsuku-hyouga': {
    type: 'itetsuku-hyouga',
    title: "凍てつく氷牙",
    subtitle: "感情を凍らせた方が楽だと知った",
    description: "あなたの魂は氷のように澄み切っている。冷静沈着、感情に流されない知性の持ち主。その冷たさの奥には、誰にも見せない熱い想いが眠っている。",
    traits: [
      "冷静な判断力に自信がある",
      "感情をコントロールできる（つもり）",
      "クール系キャラが好き",
      "本音をなかなか見せない",
      "でも大切な人には意外と優しい",
    ],
    quote: "「感情を凍らせた方が楽だと知った」",
    emoji: "❄️",
    color: "#00B8D4",
    image: "/images/yami-zokusei/type-c.png",
  },
  'shiden-raikou': {
    type: 'shiden-raikou',
    title: "紫電の雷光",
    subtitle: "速さこそ正義",
    description: "あなたの魂は雷のようにスピーディー。思い立ったら即行動、迷っている暇はない。その圧倒的なスピード感と決断力は、周囲を置き去りにすることも。",
    traits: [
      "即断即決タイプ",
      "じっとしていられない",
      "効率重視、回り道が嫌い",
      "スピードキャラに感情移入する",
      "考えるより先に体が動く",
    ],
    quote: "「速さこそ正義」",
    emoji: "⚡",
    color: "#AA00FF",
    image: "/images/yami-zokusei/type-d.png",
  },
  'seinaru-hikari': {
    type: 'seinaru-hikari',
    title: "聖なる光",
    subtitle: "誰かを守る力が欲しかった",
    description: "あなたの魂は光に満ちている。闇属性診断なのに光が出るのは、あなたの優しさと正義感の証。誰かのために立ち上がれる、本物のヒーロータイプ。",
    traits: [
      "人の痛みがわかるタイプ",
      "正義感が強い",
      "聖騎士・ヒーラーに憧れる",
      "「闇属性なのに光…？」と困惑してる",
      "でも光が出るの、ちょっと嬉しい",
    ],
    quote: "「誰かを守る力が欲しかった」",
    emoji: "✨",
    color: "#FFD600",
    image: "/images/yami-zokusei/type-e.png",
  },
  'kyomu-kaze': {
    type: 'kyomu-kaze',
    title: "虚無の風",
    subtitle: "どこにも属さない自由",
    description: "あなたの魂は風のように自由で掴みどころがない。何にも縛られず、何にも属さない。その達観した姿勢は、ある意味最も強い属性かもしれない。",
    traits: [
      "マイペースの極み",
      "「どうでもいい」が口癖",
      "でも意外と周りを見てる",
      "組織に属するのが苦手",
      "最後に颯爽と去るシーンが好き",
    ],
    quote: "「どこにも属さない自由」",
    emoji: "🌀",
    color: "#78909C",
    image: "/images/yami-zokusei/type-f.png",
  },
};

export function getResultByScores(scores: Record<YamiType, number>): Result {
  let maxType: YamiType = 'shikkoku-yami';
  let maxScore = 0;

  for (const [type, score] of Object.entries(scores)) {
    if (score > maxScore) {
      maxScore = score;
      maxType = type as YamiType;
    }
  }

  return results[maxType];
}

export function getTopTypes(scores: Record<YamiType, number>, count: number = 3): { type: YamiType; score: number }[] {
  return Object.entries(scores)
    .map(([type, score]) => ({ type: type as YamiType, score }))
    .sort((a, b) => b.score - a.score)
    .slice(0, count);
}
