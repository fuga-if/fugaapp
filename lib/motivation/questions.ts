export type MotivationType = 'type-a' | 'type-b' | 'type-c' | 'type-d' | 'type-e' | 'type-f';

export interface Question {
  id: number;
  text: string;
  options: {
    label: string;
    scores: Partial<Record<MotivationType, number>>;
  }[];
}

export const questions: Question[] = [
  {
    id: 1,
    text: "仕事（or 勉強）でやる気が出るのはどんなとき？",
    options: [
      { label: "目標が明確で、達成が見えたとき", scores: { 'type-a': 3 } },
      { label: "新しくて面白いテーマに出会ったとき", scores: { 'type-b': 3 } },
      { label: "上司やチームメンバーに褒められたとき", scores: { 'type-c': 3 } },
      { label: "自分のペースで自由にやれるとき", scores: { 'type-e': 3 } },
    ],
  },
  {
    id: 2,
    text: "逆に、やる気がなくなるのは？",
    options: [
      { label: "ゴールがない・何を目指すかわからない", scores: { 'type-a': 3 } },
      { label: "同じことの繰り返し・新しさがない", scores: { 'type-b': 3 } },
      { label: "誰にも見てもらえない・評価されない", scores: { 'type-c': 3 } },
      { label: "細かく管理される・自由がない", scores: { 'type-e': 3 } },
    ],
  },
  {
    id: 3,
    text: "休日の過ごし方の理想は？",
    options: [
      { label: "やるべきことを片付けて達成感を得る", scores: { 'type-a': 2, 'type-d': 1 } },
      { label: "新しいお店や場所を開拓する", scores: { 'type-b': 3 } },
      { label: "友達や家族とゆっくり過ごす", scores: { 'type-c': 2, 'type-d': 1 } },
      { label: "何も予定がない自由な一日", scores: { 'type-e': 2, 'type-d': 1 } },
    ],
  },
  {
    id: 4,
    text: "ゲームで一番テンション上がるのは？",
    options: [
      { label: "難しいボスを倒した瞬間", scores: { 'type-a': 3 } },
      { label: "新しいエリアを発見した瞬間", scores: { 'type-b': 3 } },
      { label: "仲間と協力してクリアした瞬間", scores: { 'type-c': 2, 'type-f': 1 } },
      { label: "自由に建築やカスタマイズしてる時間", scores: { 'type-e': 3 } },
    ],
  },
  {
    id: 5,
    text: "チームで動くとき、あなたのモチベーションは？",
    options: [
      { label: "チームの目標を達成すること", scores: { 'type-a': 2, 'type-f': 1 } },
      { label: "チームで新しいことに挑戦すること", scores: { 'type-b': 2, 'type-f': 1 } },
      { label: "チームメンバーに貢献できていること", scores: { 'type-c': 3 } },
      { label: "チームの活動に社会的意義があること", scores: { 'type-f': 3 } },
    ],
  },
  {
    id: 6,
    text: "「頑張ったなぁ」と感じるのは？",
    options: [
      { label: "数字で結果が出たとき", scores: { 'type-a': 3 } },
      { label: "「なるほど！」と理解が深まったとき", scores: { 'type-b': 3 } },
      { label: "「助かった！」と言ってもらえたとき", scores: { 'type-c': 3 } },
      { label: "地道な積み重ねが実を結んだとき", scores: { 'type-d': 3 } },
    ],
  },
  {
    id: 7,
    text: "将来の不安、一番大きいのは？",
    options: [
      { label: "成長が止まること", scores: { 'type-a': 2, 'type-b': 1 } },
      { label: "飽きてしまうこと", scores: { 'type-b': 2, 'type-e': 1 } },
      { label: "孤立すること", scores: { 'type-c': 3 } },
      { label: "不安定な状況に置かれること", scores: { 'type-d': 3 } },
    ],
  },
  {
    id: 8,
    text: "お金と自由、どっちが大事？",
    options: [
      { label: "お金（目標達成のための資源）", scores: { 'type-a': 2, 'type-d': 1 } },
      { label: "自由（好きなことをやるため）", scores: { 'type-e': 3 } },
      { label: "どっちも大事だけど、人間関係が一番", scores: { 'type-c': 3 } },
      { label: "お金より意義のある仕事がしたい", scores: { 'type-f': 3 } },
    ],
  },
  {
    id: 9,
    text: "SNSで投稿するとき、何が嬉しい？",
    options: [
      { label: "「すごい！」「達成おめでとう！」の反応", scores: { 'type-a': 2, 'type-c': 1 } },
      { label: "「それ知らなかった！面白い！」の反応", scores: { 'type-b': 3 } },
      { label: "たくさんのいいねやコメント", scores: { 'type-c': 3 } },
      { label: "特にない（投稿しないかも）", scores: { 'type-e': 2, 'type-d': 1 } },
    ],
  },
  {
    id: 10,
    text: "一言で言うと、あなたを動かすものは？",
    options: [
      { label: "「目標を達成したい」", scores: { 'type-a': 3 } },
      { label: "「もっと知りたい」", scores: { 'type-b': 3 } },
      { label: "「誰かの役に立ちたい」", scores: { 'type-c': 2, 'type-f': 2 } },
      { label: "「自分のペースで生きたい」", scores: { 'type-e': 2, 'type-d': 2 } },
    ],
  },
];
