export type HspType = 'type-a' | 'type-b' | 'type-c' | 'type-d' | 'type-e';

export interface Question {
  id: number;
  text: string;
  options: {
    label: string;
    score: number;
  }[];
}

export const questions: Question[] = [
  {
    id: 1,
    text: "大きな音（工事の音、大音量の音楽など）を聞くと…",
    options: [
      { label: "とても不快で、その場を離れたくなる", score: 3 },
      { label: "気になるけど、我慢できる", score: 2 },
      { label: "少し気になる程度", score: 1 },
      { label: "特に気にならない", score: 0 },
    ],
  },
  {
    id: 2,
    text: "人混みの中にいると…",
    options: [
      { label: "すぐに疲れて、逃げ出したくなる", score: 3 },
      { label: "しばらくすると疲れてくる", score: 2 },
      { label: "少し疲れるかな、という程度", score: 1 },
      { label: "特に疲れない", score: 0 },
    ],
  },
  {
    id: 3,
    text: "映画やドラマを観て泣くことは…",
    options: [
      { label: "よくある（感情移入しすぎる）", score: 3 },
      { label: "たまにある", score: 2 },
      { label: "あまりない", score: 1 },
      { label: "ほとんどない", score: 0 },
    ],
  },
  {
    id: 4,
    text: "他人の機嫌が悪いと…",
    options: [
      { label: "自分のせいかと思ってしまう", score: 3 },
      { label: "気になってしまう", score: 2 },
      { label: "少し気になる", score: 1 },
      { label: "特に気にならない", score: 0 },
    ],
  },
  {
    id: 5,
    text: "締め切りや予定が詰まっていると…",
    options: [
      { label: "パニックになりやすい", score: 3 },
      { label: "焦ってミスが増える", score: 2 },
      { label: "少しプレッシャーを感じる", score: 1 },
      { label: "むしろ燃える", score: 0 },
    ],
  },
  {
    id: 6,
    text: "美しい景色や芸術作品を見ると…",
    options: [
      { label: "深く感動して動けなくなることがある", score: 3 },
      { label: "強く心を動かされる", score: 2 },
      { label: "いいなと思う", score: 1 },
      { label: "特に何も感じない", score: 0 },
    ],
  },
  {
    id: 7,
    text: "一人の時間について…",
    options: [
      { label: "絶対に必要。ないと壊れる", score: 3 },
      { label: "かなり必要", score: 2 },
      { label: "あると嬉しい", score: 1 },
      { label: "なくても平気", score: 0 },
    ],
  },
  {
    id: 8,
    text: "カフェインやアルコールの影響は…",
    options: [
      { label: "すごく敏感に反応する", score: 3 },
      { label: "結構影響を受ける", score: 2 },
      { label: "普通に影響を受ける", score: 1 },
      { label: "あまり影響を感じない", score: 0 },
    ],
  },
  {
    id: 9,
    text: "服のタグや素材の肌触りは…",
    options: [
      { label: "とても気になる、不快だと着られない", score: 3 },
      { label: "気になることが多い", score: 2 },
      { label: "たまに気になる", score: 1 },
      { label: "全く気にならない", score: 0 },
    ],
  },
  {
    id: 10,
    text: "暴力的な映像やニュースは…",
    options: [
      { label: "見られない、見ると引きずる", score: 3 },
      { label: "苦手で避けることが多い", score: 2 },
      { label: "少し嫌だなと思う", score: 1 },
      { label: "平気で見られる", score: 0 },
    ],
  },
];
