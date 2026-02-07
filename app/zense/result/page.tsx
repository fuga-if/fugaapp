import { Suspense } from "react";
import { Metadata } from "next";
import { getResultByScores } from "@/lib/zense/results";
import { ZenseType } from "@/lib/zense/questions";
import { ZenseResultContent } from "./ResultContent";

interface Props { searchParams: Promise<{ [key: string]: string | undefined }>; }
const typeKeys: ZenseType[] = ['type-a', 'type-b', 'type-c', 'type-d', 'type-e', 'type-f'];

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const params = await searchParams;
  const scores: Record<ZenseType, number> = { 'type-a': 0, 'type-b': 0, 'type-c': 0, 'type-d': 0, 'type-e': 0, 'type-f': 0 };
  for (const t of typeKeys) { scores[t] = params[t] ? Number(params[t]) : 0; }
  const result = getResultByScores(scores);
  const ogUrl = `/api/og/zense?type=${encodeURIComponent(result.type)}&title=${encodeURIComponent(result.title)}`;
  return {
    title: `${result.title} | 前世診断`,
    description: result.description,
    openGraph: {
      title: `私の前世は「${result.title}」でした！`,
      images: [{ url: ogUrl, width: 1200, height: 630, type: "image/png" }],
    },
    twitter: {
      card: "summary_large_image",
      title: `私の前世は「${result.title}」でした！`,
      images: [{ url: ogUrl, width: 1200, height: 630, type: "image/png" }],
    },
  };
}

export default function ResultPage(): React.ReactElement {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="text-amber-300 animate-pulse">✦ 魂の記憶を読み取っています... ✦</div></div>}>
      <ZenseResultContent />
    </Suspense>
  );
}
