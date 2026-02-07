import { Suspense } from "react";
import { Metadata } from "next";
import { getResultByScore } from "@/lib/commu-ryoku/results";
import { CommuResultContent } from "./ResultContent";

interface Props { searchParams: Promise<{ [key: string]: string | undefined }>; }

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const params = await searchParams;
  const score = params.score ? Number(params.score) : 0;
  const result = getResultByScore(score);
  const ogUrl = `/api/og/commu-ryoku?type=${encodeURIComponent(result.type)}&title=${encodeURIComponent(result.title)}`;
  return {
    title: `${result.title} | オタクコミュ力診断`,
    description: result.description,
    openGraph: { title: `あなたは「${result.title}」タイプ！`, images: [ogUrl] },
    twitter: { card: "summary_large_image", title: `あなたは「${result.title}」タイプ！`, images: [ogUrl] },
  };
}

export default function ResultPage(): React.ReactElement {
  return <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="text-teal-400">読み込み中...</div></div>}><CommuResultContent /></Suspense>;
}
