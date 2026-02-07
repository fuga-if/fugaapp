export type ResultType = 'tanto' | 'fan' | 'oshi';

export interface Question {
  id: number;
  text: string;
  options: {
    label: string;
    scores: Partial<Record<ResultType, number>>;
  }[];
}

export const questions: Question[] = [
  {
    id: 1,
    text: "アイドルを応援するとき、どんな気持ちが一番強い？",
    options: [
      { label: "この子を成長させたい、売り出したい", scores: { tanto: 3 } },
      { label: "パフォーマンスを楽しみたい", scores: { fan: 3 } },
      { label: "この子が好きで仕方ない", scores: { oshi: 3 } },
    ],
  },
  {
    id: 2,
    text: "他に気になるアイドルが現れたら？",
    options: [
      { label: "担当は担当。別枠で応援する", scores: { tanto: 3 } },
      { label: "いいなと思ったら普通に応援する", scores: { fan: 3 } },
      { label: "浮気できない…でも…", scores: { oshi: 3 } },
    ],
  },
  {
    id: 3,
    text: "推しが他のファンと仲良くしてたら？",
    options: [
      { label: "ファンが増えるのは良いこと", scores: { tanto: 3 } },
      { label: "特に何も思わない", scores: { fan: 3 } },
      { label: "ちょっとモヤッとする", scores: { oshi: 3 } },
    ],
  },
  {
    id: 4,
    text: "推しの供給が少ない時期、どうする？",
    options: [
      { label: "自分で布教活動や二次創作をする", scores: { tanto: 3 } },
      { label: "他のコンテンツも楽しみつつ待つ", scores: { fan: 3 } },
      { label: "過去の供給を掘り返して耐える", scores: { oshi: 3 } },
    ],
  },
  {
    id: 5,
    text: "推しについて語るとき、どんな言い方をしがち？",
    options: [
      { label: "「うちの子」「担当の〇〇」", scores: { tanto: 3 } },
      { label: "「〇〇好きなんだよね」", scores: { fan: 3 } },
      { label: "「推しがさぁ…（早口）」", scores: { oshi: 3 } },
    ],
  },
  {
    id: 6,
    text: "推しに求めるものは？",
    options: [
      { label: "成長、活躍", scores: { tanto: 3 } },
      { label: "良いパフォーマンス", scores: { fan: 3 } },
      { label: "存在してくれるだけでいい", scores: { oshi: 3 } },
    ],
  },
  {
    id: 7,
    text: "ぶっちゃけ、推しに対する感情は？",
    options: [
      { label: "保護者・マネージャー的な気持ち", scores: { tanto: 3 } },
      { label: "好きなアーティストへのリスペクト", scores: { fan: 3 } },
      { label: "もはや恋？愛？執着？", scores: { oshi: 3 } },
    ],
  },
];
