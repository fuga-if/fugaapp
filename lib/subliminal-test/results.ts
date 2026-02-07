import { AxisKey } from "./questions";

export type ResultType =
  | "leader"
  | "analyst"
  | "nature"
  | "healer"
  | "balance"
  | "chaos"
  | "awakened"
  | "void";

export interface SubliminalResult {
  type: ResultType;
  title: string;
  subtitle: string;
  emoji: string;
  description: string;
  traits: string[];
  color: string;
  isRare: boolean;
  rarity?: string;
}

export const results: Record<ResultType, SubliminalResult> = {
  leader: {
    type: "leader",
    title: "直感型リーダー",
    subtitle: "行動力の塊。考える前に体が動く",
    emoji: "🔥",
    description:
      "あなたの潜在意識は「行動」に支配されている。目に飛び込んでくるのは常に力強いもの。赤やとがった形に反応するのは、あなたの魂が動くことを求めているから。迷うくらいなら走り出す。それがあなたの本能。",
    traits: [
      "決断が早い（早すぎることも）",
      "直感で「正解」を引く力がある",
      "退屈が最大の敵",
      "リスクを恐れない",
      "周りを巻き込む熱量がある",
    ],
    color: "#EF4444",
    isRare: false,
  },
  analyst: {
    type: "analyst",
    title: "冷静な分析者",
    subtitle: "理性で動く。感情に流されない知性",
    emoji: "🧊",
    description:
      "あなたの潜在意識は「論理」が支配している。フラッシュの中から規則性を見出し、秩序あるものに目が行く。青や四角形に反応するのは、あなたの脳が無意識に構造を求めているから。感覚よりデータを信じる。",
    traits: [
      "感情より論理で判断する",
      "パターン認識力が高い",
      "「なぜ？」が口癖",
      "計画を立てるのが好き",
      "冷静すぎて誤解されることも",
    ],
    color: "#3B82F6",
    isRare: false,
  },
  nature: {
    type: "nature",
    title: "自然回帰型",
    subtitle: "直感と感性。自然体が一番強い",
    emoji: "🌿",
    description:
      "あなたの潜在意識は「自然」と深く繋がっている。有機的な形、柔らかな色に無意識に惹かれる。緑や丸い形に反応するのは、あなたの魂が自然のリズムに同調しているから。考えるより感じる。それが本来のあなた。",
    traits: [
      "五感が鋭い",
      "自然の中にいると回復する",
      "直感がよく当たる",
      "争いを好まない",
      "芸術的センスがある",
    ],
    color: "#22C55E",
    isRare: false,
  },
  healer: {
    type: "healer",
    title: "共感型ヒーラー",
    subtitle: "人との繋がりが全て。心で世界を感じる",
    emoji: "💫",
    description:
      "あなたの潜在意識は「人との繋がり」を求めている。温かみのある色や、柔らかなシンボルに無意識に反応する。黄色や星に目が行くのは、あなたの魂が「誰かと一緒にいたい」と叫んでいるから。共感力は才能。",
    traits: [
      "人の感情に敏感",
      "話を聞くのが得意",
      "「ありがとう」が原動力",
      "一人だと不安になる",
      "場の空気を読む天才",
    ],
    color: "#A855F7",
    isRare: false,
  },
  balance: {
    type: "balance",
    title: "バランス型",
    subtitle: "偏りなし。器用貧乏？いや、器用万能",
    emoji: "⚖️",
    description:
      "あなたの潜在意識は特定の方向に偏っていない。全ての要素をバランスよく受け取っている。これは「何も見えていない」のではなく「全部見えている」ということ。適応力が異常に高い。どんな環境でも生きていける。",
    traits: [
      "適応力が高い",
      "どの集団にも馴染める",
      "器用に何でもこなす",
      "自分の「コレ！」が見つかりにくい",
      "周りからの評価が安定している",
    ],
    color: "#6B7280",
    isRare: false,
  },
  chaos: {
    type: "chaos",
    title: "カオス型",
    subtitle: "予測不能。ルールなんて知らない",
    emoji: "🌀",
    description:
      "あなたの潜在意識はパターンを拒否している。フラッシュに対する反応がランダムなのは、あなたの脳が「型にはまること」を本能的に嫌っているから。退屈な毎日より、何が起きるかわからない明日が好き。",
    traits: [
      "飽き性だが好奇心旺盛",
      "同じことの繰り返しが苦手",
      "思いがけない発想ができる",
      "ルールや制約が嫌い",
      "「普通」に収まらない",
    ],
    color: "#F97316",
    isRare: false,
  },
  awakened: {
    type: "awakened",
    title: "覚醒者",
    subtitle: "選ばれし者。全ての選択が一致した",
    emoji: "👁️",
    description:
      "全問で最初の選択肢を選んだ。確率にして1/65536。偶然では説明がつかない。あなたの潜在意識は完全に覚醒している。迷いなく、最初に目に入ったものを選び続けた。それは「見えている」ということ。覚醒者の称号を授けよう。",
    traits: [
      "直感が100%正確",
      "迷いがない",
      "最初の印象が全て正解",
      "周りから「運が強い」と言われる",
      "考えるより先に答えが出る",
    ],
    color: "#EAB308",
    isRare: true,
    rarity: "出現率: 0.0015%（1/65536）",
  },
  void: {
    type: "void",
    title: "虚無の使者",
    subtitle: "考えるのをやめた。全ての回答が500ms以内",
    emoji: "🕳️",
    description:
      "全問500ms以内に回答した。通常の人間には不可能な速度。あなたは「考えること」を完全に放棄し、純粋な反射だけで答えた。思考という名の重力から解放された存在。虚無の使者。何も考えないことが、最強の直感。",
    traits: [
      "反射神経が異常に速い",
      "考えるのが面倒",
      "直感というより反射",
      "何事にも動じない",
      "無の境地に近い",
    ],
    color: "#1F2937",
    isRare: true,
    rarity: "条件: 全問500ms以内に回答",
  },
};

