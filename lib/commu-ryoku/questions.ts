export interface Question {
  id: number;
  text: string;
  options: {
    label: string;
    score: number;
  }[];
}

export const questions: Question[] = [
  {
    id: 1,
    text: "推しの新情報が出た。最初にすること？",
    options: [
      { label: "即ツイート。感情をぶちまける", score: 3 },
      { label: "信頼できるフォロワーにDM", score: 2 },
      { label: "スクショ撮って保存。後で語る", score: 1 },
      { label: "心の中で叫ぶ。誰にも言わない", score: 0 },
    ],
  },
  {
    id: 2,
    text: "オタク系イベントでの立ち回りは？",
    options: [
      { label: "知らない人にもガンガン話しかける", score: 3 },
      { label: "友達と一緒に行って、友達の知り合いと話す", score: 2 },
      { label: "一人で行って、ブースを黙々と回る", score: 1 },
      { label: "そもそもイベントに行かない", score: 0 },
    ],
  },
  {
    id: 3,
    text: "Xでフォロワーと絡む頻度は？",
    options: [
      { label: "毎日リプやいいねを飛ばしまくる", score: 3 },
      { label: "気が向いたら反応する", score: 2 },
      { label: "いいねは押すけどリプはほぼしない", score: 1 },
      { label: "ROM専。見てるだけ", score: 0 },
    ],
  },
  {
    id: 4,
    text: "同じ推しの人を見つけた。どうする？",
    options: [
      { label: "即フォロー＆リプで語りかける", score: 3 },
      { label: "まずフォローして、タイミング見てリプ", score: 2 },
      { label: "フォローだけして様子を見る", score: 1 },
      { label: "こっそりリストに入れて観察", score: 0 },
    ],
  },
  {
    id: 5,
    text: "オフ会に誘われた。反応は？",
    options: [
      { label: "「行く！！」即答", score: 3 },
      { label: "メンバー次第で考える", score: 2 },
      { label: "興味はあるけど勇気が出ない", score: 1 },
      { label: "絶対行かない。ネットはネット", score: 0 },
    ],
  },
  {
    id: 6,
    text: "推しについて語る時のスタイルは？",
    options: [
      { label: "誰にでも推しの話をする。初対面でも", score: 3 },
      { label: "オタク仲間には熱く語る", score: 2 },
      { label: "聞かれたら答える程度", score: 1 },
      { label: "推しの話は自分の中で完結させる", score: 0 },
    ],
  },
  {
    id: 7,
    text: "オタク垢と本垢の関係は？",
    options: [
      { label: "一つしかない。全部オープン", score: 3 },
      { label: "分けてるけど、オタク垢でもフォロワーと仲良し", score: 2 },
      { label: "分けてる。オタク垢はゆるく運用", score: 1 },
      { label: "鍵垢。フォロワーも厳選", score: 0 },
    ],
  },
  {
    id: 8,
    text: "コラボカフェに行くなら？",
    options: [
      { label: "フォロワーと大人数で。写真撮りまくる", score: 3 },
      { label: "親しい友達と2-3人で", score: 2 },
      { label: "一人で行って静かに楽しむ", score: 1 },
      { label: "コラボカフェは行かない", score: 0 },
    ],
  },
  {
    id: 9,
    text: "推しのグッズ交換・譲渡のやりとりは？",
    options: [
      { label: "得意。交渉もスムーズにこなす", score: 3 },
      { label: "必要ならやるけど緊張する", score: 2 },
      { label: "友達に頼む", score: 1 },
      { label: "やったことない。怖い", score: 0 },
    ],
  },
  {
    id: 10,
    text: "オタク人生で一番幸せな瞬間は？",
    options: [
      { label: "仲間と推しについて語り合う時", score: 3 },
      { label: "イベントで同じ空間を共有する時", score: 2 },
      { label: "一人で推しコンテンツに没頭する時", score: 1 },
      { label: "誰にも邪魔されず推しを愛でる時", score: 0 },
    ],
  },
];
