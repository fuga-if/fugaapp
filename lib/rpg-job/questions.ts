export type RpgJobType = 'type-a' | 'type-b' | 'type-c' | 'type-d' | 'type-e' | 'type-f';

export interface Question {
  id: number;
  text: string;
  options: {
    label: string;
    scores: Partial<Record<RpgJobType, number>>;
  }[];
}

export const questions: Question[] = [
  {
    id: 1,
    text: "冒険の始まり。パーティでのあなたの役割は？",
    options: [
      { label: "先頭に立って道を切り開く", scores: { 'type-a': 3 } },
      { label: "作戦を考えて指示を出す", scores: { 'type-b': 3 } },
      { label: "偵察して情報を集めてくる", scores: { 'type-c': 3 } },
      { label: "仲間の体調を気にかける", scores: { 'type-d': 3 } },
    ],
  },
  {
    id: 2,
    text: "ダンジョンで罠を発見。どう対処する？",
    options: [
      { label: "力ずくで突破する", scores: { 'type-a': 2, 'type-e': 1 } },
      { label: "仕組みを分析して解除する", scores: { 'type-b': 3 } },
      { label: "別のルートを探す", scores: { 'type-c': 3 } },
      { label: "みんなの安全を確認してから慎重に進む", scores: { 'type-d': 2, 'type-f': 1 } },
    ],
  },
  {
    id: 3,
    text: "宝箱を見つけた！中身は何がいい？",
    options: [
      { label: "最強の武器", scores: { 'type-a': 3 } },
      { label: "古代の知識が詰まった魔導書", scores: { 'type-b': 3 } },
      { label: "大量のゴールド", scores: { 'type-c': 2, 'type-f': 1 } },
      { label: "仲間全員に効く回復アイテム", scores: { 'type-d': 3 } },
    ],
  },
  {
    id: 4,
    text: "町の酒場で休憩中。あなたは何してる？",
    options: [
      { label: "次の冒険の仲間を探してる", scores: { 'type-a': 2, 'type-c': 1 } },
      { label: "隅の席で本を読んでる", scores: { 'type-b': 2, 'type-f': 1 } },
      { label: "酒場のマスターから裏情報を聞き出す", scores: { 'type-c': 3 } },
      { label: "みんなに歌を歌って盛り上げてる", scores: { 'type-e': 3 } },
    ],
  },
  {
    id: 5,
    text: "強敵が現れた！あなたの戦い方は？",
    options: [
      { label: "真正面からぶつかる", scores: { 'type-a': 3 } },
      { label: "弱点を分析してから攻撃", scores: { 'type-b': 2, 'type-f': 1 } },
      { label: "隙を突いて急所を狙う", scores: { 'type-c': 3 } },
      { label: "仲間を強化して援護する", scores: { 'type-d': 2, 'type-e': 1 } },
    ],
  },
  {
    id: 6,
    text: "仲間が落ち込んでる。どうする？",
    options: [
      { label: "「俺がついてるから大丈夫！」と励ます", scores: { 'type-a': 2, 'type-d': 1 } },
      { label: "問題の原因を一緒に考える", scores: { 'type-b': 2, 'type-f': 1 } },
      { label: "気分転換に街に連れ出す", scores: { 'type-c': 2, 'type-e': 1 } },
      { label: "そっと隣にいて話を聞く", scores: { 'type-d': 3 } },
    ],
  },
  {
    id: 7,
    text: "冒険で一番ワクワクする瞬間は？",
    options: [
      { label: "強敵に勝った瞬間", scores: { 'type-a': 3 } },
      { label: "新しい魔法や知識を手に入れた瞬間", scores: { 'type-b': 3 } },
      { label: "レアアイテムをゲットした瞬間", scores: { 'type-c': 2, 'type-f': 1 } },
      { label: "仲間と笑い合ってる瞬間", scores: { 'type-e': 2, 'type-d': 1 } },
    ],
  },
  {
    id: 8,
    text: "実生活で得意なことは？",
    options: [
      { label: "人をまとめること・決断すること", scores: { 'type-a': 3 } },
      { label: "調べもの・分析・学習", scores: { 'type-b': 2, 'type-f': 2 } },
      { label: "交渉・駆け引き・情報収集", scores: { 'type-c': 3 } },
      { label: "人の話を聞くこと・気遣い", scores: { 'type-d': 3 } },
    ],
  },
  {
    id: 9,
    text: "もし転職するなら？",
    options: [
      { label: "経営者・リーダー職", scores: { 'type-a': 3 } },
      { label: "研究者・エンジニア", scores: { 'type-b': 2, 'type-f': 2 } },
      { label: "営業・フリーランス", scores: { 'type-c': 3 } },
      { label: "クリエイター・アーティスト", scores: { 'type-e': 3 } },
    ],
  },
  {
    id: 10,
    text: "人生で一番大事にしてることは？",
    options: [
      { label: "信念を貫くこと", scores: { 'type-a': 3 } },
      { label: "真理を追求すること", scores: { 'type-b': 3 } },
      { label: "自由に生きること", scores: { 'type-c': 2, 'type-e': 1 } },
      { label: "人とのつながり", scores: { 'type-d': 2, 'type-e': 1 } },
    ],
  },
];
