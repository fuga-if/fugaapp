import type { FatigueType } from './questions';

export interface Result {
  type: FatigueType;
  name: string;
  title: string;
  description: string;
  traits: string[];
  advice: string;
  emoji: string;
  color: string;
  image: string;
}

export const results: Record<FatigueType, Result> = {
  A: {
    type: 'A',
    name: "比較疲れ型",
    title: "他人の芝生が青すぎる",
    description: "他人のキラキラ投稿を見て「自分だけ取り残されてる」と感じやすいタイプ。SNSの見せかけの幸せに振り回されがち。",
    traits: [
      "友達の充実した投稿を見ると落ち込む",
      "「自分だけ上手くいってない」と思いがち",
      "いい報告を見ると複雑な気持ちになる",
      "他人の成功が眩しすぎる",
      "加工や演出だとわかっていても比べてしまう",
    ],
    advice: "SNSは「ハイライト集」であって日常じゃない！見る時間を決めて、自分の小さな幸せに目を向けてみて🌸",
    emoji: "🪞",
    color: "#7E57C2",
    image: "/images/sns-fatigue/type-a.png",
  },
  B: {
    type: 'B',
    name: "承認欲求疲れ型",
    title: "いいねが気になって仕方ない",
    description: "投稿の反応が気になりすぎるタイプ。いいね数やフォロワー数で自己価値を測ってしまいがち。",
    traits: [
      "投稿後はいいね数を何度もチェック",
      "反応が少ないと「失敗した」と思う",
      "フォロワーが減ると心がざわつく",
      "「ウケる投稿」を意識しすぎる",
      "数字で自分の価値を測ってしまう",
    ],
    advice: "いいね数≠あなたの価値！数字を見ない日を作ってみて。リアルの反応を大切にしよう💕",
    emoji: "💭",
    color: "#EC407A",
    image: "/images/sns-fatigue/type-b.png",
  },
  C: {
    type: 'C',
    name: "FOMO疲れ型",
    title: "見逃したくない症候群",
    description: "「何か見逃してるかも」という不安でSNSを離れられないタイプ。常にチェックしないと落ち着かない。",
    traits: [
      "通知が来たらすぐ確認しないと不安",
      "トレンドに乗り遅れたくない",
      "スクロールが止まらない",
      "「あとで見よう」ができない",
      "スマホを置くと何か見逃してる気がする",
    ],
    advice: "大事な情報は何度も流れてくるから大丈夫！通知OFFの時間を作って、見逃す勇気を持とう🌈",
    emoji: "👀",
    color: "#26A69A",
    image: "/images/sns-fatigue/type-c.png",
  },
  D: {
    type: 'D',
    name: "情報過多疲れ型",
    title: "情報の洪水に溺れている",
    description: "ニュースや情報を追いすぎて脳がパンク状態。ネガティブな情報にも影響されやすい。",
    traits: [
      "タイムラインを延々とスクロール",
      "炎上や論争を最後まで見てしまう",
      "悲しいニュースで気分が沈む",
      "情報を取り入れすぎて疲弊",
      "「もっと知らなきゃ」と思ってしまう",
    ],
    advice: "情報は「食事」と同じ、取りすぎは毒！フォローを厳選して、ポジティブな情報だけ摂取しよう📚",
    emoji: "📰",
    color: "#FF7043",
    image: "/images/sns-fatigue/type-d.png",
  },
  E: {
    type: 'E',
    name: "人間関係疲れ型",
    title: "オンラインの付き合いに疲弊",
    description: "コメントやDMの返信、オンラインの人間関係に疲れているタイプ。既読スルーができない真面目さん。",
    traits: [
      "返信を考えるのがストレス",
      "既読・未読が気になる",
      "コメントにどう返すか悩む",
      "オンラインでも気を使いすぎる",
      "DMが溜まると憂鬱になる",
    ],
    advice: "返信は義務じゃない！「後で返す」「返さない」も選択肢。自分のペースを大切にして🍵",
    emoji: "💬",
    color: "#5C6BC0",
    image: "/images/sns-fatigue/type-e.png",
  },
  F: {
    type: 'F',
    name: "健全ユーザー型",
    title: "SNSマスター",
    description: "SNSとちょうどいい距離感を保てている理想的なタイプ。疲れたら自然に離れられる。",
    traits: [
      "見たいときだけ見る",
      "他人の投稿に振り回されない",
      "いいね数は気にしない",
      "デジタルデトックスができる",
      "SNSは楽しむためのツール",
    ],
    advice: "素晴らしい！その調子でSNSを楽しんで。周りの疲れてる人にコツを教えてあげて✨",
    emoji: "🌿",
    color: "#66BB6A",
    image: "/images/sns-fatigue/type-f.png",
  },
};

export function getResultByScores(scores: Record<FatigueType, number>): Result {
  const entries = Object.entries(scores) as [FatigueType, number][];
  const sorted = entries.sort((a, b) => b[1] - a[1]);
  const topType = sorted[0][0];
  return results[topType];
}

export function calculateScores(answers: FatigueType[][]): Record<FatigueType, number> {
  const scores: Record<FatigueType, number> = { A: 0, B: 0, C: 0, D: 0, E: 0, F: 0 };
  for (const types of answers) {
    for (const type of types) {
      scores[type]++;
    }
  }
  return scores;
}
