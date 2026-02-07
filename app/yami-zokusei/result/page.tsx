import { Suspense } from "react";
import { Metadata } from "next";
import { getResultByScores } from "@/lib/yami-zokusei/results";
import { YamiType } from "@/lib/yami-zokusei/questions";
import { YamiZokuseiResultContent } from "./ResultContent";

interface Props { searchParams: Promise<{ [key: string]: string | undefined }>; }
const typeKeys: YamiType[] = ['shikkoku-yami', 'souen-gouka', 'itetsuku-hyouga', 'shiden-raikou', 'seinaru-hikari', 'kyomu-kaze'];

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const params = await searchParams;
  const scores: Record<YamiType, number> = { 'shikkoku-yami': 0, 'souen-gouka': 0, 'itetsuku-hyouga': 0, 'shiden-raikou': 0, 'seinaru-hikari': 0, 'kyomu-kaze': 0 };
  for (const t of typeKeys) { scores[t] = params[t] ? Number(params[t]) : 0; }
  const result = getResultByScores(scores);
  const ogUrl = `/api/og/yami-zokusei?type=${encodeURIComponent(result.type)}&title=${encodeURIComponent(result.title)}`;
  return {
    title: `${result.title} | 闇属性診断`,
    description: result.description,
    openGraph: { title: `あなたの属性は「${result.title}」！`, images: [ogUrl] },
    twitter: { card: "summary_large_image", title: `あなたの属性は「${result.title}」！`, images: [ogUrl] },
  };
}

export default function ResultPage(): React.ReactElement {
  return <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="text-red-400">覚醒中...</div></div>}><YamiZokuseiResultContent /></Suspense>;
}
