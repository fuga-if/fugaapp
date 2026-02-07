export type ShikouType = 'type-a' | 'type-b' | 'type-c' | 'type-d' | 'type-e' | 'type-f';

export interface Question {
  id: number;
  text: string;
  options: {
    label: string;
    scores: Partial<Record<ShikouType, number>>;
  }[];
}

export const questions: Question[] = [
  {
    id: 1,
    text: "友達から旅行の行き先を相談された。あなたの反応は？",
    options: [
      { label: "コスパや移動時間を比較して最適解を出す", scores: { 'type-a': 3, 'type-d': 1 } },
      { label: "「なんか沖縄いいかも！」と直感で提案", scores: { 'type-b': 3 } },
      { label: "みんなの行きたい場所を聞いてまとめる", scores: { 'type-c': 3 } },
      { label: "「とりあえず予約しちゃおう！」", scores: { 'type-e': 3 } },
    ],
  },
  {
    id: 2,
    text: "仕事で想定外の問題が発生。まずどうする？",
    options: [
      { label: "原因を分析して、データを集める", scores: { 'type-a': 3, 'type-d': 1 } },
      { label: "パッとひらめいた解決策を試してみる", scores: { 'type-b': 2, 'type-e': 1 } },
      { label: "チームメンバーの状況を確認する", scores: { 'type-c': 3 } },
      { label: "いくつか選択肢を出して比較する", scores: { 'type-d': 2, 'type-f': 2 } },
    ],
  },
  {
    id: 3,
    text: "買い物で迷ったとき、最終的に何で決める？",
    options: [
      { label: "スペックや口コミの比較結果", scores: { 'type-a': 2, 'type-d': 2 } },
      { label: "「これだ！」というピンとくる感覚", scores: { 'type-b': 3 } },
      { label: "友達や店員さんのおすすめ", scores: { 'type-c': 2, 'type-f': 1 } },
      { label: "迷ったら両方買う（or すぐ決める）", scores: { 'type-e': 3 } },
    ],
  },
  {
    id: 4,
    text: "グループで意見が割れた。あなたのスタンスは？",
    options: [
      { label: "根拠がある方を支持する", scores: { 'type-a': 3 } },
      { label: "「こうしたら両方いけるんじゃない？」と新案", scores: { 'type-b': 2, 'type-f': 1 } },
      { label: "まず全員の意見を聞いてから考える", scores: { 'type-c': 2, 'type-f': 2 } },
      { label: "「まずやってみて決めよう」と提案", scores: { 'type-e': 3 } },
    ],
  },
  {
    id: 5,
    text: "新しいことを学ぶとき、どう進める？",
    options: [
      { label: "教科書や参考書で体系的に学ぶ", scores: { 'type-a': 2, 'type-d': 2 } },
      { label: "面白そうなところからつまみ食い", scores: { 'type-b': 3 } },
      { label: "誰かに教わるのが一番早い", scores: { 'type-c': 2, 'type-e': 1 } },
      { label: "とりあえず手を動かして覚える", scores: { 'type-e': 3 } },
    ],
  },
  {
    id: 6,
    text: "自分の長所だと思うのは？",
    options: [
      { label: "冷静に判断できるところ", scores: { 'type-a': 2, 'type-d': 2 } },
      { label: "アイデアが豊富なところ", scores: { 'type-b': 3 } },
      { label: "人の気持ちがわかるところ", scores: { 'type-c': 3 } },
      { label: "フットワークの軽さ", scores: { 'type-e': 2, 'type-f': 1 } },
    ],
  },
  {
    id: 7,
    text: "映画を選ぶとき、何を重視する？",
    options: [
      { label: "評価サイトの点数やレビュー", scores: { 'type-a': 2, 'type-d': 2 } },
      { label: "予告編を見たときの直感", scores: { 'type-b': 3 } },
      { label: "友達が「良かった」と言ったかどうか", scores: { 'type-c': 2, 'type-f': 1 } },
      { label: "「新しいジャンルに挑戦しよう」と適当に選ぶ", scores: { 'type-e': 2, 'type-b': 1 } },
    ],
  },
  {
    id: 8,
    text: "人から相談されたとき、つい出る反応は？",
    options: [
      { label: "解決策やアドバイスを提示する", scores: { 'type-a': 2, 'type-e': 1 } },
      { label: "「こうしたらいいかも！」と思いつきを伝える", scores: { 'type-b': 2, 'type-e': 1 } },
      { label: "まず気持ちに共感する", scores: { 'type-c': 3 } },
      { label: "情報を整理して選択肢を並べる", scores: { 'type-d': 3 } },
    ],
  },
  {
    id: 9,
    text: "自分の弱点だと思うのは？",
    options: [
      { label: "感情的な話が苦手", scores: { 'type-a': 3 } },
      { label: "飽きっぽい・詰めが甘い", scores: { 'type-b': 3 } },
      { label: "自分の意見を通すのが苦手", scores: { 'type-c': 2, 'type-f': 2 } },
      { label: "せっかちすぎる", scores: { 'type-e': 3 } },
    ],
  },
  {
    id: 10,
    text: "一言で表すと、あなたの判断基準は？",
    options: [
      { label: "正しいかどうか", scores: { 'type-a': 3 } },
      { label: "面白いかどうか", scores: { 'type-b': 3 } },
      { label: "みんなが納得するかどうか", scores: { 'type-c': 2, 'type-f': 2 } },
      { label: "早いかどうか", scores: { 'type-e': 2, 'type-d': 1 } },
    ],
  },
];
