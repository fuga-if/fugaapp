import { Suspense } from "react";
import { Metadata } from "next";
import { getResultType, results } from "@/lib/dark-triad/results";
import { DarkTriadResultContent } from "./ResultContent";

interface Props {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const params = await searchParams;
  const m = params.m ? Number(params.m) : 0;
  const n = params.n ? Number(params.n) : 0;
  const p = params.p ? Number(params.p) : 0;
  const type = getResultType(m, n, p);
  const result = results[type];
  const ogUrl = `/api/og/dark-triad?type=${encodeURIComponent(type)}&title=${encodeURIComponent(result.title)}&m=${m}&n=${n}&p=${p}`;

  return {
    title: `${result.title} | ダークサイド診断`,
    description: result.description,
    openGraph: {
      title: `${result.emoji} 私は「${result.title}」でした！`,
      description: `M:${m}% / N:${n}% / P:${p}% — ${result.subtitle}`,
      images: [{ url: ogUrl, width: 1200, height: 630, type: "image/png" }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${result.emoji} 私は「${result.title}」でした！`,
      images: [{ url: ogUrl, width: 1200, height: 630, type: "image/png" }],
    },
  };
}

export default function ResultPage(): React.ReactElement {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-purple-400 animate-pulse">
             闇を解析中...
          </div>
        </div>
      }
    >
      <DarkTriadResultContent />
    </Suspense>
  );
}
