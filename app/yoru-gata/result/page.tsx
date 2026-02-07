import { Suspense } from "react";
import { Metadata } from "next";
import { getResultByScores } from "@/lib/yoru-gata/results";
import { YoruGataType } from "@/lib/yoru-gata/questions";
import { YoruGataResultContent } from "./ResultContent";

interface Props { searchParams: Promise<{ [key: string]: string | undefined }>; }
const typeKeys: YoruGataType[] = ['anime-ikki', 'game-shuukai', 'sousaku-engine', 'sns-junkai', 'kousatsu-fukabori', 'kyomu-yofukashi'];

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const params = await searchParams;
  const scores: Record<YoruGataType, number> = { 'anime-ikki': 0, 'game-shuukai': 0, 'sousaku-engine': 0, 'sns-junkai': 0, 'kousatsu-fukabori': 0, 'kyomu-yofukashi': 0 };
  for (const t of typeKeys) { scores[t] = params[t] ? Number(params[t]) : 0; }
  const result = getResultByScores(scores);
  const ogUrl = `/api/og/yoru-gata?type=${encodeURIComponent(result.type)}&title=${encodeURIComponent(result.title)}`;
  return {
    title: `${result.title} | 夜型オタク診断`,
    description: result.description,
    openGraph: { title: `あなたは「${result.title}」タイプ！`, images: [ogUrl] },
    twitter: { card: "summary_large_image", title: `あなたは「${result.title}」タイプ！`, images: [ogUrl] },
  };
}

export default function ResultPage(): React.ReactElement {
  return <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="text-indigo-400">読み込み中...</div></div>}><YoruGataResultContent /></Suspense>;
}
