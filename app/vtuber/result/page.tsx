import { Suspense } from "react";
import { Metadata } from "next";
import { getResultByScores } from "@/lib/vtuber/results";
import { OtakuType } from "@/lib/vtuber/questions";
import { VtuberResultContent } from "./ResultContent";

interface Props { searchParams: Promise<{ [key: string]: string | undefined }>; }
const typeKeys: OtakuType[] = ['gachi-koi', 'hako-oshi', 'archive', 'shokunin', 'teetee', 'kosan'];

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const params = await searchParams;
  const scores: Record<OtakuType, number> = { 'gachi-koi': 0, 'hako-oshi': 0, 'archive': 0, 'shokunin': 0, 'teetee': 0, 'kosan': 0 };
  for (const t of typeKeys) { scores[t] = params[t] ? Number(params[t]) : 0; }
  const result = getResultByScores(scores);
  const ogUrl = `/api/og/vtuber?type=${encodeURIComponent(result.type)}&title=${encodeURIComponent(result.title)}`;
  return {
    title: `${result.title} | Vtuberオタク診断`,
    description: result.description,
    openGraph: { title: `あなたは「${result.title}」タイプ！`, images: [ogUrl] },
    twitter: { card: "summary_large_image", title: `あなたは「${result.title}」タイプ！`, images: [ogUrl] },
  };
}

export default function ResultPage(): React.ReactElement {
  return <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="text-purple-300">読み込み中...</div></div>}><VtuberResultContent /></Suspense>;
}
