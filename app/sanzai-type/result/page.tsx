import { Suspense } from "react";
import { Metadata } from "next";
import { getResultByScores } from "@/lib/sanzai-type/results";
import { SanzaiType } from "@/lib/sanzai-type/questions";
import { SanzaiTypeResultContent } from "./ResultContent";

interface Props { searchParams: Promise<{ [key: string]: string | undefined }>; }
const typeKeys: SanzaiType[] = ['goods', 'ensei', 'gacha', 'doujin', 'superchat', 'collab'];

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const params = await searchParams;
  const scores: Record<SanzaiType, number> = { goods: 0, ensei: 0, gacha: 0, doujin: 0, superchat: 0, collab: 0 };
  for (const t of typeKeys) { scores[t] = params[t] ? Number(params[t]) : 0; }
  const result = getResultByScores(scores);
  const ogUrl = `/api/og/sanzai-type?type=${encodeURIComponent(result.type)}&title=${encodeURIComponent(result.title)}`;
  return {
    title: `${result.title} | オタク散財タイプ診断`,
    description: result.description,
    openGraph: { title: `あなたは「${result.title}」タイプ！`, images: [ogUrl] },
    twitter: { card: "summary_large_image", title: `あなたは「${result.title}」タイプ！`, images: [ogUrl] },
  };
}

export default function ResultPage(): React.ReactElement {
  return <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="text-yellow-400">読み込み中...</div></div>}><SanzaiTypeResultContent /></Suspense>;
}
