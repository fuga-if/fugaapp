import { KakuredoType } from './questions';

export interface Result {
  type: KakuredoType;
  title: string;
  subtitle: string;
  description: string;
  traits: string[];
  quote: string;
  emoji: string;
  color: string;
  image: string;
}

export const results: Record<KakuredoType, Result> = {
  'type-a': {
    type: 'type-a',
    title: "完全隠密オタク",
    subtitle: "墓まで持っていく覚悟",
    description: "あなたのオタク趣味は鉄壁のガード！SNSは鍵垢、グッズは厳重保管、職場では「趣味？映画鑑賞です」で通す完璧な隠密ぶり。その秘密主義、もはやプロの域。",
    traits: [
      "SNSのアイコンは絶対に無難なもの",
      "グッズは人目につかない場所に保管",
      "職場では「休日は家でゆっくり」がデフォ",
      "推し活の予定は「友達と会う」で統一",
      "スマホのロック画面は風景写真",
    ],
    quote: "「墓まで持っていく」",
    emoji: "🥷",
    color: "#8B4513",
    image: "/images/otaku-kakuredo/type-a.png",
  },
  'type-b': {
    type: 'type-b',
    title: "選択的開示オタク",
    subtitle: "理解ある人限定公開",
    description: "信頼できる人にだけオタク趣味を明かすあなた。「この人なら大丈夫」という嗅覚が鋭い。オタク友達との時間は至福だけど、それ以外ではしっかりガード。",
    traits: [
      "オタク友達と一般友達で態度が違う",
      "相手がオタクっぽいかまず観察する",
      "LINEのグループは用途別に分けてる",
      "「実は私も…」と打ち明けられると嬉しい",
      "来客時はさりげなくグッズを隠す",
    ],
    quote: "「理解ある人限定」",
    emoji: "🔐",
    color: "#D2691E",
    image: "/images/otaku-kakuredo/type-b.png",
  },
  'type-c': {
    type: 'type-c',
    title: "職場カモフラオタク",
    subtitle: "仕事とプライベートは別",
    description: "昼は真面目な社会人、夜は全力オタク。仕事場では完璧に隠してるけど、プライベートでは解放的。このオンオフの切り替えが実は一番健全かも？",
    traits: [
      "職場の人には絶対バレない自信がある",
      "有給の理由は「私用」で通す",
      "仕事用と趣味用でSNSアカウントを分離",
      "飲み会では趣味の話をかわすスキルが高い",
      "でもプライベートでは全開で語る",
    ],
    quote: "「仕事とプライベートは別」",
    emoji: "🎭",
    color: "#CD853F",
    image: "/images/otaku-kakuredo/type-c.png",
  },
  'type-d': {
    type: 'type-d',
    title: "じわじわ浸透オタク",
    subtitle: "気づいたら沼に引きずり込む",
    description: "隠してはいないけど、あえてアピールもしない。でも会話の端々にオタク要素がにじみ出てる。気づいたら周りの人が「ちょっと興味ある…」と言い出す、天然の布教師。",
    traits: [
      "「これ面白いよ」とさりげなく推す",
      "オタクバレしても「まあね」で済ませる",
      "会話にアニメや漫画の名言が混ざる",
      "周りの人が気づいたらオタクになってる",
      "布教成功率が意外と高い",
    ],
    quote: "「気づいたら沼に引きずり込む」",
    emoji: "🌊",
    color: "#DEB887",
    image: "/images/otaku-kakuredo/type-d.png",
  },
  'type-e': {
    type: 'type-e',
    title: "堂々オープンオタク",
    subtitle: "オタクで何が悪い",
    description: "隠す？なぜ？推しは誇り、オタクはアイデンティティ。グッズは見せる、推しは語る、イベントは堂々と参戦。その眩しいほどの堂々っぷりに、密かに憧れてる人もいるはず。",
    traits: [
      "SNSアイコンは当然推しキャラ",
      "デスクに推しグッズを飾ってる",
      "初対面でもオタクトーク全開",
      "推し活の予定は隠さず言う",
      "「オタクっぽい」は褒め言葉",
    ],
    quote: "「オタクで何が悪い」",
    emoji: "👑",
    color: "#FF8C00",
    image: "/images/otaku-kakuredo/type-e.png",
  },
  'type-f': {
    type: 'type-f',
    title: "自覚なしオタク",
    subtitle: "え、これオタクなの？",
    description: "自分では「普通に好き」だと思ってるけど、周りから見ると立派なオタク。グッズは買わないけど知識量がすごかったり、「にわか」と言いつつ全話見てたり。一番ピュアなオタクかも。",
    traits: [
      "「オタクっぽい」と言われると首を傾げる",
      "好きなものへの知識量が一般人のレベルを超えてる",
      "「みんなこれくらい好きでしょ？」が口癖",
      "グッズは買わないけど公式は全チェック",
      "隠してるわけじゃない、隠す必要を感じてない",
    ],
    quote: "「え、これオタクなの？」",
    emoji: "🤔",
    color: "#A0522D",
    image: "/images/otaku-kakuredo/type-f.png",
  },
};

export function getResultByScores(scores: Record<KakuredoType, number>): Result {
  let maxType: KakuredoType = 'type-a';
  let maxScore = 0;

  for (const [type, score] of Object.entries(scores)) {
    if (score > maxScore) {
      maxScore = score;
      maxType = type as KakuredoType;
    }
  }

  return results[maxType];
}

export function getTopTypes(scores: Record<KakuredoType, number>, count: number = 3): { type: KakuredoType; score: number }[] {
  return Object.entries(scores)
    .map(([type, score]) => ({ type: type as KakuredoType, score }))
    .sort((a, b) => b.score - a.score)
    .slice(0, count);
}
