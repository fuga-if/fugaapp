export type CommuStyleType = 'type-a' | 'type-b' | 'type-c' | 'type-d' | 'type-e' | 'type-f';

export interface Question {
  id: number;
  text: string;
  options: {
    label: string;
    scores: Partial<Record<CommuStyleType, number>>;
  }[];
}

export const questions: Question[] = [
  {
    id: 1,
    text: "友達が落ち込んでる。あなたの第一声は？",
    options: [
      { label: "「何があったの？話聞くよ」", scores: { 'type-a': 3 } },
      { label: "「まあまあ！美味しいもの食べに行こう！」", scores: { 'type-b': 3 } },
      { label: "「何が問題なのか整理しよう」", scores: { 'type-c': 3 } },
      { label: "そっと隣にいる（言葉は無理に出さない）", scores: { 'type-f': 3 } },
    ],
  },
  {
    id: 2,
    text: "グループLINEでの自分のポジションは？",
    options: [
      { label: "みんなのメッセージに丁寧にリアクション", scores: { 'type-a': 2, 'type-d': 1 } },
      { label: "面白いスタンプや画像を投下する係", scores: { 'type-b': 3 } },
      { label: "要点だけ短く返す", scores: { 'type-c': 2, 'type-f': 1 } },
      { label: "会話が途切れたときに話題を振る", scores: { 'type-d': 2, 'type-e': 1 } },
    ],
  },
  {
    id: 3,
    text: "初対面の人との会話、どう進める？",
    options: [
      { label: "相手の話をたくさん聞いて共通点を探す", scores: { 'type-a': 2, 'type-d': 1 } },
      { label: "自分から面白い話を振って場を和ませる", scores: { 'type-b': 3 } },
      { label: "効率よく自己紹介して本題に入る", scores: { 'type-c': 3 } },
      { label: "相手のペースに合わせて自然に", scores: { 'type-f': 2, 'type-d': 1 } },
    ],
  },
  {
    id: 4,
    text: "会議やミーティングでの役割は？",
    options: [
      { label: "メンバーの意見を引き出す", scores: { 'type-d': 3 } },
      { label: "アイスブレイクで空気を作る", scores: { 'type-b': 2, 'type-e': 1 } },
      { label: "議論の論点を整理してまとめる", scores: { 'type-c': 3 } },
      { label: "誰も言わない視点を提供する", scores: { 'type-e': 3 } },
    ],
  },
  {
    id: 5,
    text: "自分のSNSの使い方は？",
    options: [
      { label: "友達の投稿にコメントやいいねをたくさんする", scores: { 'type-a': 2, 'type-d': 1 } },
      { label: "面白いネタや日常を頻繁に投稿", scores: { 'type-b': 3 } },
      { label: "有益な情報やニュースをシェア", scores: { 'type-c': 2, 'type-e': 1 } },
      { label: "あまり投稿しない。見る専", scores: { 'type-f': 3 } },
    ],
  },
  {
    id: 6,
    text: "相手に言いにくいことを伝えるとき…",
    options: [
      { label: "相手の気持ちに配慮しながら柔らかく伝える", scores: { 'type-a': 2, 'type-d': 2 } },
      { label: "笑いに変えて軽く伝える", scores: { 'type-b': 3 } },
      { label: "ストレートに事実を伝える", scores: { 'type-c': 3 } },
      { label: "タイミングを見て、1対1で慎重に伝える", scores: { 'type-f': 2, 'type-d': 1 } },
    ],
  },
  {
    id: 7,
    text: "話がうまいなと思う人の特徴は？",
    options: [
      { label: "気持ちに寄り添ってくれる人", scores: { 'type-a': 3 } },
      { label: "面白くて場を盛り上げる人", scores: { 'type-b': 3 } },
      { label: "論理的でわかりやすい人", scores: { 'type-c': 3 } },
      { label: "独特な視点で新しい気づきをくれる人", scores: { 'type-e': 3 } },
    ],
  },
  {
    id: 8,
    text: "自分のコミュニケーションの課題は？",
    options: [
      { label: "人の感情を受け止めすぎて疲れる", scores: { 'type-a': 3 } },
      { label: "深い話になると逃げたくなる", scores: { 'type-b': 3 } },
      { label: "「冷たい」と言われることがある", scores: { 'type-c': 3 } },
      { label: "自分から話しかけるのが苦手", scores: { 'type-f': 2, 'type-e': 1 } },
    ],
  },
  {
    id: 9,
    text: "理想の人間関係は？",
    options: [
      { label: "お互いの気持ちを分かち合える関係", scores: { 'type-a': 3 } },
      { label: "いつも笑い合える関係", scores: { 'type-b': 3 } },
      { label: "信頼と尊重に基づくプロフェッショナルな関係", scores: { 'type-c': 2, 'type-f': 1 } },
      { label: "言葉がなくても通じ合える関係", scores: { 'type-f': 3 } },
    ],
  },
  {
    id: 10,
    text: "コミュニケーションで一番大事だと思うことは？",
    options: [
      { label: "相手を理解しようとする気持ち", scores: { 'type-a': 2, 'type-d': 2 } },
      { label: "楽しい雰囲気を作ること", scores: { 'type-b': 3 } },
      { label: "正確に伝えること", scores: { 'type-c': 3 } },
      { label: "信頼関係を築くこと", scores: { 'type-f': 2, 'type-e': 1 } },
    ],
  },
];
