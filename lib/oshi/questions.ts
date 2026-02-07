export type OshiType = 'kakin-senshi' | 'genba-shijou' | 'sousaku-numa' | 'data-chuu' | 'fukyou-shi' | 'seikan-sei';

export interface Question {
  id: number;
  text: string;
  options: {
    label: string;
    scores: Partial<Record<OshiType, number>>;
  }[];
}

export const questions: Question[] = [
  {
    id: 1,
    text: "推しの新グッズが発表！あなたの反応は？",
    options: [
      { label: "全種類予約する", scores: { 'kakin-senshi': 3 } },
      { label: "実物見てから決める", scores: { 'seikan-sei': 3 } },
      { label: "早速ファンアート描く", scores: { 'sousaku-numa': 3 } },
      { label: "SNSで情報拡散する", scores: { 'fukyou-shi': 3 } },
    ],
  },
  {
    id: 2,
    text: "推しのライブが遠方で開催。どうする？",
    options: [
      { label: "遠征確定。宿も即予約", scores: { 'genba-shijou': 3 } },
      { label: "配信あるなら配信で", scores: { 'seikan-sei': 2, 'kakin-senshi': 1 } },
      { label: "レポ用に機材準備する", scores: { 'data-chuu': 2, 'genba-shijou': 1 } },
      { label: "友達誘って布教チャンス", scores: { 'fukyou-shi': 3 } },
    ],
  },
  {
    id: 3,
    text: "推しの誕生日。何をする？",
    options: [
      { label: "祝い絵/祝い動画を作る", scores: { 'sousaku-numa': 3 } },
      { label: "バースデーグッズを購入", scores: { 'kakin-senshi': 3 } },
      { label: "過去の誕生日まとめを作成", scores: { 'data-chuu': 3 } },
      { label: "心の中でおめでとうを言う", scores: { 'seikan-sei': 3 } },
    ],
  },
  {
    id: 4,
    text: "推しの情報収集、どうやってる？",
    options: [
      { label: "公式だけチェック", scores: { 'seikan-sei': 3 } },
      { label: "エゴサして全部把握", scores: { 'data-chuu': 3 } },
      { label: "ファン同士で情報交換", scores: { 'fukyou-shi': 2, 'genba-shijou': 1 } },
      { label: "自分で考察記事書いてる", scores: { 'sousaku-numa': 2, 'data-chuu': 1 } },
    ],
  },
  {
    id: 5,
    text: "推しグッズの収納どうしてる？",
    options: [
      { label: "専用部屋/スペースがある", scores: { 'kakin-senshi': 3 } },
      { label: "厳選して飾ってる", scores: { 'seikan-sei': 2, 'sousaku-numa': 1 } },
      { label: "データベース化して管理", scores: { 'data-chuu': 3 } },
      { label: "布教用に複数持ち", scores: { 'fukyou-shi': 3 } },
    ],
  },
  {
    id: 6,
    text: "推しが炎上。あなたは？",
    options: [
      { label: "静かに見守る", scores: { 'seikan-sei': 3 } },
      { label: "擁護ツイートする", scores: { 'fukyou-shi': 2, 'kakin-senshi': 1 } },
      { label: "事実関係を時系列でまとめる", scores: { 'data-chuu': 3 } },
      { label: "応援の意味で課金する", scores: { 'kakin-senshi': 3 } },
    ],
  },
  {
    id: 7,
    text: "推しとの理想の距離感は？",
    options: [
      { label: "認知されたい！", scores: { 'genba-shijou': 3 } },
      { label: "遠くから見てるだけで幸せ", scores: { 'seikan-sei': 3 } },
      { label: "創作で繋がりたい", scores: { 'sousaku-numa': 3 } },
      { label: "同担と繋がりたい", scores: { 'fukyou-shi': 3 } },
    ],
  },
  {
    id: 8,
    text: "推しのために一番使ってるものは？",
    options: [
      { label: "お金", scores: { 'kakin-senshi': 3 } },
      { label: "時間", scores: { 'genba-shijou': 2, 'data-chuu': 1 } },
      { label: "体力", scores: { 'genba-shijou': 3 } },
      { label: "熱意", scores: { 'fukyou-shi': 2, 'sousaku-numa': 1 } },
    ],
  },
];
