export type YoruGataType = 'anime-ikki' | 'game-shuukai' | 'sousaku-engine' | 'sns-junkai' | 'kousatsu-fukabori' | 'kyomu-yofukashi';

export interface Question {
  id: number;
  text: string;
  options: {
    label: string;
    scores: Partial<Record<YoruGataType, number>>;
  }[];
}

export const questions: Question[] = [
  {
    id: 1,
    text: "深夜2時、あなたは何してる？",
    options: [
      { label: "アニメの続きが止められない", scores: { 'anime-ikki': 3 } },
      { label: "ゲームのイベント周回中", scores: { 'game-shuukai': 3 } },
      { label: "描きかけの絵を仕上げてる", scores: { 'sousaku-engine': 3 } },
      { label: "SNSのTLを無限スクロール", scores: { 'sns-junkai': 3 } },
      { label: "Wikiの関連リンクを辿り続けてる", scores: { 'kousatsu-fukabori': 3 } },
      { label: "ベッドでゴロゴロしてるだけ", scores: { 'kyomu-yofukashi': 3 } },
    ],
  },
  {
    id: 2,
    text: "「もう寝よう」と思ってからの行動は？",
    options: [
      { label: "あと1話だけ…→3話見る", scores: { 'anime-ikki': 3 } },
      { label: "ログインボーナスだけ…→1時間", scores: { 'game-shuukai': 3 } },
      { label: "この部分だけ仕上げて…→完成まで", scores: { 'sousaku-engine': 3 } },
      { label: "最後にTLチェック…→30分溶ける", scores: { 'sns-junkai': 3 } },
      { label: "このスレだけ読んで…→派生記事5つ", scores: { 'kousatsu-fukabori': 3 } },
      { label: "スマホ置いたのに眠れない", scores: { 'kyomu-yofukashi': 3 } },
    ],
  },
  {
    id: 3,
    text: "朝起きた時の第一声は？",
    options: [
      { label: "「昨日の最終回やばかった…」", scores: { 'anime-ikki': 3 } },
      { label: "「スタミナ溢れてる…」", scores: { 'game-shuukai': 3 } },
      { label: "「あ、保存した…よね？」", scores: { 'sousaku-engine': 3 } },
      { label: "「通知何件…？」", scores: { 'sns-junkai': 3 } },
      { label: "「結局あの考察どうなったっけ」", scores: { 'kousatsu-fukabori': 3 } },
      { label: "「何時に寝たっけ…」", scores: { 'kyomu-yofukashi': 3 } },
    ],
  },
  {
    id: 4,
    text: "夜更かしの言い訳、何が多い？",
    options: [
      { label: "「今クール面白いのが多すぎる」", scores: { 'anime-ikki': 3 } },
      { label: "「イベント期間中だから仕方ない」", scores: { 'game-shuukai': 3 } },
      { label: "「夜の方が集中できるんだよ」", scores: { 'sousaku-engine': 3 } },
      { label: "「みんな起きてるし」", scores: { 'sns-junkai': 3 } },
      { label: "「気になることがあると眠れない性格で」", scores: { 'kousatsu-fukabori': 3 } },
      { label: "「別に夜更かししたくてしてるわけじゃ…」", scores: { 'kyomu-yofukashi': 3 } },
    ],
  },
  {
    id: 5,
    text: "休日前の夜、どう過ごす？",
    options: [
      { label: "録り溜めたアニメ一掃大会", scores: { 'anime-ikki': 3 } },
      { label: "夜通しゲームマラソン", scores: { 'game-shuukai': 3 } },
      { label: "締め切りに向けて追い込み", scores: { 'sousaku-engine': 3 } },
      { label: "夜更かしTL参加", scores: { 'sns-junkai': 2, 'kyomu-yofukashi': 1 } },
      { label: "考察まとめ記事を書く", scores: { 'kousatsu-fukabori': 3 } },
      { label: "特に何もせず夜が明ける", scores: { 'kyomu-yofukashi': 3 } },
    ],
  },
  {
    id: 6,
    text: "睡眠時間を犠牲にしてでもやりたいことは？",
    options: [
      { label: "今期アニメの消化", scores: { 'anime-ikki': 3 } },
      { label: "ゲームのランキング報酬", scores: { 'game-shuukai': 3 } },
      { label: "創作の完成", scores: { 'sousaku-engine': 3 } },
      { label: "バズってるスレの全追い", scores: { 'sns-junkai': 3 } },
      { label: "気になる情報の深掘り", scores: { 'kousatsu-fukabori': 3 } },
      { label: "特にない…でも寝れない", scores: { 'kyomu-yofukashi': 3 } },
    ],
  },
  {
    id: 7,
    text: "枕元に常備してるものは？",
    options: [
      { label: "タブレット（アニメ視聴用）", scores: { 'anime-ikki': 3 } },
      { label: "充電中のスマホ/ゲーム機", scores: { 'game-shuukai': 3 } },
      { label: "スケッチブック or ノートPC", scores: { 'sousaku-engine': 3 } },
      { label: "スマホ（SNS用）", scores: { 'sns-junkai': 3 } },
      { label: "スマホ（調べもの用）", scores: { 'kousatsu-fukabori': 2, 'sns-junkai': 1 } },
      { label: "スマホ（触らないけど手の届く範囲に）", scores: { 'kyomu-yofukashi': 3 } },
    ],
  },
  {
    id: 8,
    text: "友達に「早く寝なよ」と言われたら？",
    options: [
      { label: "「このアニメ終わったら寝る」", scores: { 'anime-ikki': 3 } },
      { label: "「お前もゲームしてるじゃん」", scores: { 'game-shuukai': 3 } },
      { label: "「ノッてる時に中断できない」", scores: { 'sousaku-engine': 3 } },
      { label: "「お前が深夜にツイートするから」", scores: { 'sns-junkai': 3 } },
      { label: "「これだけ調べたら寝る」", scores: { 'kousatsu-fukabori': 3 } },
      { label: "「寝たいけど寝れないんだよ」", scores: { 'kyomu-yofukashi': 3 } },
    ],
  },
  {
    id: 9,
    text: "理想の夜の過ごし方は？",
    options: [
      { label: "新作アニメの一挙放送", scores: { 'anime-ikki': 3 } },
      { label: "フレンドとオールナイトゲーム", scores: { 'game-shuukai': 3 } },
      { label: "静かな部屋で創作に没頭", scores: { 'sousaku-engine': 3 } },
      { label: "深夜のTLでフォロワーとわちゃわちゃ", scores: { 'sns-junkai': 3 } },
      { label: "知的好奇心が満たされる調べもの", scores: { 'kousatsu-fukabori': 3 } },
      { label: "ぐっすり寝たい…", scores: { 'kyomu-yofukashi': 3 } },
    ],
  },
  {
    id: 10,
    text: "夜更かしの翌朝、後悔してる？",
    options: [
      { label: "してない。最終回見れたし", scores: { 'anime-ikki': 3 } },
      { label: "ちょっと。でもイベント完走したし", scores: { 'game-shuukai': 3 } },
      { label: "してない。作品ができたから", scores: { 'sousaku-engine': 3 } },
      { label: "してる。でも今夜もTL見ちゃう", scores: { 'sns-junkai': 3 } },
      { label: "してない。知識が増えたから", scores: { 'kousatsu-fukabori': 3 } },
      { label: "めっちゃしてる。毎晩してる", scores: { 'kyomu-yofukashi': 3 } },
    ],
  },
];
