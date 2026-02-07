import { GamerType } from './questions';

export interface Result {
  type: GamerType;
  title: string;
  subtitle: string;
  description: string;
  traits: string[];
  quote: string;
  emoji: string;
  color: string;
  image: string;
}

export const results: Record<GamerType, Result> = {
  gachi: {
    type: 'gachi',
    title: "ガチ勢",
    subtitle: "勝たなきゃ意味がない",
    description: "あなたはランキング至上主義のガチ勢！効率を追い求め、練習量で殴るスタイル。勝利への執念は誰にも負けない。その情熱、きっと周りも認めてるはず。",
    traits: [
      "ランクマッチの勝率を毎日チェック",
      "フレーム単位で攻略情報を調べる",
      "負けたら原因分析して改善する",
      "練習時間は妥協しない",
      "「エンジョイ勢」という言葉にモヤっとする",
    ],
    quote: "「勝たなきゃ意味がない」",
    emoji: "🔥",
    color: "#FF4500",
    image: "/images/gamer-type/type-a.png",
  },
  enjoy: {
    type: 'enjoy',
    title: "エンジョイ勢",
    subtitle: "ゲームは楽しむためのもの",
    description: "楽しければOK！フレンドとワイワイ遊ぶのが最高のあなた。勝ち負けより笑いが大事。そのポジティブさでパーティの雰囲気がいつも明るくなってるよ。",
    traits: [
      "フレンドがいないとゲーム起動しない",
      "ボイチャでの雑談がメインコンテンツ",
      "勝っても負けても「楽しかった〜」",
      "新しいゲームの誘いには即OK",
      "ガチ勢に怒られがち（でも気にしない）",
    ],
    quote: "「ゲームは楽しむためのもの」",
    emoji: "🎉",
    color: "#FF8C00",
    image: "/images/gamer-type/type-b.png",
  },
  story: {
    type: 'story',
    title: "ストーリー厨",
    subtitle: "物語のないゲームに用はない",
    description: "シナリオ重視、ムービーは全部見る、考察大好き！物語に没入できるかどうかが全て。エンディングで泣いたことがあるなら、間違いなくこのタイプ。",
    traits: [
      "ムービースキップ？ありえない",
      "サブクエストの会話も全部読む",
      "考察スレッドを巡回するのが日課",
      "エンディングで泣いたことがある",
      "ネタバレは絶対許さない",
    ],
    quote: "「物語のないゲームに用はない」",
    emoji: "📖",
    color: "#7B68EE",
    image: "/images/gamer-type/type-c.png",
  },
  collector: {
    type: 'collector',
    title: "コレクター",
    subtitle: "100%にしないと気が済まない",
    description: "実績コンプ、全キャラ収集、図鑑埋め。100%にしないと終われないあなた！やり込み要素を全て制覇してこそ真のクリア。その徹底ぶり、もはや職人。",
    traits: [
      "トロフィー/実績コンプは必須",
      "図鑑の空欄が許せない",
      "全キャラ育成が当たり前",
      "隠し要素は全部見つける",
      "クリア後のやり込みが本番",
    ],
    quote: "「100%にしないと気が済まない」",
    emoji: "🏆",
    color: "#FFD700",
    image: "/images/gamer-type/type-d.png",
  },
  streamer: {
    type: 'streamer',
    title: "配信者気質",
    subtitle: "このプレイ、誰かに見せたい",
    description: "見せプレイ、リアクション芸、共有欲強め！神プレイが出たら即クリップ。ゲームの楽しさを誰かと分かち合いたいあなたは、天性のエンターテイナー。",
    traits: [
      "神プレイは即録画・クリップ",
      "リアクションが大きい",
      "ゲーム選びは「配信映え」重視",
      "プレイ中に実況口調になりがち",
      "SNSにスクショを上げずにはいられない",
    ],
    quote: "「このプレイ、誰かに見せたい」",
    emoji: "📺",
    color: "#FF6347",
    image: "/images/gamer-type/type-e.png",
  },
  numa: {
    type: 'numa',
    title: "沼落ち型",
    subtitle: "今やってるゲームが世界一",
    description: "ハマったら廃人、飽きたら即移動！今プレイ中のゲームが常に世界一。その熱量は凄まじいけど、突然冷める速度も驚異的。でもその全力さが魅力だよ。",
    traits: [
      "ハマると寝食を忘れてプレイ",
      "「これ神ゲー」が週替わり",
      "飽きたら即アンインストール",
      "布教活動に全力を注ぐ",
      "過去のマイブームを覚えてない",
    ],
    quote: "「今やってるゲームが世界一」",
    emoji: "🌊",
    color: "#00CED1",
    image: "/images/gamer-type/type-f.png",
  },
};

export function getResultByScores(scores: Record<GamerType, number>): Result {
  let maxType: GamerType = 'gachi';
  let maxScore = 0;
  for (const [type, score] of Object.entries(scores)) {
    if (score > maxScore) {
      maxScore = score;
      maxType = type as GamerType;
    }
  }
  return results[maxType];
}

export function getTopTypes(scores: Record<GamerType, number>, count: number = 3): { type: GamerType; score: number }[] {
  return Object.entries(scores)
    .map(([type, score]) => ({ type: type as GamerType, score }))
    .sort((a, b) => b.score - a.score)
    .slice(0, count);
}
