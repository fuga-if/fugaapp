export type SumahoIzonType = 'type-a' | 'type-b' | 'type-c' | 'type-d' | 'type-e' | 'type-f';

export interface Question {
  id: number;
  text: string;
  options: {
    label: string;
    scores: Partial<Record<SumahoIzonType, number>>;
  }[];
}

export const questions: Question[] = [
  {
    id: 1,
    text: "朝起きて最初にすることは？",
    options: [
      { label: "SNSのTLチェック", scores: { 'type-a': 3 } },
      { label: "通知を全部確認", scores: { 'type-b': 3 } },
      { label: "ゲームのログインボーナス受け取り", scores: { 'type-c': 3 } },
      { label: "ニュースアプリをチェック", scores: { 'type-d': 3 } },
      { label: "今日の予定をカメラロールで確認", scores: { 'type-e': 2, 'type-f': 1 } },
      { label: "タスクアプリで今日のToDoを見る", scores: { 'type-f': 3 } },
    ],
  },
  {
    id: 2,
    text: "スマホのバッテリーが20%。どうする？",
    options: [
      { label: "モバイルバッテリー即接続", scores: { 'type-b': 2, 'type-a': 1 } },
      { label: "SNSとゲーム、どっちを残すか悩む", scores: { 'type-a': 2, 'type-c': 1 } },
      { label: "ゲームのスタミナ消費を優先", scores: { 'type-c': 3 } },
      { label: "最低限の調べ物だけに制限", scores: { 'type-d': 3 } },
      { label: "写真撮れなくなるのが困る", scores: { 'type-e': 3 } },
      { label: "充電できるカフェを探す", scores: { 'type-f': 2, 'type-b': 1 } },
    ],
  },
  {
    id: 3,
    text: "スマホを家に忘れた。どんな気分？",
    options: [
      { label: "TLが追えない…不安", scores: { 'type-a': 3 } },
      { label: "連絡来てたらどうしよう…パニック", scores: { 'type-b': 3 } },
      { label: "デイリー消化できない…焦り", scores: { 'type-c': 3 } },
      { label: "調べたいことがあったのに…", scores: { 'type-d': 3 } },
      { label: "写真撮れない…今日は無かったことに", scores: { 'type-e': 3 } },
      { label: "スケジュールわからん…詰み", scores: { 'type-f': 3 } },
    ],
  },
  {
    id: 4,
    text: "一番使ってるアプリのジャンルは？",
    options: [
      { label: "SNS（Twitter/Instagram/TikTok）", scores: { 'type-a': 3 } },
      { label: "メッセージ（LINE/Discord）", scores: { 'type-b': 3 } },
      { label: "ゲーム", scores: { 'type-c': 3 } },
      { label: "ブラウザ/ニュース", scores: { 'type-d': 3 } },
      { label: "カメラ/写真編集", scores: { 'type-e': 3 } },
      { label: "生産性ツール/家計簿", scores: { 'type-f': 3 } },
    ],
  },
  {
    id: 5,
    text: "トイレにスマホ持っていく？",
    options: [
      { label: "当然。SNS見る", scores: { 'type-a': 3 } },
      { label: "持っていく。連絡来るかもだし", scores: { 'type-b': 3 } },
      { label: "持っていく。周回できるし", scores: { 'type-c': 3 } },
      { label: "持っていく。記事の続き読む", scores: { 'type-d': 3 } },
      { label: "持っていかない。でもすぐ手に取る", scores: { 'type-e': 1, 'type-f': 2 } },
      { label: "持っていく。習慣", scores: { 'type-a': 1, 'type-b': 1, 'type-d': 1 } },
    ],
  },
  {
    id: 6,
    text: "食事中のスマホは？",
    options: [
      { label: "見ながら食べる。当然", scores: { 'type-a': 2, 'type-d': 1 } },
      { label: "通知が来たら見る", scores: { 'type-b': 3 } },
      { label: "ゲームの自動周回を回してる", scores: { 'type-c': 3 } },
      { label: "記事や動画見ながら食べる", scores: { 'type-d': 3 } },
      { label: "食事の写真を撮ってから食べる", scores: { 'type-e': 3 } },
      { label: "マナーとして見ないようにしてる（でも気になる）", scores: { 'type-f': 2, 'type-b': 1 } },
    ],
  },
  {
    id: 7,
    text: "スクリーンタイム、1日何時間くらい？",
    options: [
      { label: "5時間以上。SNSが大半", scores: { 'type-a': 3 } },
      { label: "4-5時間。通知チェックが多い", scores: { 'type-b': 3 } },
      { label: "6時間以上。ほぼゲーム", scores: { 'type-c': 3 } },
      { label: "3-4時間。調べ物中心", scores: { 'type-d': 3 } },
      { label: "3時間。カメラと編集", scores: { 'type-e': 3 } },
      { label: "4時間。色んなアプリ少しずつ", scores: { 'type-f': 3 } },
    ],
  },
  {
    id: 8,
    text: "「スマホ断ち」しろと言われたら？",
    options: [
      { label: "TLが追えなくなる恐怖", scores: { 'type-a': 3 } },
      { label: "連絡取れなくなるのが無理", scores: { 'type-b': 3 } },
      { label: "ゲームのイベントが…", scores: { 'type-c': 3 } },
      { label: "調べ物ができない生活は考えられない", scores: { 'type-d': 3 } },
      { label: "思い出が記録できない", scores: { 'type-e': 3 } },
      { label: "生活が回らなくなる", scores: { 'type-f': 3 } },
    ],
  },
  {
    id: 9,
    text: "寝る前のスマホ、何してる？",
    options: [
      { label: "SNSの最終チェック", scores: { 'type-a': 3 } },
      { label: "返信してない人いないか確認", scores: { 'type-b': 3 } },
      { label: "ゲームのスタミナ消費", scores: { 'type-c': 3 } },
      { label: "明日の天気やニュースチェック", scores: { 'type-d': 3 } },
      { label: "今日撮った写真を整理", scores: { 'type-e': 3 } },
      { label: "明日のスケジュール確認", scores: { 'type-f': 3 } },
    ],
  },
  {
    id: 10,
    text: "スマホで一番大事なデータは？",
    options: [
      { label: "SNSのアカウント", scores: { 'type-a': 3 } },
      { label: "LINEのトーク履歴", scores: { 'type-b': 3 } },
      { label: "ゲームのセーブデータ", scores: { 'type-c': 3 } },
      { label: "ブックマークとメモ", scores: { 'type-d': 3 } },
      { label: "カメラロール（写真・動画）", scores: { 'type-e': 3 } },
      { label: "各種アプリの設定・データ", scores: { 'type-f': 3 } },
    ],
  },
];
