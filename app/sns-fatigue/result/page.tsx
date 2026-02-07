import { Suspense } from "react";
import { Metadata } from "next";
import { results } from "@/lib/sns-fatigue/results";
import type { FatigueType } from "@/lib/sns-fatigue/questions";
import { SnsResultContent } from "./ResultContent";

interface Props { searchParams: Promise<{ type?: string }>; }

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const params = await searchParams;
  const type = (params.type || 'A') as FatigueType;
  const result = results[type] || results.A;
  const ogUrl = `/api/og/sns-fatigue?type=${type}&name=${encodeURIComponent(result.name)}&title=${encodeURIComponent(result.title)}`;
  return {
    title: `${result.name} | SNS疲れタイプ診断`,
    description: result.description,
    openGraph: { title: `SNS疲れタイプ: ${result.name}`, images: [ogUrl] },
    twitter: { card: "summary_large_image", title: `SNS疲れタイプ: ${result.name}`, images: [ogUrl] },
  };
}

export default function ResultPage(): React.ReactElement {
  return <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="text-blue-500">読み込み中...</div></div>}><SnsResultContent /></Suspense>;
}
