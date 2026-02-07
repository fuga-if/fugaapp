import { Suspense } from "react";
import { Metadata } from "next";
import { getResultByAnswers } from "@/lib/subliminal-test/results";
import type { AnswerData } from "@/lib/subliminal-test/results";
import { SubliminalResultContent } from "./ResultContent";

interface Props {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}

function parseAnswers(raw: string | undefined): AnswerData[] {
  if (!raw) return [];
  return raw.split(",").map((pair) => {
    const [ci, rt] = pair.split(":");
    return { choiceIndex: Number(ci) || 0, responseTimeMs: Number(rt) || 0 };
  });
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const params = await searchParams;
  const answers = parseAnswers(params.a);
  if (answers.length !== 8) {
    return { title: "潜在意識テスト | 結果" };
  }
  const { result } = getResultByAnswers(answers);
  const ogUrl = `/api/og/subliminal-test?type=${encodeURIComponent(result.type)}&title=${encodeURIComponent(result.title)}&emoji=${encodeURIComponent(result.emoji)}&rare=${result.isRare ? "1" : "0"}`;
  return {
    title: `${result.title} | 潜在意識テスト`,
    description: result.description,
    openGraph: {
      title: `私の潜在意識タイプは「${result.title}」でした！`,
      images: [{ url: ogUrl, width: 1200, height: 630, type: "image/png" }],
    },
    twitter: {
      card: "summary_large_image",
      title: `私の潜在意識タイプは「${result.title}」でした！`,
      images: [{ url: ogUrl, width: 1200, height: 630, type: "image/png" }],
    },
  };
}

export default function ResultPage(): React.ReactElement {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-indigo-300 animate-pulse">
             潜在意識を解析しています... 
          </div>
        </div>
      }
    >
      <SubliminalResultContent />
    </Suspense>
  );
}
