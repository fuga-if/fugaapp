import { CommuStyleType } from './questions';

export interface Result {
  type: CommuStyleType;
  title: string;
  subtitle: string;
  description: string;
  traits: string[];
  quote: string;
  emoji: string;
  color: string;
  image: string;
}

export const results: Record<CommuStyleType, Result> = {
  'type-a': {
    type: 'type-a',
    title: "共感マスター",
    subtitle: "「あなたの気持ち、ちゃんと伝わってるよ」",
    description: "相手の感情を受け止めて、安心感を与えるコミュニケーションが得意。悩み相談のプロで、「この人に話すと楽になる」と言われがち。聞くだけじゃなく、共感の言葉を自然に出せる。",
    traits: [
      "「わかる〜」のバリエーションが豊富",
      "相手が言いたいことを先に言語化できる",
      "泣いてる人のそばにいるのが苦じゃない",
      "「聞いて」って言われる頻度が高い",
      "自分の感情を後回しにしがち",
    ],
    quote: "「話してくれてありがとう」",
    emoji: "💛",
    color: "#F59E0B",
    image: "/images/commu-style/type-a.png",
  },
  'type-b': {
    type: 'type-b',
    title: "ムードメーカー",
    subtitle: "「場の空気は私が作る」",
    description: "明るい話術と絶妙なタイミングで場を盛り上げる天才。沈黙が苦手で、つい何か話題を振っちゃう。笑いを取るのも得意で、初対面でも場を和ませられる。",
    traits: [
      "沈黙は3秒で耐えられない",
      "ツッコミのタイミングが天才的",
      "「面白いよね」ってよく言われる",
      "大人数の会話を回すのが得意",
      "深い話は実はちょっと苦手",
    ],
    quote: "「笑ってる時間が一番いい時間」",
    emoji: "🎉",
    color: "#EF4444",
    image: "/images/commu-style/type-b.png",
  },
  'type-c': {
    type: 'type-c',
    title: "的確アドバイザー",
    subtitle: "「結論から言うとね」",
    description: "論理的で簡潔なコミュニケーションが持ち味。要点を的確に伝えられて、アドバイスが具体的。ビジネスシーンでは頼りにされるけど、「冷たい」と誤解されることも。",
    traits: [
      "話は結論から言う",
      "LINEは短文＆スタンプ少なめ",
      "「で、どうしたいの？」って聞きがち",
      "問題解決能力が高い",
      "雑談より目的のある会話が好き",
    ],
    quote: "「結論ファーストでいこう」",
    emoji: "🎯",
    color: "#2563EB",
    image: "/images/commu-style/type-c.png",
  },
  'type-d': {
    type: 'type-d',
    title: "気配り調整役",
    subtitle: "「みんなが心地よくいられるように」",
    description: "場の空気を読んで、全員が居心地よく過ごせるよう調整するタイプ。誰が発言できてないか、誰が不満そうかを察知して、さりげなくフォローする。縁の下の力持ち。",
    traits: [
      "会話に入れてない人に話を振る",
      "「〇〇さんはどう思う？」が自然に出る",
      "板挟みになりがち",
      "自分の意見より全体のバランスを優先",
      "幹事や司会を頼まれやすい",
    ],
    quote: "「全員が楽しいのが一番いい」",
    emoji: "🌸",
    color: "#EC4899",
    image: "/images/commu-style/type-d.png",
  },
  'type-e': {
    type: 'type-e',
    title: "独自路線クリエイター",
    subtitle: "「普通の会話じゃつまらない」",
    description: "予想外の角度から話題を投げてくる独創的なコミュニケーター。雑学や豆知識が豊富で、「それ知らなかった！」と言わせるのが快感。普通の雑談を面白い方向に転がす力がある。",
    traits: [
      "話の展開が読めないと言われる",
      "「それで思い出したんだけど」が口癖",
      "雑学・豆知識のストックがすごい",
      "一対一の深い会話が好き",
      "大人数だと浮くことがある",
    ],
    quote: "「その話、実はこんな裏があってね」",
    emoji: "🌀",
    color: "#8B5CF6",
    image: "/images/commu-style/type-e.png",
  },
  'type-f': {
    type: 'type-f',
    title: "静かな信頼構築型",
    subtitle: "「言葉は少ないけど、ちゃんと見てるよ」",
    description: "口数は多くないけど、一言一言に重みがある。長い付き合いの中でじっくり信頼関係を築くタイプ。派手さはないけど、「この人は本物」と思わせる深い繋がりを作れる。",
    traits: [
      "LINEの返信は遅いけど丁寧",
      "大事なことだけ言う",
      "表面的な付き合いが苦手",
      "「実は一番頼りになる」と評される",
      "長い沈黙も苦にならない",
    ],
    quote: "「言葉より、行動で示す」",
    emoji: "🪨",
    color: "#475569",
    image: "/images/commu-style/type-f.png",
  },
};

export function getResultByScores(scores: Record<CommuStyleType, number>): Result {
  let maxType: CommuStyleType = 'type-a';
  let maxScore = 0;

  for (const [type, score] of Object.entries(scores)) {
    if (score > maxScore) {
      maxScore = score;
      maxType = type as CommuStyleType;
    }
  }

  return results[maxType];
}

export function getTopTypes(scores: Record<CommuStyleType, number>, count: number = 3): { type: CommuStyleType; score: number }[] {
  return Object.entries(scores)
    .map(([type, score]) => ({ type: type as CommuStyleType, score }))
    .sort((a, b) => b.score - a.score)
    .slice(0, count);
}
