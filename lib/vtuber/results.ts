import { OtakuType } from './questions';

export interface Result {
  type: OtakuType;
  title: string;
  subtitle: string;
  description: string;
  traits: string[];
  quote: string;
  emoji: string;
  color: string;
  image: string;
}

export const results: Record<OtakuType, Result> = {
  'gachi-koi': {
    type: 'gachi-koi',
    title: "ガチ恋勢",
    subtitle: "推しが人生",
    description: "あなたは一人の推しに全力で愛を注ぐタイプ！配信は可能な限りリアタイ、グッズも推しのものは全回収。その一途さ、きっと届いてるよ。",
    traits: [
      "配信開始通知きたら即スタンバイ",
      "推しの配信がない日はちょっと物足りない",
      "スパチャ読まれた瞬間が人生のハイライト",
      "他のVも見るけど、やっぱり推しが一番",
      "推しの声で目覚まし設定してる",
    ],
    quote: "「推しが人生」",
    emoji: "❤️",
    color: "#E91E63",
    image: "/images/vtuber/gachi-koi.png",
  },
  'hako-oshi': {
    type: 'hako-oshi',
    title: "箱推しリスナー",
    subtitle: "みんな尊い",
    description: "事務所やグループ全体を愛するあなた！コラボ配信は最高のご褒美、メンバー同士の絡みに生かされてる。その広い愛、素敵です。",
    traits: [
      "大型コラボは絶対リアタイ",
      "推しメンが複数いて選べない",
      "事務所のイベントは現地参戦したい",
      "誰がコラボしても嬉しい",
      "新人デビューはお祭り気分",
    ],
    quote: "「みんな尊い」",
    emoji: "🌈",
    color: "#9C27B0",
    image: "/images/vtuber/hako-oshi.png",
  },
  'archive': {
    type: 'archive',
    title: "アーカイブ勢",
    subtitle: "切り抜きから入った",
    description: "自分のペースで楽しむあなた！リアタイにこだわらず、切り抜きやアーカイブをじっくり味わうスタイル。マイペースな推し活、いいよね。",
    traits: [
      "切り抜き動画から推しを知った",
      "深夜にアーカイブ一気見しがち",
      "2倍速再生も駆使する",
      "「面白いとこだけ教えて」って聞く",
      "まとめ動画は神コンテンツ",
    ],
    quote: "「切り抜きから入った」",
    emoji: "☕",
    color: "#607D8B",
    image: "/images/vtuber/archive-zei.png",
  },
  'shokunin': {
    type: 'shokunin',
    title: "配信職人鑑賞勢",
    subtitle: "エンタメとして見てる",
    description: "トーク力、企画力、編集技術...エンタメとしてVtuberを評価する目を持つあなた！その分析力、実はクリエイター向きかも？",
    traits: [
      "企画の完成度を気にしてしまう",
      "編集うまい人は尊敬する",
      "コメント欄の空気読む力がすごい",
      "「この人伸びるな」がわりと当たる",
      "配信のここがよかったってレポ書きがち",
    ],
    quote: "「エンタメとして見てる」",
    emoji: "⭐",
    color: "#2196F3",
    image: "/images/vtuber/haishin-shokunin.png",
  },
  'teetee': {
    type: 'teetee',
    title: "てぇてぇ民",
    subtitle: "尊すぎて無理",
    description: "関係性厨のあなた！コンビやグループの絡みに生かされ、てぇてぇシーンでは感情が爆発。その尊みを感じる力、誰にも負けないね。",
    traits: [
      "コラボの告知だけでテンション上がる",
      "てぇてぇシーンはスクショ必須",
      "「この二人の関係性が...」って語りがち",
      "カップリング名つけたくなる",
      "仲良し配信は何度も見返す",
    ],
    quote: "「尊すぎて無理」",
    emoji: "💕",
    color: "#FF4081",
    image: "/images/vtuber/teetee-min.png",
  },
  'kosan': {
    type: 'kosan',
    title: "古参・発掘勢",
    subtitle: "伸びる前から知ってた",
    description: "新人発掘が趣味のあなた！登録者が少ない頃から応援して、成長を見守るのが喜び。その目利き力、すごいよ。",
    traits: [
      "登録者3桁のVを見つけるのが得意",
      "「この子絶対伸びる」が口癖",
      "古参アピールはしないけど内心誇らしい",
      "推しの初配信から見てる",
      "新人Vのデビュー配信は必ずチェック",
    ],
    quote: "「伸びる前から知ってた」",
    emoji: "🔍",
    color: "#4CAF50",
    image: "/images/vtuber/kosan-hakkutsu.png",
  },
};

export function getResultByScores(scores: Record<OtakuType, number>): Result {
  let maxType: OtakuType = 'gachi-koi';
  let maxScore = 0;

  for (const [type, score] of Object.entries(scores)) {
    if (score > maxScore) {
      maxScore = score;
      maxType = type as OtakuType;
    }
  }

  return results[maxType];
}

export function getTopTypes(scores: Record<OtakuType, number>, count: number = 3): { type: OtakuType; score: number }[] {
  return Object.entries(scores)
    .map(([type, score]) => ({ type: type as OtakuType, score }))
    .sort((a, b) => b.score - a.score)
    .slice(0, count);
}
