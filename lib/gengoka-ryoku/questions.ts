export type GengokaType = 'type-a' | 'type-b' | 'type-c' | 'type-d' | 'type-e' | 'type-f';

export interface Question {
  id: number;
  text: string;
  options: {
    label: string;
    scores: Partial<Record<GengokaType, number>>;
  }[];
}

export const questions: Question[] = [
  {
    id: 1,
    text: "好きな映画を人に勧めるとき、どうする？",
    options: [
      { label: "感動したシーンを熱く語る", scores: { 'type-a': 3 } },
      { label: "あらすじを順序立てて説明する", scores: { 'type-b': 3 } },
      { label: "「〇〇が好きならハマるよ」と例える", scores: { 'type-c': 3 } },
      { label: "相手の好みを聞いてから説明する", scores: { 'type-d': 3 } },
      { label: "「とりあえず観て！」で済ませる", scores: { 'type-e': 3 } },
      { label: "何から話せばいいか迷って黙る", scores: { 'type-f': 3 } },
    ],
  },
  {
    id: 2,
    text: "会議で意見を求められたとき、どうする？",
    options: [
      { label: "思ったことをそのまま言う", scores: { 'type-a': 3 } },
      { label: "結論→理由の順で話す", scores: { 'type-b': 3 } },
      { label: "身近な例に置き換えて話す", scores: { 'type-c': 3 } },
      { label: "他の人の意見をまとめてから自分の意見", scores: { 'type-d': 3 } },
      { label: "「なんとなくこう思う」で済ませる", scores: { 'type-e': 3 } },
      { label: "後でメールやチャットで送る", scores: { 'type-f': 3 } },
    ],
  },
  {
    id: 3,
    text: "友達が悩み相談してきたとき、どうする？",
    options: [
      { label: "共感の言葉をたくさんかける", scores: { 'type-a': 3 } },
      { label: "問題を整理して解決策を提示する", scores: { 'type-b': 3 } },
      { label: "似た経験の話をして寄り添う", scores: { 'type-c': 3 } },
      { label: "「つまりこういうこと？」と確認する", scores: { 'type-d': 3 } },
      { label: "黙って隣にいる", scores: { 'type-e': 3 } },
      { label: "何て言えばいいかわからなくなる", scores: { 'type-f': 3 } },
    ],
  },
  {
    id: 4,
    text: "新しい趣味にハマったとき、どうする？",
    options: [
      { label: "SNSで熱く布教する", scores: { 'type-a': 3 } },
      { label: "魅力を箇条書きでまとめる", scores: { 'type-b': 3 } },
      { label: "「〇〇×〇〇みたいな感じ」と説明する", scores: { 'type-c': 3 } },
      { label: "相手の興味に合わせて紹介する", scores: { 'type-d': 3 } },
      { label: "語らず黙々と楽しむ", scores: { 'type-e': 3 } },
      { label: "話したいけど伝わる気がしない", scores: { 'type-f': 3 } },
    ],
  },
  {
    id: 5,
    text: "自分の仕事を説明するとき、どうする？",
    options: [
      { label: "やりがいや想いを語る", scores: { 'type-a': 3 } },
      { label: "業務内容を具体的に説明する", scores: { 'type-b': 3 } },
      { label: "「〇〇みたいなもの」と例える", scores: { 'type-c': 3 } },
      { label: "相手の仕事と比較して説明する", scores: { 'type-d': 3 } },
      { label: "「まあ色々やってる」で済ませる", scores: { 'type-e': 3 } },
      { label: "うまく説明できなくてもどかしい", scores: { 'type-f': 3 } },
    ],
  },
  {
    id: 6,
    text: "怒りを感じたとき、どうする？",
    options: [
      { label: "感情を言葉にして伝える", scores: { 'type-a': 3 } },
      { label: "何が問題か論理的に説明する", scores: { 'type-b': 3 } },
      { label: "「例えばさ…」と具体例で示す", scores: { 'type-c': 3 } },
      { label: "相手の言い分を確認してから伝える", scores: { 'type-d': 3 } },
      { label: "態度で示す", scores: { 'type-e': 3 } },
      { label: "言葉にできず飲み込む", scores: { 'type-f': 3 } },
    ],
  },
  {
    id: 7,
    text: "複雑な説明を聞いたとき、どうする？",
    options: [
      { label: "感想や印象を述べる", scores: { 'type-a': 3 } },
      { label: "要点をメモする", scores: { 'type-b': 3 } },
      { label: "自分なりの例えに変換する", scores: { 'type-c': 3 } },
      { label: "「つまり〇〇ってこと？」と確認する", scores: { 'type-d': 3 } },
      { label: "なんとなく理解する", scores: { 'type-e': 3 } },
      { label: "わかったふりをしてしまう", scores: { 'type-f': 3 } },
    ],
  },
  {
    id: 8,
    text: "文章を書くとき、どうなる？",
    options: [
      { label: "感情が溢れて長くなる", scores: { 'type-a': 3 } },
      { label: "構成を決めてから書く", scores: { 'type-b': 3 } },
      { label: "例え話を多用する", scores: { 'type-c': 3 } },
      { label: "読者目線を意識する", scores: { 'type-d': 3 } },
      { label: "苦手、最小限で済ませたい", scores: { 'type-e': 3 } },
      { label: "頭の中にはあるのに書けない", scores: { 'type-f': 3 } },
    ],
  },
];
