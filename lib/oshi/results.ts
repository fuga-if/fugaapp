import { OshiType } from './questions';

export interface Result {
  type: OshiType;
  title: string;
  subtitle: string;
  description: string;
  traits: string[];
  quote: string;
  emoji: string;
  color: string;
  image: string;
}

export const results: Record<OshiType, Result> = {
  'kakin-senshi': {
    type: 'kakin-senshi',
    title: "課金戦士",
    subtitle: "推しに貢ぐことが生きがい",
    description: "グッズ全種回収、CD積み、スパチャは惜しまない！推しへの愛を金額で証明するあなた。その経済力と行動力、推しの最強の味方だよ。",
    traits: [
      "新グッズは全種類コンプが基本",
      "CDは積むもの。聴くのはおまけ",
      "スパチャ・投げ銭は日常の一部",
      "推しの売上に貢献してる自覚がある",
      "給料日＝推し活費の入金日",
    ],
    quote: "「金は推しに使うためにある」",
    emoji: "💸",
    color: "#FF6B9D",
    image: "/images/oshi/kakin-senshi.png",
  },
  'genba-shijou': {
    type: 'genba-shijou',
    title: "現場至上主義",
    subtitle: "やっぱり生が一番",
    description: "ライブ・イベント全通、遠征も厭わない！現場でしか味わえないあの空気感を知ってるあなた。推しを生で見る喜びは何にも代えがたい。",
    traits: [
      "ライブは全通が基本スタンス",
      "遠征用のスーツケースが常にスタンバイ",
      "現場で会う仲間がもう家族",
      "推しの汗まで見える距離を知ってる",
      "「現場の空気感は配信じゃ伝わらない」が持論",
    ],
    quote: "「現場でしか得られない栄養がある」",
    emoji: "📸",
    color: "#FF9F43",
    image: "/images/oshi/genba-shijou.png",
  },
  'sousaku-numa': {
    type: 'sousaku-numa',
    title: "創作沼",
    subtitle: "推しへの愛は創作で示す",
    description: "ファンアート、同人誌、考察ブログ…推しへの溢れる愛を創作で表現するあなた。その情熱はもはやアーティスト。推しは最高のミューズ！",
    traits: [
      "推しを見るとすぐ描きたくなる",
      "二次創作の締め切りに追われがち",
      "推しの新衣装は即ファンアートの題材",
      "考察が止まらなくてブログが長文化",
      "「推しは創作意欲の源泉」と本気で思ってる",
    ],
    quote: "「推しは創作の源泉」",
    emoji: "🎨",
    color: "#A855F7",
    image: "/images/oshi/sousaku-numa.png",
  },
  'data-chuu': {
    type: 'data-chuu',
    title: "データ厨",
    subtitle: "推しのことは誰よりも知っている",
    description: "Wiki編集者、時系列まとめ、統計分析…推しに関するあらゆるデータを記録・整理するあなた。その知識量はもはや公式を超えてるかも。",
    traits: [
      "推しのプロフィールは全部暗記済み",
      "過去の発言をスプレッドシートで管理",
      "「それ何月何日の配信で言ってた」が出てくる",
      "Wiki編集や年表作成が生きがい",
      "新情報は即データベースに追加",
    ],
    quote: "「記録することが愛」",
    emoji: "📊",
    color: "#3B82F6",
    image: "/images/oshi/data-chuu.png",
  },
  'fukyou-shi': {
    type: 'fukyou-shi',
    title: "布教師",
    subtitle: "みんなにも推しの良さを知ってほしい",
    description: "SNSで布教活動、入門記事作成、友達を沼に落とす…推しの魅力を一人でも多くの人に伝えたいあなた。その布教力、宗教団体が欲しがるレベル。",
    traits: [
      "「推し見て」が口癖",
      "入門用プレイリストを常備してる",
      "友達を沼に落とした回数を密かに数えてる",
      "布教用アカウントを持ってる",
      "「知らないなんてもったいない」が信念",
    ],
    quote: "「沼は広げるもの」",
    emoji: "🌱",
    color: "#10B981",
    image: "/images/oshi/fukyou-shi.png",
  },
  'seikan-sei': {
    type: 'seikan-sei',
    title: "静観勢",
    subtitle: "遠くから見守るのが幸せ",
    description: "公式だけ追う、グッズは厳選、自分のペースで楽しむ…推しとの距離感を大切にするあなた。穏やかで長く続く推し活、実は一番幸せかも。",
    traits: [
      "公式アカウントだけフォローしてる",
      "グッズは本当に好きなものだけ買う",
      "TLが荒れても静かに見守る",
      "推しが元気ならそれだけで嬉しい",
      "マイペースに長く推し続ける自信がある",
    ],
    quote: "「推しが元気ならそれでいい」",
    emoji: "😌",
    color: "#8B5CF6",
    image: "/images/oshi/seikan-sei.png",
  },
};

export function getResultByScores(scores: Record<OshiType, number>): Result {
  let maxType: OshiType = 'kakin-senshi';
  let maxScore = 0;

  for (const [type, score] of Object.entries(scores)) {
    if (score > maxScore) {
      maxScore = score;
      maxType = type as OshiType;
    }
  }

  return results[maxType];
}

export function getTopTypes(scores: Record<OshiType, number>, count: number = 3): { type: OshiType; score: number }[] {
  return Object.entries(scores)
    .map(([type, score]) => ({ type: type as OshiType, score }))
    .sort((a, b) => b.score - a.score)
    .slice(0, count);
}
