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
    ? `10秒チャレンジ結果: 誤差${score}ms - ${rank}ランク「${title}」`
    : "10秒チャレンジ - あなたの体内時計は正確？";
  const description = hasResult
    ? `10秒チャレンジで誤差${score}msを記録！ランク: ${rank}「${title}」あなたも挑戦してみよう！`
    : "体内時計でぴったり10秒を目指せ！誤差をミリ秒で計測してランク判定。";

  const ogUrl = hasResult
    ? `/api/og/ten-seconds?score=${score}&rank=${rank}&title=${encodeURIComponent(title)}`
    : "/api/og/ten-seconds";

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

export default function TenSecondsPage() {
  return <GameClient />;
}
