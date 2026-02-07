export type ZenseType = 'type-a' | 'type-b' | 'type-c' | 'type-d' | 'type-e' | 'type-f';

export interface Question {
  id: number;
  text: string;
  options: {
    label: string;
    scores: Partial<Record<ZenseType, number>>;
  }[];
}

export const questions: Question[] = [
  {
    id: 1,
    text: "ふと惹かれる場所は？",
    options: [
      { label: "古城や要塞", scores: { 'type-a': 3 } },
      { label: "深い森や洞窟", scores: { 'type-b': 3 } },
      { label: "賑やかな港町や市場", scores: { 'type-c': 2, 'type-f': 1 } },
      { label: "神社や古い寺院", scores: { 'type-d': 3 } },
    ],
  },
  {
    id: 2,
    text: "夢の中でよく見る風景は？",
    options: [
      { label: "剣を手に戦場に立っている", scores: { 'type-a': 3 } },
      { label: "星空の下で何かの儀式をしている", scores: { 'type-b': 3 } },
      { label: "知らない街を歩いている", scores: { 'type-c': 2, 'type-f': 1 } },
      { label: "図書館のような場所で本を読んでいる", scores: { 'type-e': 3 } },
    ],
  },
  {
    id: 3,
    text: "不思議と得意なことは？",
    options: [
      { label: "人を守ること・リーダーシップ", scores: { 'type-a': 2, 'type-d': 1 } },
      { label: "直感で正解を当てること", scores: { 'type-b': 3 } },
      { label: "人を楽しませること", scores: { 'type-c': 3 } },
      { label: "物事の仕組みを理解すること", scores: { 'type-e': 2, 'type-b': 1 } },
    ],
  },
  {
    id: 4,
    text: "初めて会った人に「前世は〇〇っぽい」と言われるなら？",
    options: [
      { label: "「戦士っぽい」「強そう」", scores: { 'type-a': 3 } },
      { label: "「不思議な雰囲気がある」", scores: { 'type-b': 2, 'type-d': 1 } },
      { label: "「芸人っぽい」「面白そう」", scores: { 'type-c': 3 } },
      { label: "「穏やかで癒される」", scores: { 'type-d': 3 } },
    ],
  },
  {
    id: 5,
    text: "何かを選ぶとき、一番大事にすることは？",
    options: [
      { label: "正しいかどうか", scores: { 'type-a': 2, 'type-d': 1 } },
      { label: "直感やフィーリング", scores: { 'type-b': 2, 'type-c': 1 } },
      { label: "自由でいられるかどうか", scores: { 'type-f': 3 } },
      { label: "論理的に正しいか", scores: { 'type-e': 3 } },
    ],
  },
  {
    id: 6,
    text: "ストレスを感じたとき、やりたくなることは？",
    options: [
      { label: "体を動かして発散", scores: { 'type-a': 2, 'type-f': 1 } },
      { label: "一人で静かに過ごす", scores: { 'type-b': 2, 'type-e': 1 } },
      { label: "友達と騒ぐ", scores: { 'type-c': 3 } },
      { label: "誰かに話を聞いてもらう", scores: { 'type-d': 2, 'type-c': 1 } },
    ],
  },
  {
    id: 7,
    text: "子どもの頃、好きだった遊びは？",
    options: [
      { label: "ヒーローごっこ・戦いごっこ", scores: { 'type-a': 3 } },
      { label: "おまじないや秘密基地", scores: { 'type-b': 2, 'type-d': 1 } },
      { label: "かくれんぼや鬼ごっこ", scores: { 'type-c': 2, 'type-f': 1 } },
      { label: "図鑑を読む・実験", scores: { 'type-e': 3 } },
    ],
  },
  {
    id: 8,
    text: "歴史上の人物で共感するのは？",
    options: [
      { label: "アーサー王やジャンヌ・ダルク", scores: { 'type-a': 3 } },
      { label: "ノストラダムスやクレオパトラ", scores: { 'type-b': 3 } },
      { label: "マルコ・ポーロやコロンブス", scores: { 'type-f': 2, 'type-c': 1 } },
      { label: "レオナルド・ダ・ヴィンチやニュートン", scores: { 'type-e': 3 } },
    ],
  },
  {
    id: 9,
    text: "自分の「魂の色」は何色だと思う？",
    options: [
      { label: "赤（情熱・正義）", scores: { 'type-a': 3 } },
      { label: "紫（神秘・直感）", scores: { 'type-b': 2, 'type-d': 1 } },
      { label: "黄色（自由・楽しさ）", scores: { 'type-c': 2, 'type-f': 1 } },
      { label: "青（知性・探究）", scores: { 'type-e': 3 } },
    ],
  },
  {
    id: 10,
    text: "生まれ変わっても持っていたい力は？",
    options: [
      { label: "誰かを守れる強さ", scores: { 'type-a': 2, 'type-d': 1 } },
      { label: "未来を見通す直感力", scores: { 'type-b': 3 } },
      { label: "どこでも生きていける適応力", scores: { 'type-c': 1, 'type-f': 2 } },
      { label: "世界を癒す優しさ", scores: { 'type-d': 3 } },
    ],
  },
];
