import { Suspense } from "react";
import { Metadata } from "next";
import { getResultByScore } from "@/lib/adhd/results";
import { AdhdResultContent } from "./ResultContent";

interface Props { searchParams: Promise<{ [key: string]: string | undefined }>; }

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const params = await searchParams;
  const score = params.score ? Number(params.score) : 0;
  const result = getResultByScore(score);
  const ogUrl = `/api/og/adhd?type=${encodeURIComponent(result.type)}&title=${encodeURIComponent(result.title)}`;
  return {
    title: `${result.title} | ADHD傾向チェック`,
    description: result.description,
    openGraph: {
      title: `私は「${result.title}」でした！`,
      images: [{ url: ogUrl, width: 1200, height: 630, type: "image/png" }],
    },
    twitter: {
      card: "summary_large_image",
      title: `私は「${result.title}」でした！`,
      images: [{ url: ogUrl, width: 1200, height: 630, type: "image/png" }],
    },
  };
}

export default function ResultPage(): React.ReactElement {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="text-orange-400">診断中...</div></div>}>
      <AdhdResultContent />
    </Suspense>
  );
}
