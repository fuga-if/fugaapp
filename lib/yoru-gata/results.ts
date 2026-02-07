import { YoruGataType } from './questions';

export interface Result {
  type: YoruGataType;
  title: string;
  subtitle: string;
  description: string;
  traits: string[];
  quote: string;
  emoji: string;
  color: string;
  image: string;
}

export const results: Record<YoruGataType, Result> = {
  'anime-ikki': {
    type: 'anime-ikki',
    title: "アニメ一気見型",
    subtitle: "あと1話だけ…が止まらない",
    description: "「気づいたら朝だった」が日常のあなた。今期アニメの消化が使命感になっていて、最終回まで止められない。ブランケットに包まれてタブレットを見つめる姿はもはや修行僧。",
    traits: [
      "「あと1話だけ」が3話になるのは毎回",
      "今期アニメの消化リストがある",
      "最終回を深夜リアタイで見がち",
      "OPとEDは飛ばさない派（時間がないのに）",
      "寝落ちして同じシーンを3回見ることがある",
    ],
    quote: "「気づいたら朝だった」",
    emoji: "📺",
    color: "#7C4DFF",
    image: "/images/yoru-gata/type-a.png",
  },
  'game-shuukai': {
    type: 'game-shuukai',
    title: "ゲーム周回型",
    subtitle: "デイリー消化は義務",
    description: "スタミナ管理と周回が生活リズムを支配しているあなた。イベント期間中は睡眠時間が確実に削られる。ゲーム機を握ったまま寝落ちするのはもう様式美。",
    traits: [
      "スタミナ回復タイマーが体内時計",
      "イベント最終日は徹夜覚悟",
      "「あと1周だけ」が10周になる",
      "ゲーム機握ったまま寝落ち経験あり",
      "デイリーミッション未消化は許せない",
    ],
    quote: "「デイリー消化は義務」",
    emoji: "🎮",
    color: "#00E676",
    image: "/images/yoru-gata/type-b.png",
  },
  'sousaku-engine': {
    type: 'sousaku-engine',
    title: "創作エンジン型",
    subtitle: "夜は脳が冴える",
    description: "深夜になると創作意欲が爆発するあなた。絵、小説、動画…静かな夜こそが最高の制作環境。「ノッてるときに寝るなんてもったいない」が信条。",
    traits: [
      "深夜2時に突然インスピレーションが降りてくる",
      "「あとちょっとで完成」が朝まで続く",
      "保存を忘れて寝落ちした経験がトラウマ",
      "夜中のテンションで描いた絵を朝見て微妙な気持ちになる",
      "でもやっぱり夜が一番集中できる",
    ],
    quote: "「夜は脳が冴える」",
    emoji: "🎨",
    color: "#FF4081",
    image: "/images/yoru-gata/type-c.png",
  },
  'sns-junkai': {
    type: 'sns-junkai',
    title: "SNS巡回型",
    subtitle: "TLに終わりはない",
    description: "TLを追い続けて気づいたら深夜。いいねの手が止まらないあなた。「みんなが起きてるから」が最強の言い訳。深夜のTLが一番面白いのは事実。",
    traits: [
      "TLの更新ボタンを無意識に押してる",
      "深夜のフォロワーとの会話が楽しすぎる",
      "通知音が子守唄",
      "「最後にTLチェック」が30分コース",
      "朝起きて通知の数に驚く",
    ],
    quote: "「TLに終わりはない」",
    emoji: "📱",
    color: "#00B0FF",
    image: "/images/yoru-gata/type-d.png",
  },
  'kousatsu-fukabori': {
    type: 'kousatsu-fukabori',
    title: "考察・深掘り型",
    subtitle: "調べ始めたら止まらない",
    description: "推しの考察、Wiki巡り、関連動画のループ…知的好奇心が眠りを許さないあなた。1つ調べると5つ気になることが増える無限ループの住人。",
    traits: [
      "Wikipediaの「関連項目」を全部開く",
      "考察スレを最初から最後まで読破",
      "気づいたらブラウザのタブが30個",
      "「これだけ調べたら寝る」が嘘になる",
      "翌朝、昨夜調べたことの半分を忘れてる",
    ],
    quote: "「調べ始めたら止まらない」",
    emoji: "🔍",
    color: "#FFD740",
    image: "/images/yoru-gata/type-e.png",
  },
  'kyomu-yofukashi': {
    type: 'kyomu-yofukashi',
    title: "虚無夜更かし型",
    subtitle: "何もしてないのに3時",
    description: "特に何かしてるわけじゃないのに寝れない。天井を見つめて「何してるんだろう」と思いつつ、気づけば深夜3時。寝たいのに寝れない、それが虚無。",
    traits: [
      "ベッドに入ってから2時間経ってる",
      "スマホを置いても眠れない",
      "天井のシミの数なら誰にも負けない",
      "「明日こそ早く寝る」が毎日の目標",
      "何もしてないのが一番疲れる",
    ],
    quote: "「何もしてないのに3時」",
    emoji: "🌀",
    color: "#B0BEC5",
    image: "/images/yoru-gata/type-f.png",
  },
};

export function getResultByScores(scores: Record<YoruGataType, number>): Result {
  let maxType: YoruGataType = 'anime-ikki';
  let maxScore = 0;

  for (const [type, score] of Object.entries(scores)) {
    if (score > maxScore) {
      maxScore = score;
      maxType = type as YoruGataType;
    }
  }

  return results[maxType];
}

export function getTopTypes(scores: Record<YoruGataType, number>, count: number = 3): { type: YoruGataType; score: number }[] {
  return Object.entries(scores)
    .map(([type, score]) => ({ type: type as YoruGataType, score }))
    .sort((a, b) => b.score - a.score)
    .slice(0, count);
}
