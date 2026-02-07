import { SumahoIzonType } from './questions';

export interface Result {
  type: SumahoIzonType;
  title: string;
  subtitle: string;
  description: string;
  traits: string[];
  quote: string;
  emoji: string;
  color: string;
  image: string;
}

export const results: Record<SumahoIzonType, Result> = {
  'type-a': {
    type: 'type-a',
    title: "SNS無限スクロール型",
    subtitle: "あと1スクロールだけ…",
    description: "TLが終わらない。リールに吸い込まれる。気づいたら1時間経ってた。あなたのスマホ依存はSNSに全振り！いいねとリプが生きがいのソーシャルジャンキー。",
    traits: [
      "気づいたらTLを1時間見てる",
      "リールやショートに吸い込まれる",
      "いいねの数がちょっと気になる",
      "フォロワーの投稿は全チェック",
      "寝る前の「最後の1スクロール」が終わらない",
    ],
    quote: "「あと1スクロールだけ…」",
    emoji: "📱",
    color: "#00BFFF",
    image: "/images/sumaho-izon/type-a.png",
  },
  'type-b': {
    type: 'type-b',
    title: "通知パニック型",
    subtitle: "通知音は生命維持装置",
    description: "通知が来ないと不安。既読がつかないとソワソワ。バッジの数字は即ゼロにしたい完璧主義。あなたにとってスマホは「つながりの安心装置」。",
    traits: [
      "通知音が鳴ると即確認",
      "既読無視されると不安になる",
      "バッジの赤丸は即消したい",
      "返信していない人がいないか常にチェック",
      "サイレントモードにする勇気がない",
    ],
    quote: "「通知音は生命維持装置」",
    emoji: "🔔",
    color: "#FF4081",
    image: "/images/sumaho-izon/type-b.png",
  },
  'type-c': {
    type: 'type-c',
    title: "ゲーム常駐型",
    subtitle: "スマホ＝ゲーム機",
    description: "スタミナ管理、デイリー消化、イベント周回…あなたのスマホはほぼゲーム専用機！ログインボーナスのために朝起きる。それはもはやライフスタイル。",
    traits: [
      "ログインボーナスのために起きる",
      "スタミナが溢れるのが許せない",
      "イベント期間中は睡眠時間が減る",
      "自動周回を常に回してる",
      "ゲームのためにバッテリーを温存",
    ],
    quote: "「スマホ＝ゲーム機」",
    emoji: "🎮",
    color: "#76FF03",
    image: "/images/sumaho-izon/type-c.png",
  },
  'type-d': {
    type: 'type-d',
    title: "情報ジャンキー型",
    subtitle: "知らないことがあると落ち着かない",
    description: "ニュース、まとめサイト、Wikipedia沼…知的好奇心が止まらないあなた！1つ調べたら3つ気になる無限ループ。その知識量、もはや歩くGoogle。",
    traits: [
      "気になったことは即検索",
      "Wikipediaで気づいたら30分",
      "ニュースアプリを3つ以上入れてる",
      "まとめサイトの沼にハマりがち",
      "「ちょっと調べるだけ」が1時間になる",
    ],
    quote: "「知らないことがあると落ち着かない」",
    emoji: "🔍",
    color: "#448AFF",
    image: "/images/sumaho-izon/type-d.png",
  },
  'type-e': {
    type: 'type-e',
    title: "カメラ・記録型",
    subtitle: "撮らなきゃ存在しなかったことになる",
    description: "何でも撮る。食事、風景、推し、自撮り。カメラロールが人生のアーカイブ。撮らなかった日は「なかった日」。あなたにとってスマホは記録装置。",
    traits: [
      "食事前に写真を撮るのが儀式",
      "カメラロールが数万枚",
      "写真編集アプリを複数使い分け",
      "「映える」かどうかが行動基準",
      "ストレージ不足と常に戦ってる",
    ],
    quote: "「撮らなきゃ存在しなかったことになる」",
    emoji: "📸",
    color: "#FF6E40",
    image: "/images/sumaho-izon/type-e.png",
  },
  'type-f': {
    type: 'type-f',
    title: "意識高い依存型",
    subtitle: "アプリなしで生活できない",
    description: "タスク管理、家計簿、健康管理、スケジュール…全部アプリ。「依存じゃない、これは最適化」が口癖。スマホがないと生活が回らない。それって一番依存してるのでは…？",
    traits: [
      "タスク管理アプリで人生を管理",
      "家計簿アプリに毎日入力",
      "健康管理系アプリを3つ以上使用",
      "「生産性向上」のためにアプリを入れまくる",
      "スマホなしだとスケジュールがわからない",
    ],
    quote: "「依存じゃない、これは最適化」",
    emoji: "📊",
    color: "#00E5FF",
    image: "/images/sumaho-izon/type-f.png",
  },
};

export function getResultByScores(scores: Record<SumahoIzonType, number>): Result {
  let maxType: SumahoIzonType = 'type-a';
  let maxScore = 0;

  for (const [type, score] of Object.entries(scores)) {
    if (score > maxScore) {
      maxScore = score;
      maxType = type as SumahoIzonType;
    }
  }

  return results[maxType];
}

export function getTopTypes(scores: Record<SumahoIzonType, number>, count: number = 3): { type: SumahoIzonType; score: number }[] {
  return Object.entries(scores)
    .map(([type, score]) => ({ type: type as SumahoIzonType, score }))
    .sort((a, b) => b.score - a.score)
    .slice(0, count);
}
