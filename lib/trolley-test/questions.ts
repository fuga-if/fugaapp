export type AxisType = "utilitarian" | "deontological";

export interface TrolleyQuestion {
  id: number;
  title: string;
  scenario: string;
  emoji: string;
  options: {
    label: string;
    axis: AxisType;
    summary: string; // 結果画面で「あなたは〜しました」的に使う
  }[];
}

export const questions: TrolleyQuestion[] = [
  {
    id: 1,
    title: "トロッコ問題",
    scenario:
      "暴走トロッコが5人の作業員に向かっている。レバーを引けば、別の線路にいる1人の方に切り替わる。",
    emoji: "🚂",
    options: [
      {
        label: "レバーを引く（1人を犠牲に5人を救う）",
        axis: "utilitarian",
        summary: "レバーを引いて5人を救った",
      },
      {
        label: "レバーを引かない（自分の手は汚さない）",
        axis: "deontological",
        summary: "レバーには触れなかった",
      },
    ],
  },
  {
    id: 2,
    title: "臓器移植問題",
    scenario:
      "5人の患者がそれぞれ別の臓器移植を必要としている。たまたま健康な1人の旅行者が病院に来た。",
    emoji: "🏥",
    options: [
      {
        label: "臓器を取って5人を救う",
        axis: "utilitarian",
        summary: "5人を救うために臓器提供を選んだ",
      },
      {
        label: "絶対に取らない",
        axis: "deontological",
        summary: "健康な人を犠牲にしなかった",
      },
    ],
  },
  {
    id: 3,
    title: "嘘の約束",
    scenario:
      "死にかけの親友に「あなたの猫の世話をする」と約束した。でも実はあなたは重度の猫アレルギー。",
    emoji: "🐱",
    options: [
      {
        label: "約束を守る（アレルギーでも猫の世話をする）",
        axis: "deontological",
        summary: "アレルギーでも約束を守った",
      },
      {
        label: "事情を説明して別の人に託す",
        axis: "utilitarian",
        summary: "合理的に別の人に猫を託した",
      },
    ],
  },
  {
    id: 4,
    title: "通報のジレンマ",
    scenario:
      "親友がコンビニで軽い万引きをするのを目撃してしまった。商品は500円のお菓子。",
    emoji: "🏪",
    options: [
      {
        label: "通報する（罪は罪）",
        axis: "deontological",
        summary: "親友でも通報を選んだ",
      },
      {
        label: "通報しない（親友との関係を守る）",
        axis: "utilitarian",
        summary: "親友を通報しなかった",
      },
    ],
  },
  {
    id: 5,
    title: "AIの判断",
    scenario:
      "自動運転車のAIを設計している。事故を避けられない場面で、乗客1人を犠牲にして歩行者5人を救う設計にする？",
    emoji: "🚗",
    options: [
      {
        label: "そう設計する（5人の命を優先）",
        axis: "utilitarian",
        summary: "多数を救うAI設計を選んだ",
      },
      {
        label: "しない（乗客の安全が最優先）",
        axis: "deontological",
        summary: "乗客の安全を最優先にした",
      },
    ],
  },
  {
    id: 6,
    title: "内部告発",
    scenario:
      "勤め先の会社で重大な不正を発見した。内部告発すると会社は潰れ、100人の同僚が失業する。",
    emoji: "🏢",
    options: [
      {
        label: "告発する（不正は不正）",
        axis: "deontological",
        summary: "正義のために内部告発した",
      },
      {
        label: "黙認する（100人の生活を守る）",
        axis: "utilitarian",
        summary: "100人の生活を守るため黙認した",
      },
    ],
  },
  {
    id: 7,
    title: "時間泥棒",
    scenario:
      "友人が毎回きっちり1時間遅刻する。もう10回連続。次の待ち合わせを1時間早い嘘の時間で伝える？",
    emoji: "⏰",
    options: [
      {
        label: "嘘の時間を伝える（結果的にちょうどいい）",
        axis: "utilitarian",
        summary: "嘘の時間を伝えて解決した",
      },
      {
        label: "正直に伝える（嘘はつかない）",
        axis: "deontological",
        summary: "正直な時間を伝え続けた",
      },
    ],
  },
  {
    id: 8,
    title: "幸福の薬",
    scenario:
      "飲めば一生幸福を感じ続けられる薬がある。ただし、現実を正しく認識できなくなる。副作用は他にない。",
    emoji: "💊",
    options: [
      {
        label: "飲む（幸福が一番大事）",
        axis: "utilitarian",
        summary: "幸福の薬を飲んだ",
      },
      {
        label: "飲まない（偽りの幸福はいらない）",
        axis: "deontological",
        summary: "偽りの幸福を拒否した",
      },
    ],
  },
  {
    id: 9,
    title: "未来人の選択",
    scenario:
      "確実な予知能力で判明した。今、10人を犠牲にすれば、100年後に1000人の命が救われる。",
    emoji: "🔮",
    options: [
      {
        label: "犠牲にする（1000人の命のために）",
        axis: "utilitarian",
        summary: "未来の1000人のために決断した",
      },
      {
        label: "犠牲にしない（今の命を奪う権利はない）",
        axis: "deontological",
        summary: "今の10人の命を守った",
      },
    ],
  },
  {
    id: 10,
    title: "最後の質問",
    scenario:
      "この診断の結果が「あなたは悪い人です」だったら、回答をやり直して変えたいと思う？",
    emoji: "🪞",
    options: [
      {
        label: "変える（結果が良い方がいい）",
        axis: "utilitarian",
        summary: "結果のために回答を変えると答えた",
      },
      {
        label: "変えない（自分の答えは自分の答え）",
        axis: "deontological",
        summary: "自分の回答を変えないと答えた",
      },
    ],
  },
];
