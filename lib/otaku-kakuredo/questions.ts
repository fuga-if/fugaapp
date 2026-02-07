export type KakuredoType = 'type-a' | 'type-b' | 'type-c' | 'type-d' | 'type-e' | 'type-f';

export interface Question {
  id: number;
  text: string;
  options: {
    label: string;
    scores: Partial<Record<KakuredoType, number>>;
  }[];
}

export const questions: Question[] = [
  {
    id: 1,
    text: "SNSのアイコン、どうしてる？",
    options: [
      { label: "風景や動物など無難なもの", scores: { 'type-a': 3, 'type-b': 1 } },
      { label: "推しキャラだけど分かる人には分かる程度", scores: { 'type-b': 2, 'type-c': 1 } },
      { label: "堂々と推しキャラ", scores: { 'type-d': 2, 'type-e': 2 } },
      { label: "自撮りや実写", scores: { 'type-f': 3 } },
      { label: "アカウント分けてる", scores: { 'type-a': 2, 'type-c': 2 } },
    ],
  },
  {
    id: 2,
    text: "職場や学校で趣味を聞かれたら？",
    options: [
      { label: "「映画鑑賞」「読書」など無難に答える", scores: { 'type-a': 2, 'type-c': 2 } },
      { label: "「アニメとか見ます」くらいは言う", scores: { 'type-b': 2, 'type-d': 1 } },
      { label: "具体的な作品名まで言う", scores: { 'type-e': 3 } },
      { label: "趣味の話題は避ける", scores: { 'type-a': 3 } },
      { label: "相手によって変える", scores: { 'type-b': 2, 'type-c': 1 } },
    ],
  },
  {
    id: 3,
    text: "推しのグッズ、どこに置いてる？",
    options: [
      { label: "人目につかない場所に厳重保管", scores: { 'type-a': 3 } },
      { label: "自室にはあるけど来客時は隠す", scores: { 'type-b': 2, 'type-c': 1 } },
      { label: "普通に飾ってる", scores: { 'type-d': 2, 'type-e': 1 } },
      { label: "持ち歩いてる", scores: { 'type-e': 3 } },
      { label: "グッズは買わない派", scores: { 'type-f': 3 } },
    ],
  },
  {
    id: 4,
    text: "オタク趣味、家族は知ってる？",
    options: [
      { label: "絶対に知られたくない", scores: { 'type-a': 3 } },
      { label: "薄々気づいてるかも", scores: { 'type-b': 3 } },
      { label: "知ってるけど深くは話さない", scores: { 'type-c': 3 } },
      { label: "普通に話す", scores: { 'type-d': 2, 'type-e': 1 } },
      { label: "一緒にハマってる", scores: { 'type-e': 2, 'type-f': 1 } },
    ],
  },
  {
    id: 5,
    text: "初対面の人との会話で",
    options: [
      { label: "オタク話は絶対しない", scores: { 'type-a': 3 } },
      { label: "相手がオタクっぽかったら探りを入れる", scores: { 'type-b': 2, 'type-d': 1 } },
      { label: "流れで自然に話すことも", scores: { 'type-c': 1, 'type-d': 2 } },
      { label: "自己紹介で言う", scores: { 'type-e': 3 } },
      { label: "特に意識しない", scores: { 'type-f': 3 } },
    ],
  },
  {
    id: 6,
    text: "推しの話をするとき",
    options: [
      { label: "周りに人がいないか確認する", scores: { 'type-a': 2, 'type-b': 1 } },
      { label: "声のトーンを落とす", scores: { 'type-b': 2, 'type-c': 1 } },
      { label: "普通に話す", scores: { 'type-d': 2, 'type-e': 1 } },
      { label: "むしろ熱く語る", scores: { 'type-e': 3 } },
      { label: "あまり人に話さない", scores: { 'type-a': 1, 'type-f': 2 } },
    ],
  },
  {
    id: 7,
    text: "オタク友達との連絡手段は？",
    options: [
      { label: "専用のサブ垢やDM", scores: { 'type-a': 3 } },
      { label: "LINEのグループ", scores: { 'type-b': 2, 'type-c': 1 } },
      { label: "普通に本垢で絡む", scores: { 'type-d': 2, 'type-e': 1 } },
      { label: "リアルで会って話す", scores: { 'type-e': 3 } },
      { label: "オタク友達いない", scores: { 'type-a': 1, 'type-f': 2 } },
    ],
  },
  {
    id: 8,
    text: "「オタクっぽい」と言われたら？",
    options: [
      { label: "全力で否定する", scores: { 'type-a': 3 } },
      { label: "曖昧に笑ってごまかす", scores: { 'type-b': 2, 'type-c': 1 } },
      { label: "「まあね」と認める", scores: { 'type-d': 3 } },
      { label: "「当たり前でしょ」", scores: { 'type-e': 3 } },
      { label: "「そう？」と不思議に思う", scores: { 'type-f': 3 } },
    ],
  },
  {
    id: 9,
    text: "推し活の予定、どう説明する？",
    options: [
      { label: "「友達と会う」など別の理由", scores: { 'type-a': 2, 'type-c': 1 } },
      { label: "「ライブ」とだけ言う", scores: { 'type-b': 2, 'type-c': 1 } },
      { label: "正直に言う", scores: { 'type-d': 2, 'type-e': 1 } },
      { label: "誘ってみる", scores: { 'type-e': 3 } },
      { label: "説明する相手がいない", scores: { 'type-a': 1, 'type-f': 2 } },
    ],
  },
  {
    id: 10,
    text: "ぶっちゃけ、オタクバレしたらどう思う？",
    options: [
      { label: "社会的に死ぬ", scores: { 'type-a': 3 } },
      { label: "ちょっと恥ずかしい", scores: { 'type-b': 2, 'type-c': 1 } },
      { label: "別に平気", scores: { 'type-d': 3 } },
      { label: "むしろ仲間が増えて嬉しい", scores: { 'type-e': 3 } },
      { label: "バレるも何も隠してない", scores: { 'type-e': 1, 'type-f': 2 } },
    ],
  },
];
