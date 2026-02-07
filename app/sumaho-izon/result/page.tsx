import { Suspense } from "react";
import { Metadata } from "next";
import { getResultByScores } from "@/lib/sumaho-izon/results";
import { SumahoIzonType } from "@/lib/sumaho-izon/questions";
import { SumahoIzonResultContent } from "./ResultContent";

interface Props { searchParams: Promise<{ [key: string]: string | undefined }>; }
const typeKeys: SumahoIzonType[] = ['type-a', 'type-b', 'type-c', 'type-d', 'type-e', 'type-f'];

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const params = await searchParams;
  const scores: Record<SumahoIzonType, number> = { 'type-a': 0, 'type-b': 0, 'type-c': 0, 'type-d': 0, 'type-e': 0, 'type-f': 0 };
  for (const t of typeKeys) { scores[t] = params[t] ? Number(params[t]) : 0; }
  const result = getResultByScores(scores);
  const ogUrl = `/api/og/sumaho-izon?type=${encodeURIComponent(result.type)}&title=${encodeURIComponent(result.title)}`;
  return {
    title: `${result.title} | スマホ依存タイプ診断`,
    description: result.description,
    openGraph: { title: `あなたは「${result.title}」！`, images: [ogUrl] },
    twitter: { card: "summary_large_image", title: `あなたは「${result.title}」！`, images: [ogUrl] },
  };
}

export default function ResultPage(): React.ReactElement {
  return <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="text-cyan-400">読み込み中...</div></div>}><SumahoIzonResultContent /></Suspense>;
}
