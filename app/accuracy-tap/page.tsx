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
    ? `正確タップテスト結果: Lv.${score} - ${rank}ランク「${title}」`
    : "正確タップテスト - あなたのタップ精度は？";
  const description = hasResult
    ? `正確タップテストでレベル${score}に到達！ランク: ${rank}「${title}」あなたも挑戦してみよう！`
    : "レベルが上がるほど小さくなるターゲットをタップ！ミス3回で終了。どこまで行ける？";

  const ogUrl = hasResult
    ? `/api/og/accuracy-tap?score=${score}&rank=${rank}&title=${encodeURIComponent(title)}`
    : "/api/og/accuracy-tap";

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

export default function AccuracyTapPage() {
  return <GameClient />;
}
