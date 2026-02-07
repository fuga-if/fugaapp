import { ResultType } from './questions';

export interface Result {
  type: ResultType;
  title: string;
  catchphrase: string;
  description: string;
  traits: string[];
  quote: string;
  color: string;
  image: string;
}

export const results: Record<ResultType, Result> = {
  tanto: {
    type: 'tanto',
    title: '担当',
    catchphrase: 'あなたは"担当"タイプ',
    description: '責任感を持って応援するあなたは、まさにプロデューサー気質。アイドルの成長に寄り添い、長期的な関係を大切にする。「この子を売り出す」という意識が強く、担当への愛は揺るがない。',
    traits: [
      '責任感を持って応援する',
      'プロデューサーとしての自覚がある',
      'アイドルの成長に寄り添う',
      '長期的な関係を重視する',
      '「この子を売り出す」意識が強い',
    ],
    quote: '「担当は降りない。降りたら負け」',
    color: '#6366F1',
    image: '/images/tanto-fan-oshi/tanto.png',
  },
  fan: {
    type: 'fan',
    title: 'ファン',
    catchphrase: 'あなたは"ファン"タイプ',
    description: '純粋に応援を楽しむあなたは、程よい距離感でコンテンツを楽しむタイプ。複数のアイドルを広く浅く応援し、気楽にオタクライフを満喫する。そのバランス感覚が最大の武器。',
    traits: [
      '純粋に応援を楽しむ',
      '程よい距離感を保てる',
      'コンテンツを消費者として楽しむ',
      '複数を広く浅く応援できる',
      '気楽に楽しみたい',
    ],
    quote: '「好きなものは好き、それでいい」',
    color: '#10B981',
    image: '/images/tanto-fan-oshi/fan.png',
  },
  oshi: {
    type: 'oshi',
    title: '推し',
    catchphrase: 'あなたは"推し"タイプ',
    description: '強い愛情と執着を持つあなたは、「この人が一番」という感覚が誰よりも強い。布教したい気持ちが溢れ、感情的なつながりを大切にする。推しの幸せが自分の幸せ。',
    traits: [
      '強い愛情・執着がある',
      '「この人が一番」という感覚',
      '布教したい気持ちが溢れる',
      '感情的つながりを重視する',
      '推しの幸せ＝自分の幸せ',
    ],
    quote: '「推しは推せる時に推せ」',
    color: '#EC4899',
    image: '/images/tanto-fan-oshi/oshi.png',
  },
};

// Priority for tie-breaking: tanto > oshi > fan
const typePriority: ResultType[] = ['tanto', 'oshi', 'fan'];

export function getResultByScores(scores: Record<ResultType, number>): Result {
  let maxType: ResultType = 'tanto';
  let maxScore = -1;

  for (const type of typePriority) {
    if (scores[type] > maxScore) {
      maxScore = scores[type];
      maxType = type;
    }
  }

  return results[maxType];
}

export function getTopTypes(scores: Record<ResultType, number>): { type: ResultType; score: number }[] {
  return Object.entries(scores)
    .map(([type, score]) => ({ type: type as ResultType, score }))
    .sort((a, b) => b.score - a.score);
}
