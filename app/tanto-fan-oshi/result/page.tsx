import { Suspense } from "react";
import { Metadata } from "next";
import { results } from "@/lib/tanto-fan-oshi/results";
import { ResultType } from "@/lib/tanto-fan-oshi/questions";
import { TantoResultContent } from "./ResultContent";

interface Props { searchParams: Promise<{ type?: string }>; }

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const params = await searchParams;
  const type = (params.type || 'tanto') as ResultType;
  const result = results[type] || results.tanto;
  const ogImageUrl = `/api/og/tanto-fan-oshi?type=${encodeURIComponent(result.type)}`;
  return {
    title: `${result.catchphrase} | 担当/ファン/推し診断`,
    description: result.description,
    openGraph: { title: `${result.catchphrase}！`, description: result.description, images: [ogImageUrl] },
    twitter: { card: "summary_large_image", title: `${result.catchphrase}！`, images: [ogImageUrl] },
  };
}

export default function ResultPage(): React.ReactElement {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="text-purple-300">読み込み中...</div></div>}>
      <TantoResultContent />
    </Suspense>
  );
}
