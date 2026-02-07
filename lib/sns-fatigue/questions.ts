export type FatigueType = 'A' | 'B' | 'C' | 'D' | 'E' | 'F';

export interface Question {
  id: number;
  text: string;
  options: {
    label: string;
    types: FatigueType[];
  }[];
}

export const questions: Question[] = [
  {
    id: 1,
    text: "朝起きて最初にすることは？",
    options: [
      { label: "📱 すぐSNSをチェック", types: ['C'] },
      { label: "🔔 通知の数を確認", types: ['B', 'C'] },
      { label: "📰 ニュースアプリを開く", types: ['D'] },
      { label: "☕ SNSは後で見る", types: ['F'] },
    ],
  },
  {
    id: 2,
    text: "友達のキラキラした投稿を見たとき、どう思う？",
    options: [
      { label: "🥲 自分と比べて落ち込む", types: ['A'] },
      { label: "👍 いいね押して流す", types: ['F'] },
      { label: "📸 自分も何か投稿しなきゃ", types: ['B'] },
      { label: "🤔 どうせ加工でしょ、と思う", types: ['A', 'D'] },
    ],
  },
  {
    id: 3,
    text: "投稿してから1時間後、まず何を見る？",
    options: [
      { label: "❤️ いいね数", types: ['B'] },
      { label: "💬 コメントの内容", types: ['E'] },
      { label: "👀 閲覧数・インプレッション", types: ['B', 'C'] },
      { label: "🤷 特に気にしない", types: ['F'] },
    ],
  },
  {
    id: 4,
    text: "タイムラインで炎上や論争を見つけたら？",
    options: [
      { label: "🔥 最後まで追ってしまう", types: ['C', 'D'] },
      { label: "😰 気分が悪くなる", types: ['D'] },
      { label: "💬 意見を言いたくなる", types: ['E'] },
      { label: "🙈 スルーして別のことする", types: ['F'] },
    ],
  },
  {
    id: 5,
    text: "DMやコメントの返信、どうしてる？",
    options: [
      { label: "😫 返信がストレス…", types: ['E'] },
      { label: "⏰ すぐ返さないと不安", types: ['C', 'E'] },
      { label: "📝 じっくり考えて返す", types: ['B'] },
      { label: "💨 気が向いたときに返す", types: ['F'] },
    ],
  },
  {
    id: 6,
    text: "フォロワーが減ったとき、どう思う？",
    options: [
      { label: "😱 誰が外したか気になる", types: ['B'] },
      { label: "🥺 自分の投稿がダメだった？", types: ['A', 'B'] },
      { label: "😤 ムカつく", types: ['E'] },
      { label: "🤷 気にしない", types: ['F'] },
    ],
  },
  {
    id: 7,
    text: "スマホを1日触らないでいられる？",
    options: [
      { label: "😨 無理！何か見逃しそう", types: ['C'] },
      { label: "😬 いいねやコメントが気になる", types: ['B', 'E'] },
      { label: "😓 ニュースが気になる", types: ['D'] },
      { label: "😊 余裕でいける", types: ['F'] },
    ],
  },
  {
    id: 8,
    text: "他人の「いい報告」（結婚、昇進など）を見ると？",
    options: [
      { label: "😢 自分は何してるんだろう…", types: ['A'] },
      { label: "🎉 素直に祝福できる", types: ['F'] },
      { label: "😒 アピールうざいなと思う", types: ['A', 'E'] },
      { label: "📊 自分も何か成果出さなきゃ", types: ['B'] },
    ],
  },
  {
    id: 9,
    text: "寝る前のスマホ、どのくらい見る？",
    options: [
      { label: "🌙 気づいたら1時間以上", types: ['C', 'D'] },
      { label: "🔔 通知だけチェック", types: ['C'] },
      { label: "📱 返信だけして終わり", types: ['E'] },
      { label: "😴 寝る前は見ない", types: ['F'] },
    ],
  },
  {
    id: 10,
    text: "SNSとの付き合い方、正直どう思う？",
    options: [
      { label: "😞 みんなが羨ましくて辛い", types: ['A'] },
      { label: "😩 反応が気になって疲れる", types: ['B'] },
      { label: "😵 情報量が多すぎて追えない", types: ['C', 'D'] },
      { label: "😮‍💨 人間関係が面倒", types: ['E'] },
      { label: "😌 ちょうどいい感じ", types: ['F'] },
    ],
  },
];
