import { Suspense } from "react";
import { Metadata } from "next";
import { decodeAnswers } from "@/lib/liar-test/questions";
import { getResult } from "@/lib/liar-test/results";
import { LiarTestResultContent } from "./ResultContent";

interface Props {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const params = await searchParams;
  const answers = decodeAnswers(params.a || null, params.t || null);
  const result = answers ? getResult(answers) : null;

  const title = result ? result.title : "嘘つき度診断";
  const score = result ? result.liarScore : 0;
  const ogUrl = `/api/og/liar-test?type=${encodeURIComponent(result?.type || "")}&title=${encodeURIComponent(title)}&score=${score}`;

  return {
    title: `${title} | 嘘つき度診断`,
    description: result?.description || "回答の「迷い」を検出。あなたの嘘、バレてますよ？",
    openGraph: {
      title: `嘘つき度${score}%！「${title}」でした`,
      images: [{ url: ogUrl, width: 1200, height: 630, type: "image/png" }],
    },
    twitter: {
      card: "summary_large_image",
      title: `嘘つき度${score}%！「${title}」でした`,
      images: [{ url: ogUrl, width: 1200, height: 630, type: "image/png" }],
    },
  };
}

export default function ResultPage(): React.ReactElement {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-gray-400 animate-pulse font-mono">
             分析中...嘘を検出しています...
          </div>
        </div>
      }
    >
      <LiarTestResultContent />
    </Suspense>
  );
}
