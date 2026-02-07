import { Suspense } from "react";
import { Metadata } from "next";
import { getResultByScores } from "@/lib/inkya-youkya/results";
import { InkyaYoukyaType } from "@/lib/inkya-youkya/questions";
import { InkyaYoukyaResultContent } from "./ResultContent";

interface Props { searchParams: Promise<{ [key: string]: string | undefined }>; }
const typeKeys: InkyaYoukyaType[] = ['type-a', 'type-b', 'type-c', 'type-d', 'type-e', 'type-f'];

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const params = await searchParams;
  const scores: Record<InkyaYoukyaType, number> = { 'type-a': 0, 'type-b': 0, 'type-c': 0, 'type-d': 0, 'type-e': 0, 'type-f': 0 };
  for (const t of typeKeys) { scores[t] = params[t] ? Number(params[t]) : 0; }
  const result = getResultByScores(scores);
  const ogUrl = `/api/og/inkya-youkya?type=${encodeURIComponent(result.type)}&title=${encodeURIComponent(result.title)}`;
  return {
    title: `${result.title} | 陰キャ陽キャスペクトラム診断`,
    description: result.description,
    openGraph: {
      title: `私は「${result.title}」タイプでした！`,
      images: [{ url: ogUrl, width: 1200, height: 630, type: "image/png" }],
    },
    twitter: {
      card: "summary_large_image",
      title: `私は「${result.title}」タイプでした！`,
      images: [{ url: ogUrl, width: 1200, height: 630, type: "image/png" }],
    },
  };
}

export default function ResultPage(): React.ReactElement {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="text-purple-400">診断中...</div></div>}>
      <InkyaYoukyaResultContent />
    </Suspense>
  );
}
