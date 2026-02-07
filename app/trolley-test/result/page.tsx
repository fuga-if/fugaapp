import { Suspense } from "react";
import { Metadata } from "next";
import { getResult, TrolleyScores } from "@/lib/trolley-test/results";
import { AxisType } from "@/lib/trolley-test/questions";
import { TrolleyResultContent } from "./ResultContent";

interface Props {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}

function parseScores(params: {
  [key: string]: string | undefined;
}): TrolleyScores {
  const u = params.u ? Number(params.u) : 0;
  const d = params.d ? Number(params.d) : 0;
  const answersStr = params.a || "";
  const answers: AxisType[] = answersStr
    .split("")
    .map((c) => (c === "U" ? "utilitarian" : "deontological"));
  return { utilitarian: u, deontological: d, answers };
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const params = await searchParams;
  const scores = parseScores(params);
  const result = getResult(scores);
  const ogUrl = `/api/og/trolley-test?id=${encodeURIComponent(result.id)}&title=${encodeURIComponent(result.title)}&emoji=${encodeURIComponent(result.emoji)}&u=${scores.utilitarian}&d=${scores.deontological}`;
  return {
    title: `${result.title} | 思考の癖テスト`,
    description: result.description,
    openGraph: {
      title: `私の思考タイプは「${result.title}」でした！`,
      images: [{ url: ogUrl, width: 1200, height: 630, type: "image/png" }],
    },
    twitter: {
      card: "summary_large_image",
      title: `私の思考タイプは「${result.title}」でした！`,
      images: [{ url: ogUrl, width: 1200, height: 630, type: "image/png" }],
    },
  };
}

export default function ResultPage(): React.ReactElement {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-amber-300 animate-pulse">
            ⚖️ あなたの正義を分析しています...
          </div>
        </div>
      }
    >
      <TrolleyResultContent />
    </Suspense>
  );
}
