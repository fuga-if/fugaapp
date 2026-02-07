import type { Metadata } from "next";
import ResultContent from "./ResultContent";
import { getResultType } from "@/lib/color-diversity/results";

interface Props {
  searchParams: Promise<{ type?: string; total?: string }>;
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const params = await searchParams;
  const type = params.type || "type-c";
  const total = params.total || "0";
  const result = getResultType(type);

  const pageTitle = `色覚多様性チェック結果: ${result.title}`;
  const description = `${result.emoji} ${result.subtitle} - ${total}/10問正解！${result.description.slice(0, 50)}...`;

  const ogUrl = `/api/og/color-diversity?type=${type}&total=${total}`;

  return {
    title: pageTitle,
    description,
    openGraph: {
      title: pageTitle,
      description,
      images: [{ url: ogUrl, width: 1200, height: 630, type: "image/png" }],
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description,
      images: [ogUrl],
    },
  };
}

export default function ResultPage() {
  return <ResultContent />;
}
