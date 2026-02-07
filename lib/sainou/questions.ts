export type SainouType = 'type-a' | 'type-b' | 'type-c' | 'type-d' | 'type-e' | 'type-f';

export interface Question {
  id: number;
  text: string;
  options: {
    label: string;
    scores: Partial<Record<SainouType, number>>;
  }[];
}

export const questions: Question[] = [
  {
    id: 1,
    text: "友達グループでの自分のポジションは？",
    options: [
      { label: "話をまとめる・アドバイスする", scores: { 'type-a': 2, 'type-f': 1 } },
      { label: "情報を集めて共有する", scores: { 'type-b': 2, 'type-e': 1 } },
      { label: "みんなの相談に乗る", scores: { 'type-c': 3 } },
      { label: "アイデアを出す・企画する", scores: { 'type-d': 3 } },
    ],
  },
  {
    id: 2,
    text: "ついやってしまうことは？",
    options: [
      { label: "気になったことを調べ尽くす", scores: { 'type-b': 3 } },
      { label: "人の表情や仕草を観察する", scores: { 'type-e': 2, 'type-c': 1 } },
      { label: "頭の中でストーリーを作る", scores: { 'type-d': 2, 'type-a': 1 } },
      { label: "みんなの意見をまとめる", scores: { 'type-f': 3 } },
    ],
  },
  {
    id: 3,
    text: "SNSで評価されるとしたら？",
    options: [
      { label: "文章力やキャプションのセンス", scores: { 'type-a': 3 } },
      { label: "データ分析や考察の深さ", scores: { 'type-b': 3 } },
      { label: "写真や動画の独特な視点", scores: { 'type-d': 2, 'type-e': 1 } },
      { label: "フォロワーとのコミュニケーション力", scores: { 'type-c': 2, 'type-f': 1 } },
    ],
  },
  {
    id: 4,
    text: "学生時代、得意だった教科は？",
    options: [
      { label: "国語・英語", scores: { 'type-a': 3 } },
      { label: "数学・理科", scores: { 'type-b': 2, 'type-e': 1 } },
      { label: "音楽・美術", scores: { 'type-d': 3 } },
      { label: "社会・道徳", scores: { 'type-c': 2, 'type-f': 1 } },
    ],
  },
  {
    id: 5,
    text: "問題が起きたとき、最初にすることは？",
    options: [
      { label: "原因を言語化して整理する", scores: { 'type-a': 2, 'type-b': 1 } },
      { label: "データや事実を集める", scores: { 'type-b': 2, 'type-e': 1 } },
      { label: "関係者の気持ちを確認する", scores: { 'type-c': 3 } },
      { label: "全く新しい解決策を考える", scores: { 'type-d': 2, 'type-f': 1 } },
    ],
  },
  {
    id: 6,
    text: "休日の理想の過ごし方は？",
    options: [
      { label: "本を読む・文章を書く", scores: { 'type-a': 3 } },
      { label: "新しいスキルを勉強する", scores: { 'type-b': 2, 'type-e': 1 } },
      { label: "友達とゆっくり話す", scores: { 'type-c': 3 } },
      { label: "何か作品を作る", scores: { 'type-d': 3 } },
    ],
  },
  {
    id: 7,
    text: "「すごい！」と言われて嬉しいのは？",
    options: [
      { label: "「話がわかりやすい！」", scores: { 'type-a': 3 } },
      { label: "「よくそんなこと気づくね！」", scores: { 'type-e': 3 } },
      { label: "「一緒にいると安心する」", scores: { 'type-c': 3 } },
      { label: "「そのアイデア天才じゃん！」", scores: { 'type-d': 2, 'type-f': 1 } },
    ],
  },
  {
    id: 8,
    text: "チームで仕事するとき、自然と担当するのは？",
    options: [
      { label: "資料作成・文章チェック", scores: { 'type-a': 2, 'type-e': 1 } },
      { label: "スケジュール管理・分析", scores: { 'type-b': 2, 'type-f': 1 } },
      { label: "メンバーのケア・雰囲気作り", scores: { 'type-c': 3 } },
      { label: "全体の方向性を決める", scores: { 'type-f': 3 } },
    ],
  },
  {
    id: 9,
    text: "映画を観た後、気になるのは？",
    options: [
      { label: "セリフの言い回しや脚本", scores: { 'type-a': 3 } },
      { label: "伏線や矛盾点", scores: { 'type-b': 2, 'type-e': 1 } },
      { label: "登場人物の気持ち", scores: { 'type-c': 3 } },
      { label: "映像表現や演出", scores: { 'type-d': 3 } },
    ],
  },
  {
    id: 10,
    text: "自分の一番の強みは？",
    options: [
      { label: "伝える力", scores: { 'type-a': 3 } },
      { label: "考える力", scores: { 'type-b': 2, 'type-e': 1 } },
      { label: "寄り添う力", scores: { 'type-c': 3 } },
      { label: "決断する力", scores: { 'type-f': 3 } },
    ],
  },
];
