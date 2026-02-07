import { Suspense } from "react";
import { Metadata } from "next";
import { getResultByScores } from "@/lib/gacha/results";
import { KakinType } from "@/lib/gacha/questions";
import { GachaResultContent } from "./ResultContent";

interface Props { searchParams: Promise<{ [key: string]: string | undefined }>; }
const typeKeys: KakinType[] = ['tenjou-kyouto', 'shoudou-kakin', 'bi-kakin', 'mu-kakin', 'gentei-killer', 'hai-kakin'];

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const params = await searchParams;
  const scores: Record<KakinType, number> = { 'tenjou-kyouto': 0, 'shoudou-kakin': 0, 'bi-kakin': 0, 'mu-kakin': 0, 'gentei-killer': 0, 'hai-kakin': 0 };
  for (const t of typeKeys) { scores[t] = params[t] ? Number(params[t]) : 0; }
  const result = getResultByScores(scores);
  const ogUrl = `/api/og/gacha?type=${encodeURIComponent(result.type)}&title=${encodeURIComponent(result.title)}`;
  return {
    title: `${result.title} | 課金スタイル診断`,
    description: result.description,
    openGraph: { title: `あなたは「${result.title}」タイプ！`, images: [ogUrl] },
    twitter: { card: "summary_large_image", title: `あなたは「${result.title}」タイプ！`, images: [ogUrl] },
  };
}

export default function ResultPage(): React.ReactElement {
  return <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="text-amber-400">読み込み中...</div></div>}><GachaResultContent /></Suspense>;
}
