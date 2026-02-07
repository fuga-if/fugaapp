import { RpgJobType } from './questions';

export interface RpgJobStats {
  STR: number;
  INT: number;
  DEX: number;
  VIT: number;
  LUK: number;
  CHA: number;
}

export interface RpgJobResult {
  type: RpgJobType;
  title: string;
  subtitle: string;
  description: string;
  stats: RpgJobStats;
  traits: string[];
  quote: string;
  emoji: string;
  color: string;
  image: string;
}

export const results: Record<RpgJobType, RpgJobResult> = {
  'type-a': {
    type: 'type-a',
    title: "勇者",
    subtitle: "困ってる人を見過ごせない、生まれながらのリーダー",
    description: "正義感が強く、困難に立ち向かう力がある。チームの中心で皆を引っ張る存在。責任感も強いが、たまに一人で背負いすぎることも。",
    stats: { STR: 85, INT: 60, DEX: 55, VIT: 80, LUK: 65, CHA: 90 },
    traits: [
      "困ってる人を見ると放っておけない",
      "「なんとかなる」精神が強い",
      "リーダーを任されがち",
      "正論を言いすぎて疲れることも",
      "仲間思いで情に厚い",
    ],
    quote: "「みんなを守る。それが俺の使命だ」",
    emoji: "⚔️",
    color: "#EF4444",
    image: "/images/rpg-job/type-a.png",
  },
  'type-b': {
    type: 'type-b',
    title: "魔法使い",
    subtitle: "知識こそ最強の武器。考えることが生きがい",
    description: "頭脳明晰で知識欲が旺盛。論理的思考と創造力を兼ね備え、複雑な問題を解決する。実戦より研究が好きだが、いざという時の一撃は強烈。",
    stats: { STR: 30, INT: 95, DEX: 50, VIT: 40, LUK: 60, CHA: 55 },
    traits: [
      "知らないことがあると調べずにいられない",
      "一人の時間が至福",
      "理屈っぽいと言われる",
      "専門分野では無双する",
      "体力はないけど知恵で勝負",
    ],
    quote: "「答えは必ずある。探し続ければ」",
    emoji: "🧙",
    color: "#8B5CF6",
    image: "/images/rpg-job/type-b.png",
  },
  'type-c': {
    type: 'type-c',
    title: "盗賊",
    subtitle: "要領の良さと直感で、どんな場面も切り抜ける",
    description: "機転が利いて要領がいい。ルールに縛られるのが苦手で、自分なりのやり方で結果を出す。コミュ力も高く、情報収集が得意。",
    stats: { STR: 50, INT: 65, DEX: 95, VIT: 55, LUK: 80, CHA: 70 },
    traits: [
      "要領がいいと言われる",
      "ルールより結果重視",
      "フットワークが軽い",
      "裏技や近道を見つけるのが得意",
      "飽きっぽいけど器用",
    ],
    quote: "「正面突破だけが戦い方じゃない」",
    emoji: "🗡️",
    color: "#059669",
    image: "/images/rpg-job/type-c.png",
  },
  'type-d': {
    type: 'type-d',
    title: "僧侶",
    subtitle: "癒しの力で、みんなの心と体を支える",
    description: "優しくて面倒見がいい。周りの人を癒し、支えることに喜びを感じる。自分より他人を優先しがちだが、その包容力がチームの要。",
    stats: { STR: 40, INT: 70, DEX: 45, VIT: 75, LUK: 70, CHA: 85 },
    traits: [
      "「大丈夫？」が口癖",
      "人の体調や気分の変化に敏感",
      "お世話好き",
      "自分のことは後回し",
      "いるだけで場が和む",
    ],
    quote: "「あなたが元気なら、それでいい」",
    emoji: "💚",
    color: "#F59E0B",
    image: "/images/rpg-job/type-d.png",
  },
  'type-e': {
    type: 'type-e',
    title: "吟遊詩人",
    subtitle: "表現すること、楽しむこと。人生は舞台だ",
    description: "創造力と表現力に溢れたエンターテイナー。場を盛り上げる才能があり、アートや音楽、言葉で人の心を動かす。自由を愛し、型にはまらない。",
    stats: { STR: 35, INT: 60, DEX: 70, VIT: 50, LUK: 75, CHA: 95 },
    traits: [
      "注目されるのが好き",
      "創作活動が趣味（or 仕事）",
      "ノリと勢いで生きてる",
      "感受性が豊か",
      "「面白い」が最高の褒め言葉",
    ],
    quote: "「人生は一度きりのステージだ」",
    emoji: "🎵",
    color: "#EC4899",
    image: "/images/rpg-job/type-e.png",
  },
  'type-f': {
    type: 'type-f',
    title: "錬金術師",
    subtitle: "無から有を生み出す。それが俺のスタイル",
    description: "独自の視点で物事を組み合わせ、新しい価値を生み出すクリエイター気質。研究熱心で凝り性、こだわりが強い。変わり者だが、その発想力は唯一無二。",
    stats: { STR: 45, INT: 85, DEX: 75, VIT: 50, LUK: 55, CHA: 50 },
    traits: [
      "こだわりが強すぎると言われる",
      "「なんかいいもの作れないかな」が口癖",
      "独学で色々覚える",
      "完成度にこだわって締切ギリギリ",
      "変わってると言われるのは褒め言葉",
    ],
    quote: "「誰も見たことないものを作りたい」",
    emoji: "⚗️",
    color: "#06B6D4",
    image: "/images/rpg-job/type-f.png",
  },
};

export function getResultByScores(scores: Record<RpgJobType, number>): RpgJobResult {
  let maxType: RpgJobType = 'type-a';
  let maxScore = 0;

  for (const [type, score] of Object.entries(scores)) {
    if (score > maxScore) {
      maxScore = score;
      maxType = type as RpgJobType;
    }
  }

  return results[maxType];
}
