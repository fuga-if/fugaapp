export type InkyaYoukyaType = 'type-a' | 'type-b' | 'type-c' | 'type-d' | 'type-e' | 'type-f';

export interface Question {
  id: number;
  text: string;
  options: {
    label: string;
    scores: Partial<Record<InkyaYoukyaType, number>>;
  }[];
}

export const questions: Question[] = [
  {
    id: 1,
    text: "休日、特に予定がない日。あなたは？",
    options: [
      { label: "友達に連絡して予定を作る", scores: { 'type-a': 3, 'type-b': 1 } },
      { label: "気分が乗ったら誰かに連絡するかも", scores: { 'type-b': 2, 'type-c': 1 } },
      { label: "家でゆっくり過ごす。最高。", scores: { 'type-d': 2, 'type-e': 1 } },
      { label: "一人で好きなことに没頭する", scores: { 'type-e': 3, 'type-f': 1 } },
    ],
  },
  {
    id: 2,
    text: "初対面の人が多い場に行くことに。正直な気持ちは？",
    options: [
      { label: "ワクワクする！新しい出会い楽しみ", scores: { 'type-a': 3 } },
      { label: "知り合いが一人いれば大丈夫", scores: { 'type-c': 2, 'type-d': 1 } },
      { label: "ちょっと憂鬱だけど行けば楽しめる", scores: { 'type-b': 2, 'type-d': 1 } },
      { label: "できれば行きたくない", scores: { 'type-e': 2, 'type-f': 2 } },
    ],
  },
  {
    id: 3,
    text: "グループでの会話中、あなたのポジションは？",
    options: [
      { label: "話題を提供する中心人物", scores: { 'type-a': 3, 'type-c': 1 } },
      { label: "ツッコミやリアクション担当", scores: { 'type-c': 3, 'type-b': 1 } },
      { label: "話を振られたら答えるスタイル", scores: { 'type-d': 2, 'type-f': 1 } },
      { label: "基本聞いてる。たまに鋭い一言", scores: { 'type-f': 3, 'type-e': 1 } },
    ],
  },
  {
    id: 4,
    text: "LINEのグループチャット、あなたの使い方は？",
    options: [
      { label: "自分から話題を投下する", scores: { 'type-a': 3 } },
      { label: "面白い返しやスタンプで盛り上げる", scores: { 'type-c': 2, 'type-b': 1 } },
      { label: "読んではいるけど既読スルーしがち", scores: { 'type-d': 1, 'type-f': 2 } },
      { label: "通知オフにしてる", scores: { 'type-e': 3 } },
    ],
  },
  {
    id: 5,
    text: "自分の「好き」を人に話すとき…",
    options: [
      { label: "聞いてないのに話し始める", scores: { 'type-a': 2, 'type-b': 2 } },
      { label: "聞かれたら熱量MAXで語る", scores: { 'type-b': 3, 'type-c': 1 } },
      { label: "さらっと話す程度", scores: { 'type-d': 2, 'type-f': 1 } },
      { label: "あまり人には言わない", scores: { 'type-e': 2, 'type-f': 2 } },
    ],
  },
  {
    id: 6,
    text: "飲み会やパーティの終盤、あなたは？",
    options: [
      { label: "まだ帰りたくない！二次会行こう", scores: { 'type-a': 3 } },
      { label: "楽しかったけどそろそろ限界", scores: { 'type-d': 3, 'type-c': 1 } },
      { label: "気づいたら端っこで仲いい人と深い話してる", scores: { 'type-b': 2, 'type-e': 1 } },
      { label: "とっくに帰ってる", scores: { 'type-e': 2, 'type-f': 2 } },
    ],
  },
  {
    id: 7,
    text: "SNSの投稿スタイルは？",
    options: [
      { label: "日常を頻繁にシェアする", scores: { 'type-a': 3 } },
      { label: "ハマってるものだけ熱く投稿", scores: { 'type-b': 3 } },
      { label: "たまに投稿。見る方が多い", scores: { 'type-d': 2, 'type-c': 1 } },
      { label: "ほぼ見る専。投稿はしない", scores: { 'type-f': 3, 'type-e': 1 } },
    ],
  },
  {
    id: 8,
    text: "「あなたってどんな人？」と聞かれたら？",
    options: [
      { label: "「明るいってよく言われる！」", scores: { 'type-a': 2, 'type-c': 1 } },
      { label: "「仲良くなったら面白いよ（笑）」", scores: { 'type-c': 3 } },
      { label: "「普通…かな？」", scores: { 'type-d': 2, 'type-f': 1 } },
      { label: "「うーん、自分ではよくわからない」", scores: { 'type-e': 1, 'type-f': 2, 'type-b': 1 } },
    ],
  },
  {
    id: 9,
    text: "理想の人間関係は？",
    options: [
      { label: "いろんな人と広く繋がりたい", scores: { 'type-a': 3 } },
      { label: "趣味の合う人と深く繋がりたい", scores: { 'type-b': 2, 'type-c': 1 } },
      { label: "少数精鋭でいい", scores: { 'type-e': 2, 'type-d': 2 } },
      { label: "一人の時間と人との時間のバランスが大事", scores: { 'type-d': 2, 'type-f': 2 } },
    ],
  },
  {
    id: 10,
    text: "ぶっちゃけ、自分は陰キャだと思う？",
    options: [
      { label: "陽キャだと思う！", scores: { 'type-a': 3 } },
      { label: "場面によって切り替わる", scores: { 'type-b': 2, 'type-c': 2 } },
      { label: "陰キャ寄りだけど、それでいい", scores: { 'type-d': 1, 'type-e': 2, 'type-f': 1 } },
      { label: "陰キャとか陽キャとか、どうでもいい", scores: { 'type-e': 2, 'type-f': 2 } },
    ],
  },
];
