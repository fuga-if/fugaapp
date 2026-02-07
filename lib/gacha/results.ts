import { KakinType } from './questions';

export interface Result {
  type: KakinType;
  title: string;
  subtitle: string;
  description: string;
  traits: string[];
  quote: string;
  emoji: string;
  color: string;
  image: string;
}

export const results: Record<KakinType, Result> = {
  'tenjou-kyouto': {
    type: 'tenjou-kyouto',
    title: "天井教徒",
    subtitle: "無駄な10連はしない",
    description: "あなたは計画的課金の達人！天井までの石を計算し、確実に推しをゲットするタイプ。無駄打ちは一切しない、その合理性は周りから尊敬されてるはず。",
    traits: [
      "天井到達回数をスプレッドシートで管理",
      "石効率を小数点以下まで把握してる",
      "「すり抜けても天井がある」が口癖",
      "無料石は計画的に貯める派",
      "他人の爆死報告を見て「天井まで待てば…」と思う",
    ],
    quote: "「天井こそ正義」",
    emoji: "📊",
    color: "#FFD700",
    image: "/images/gacha/tenjou-kyouto.png",
  },
  'shoudou-kakin': {
    type: 'shoudou-kakin',
    title: "衝動課金マン",
    subtitle: "今引かないと後悔する",
    description: "ガチャは勢いが大事！推しが来たら考える前に指が動いてるタイプ。「あと1回だけ…」が5回続くのはもうお約束。その瞬発力、ある意味才能だよ。",
    traits: [
      "「あと1回だけ」が止まらない",
      "新キャラPVで即課金を決意",
      "深夜テンションでガチャを回しがち",
      "翌朝の残高を見て我に返る",
      "でも引けたときの快感は最高",
    ],
    quote: "「今引かないと後悔する」",
    emoji: "⚡",
    color: "#FF6B35",
    image: "/images/gacha/shoudou-kakin.png",
  },
  'bi-kakin': {
    type: 'bi-kakin',
    title: "微課金勢",
    subtitle: "コスパ重視で賢く",
    description: "お得パックと確定ガチャだけ買う賢いあなた！無駄遣いはしないけど、ここぞというときだけ課金する。そのバランス感覚、実は一番長くゲームを楽しめるタイプかも。",
    traits: [
      "月額パスとお得パックだけは買う",
      "確定ガチャは絶対引く",
      "「この石効率なら買い」が口癖",
      "課金額は月3000円以内をキープ",
      "無課金と廃課金の間で一番幸せ",
    ],
    quote: "「コスパ重視で賢く」",
    emoji: "⚖️",
    color: "#4CAF50",
    image: "/images/gacha/bi-kakin.png",
  },
  'mu-kakin': {
    type: 'mu-kakin',
    title: "完全無課金",
    subtitle: "時間で解決できる",
    description: "課金？しませんけど？配布石と時間で全てを解決するあなた！その忍耐力と戦略性は、ある意味廃課金より強いかもしれない。無課金クリアは誇っていい。",
    traits: [
      "配布石は1個も無駄にしない",
      "リセマラは妥協しない",
      "イベント周回で素材を貯める日々",
      "「課金しなくても楽しめる」が信条",
      "無課金クリア報告が密かな誇り",
    ],
    quote: "「時間で解決できる」",
    emoji: "⏰",
    color: "#2196F3",
    image: "/images/gacha/mu-kakin.png",
  },
  'gentei-killer': {
    type: 'gentei-killer',
    title: "限定キラー",
    subtitle: "限定は逃せない",
    description: "普段は冷静だけど「限定」の2文字に弱いあなた！コラボや期間限定には本気を出す。その選球眼、実は一番効率がいいかもしれない。",
    traits: [
      "「限定」の文字で理性が飛ぶ",
      "コラボガチャは全力投球",
      "復刻しないキャラは絶対逃さない",
      "普段は石を貯めて限定に備える",
      "限定キャラのコンプ率だけは高い",
    ],
    quote: "「限定は逃せない」",
    emoji: "🎯",
    color: "#E040FB",
    image: "/images/gacha/gentei-killer.png",
  },
  'hai-kakin': {
    type: 'hai-kakin',
    title: "廃課金戦士",
    subtitle: "後悔はしてない（震え声）",
    description: "推しのためなら天井を何度でも突破するあなた！完凸は当然、推しへの愛を金額で証明するタイプ。その覚悟…もはや尊敬の域。お財布だけは大切にね。",
    traits: [
      "天井を月に複数回叩く",
      "推しは完凸が当たり前",
      "クレカの明細は見ないようにしてる",
      "「推しに使うお金は消費じゃなく投資」",
      "後悔はしてない（たぶん）",
    ],
    quote: "「後悔はしてない（震え声）」",
    emoji: "💸",
    color: "#FF1744",
    image: "/images/gacha/hai-kakin.png",
  },
};

export function getResultByScores(scores: Record<KakinType, number>): Result {
  let maxType: KakinType = 'tenjou-kyouto';
  let maxScore = 0;

  for (const [type, score] of Object.entries(scores)) {
    if (score > maxScore) {
      maxScore = score;
      maxType = type as KakinType;
    }
  }

  return results[maxType];
}

export function getTopTypes(scores: Record<KakinType, number>, count: number = 3): { type: KakinType; score: number }[] {
  return Object.entries(scores)
    .map(([type, score]) => ({ type: type as KakinType, score }))
    .sort((a, b) => b.score - a.score)
    .slice(0, count);
}
