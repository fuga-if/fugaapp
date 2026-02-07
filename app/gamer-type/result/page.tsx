import { Suspense } from "react";
import { Metadata } from "next";
import { getResultByScores } from "@/lib/gamer-type/results";
import { GamerType } from "@/lib/gamer-type/questions";
import { GamerTypeResultContent } from "./ResultContent";

interface Props { searchParams: Promise<{ [key: string]: string | undefined }>; }
const typeKeys: GamerType[] = ['gachi', 'enjoy', 'story', 'collector', 'streamer', 'numa'];

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const params = await searchParams;
  const scores: Record<GamerType, number> = { gachi: 0, enjoy: 0, story: 0, collector: 0, streamer: 0, numa: 0 };
  for (const t of typeKeys) { scores[t] = params[t] ? Number(params[t]) : 0; }
  const result = getResultByScores(scores);
  const ogUrl = `/api/og/gamer-type?type=${encodeURIComponent(result.type)}&title=${encodeURIComponent(result.title)}`;
  return {
    title: `${result.title} | ゲーマータイプ診断`,
    description: result.description,
    openGraph: { title: `あなたは「${result.title}」タイプ！`, images: [ogUrl] },
    twitter: { card: "summary_large_image", title: `あなたは「${result.title}」タイプ！`, images: [ogUrl] },
  };
}

export default function ResultPage(): React.ReactElement {
  return <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="text-orange-400">読み込み中...</div></div>}><GamerTypeResultContent /></Suspense>;
}
