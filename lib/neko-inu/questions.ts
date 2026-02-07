export type NekoInuType = 'type-a' | 'type-b' | 'type-c' | 'type-d' | 'type-e' | 'type-f';

export interface Question {
  id: number;
  text: string;
  options: {
    label: string;
    scores: Partial<Record<NekoInuType, number>>;
  }[];
}

export const questions: Question[] = [
  {
    id: 1,
    text: "休日の過ごし方は？",
    options: [
      { label: "家で1人でゴロゴロ", scores: { 'type-a': 3 } },
      { label: "1人だけど気が向いたら外出", scores: { 'type-b': 3 } },
      { label: "予定次第。どっちもあり", scores: { 'type-c': 3 } },
      { label: "友達と出かけることが多い", scores: { 'type-d': 2, 'type-e': 1 } },
      { label: "予定パンパン！みんなと遊ぶ", scores: { 'type-e': 3 } },
      { label: "ふらっと知らない場所に行く", scores: { 'type-f': 3 } },
    ],
  },
  {
    id: 2,
    text: "好きな人への態度は？",
    options: [
      { label: "そっけないけど実は気にしてる", scores: { 'type-a': 3 } },
      { label: "気まぐれに甘えたり突き放したり", scores: { 'type-b': 2, 'type-f': 1 } },
      { label: "相手に合わせる", scores: { 'type-c': 3 } },
      { label: "素直に好きって言える", scores: { 'type-d': 2, 'type-e': 1 } },
      { label: "全力で愛情表現！スキンシップ多め", scores: { 'type-e': 3 } },
      { label: "好きだけど束縛はされたくない", scores: { 'type-f': 3 } },
    ],
  },
  {
    id: 3,
    text: "友達の数は？",
    options: [
      { label: "少ない。でも深い", scores: { 'type-a': 3 } },
      { label: "数人の親友がいればいい", scores: { 'type-b': 3 } },
      { label: "程々にいる", scores: { 'type-c': 3 } },
      { label: "多い方だと思う", scores: { 'type-d': 3 } },
      { label: "めっちゃ多い！", scores: { 'type-e': 3 } },
      { label: "友達って概念がよくわからない", scores: { 'type-f': 3 } },
    ],
  },
  {
    id: 4,
    text: "LINEの返信速度は？",
    options: [
      { label: "気が向いた時に返す", scores: { 'type-a': 3 } },
      { label: "内容による。興味あれば即レス", scores: { 'type-b': 3 } },
      { label: "相手によって変える", scores: { 'type-c': 3 } },
      { label: "基本すぐ返す", scores: { 'type-d': 2, 'type-e': 1 } },
      { label: "秒で返す！", scores: { 'type-e': 3 } },
      { label: "既読つけないことも多い", scores: { 'type-f': 3 } },
    ],
  },
  {
    id: 5,
    text: "初対面の人との接し方は？",
    options: [
      { label: "距離を取る。警戒する", scores: { 'type-a': 3 } },
      { label: "様子を見てから判断", scores: { 'type-b': 3 } },
      { label: "普通に接する", scores: { 'type-c': 3 } },
      { label: "自分から話しかける方", scores: { 'type-d': 3 } },
      { label: "すぐ仲良くなれる！", scores: { 'type-e': 3 } },
      { label: "気が合えば一瞬で仲良く、合わなければスルー", scores: { 'type-f': 3 } },
    ],
  },
  {
    id: 6,
    text: "叱られた時の反応は？",
    options: [
      { label: "無視。自分の中で処理する", scores: { 'type-a': 3 } },
      { label: "ちょっとむくれるけどすぐ忘れる", scores: { 'type-b': 2, 'type-f': 1 } },
      { label: "反省して改善する", scores: { 'type-c': 2, 'type-d': 1 } },
      { label: "素直に謝る", scores: { 'type-d': 2, 'type-e': 1 } },
      { label: "しょんぼりする。でもすぐ立ち直る", scores: { 'type-e': 3 } },
      { label: "知らん。自分のルールで生きる", scores: { 'type-f': 3 } },
    ],
  },
  {
    id: 7,
    text: "寝る場所のこだわりは？",
    options: [
      { label: "自分だけの定位置が必要", scores: { 'type-a': 3 } },
      { label: "日によって変わる。気分次第", scores: { 'type-b': 2, 'type-f': 1 } },
      { label: "特にこだわりなし", scores: { 'type-c': 3 } },
      { label: "人の近くがいい", scores: { 'type-d': 2, 'type-e': 1 } },
      { label: "誰かと一緒に寝たい", scores: { 'type-e': 3 } },
      { label: "どこでも寝れる", scores: { 'type-f': 3 } },
    ],
  },
  {
    id: 8,
    text: "嫌なことがあった時は？",
    options: [
      { label: "1人で静かに過ごす", scores: { 'type-a': 3 } },
      { label: "しばらく不機嫌になるけど自然に復活", scores: { 'type-b': 3 } },
      { label: "人に相談することもある", scores: { 'type-c': 2, 'type-d': 1 } },
      { label: "友達に話して発散", scores: { 'type-d': 3 } },
      { label: "すぐ切り替える！遊びに行く", scores: { 'type-e': 3 } },
      { label: "どこかに逃げる", scores: { 'type-f': 3 } },
    ],
  },
  {
    id: 9,
    text: "褒められた時の反応は？",
    options: [
      { label: "素直に喜べない。照れる", scores: { 'type-a': 3 } },
      { label: "嬉しいけど顔に出さない", scores: { 'type-b': 3 } },
      { label: "普通に「ありがとう」", scores: { 'type-c': 3 } },
      { label: "嬉しい！もっと褒めて", scores: { 'type-d': 2, 'type-e': 1 } },
      { label: "全身で喜ぶ！テンション爆上がり", scores: { 'type-e': 3 } },
      { label: "「ふーん」（でも内心嬉しい）", scores: { 'type-f': 2, 'type-a': 1 } },
    ],
  },
  {
    id: 10,
    text: "あなたにとって「幸せ」とは？",
    options: [
      { label: "誰にも邪魔されない時間", scores: { 'type-a': 3 } },
      { label: "信頼できる人といる時", scores: { 'type-b': 3 } },
      { label: "バランスの取れた日常", scores: { 'type-c': 3 } },
      { label: "みんなと笑ってる時", scores: { 'type-d': 2, 'type-e': 1 } },
      { label: "大好きな人の隣にいること", scores: { 'type-e': 3 } },
      { label: "自由であること", scores: { 'type-f': 3 } },
    ],
  },
];
