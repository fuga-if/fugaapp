import { ZenseType } from './questions';

export interface ZenseResult {
  type: ZenseType;
  title: string;
  subtitle: string;
  description: string;
  traits: string[];
  quote: string;
  emoji: string;
  color: string;
  image: string;
}

export const results: Record<ZenseType, ZenseResult> = {
  'type-a': {
    type: 'type-a',
    title: "騎士",
    subtitle: "剣に誓いを。民を守る鋼の意志",
    description: "前世のあなたは高潔な騎士。正義感と忠誠心を胸に、大切な人を守るために戦っていた。現世でも責任感が強く、困ってる人を放っておけない性格はその名残。リーダーシップと行動力は前世から受け継いだ魂の力。",
    traits: [
      "約束は絶対に守る",
      "弱い人の味方をしがち",
      "正義感が強すぎて疲れることも",
      "「守りたい」という衝動がある",
      "体を動かすのが好き",
    ],
    quote: "「この剣は、誰かを守るためにある」",
    emoji: "⚔️",
    color: "#DC2626",
    image: "/images/zense/type-a.png",
  },
  'type-b': {
    type: 'type-b',
    title: "魔女",
    subtitle: "知識は力。秘密の書庫に眠る真実を求めて",
    description: "前世のあなたは秘術を操る魔女（魔術師）。人知を超えた知識を追い求め、薬草や星の動きに精通していた。現世でも知的好奇心が旺盛で、スピリチュアルや占いに惹かれるのは前世の記憶。直感が鋭いのも魔術の名残。",
    traits: [
      "直感やインスピレーションが鋭い",
      "占いやスピリチュアルに興味がある",
      "一人で集中する時間が好き",
      "薬草やアロマに惹かれる",
      "「なんとなくわかる」が多い",
    ],
    quote: "「真実は、星の導きの先にある」",
    emoji: "🔮",
    color: "#7C3AED",
    image: "/images/zense/type-b.png",
  },
  'type-c': {
    type: 'type-c',
    title: "旅芸人",
    subtitle: "世界は舞台。笑顔を届ける旅はまだ終わらない",
    description: "前世のあなたは各地を巡る旅芸人。歌や踊り、話芸で人々を楽しませていた。現世でもコミュ力が高く、場を盛り上げるのが得意なのは前世の才能。自由を愛し、一箇所にとどまれない性格も旅芸人の血。",
    traits: [
      "じっとしていられない",
      "人前で何かするのが好き",
      "旅行が大好き",
      "面白い話をするのが得意",
      "束縛されるのが苦手",
    ],
    quote: "「笑ってくれるなら、どこへだって行くさ」",
    emoji: "🎭",
    color: "#F59E0B",
    image: "/images/zense/type-c.png",
  },
  'type-d': {
    type: 'type-d',
    title: "巫女",
    subtitle: "人の心に寄り添う、癒しの祈り",
    description: "前世のあなたは神殿に仕える巫女（神官）。人々の苦しみに寄り添い、祈りで癒していた。現世でも共感力が高く、人の痛みがわかるのは前世の力。スピリチュアルな感覚や「浄化したい」という衝動は巫女の魂。",
    traits: [
      "人の悩みを聞くのが得意",
      "神社やお寺に行くと落ち着く",
      "「空気が重い場所」がわかる",
      "癒し系と言われる",
      "自分より人のことを考えがち",
    ],
    quote: "「あなたの涙が止まるまで、ここにいるよ」",
    emoji: "🌸",
    color: "#EC4899",
    image: "/images/zense/type-d.png",
  },
  'type-e': {
    type: 'type-e',
    title: "学者",
    subtitle: "万物の法則を解き明かす、探究の魂",
    description: "前世のあなたは真理を追求する学者（錬金術師）。書物に囲まれて研究に没頭する日々を送っていた。現世でも「なぜ？」が口癖で、物事の仕組みを知りたがるのは前世からの探究心。理系っぽい思考も学者の名残。",
    traits: [
      "「なぜ？」「どうして？」が多い",
      "本や論文を読むのが好き",
      "細かいことが気になる",
      "実験や検証が楽しい",
      "オタク気質と言われる",
    ],
    quote: "「真理は、問い続ける者にのみ姿を現す」",
    emoji: "📜",
    color: "#0EA5E9",
    image: "/images/zense/type-e.png",
  },
  'type-f': {
    type: 'type-f',
    title: "海賊",
    subtitle: "自由の海へ。冒険はまだ始まったばかり",
    description: "前世のあなたは海を渡る海賊（冒険家）。誰にも縛られず、自分のルールで生きていた。現世でもルールに縛られるのが嫌いで、型破りな生き方を好むのは海賊の魂。リスクを恐れない大胆さも前世譲り。",
    traits: [
      "ルールに縛られるのが嫌い",
      "リスクを取るのが平気",
      "「自分らしく生きたい」が信条",
      "海や空を見ると心が騒ぐ",
      "安定より刺激を選ぶ",
    ],
    quote: "「俺の人生は、俺が決める」",
    emoji: "🏴‍☠️",
    color: "#1E293B",
    image: "/images/zense/type-f.png",
  },
};

export function getResultByScores(scores: Record<ZenseType, number>): ZenseResult {
  let maxType: ZenseType = 'type-a';
  let maxScore = 0;

  for (const [type, score] of Object.entries(scores)) {
    if (score > maxScore) {
      maxScore = score;
      maxType = type as ZenseType;
    }
  }

  return results[maxType];
}
