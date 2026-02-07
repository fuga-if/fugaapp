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
    text: "好きな人からLINEの返信が来ないとき、どうする？",
    options: [
      { label: "スマホ置いて別のことする", score: 1 },
      { label: "通知来るまでスマホ握りしめてる", score: 3 },
      { label: "「忙しいのかな」って自分から送る", score: 2 },
      { label: "共通の友達に「あの人今なにしてる？」って聞く", score: 4 },
    ],
  },
  {
    id: 2,
    text: "恋人や好きな人が異性と楽しそうに話してた。どうする？",
    options: [
      { label: "あとで「誰だったの？」って聞く", score: 2 },
      { label: "その人のSNSを特定して調べる", score: 4 },
      { label: "別に気にしない、自分も友達いるし", score: 1 },
      { label: "会話が終わるまでずっと見てる", score: 3 },
    ],
  },
  {
    id: 3,
    text: "夜中にふと寂しくなった。どうする？",
    options: [
      { label: "寝落ちするまでSNS見てる", score: 2 },
      { label: "誰かに「起きてる？」って連絡する", score: 3 },
      { label: "音楽聴いたり動画見て気を紛らわす", score: 1 },
      { label: "誰でもいいから話し相手探す", score: 4 },
    ],
  },
  {
    id: 4,
    text: "相手の「好き」が本当か不安になったら？",
    options: [
      { label: "わざと冷たくして反応を見る", score: 4 },
      { label: "「私のこと好き？」って聞いちゃう", score: 3 },
      { label: "行動を見て判断する", score: 1 },
      { label: "たまにさりげなく確認する", score: 2 },
    ],
  },
  {
    id: 5,
    text: "「別れよう」って言われた。どうする？",
    options: [
      { label: "理由を聞いて話し合う", score: 2 },
      { label: "悲しいけど受け入れる", score: 1 },
      { label: "「絶対イヤ」って言い続ける", score: 4 },
      { label: "泣いて考え直してもらう", score: 3 },
    ],
  },
  {
    id: 6,
    text: "相手のスマホに通知が来た。どうする？",
    options: [
      { label: "チラッと画面を見ちゃう", score: 3 },
      { label: "全然気にならない", score: 1 },
      { label: "「誰から？」って聞く", score: 2 },
      { label: "トイレ行ったスキにチェックする", score: 4 },
    ],
  },
  {
    id: 7,
    text: "恋愛してないとき、休日は何してる？",
    options: [
      { label: "マッチングアプリ開いちゃう", score: 3 },
      { label: "趣味とか友達と過ごす", score: 1 },
      { label: "元カレ/元カノのSNSパトロール", score: 4 },
      { label: "なんとなくダラダラしてる", score: 2 },
    ],
  },
  {
    id: 8,
    text: "自分に自信がなくなったとき、どうする？",
    options: [
      { label: "SNSに自撮り上げていいね待つ", score: 3 },
      { label: "自分の好きなことして気分転換", score: 1 },
      { label: "「私ってダメかな」って誰かに聞く", score: 4 },
      { label: "友達に会って話を聞いてもらう", score: 2 },
    ],
  },
  {
    id: 9,
    text: "相手の予定、どこまで知りたい？",
    options: [
      { label: "今日何するかくらい知りたい", score: 2 },
      { label: "位置情報共有してほしい", score: 4 },
      { label: "聞かれたら教えてくれればOK", score: 1 },
      { label: "誰と会うかは把握しておきたい", score: 3 },
    ],
  },
  {
    id: 10,
    text: "「ちょっと重いかも」って言われた。どう思う？",
    options: [
      { label: "言われたことない", score: 1 },
      { label: "私の愛が重いのは当然でしょ", score: 4 },
      { label: "ショックだけど気をつける", score: 2 },
      { label: "何が重いのかわからない", score: 3 },
    ],
  },
];
