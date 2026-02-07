export type GamerType = 'gachi' | 'enjoy' | 'story' | 'collector' | 'streamer' | 'numa';

export interface Question {
  id: number;
  text: string;
  options: {
    label: string;
    scores: Partial<Record<GamerType, number>>;
  }[];
}

export const questions: Question[] = [
  {
    id: 1,
    text: "新作ゲームを買う決め手は？",
    options: [
      { label: "競技シーンが盛り上がってるか", scores: { gachi: 3 } },
      { label: "友達がやってるか", scores: { enjoy: 3 } },
      { label: "ストーリーの評価", scores: { story: 3 } },
      { label: "やり込み要素の多さ", scores: { collector: 3 } },
      { label: "配信映えするか", scores: { streamer: 2, enjoy: 1 } },
    ],
  },
  {
    id: 2,
    text: "ゲームで一番テンション上がる瞬間は？",
    options: [
      { label: "ランクが上がった時", scores: { gachi: 3 } },
      { label: "フレンドと大笑いした時", scores: { enjoy: 3 } },
      { label: "衝撃的なストーリー展開", scores: { story: 3 } },
      { label: "レアアイテムをゲットした時", scores: { collector: 3 } },
      { label: "神プレイが出た時", scores: { streamer: 2, gachi: 1 } },
    ],
  },
  {
    id: 3,
    text: "ゲームオーバーになったら？",
    options: [
      { label: "原因を分析して改善する", scores: { gachi: 3 } },
      { label: "まぁいっか、次いこ", scores: { enjoy: 3 } },
      { label: "ストーリーの続きが気になるから即リトライ", scores: { story: 3 } },
      { label: "取り逃したアイテムがないか確認", scores: { collector: 3 } },
      { label: "面白いやられ方なら録画を確認", scores: { streamer: 3 } },
    ],
  },
  {
    id: 4,
    text: "マルチプレイの立ち位置は？",
    options: [
      { label: "指示出し/ショットコーラー", scores: { gachi: 3 } },
      { label: "ムードメーカー", scores: { enjoy: 3 } },
      { label: "ソロで黙々とやりたい…", scores: { story: 2, numa: 1 } },
      { label: "サポート役で全体を把握", scores: { collector: 2, gachi: 1 } },
      { label: "実況しながらプレイ", scores: { streamer: 3 } },
    ],
  },
  {
    id: 5,
    text: "積みゲーの量は？",
    options: [
      { label: "積まない。今やってるのを極める", scores: { gachi: 2, numa: 1 } },
      { label: "めっちゃある。友達に誘われて買っちゃう", scores: { enjoy: 3 } },
      { label: "ストーリーが良さそうなのだけ買う", scores: { story: 3 } },
      { label: "セールで全部買っちゃう", scores: { collector: 3 } },
      { label: "配信で話題のやつは一通り触る", scores: { streamer: 3 } },
    ],
  },
  {
    id: 6,
    text: "ゲームの攻略情報、どうしてる？",
    options: [
      { label: "フレーム単位で調べる", scores: { gachi: 3 } },
      { label: "詰まったら見る程度", scores: { enjoy: 3 } },
      { label: "ネタバレ回避最優先", scores: { story: 3 } },
      { label: "全収集物リストは必須", scores: { collector: 3 } },
      { label: "攻略動画を参考にしつつ自分流にアレンジ", scores: { streamer: 2, numa: 1 } },
    ],
  },
  {
    id: 7,
    text: "好きなゲームジャンルは？",
    options: [
      { label: "格ゲー/FPS/MOBA", scores: { gachi: 3 } },
      { label: "パーティゲーム/協力ゲー", scores: { enjoy: 3 } },
      { label: "RPG/アドベンチャー", scores: { story: 3 } },
      { label: "オープンワールド/ハクスラ", scores: { collector: 3 } },
      { label: "何でもやる、旬のゲーム", scores: { numa: 2, streamer: 1 } },
    ],
  },
  {
    id: 8,
    text: "ゲーム中の口癖は？",
    options: [
      { label: "「今のは相手がうまかった」", scores: { gachi: 3 } },
      { label: "「やば〜いwww」", scores: { enjoy: 3 } },
      { label: "「ここの演出すごくない？」", scores: { story: 3 } },
      { label: "「あと1個で全部揃う…」", scores: { collector: 3 } },
      { label: "「今の見た？！」", scores: { streamer: 3 } },
    ],
  },
  {
    id: 9,
    text: "ゲームのプレイ時間、どのくらい？",
    options: [
      { label: "毎日最低2時間はランク回す", scores: { gachi: 3 } },
      { label: "友達がオンの時だけ", scores: { enjoy: 3 } },
      { label: "気になる作品がある時だけ集中的に", scores: { story: 2, numa: 1 } },
      { label: "コンプするまでずっと", scores: { collector: 3 } },
      { label: "配信スケジュールに合わせて", scores: { streamer: 3 } },
    ],
  },
  {
    id: 10,
    text: "ゲームへの課金スタンスは？",
    options: [
      { label: "強くなれるなら必要経費", scores: { gachi: 3 } },
      { label: "フレンドとお揃いスキンとか買う", scores: { enjoy: 3 } },
      { label: "ストーリーDLCは即買い", scores: { story: 3 } },
      { label: "限定アイテムは全部確保", scores: { collector: 3 } },
      { label: "見た目が映えるスキンに課金", scores: { streamer: 2, numa: 1 } },
    ],
  },
];