export interface AnswerData {
  choiceIndex: number;
  responseTimeMs: number;
}

export function getResultByAnswers(
  answers: AnswerData[]
): { result: SubliminalResult; axisScores: Record<AxisKey, number> } {
  // Import questions inline to avoid circular
  const { questions } = require("./questions");

  // Check rare: awakened (all first choice)
  const allFirst = answers.length === 8 && answers.every((a) => a.choiceIndex === 0);
  if (allFirst) {
    return {
      result: results.awakened,
      axisScores: { action: 0, logic: 0, nature: 0, social: 0 },
    };
  }

  // Check rare: void (all under 500ms)
  const allFast =
    answers.length === 8 && answers.every((a) => a.responseTimeMs <= 500);
  if (allFast) {
    return {
      result: results.void,
      axisScores: { action: 0, logic: 0, nature: 0, social: 0 },
    };
  }

  // Calculate axis scores
  const axisScores: Record<AxisKey, number> = {
    action: 0,
    logic: 0,
    nature: 0,
    social: 0,
  };

  for (let i = 0; i < answers.length; i++) {
    const q = questions[i];
    const ci = answers[i].choiceIndex;
    for (const axis of ["action", "logic", "nature", "social"] as AxisKey[]) {
      axisScores[axis] += q.scores[axis][ci] || 0;
    }
  }

  // Find dominant axis
  const axes = Object.entries(axisScores).sort((a, b) => b[1] - a[1]);
  const top = axes[0];
  const second = axes[1];

  // Check for balance (top - bottom <= 3)
  const bottom = axes[axes.length - 1];
  if (top[1] - bottom[1] <= 3) {
    return { result: results.balance, axisScores };
  }

  // Check for chaos (no clear pattern: top == second)
  if (top[1] === second[1]) {
    // Check if third is also the same
    const third = axes[2];
    if (third[1] === top[1]) {
      return { result: results.chaos, axisScores };
    }
  }

  // Map to result type
  const axisToResult: Record<AxisKey, ResultType> = {
    action: "leader",
    logic: "analyst",
    nature: "nature",
    social: "healer",
  };

  return {
    result: results[axisToResult[top[0] as AxisKey]],
    axisScores,
  };
}
