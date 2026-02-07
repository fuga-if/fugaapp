import { Suspense } from "react";
import { Metadata } from "next";
import { getResultByScore } from "@/lib/menhera/results";
import { MenheraResultContent } from "./ResultContent";

interface Props {
  searchParams: Promise<{ score?: string }>;
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const params = await searchParams;
  const score = params.score ? Number(params.score) : 25;
  const result = getResultByScore(score);
  const ogImageUrl = `/api/og/menhera?level=${encodeURIComponent(result.level)}&title=${encodeURIComponent(result.title)}`;
  return {
    title: `${result.title} | メンヘラ度診断`,
    description: result.description,
    openGraph: {
      title: `メンヘラ度 ${result.level} - ${result.title}`,
      description: result.description,
      images: [{ url: ogImageUrl, width: 1200, height: 630, type: "image/png" }],
    },
    twitter: {
      card: "summary_large_image",
      title: `メンヘラ度 ${result.level} - ${result.title}`,
      description: result.description,
      images: [{ url: ogImageUrl, width: 1200, height: 630, type: "image/png" }],
    },
  };
}

export default function ResultPage(): React.ReactElement {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="text-pink-500">読み込み中...</div></div>}>
      <MenheraResultContent />
    </Suspense>
  );
}
