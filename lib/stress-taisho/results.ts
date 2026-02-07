import { StressTaishoType } from './questions';

export interface Result {
  type: StressTaishoType;
  title: string;
  subtitle: string;
  description: string;
  traits: string[];
  quote: string;
  emoji: string;
  color: string;
  image: string;
}

export const results: Record<StressTaishoType, Result> = {
  'type-a': {
    type: 'type-a',
    title: "全力発散型",
    subtitle: "「体を動かせば、だいたい解決する」",
    description: "ストレスを感じたら体を動かして発散するタイプ。運動、カラオケ、掃除など、エネルギーをぶつけることでスッキリする。溜め込むより出す派。",
    traits: [
      "ストレスが溜まると筋トレしたくなる",
      "カラオケで絶叫すると復活する",
      "じっとしてるのが一番つらい",
      "「走ってくる」が口癖",
      "汗をかくと気分がリセットされる",
    ],
    quote: "「考えるな、動け！」",
    emoji: "💪",
    color: "#EF4444",
    image: "/images/stress-taisho/type-a.png",
  },
  'type-b': {
    type: 'type-b',
    title: "没頭リセット型",
    subtitle: "「好きなことに集中したら、悩み忘れてた」",
    description: "趣味や好きなことに没頭して、ストレスの存在ごと忘れるタイプ。ゲーム、読書、創作活動など、集中状態に入ることで心がリセットされる。",
    traits: [
      "推し活がメンタルケア",
      "気づいたら3時間ゲームしてた",
      "没頭してる間は悩みが消える",
      "「現実逃避」と言われるけど効果的",
      "趣味がないとメンタル崩壊する",
    ],
    quote: "「推しは最強のメンタルケア」",
    emoji: "🎮",
    color: "#8B5CF6",
    image: "/images/stress-taisho/type-b.png",
  },
  'type-c': {
    type: 'type-c',
    title: "おしゃべり浄化型",
    subtitle: "「話すだけで、もう半分解決してる」",
    description: "人に話を聞いてもらうことでストレスを浄化するタイプ。愚痴でもいいし、ただの報告でもいい。言語化することで気持ちが整理される。",
    traits: [
      "「ちょっと聞いて」が口癖",
      "話し終わると「あ、スッキリした」",
      "LINEの長文を送りがち",
      "一人で抱え込むと爆発する",
      "聞いてもらえればアドバイスは不要",
    ],
    quote: "「聞いてくれるだけでいいの」",
    emoji: "💬",
    color: "#F59E0B",
    image: "/images/stress-taisho/type-c.png",
  },
  'type-d': {
    type: 'type-d',
    title: "分析解決型",
    subtitle: "「原因がわかれば、もう怖くない」",
    description: "ストレスの原因を論理的に分析して、解決策を見つけることで安心するタイプ。「なぜ辛いのか」を理解できれば対処できる。問題解決志向。",
    traits: [
      "ストレスの原因をリスト化する",
      "「これは何が問題なのか」と分析から入る",
      "解決策が見つかると安心する",
      "感情より事実を重視",
      "セルフヘルプ本が好き",
    ],
    quote: "「原因がわかれば、あとは対策するだけ」",
    emoji: "🔍",
    color: "#2563EB",
    image: "/images/stress-taisho/type-d.png",
  },
  'type-e': {
    type: 'type-e',
    title: "自然回復型",
    subtitle: "「寝たら治る。時間が解決する。」",
    description: "無理にストレスと戦わず、時間の経過と休息で自然に回復するタイプ。寝る、ぼーっとする、散歩する。体と心が勝手に治してくれるのを信じている。",
    traits: [
      "「寝たら忘れる」が本当",
      "何もしない時間が大事",
      "お風呂と睡眠が最強の薬",
      "焦って解決しようとしない",
      "自然や静かな場所で回復する",
    ],
    quote: "「明日になったら、きっと大丈夫」",
    emoji: "🌿",
    color: "#059669",
    image: "/images/stress-taisho/type-e.png",
  },
  'type-f': {
    type: 'type-f',
    title: "自分ご褒美型",
    subtitle: "「頑張った自分には、ご褒美が必要」",
    description: "ストレスを感じたら自分を甘やかすことで回復するタイプ。美味しいもの、ショッピング、エステなど、「自分へのご褒美」がエネルギー源。",
    traits: [
      "「今日は頑張ったから」が万能理由",
      "コンビニスイーツで回復する",
      "ストレス買いの常習犯",
      "自分を甘やかすのが上手",
      "「ご褒美なしで頑張れない」と開き直ってる",
    ],
    quote: "「自分を大事にするのは、サボりじゃない」",
    emoji: "🎁",
    color: "#EC4899",
    image: "/images/stress-taisho/type-f.png",
  },
};

export function getResultByScores(scores: Record<StressTaishoType, number>): Result {
  let maxType: StressTaishoType = 'type-a';
  let maxScore = 0;

  for (const [type, score] of Object.entries(scores)) {
    if (score > maxScore) {
      maxScore = score;
      maxType = type as StressTaishoType;
    }
  }

  return results[maxType];
}

export function getTopTypes(scores: Record<StressTaishoType, number>, count: number = 3): { type: StressTaishoType; score: number }[] {
  return Object.entries(scores)
    .map(([type, score]) => ({ type: type as StressTaishoType, score }))
    .sort((a, b) => b.score - a.score)
    .slice(0, count);
}
