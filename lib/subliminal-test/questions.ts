export type AxisKey = "action" | "logic" | "nature" | "social";
export type FlashType =
  | "color-burst"
  | "shape-burst"
  | "number-swarm"
  | "landscape-silhouette"
  | "animal-silhouette"
  | "weather-image"
  | "abstract-pattern"
  | "light-shadow";

export interface Question {
  id: number;
  flash: FlashType;
  prompt: string;
  choices: string[];
  /** scores[axis][choiceIndex] = score value */
  scores: Record<AxisKey, number[]>;
}

export const questions: Question[] = [
  {
    id: 1,
    flash: "color-burst",
    prompt: "最初に目に入った色は？",
    choices: ["赤", "青", "緑", "黄"],
    scores: {
      action: [3, 0, 1, 2],
      logic: [0, 3, 2, 1],
      nature: [1, 2, 3, 0],
      social: [2, 1, 0, 3],
    },
  },
  {
    id: 2,
    flash: "shape-burst",
    prompt: "見えた形は？",
    choices: ["丸", "三角", "四角", "星"],
    scores: {
      action: [1, 3, 2, 0],
      logic: [2, 1, 3, 0],
      nature: [3, 0, 0, 2],
      social: [0, 2, 1, 3],
    },
  },
  {
    id: 3,
    flash: "number-swarm",
    prompt: "最初に見えた数字は？",
    choices: ["7", "4", "1", "9"],
    scores: {
      action: [2, 0, 3, 1],
      logic: [1, 3, 0, 2],
      nature: [0, 2, 1, 3],
      social: [3, 1, 2, 0],
    },
  },
  {
    id: 4,
    flash: "landscape-silhouette",
    prompt: "どれに見えた？",
    choices: ["山", "海", "森", "街"],
    scores: {
      action: [3, 1, 0, 2],
      logic: [1, 0, 2, 3],
      nature: [2, 3, 3, 0],
      social: [0, 2, 1, 3],
    },
  },
  {
    id: 5,
    flash: "animal-silhouette",
    prompt: "どれに見えた？",
    choices: ["猫", "鳥", "魚", "蝶"],
    scores: {
      action: [2, 3, 0, 1],
      logic: [3, 1, 2, 0],
      nature: [0, 2, 3, 1],
      social: [1, 0, 1, 3],
    },
  },
  {
    id: 6,
    flash: "weather-image",
    prompt: "最初の印象は？",
    choices: ["晴れ", "雨", "雷", "雪"],
    scores: {
      action: [2, 0, 3, 1],
      logic: [1, 2, 0, 3],
      nature: [3, 3, 0, 1],
      social: [0, 1, 2, 2],
    },
  },
  {
    id: 7,
    flash: "abstract-pattern",
    prompt: "何に見えた？",
    choices: ["波", "渦", "直線", "点"],
    scores: {
      action: [1, 3, 2, 0],
      logic: [0, 1, 3, 2],
      nature: [3, 2, 0, 1],
      social: [2, 0, 1, 3],
    },
  },
  {
    id: 8,
    flash: "light-shadow",
    prompt: "最初に感じたのは？",
    choices: ["明るい方", "暗い方", "両方", "どちらでもない"],
    scores: {
      action: [3, 1, 2, 0],
      logic: [1, 2, 0, 3],
      nature: [2, 0, 3, 1],
      social: [0, 3, 1, 2],
    },
  },
];
