import type { Metadata } from "next";
import GameClient from "./GameClient";

interface Props {
  searchParams: Promise<{ score?: string; rank?: string; title?: string }>;
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const params = await searchParams;
  const score = params.score;
  const rank = params.rank;
  const title = params.title;

  const hasResult = score && rank && title;
  const pageTitle = hasResult
    ? `四字熟語テスト結果: ${score}/20正解 - ${rank}ランク「${title}」`
    : "四字熟語テスト - 空欄を埋めて語彙力を測定！";
  const description = hasResult
    ? `四字熟語テストで${score}/20正解！ランク: ${rank}「${title}」あなたも挑戦してみよう！`
    : "四字熟語の空欄を4択から選んで答えよう。全20問であなたの語彙力を測定！";

  const ogUrl = hasResult
    ? `/api/og/yojijukugo?score=${score}&rank=${rank}&title=${encodeURIComponent(title)}`
    : "/api/og/yojijukugo";

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

export default function YojijukugoPage() {
  return <GameClient />;
}
