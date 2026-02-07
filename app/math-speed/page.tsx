import type { Metadata } from "next";
import GameClient from "./GameClient";

interface Props {
  searchParams: Promise<{ correct?: string; miss?: string; rank?: string; title?: string }>;
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const params = await searchParams;
  const correct = params.correct;
  const rank = params.rank;
  const title = params.title;

  const hasResult = correct && rank && title;
  const pageTitle = hasResult
    ? `計算スピードテスト結果: ${correct}問正解 - ${rank}ランク「${title}」`
    : "計算スピードテスト - 30秒で何問解ける？";
  const description = hasResult
    ? `計算スピードテストで${correct}問正解！ランク: ${rank}「${title}」あなたも挑戦してみよう！`
    : "30秒間で四則演算の問題を解いて、あなたの計算力を測定しよう！";

  const ogUrl = hasResult
    ? `/api/og/math-speed?correct=${correct}&rank=${rank}&title=${encodeURIComponent(title)}`
    : "/api/og/math-speed";

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
      images: [{ url: ogUrl, width: 1200, height: 630, type: "image/png" }],
    },
  };
}

export default function MathSpeedPage() {
  return <GameClient />;
}
