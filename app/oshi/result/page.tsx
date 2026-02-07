import { Suspense } from "react";
import { Metadata } from "next";
import { getResultByScores } from "@/lib/oshi/results";
import { OshiType } from "@/lib/oshi/questions";
import { OshiResultContent } from "./ResultContent";

interface Props { searchParams: Promise<{ [key: string]: string | undefined }>; }
const typeKeys: OshiType[] = ['kakin-senshi', 'genba-shijou', 'sousaku-numa', 'data-chuu', 'fukyou-shi', 'seikan-sei'];

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const params = await searchParams;
  const scores: Record<OshiType, number> = { 'kakin-senshi': 0, 'genba-shijou': 0, 'sousaku-numa': 0, 'data-chuu': 0, 'fukyou-shi': 0, 'seikan-sei': 0 };
  for (const type of typeKeys) { scores[type] = params[type] ? Number(params[type]) : 0; }
  const result = getResultByScores(scores);
  const ogImageUrl = `/api/og/oshi?type=${encodeURIComponent(result.type)}&title=${encodeURIComponent(result.title)}`;
  return {
    title: `${result.title} | 推し活スタイル診断`,
    description: result.description,
    openGraph: { title: `あなたは「${result.title}」タイプ！`, description: result.description, images: [ogImageUrl] },
    twitter: { card: "summary_large_image", title: `あなたは「${result.title}」タイプ！`, images: [ogImageUrl] },
  };
}

export default function ResultPage(): React.ReactElement {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="text-pink-400">読み込み中...</div></div>}>
      <OshiResultContent />
    </Suspense>
  );
}
