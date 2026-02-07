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
    ? `色覚テスト結果: Level ${score} - ${rank}ランク「${title}」`
    : "Color Perception Test - 色覚テスト";
  const description = hasResult
    ? `色覚テストでレベル${score}に到達！ランク: ${rank}「${title}」あなたも挑戦してみよう！`
    : "あなたの色覚を試しましょう。グリッドの中から異なる色を見つけて、どこまでレベルアップできるか挑戦！";

  const ogUrl = hasResult
    ? `/api/og/color-test?score=${score}&rank=${rank}&title=${encodeURIComponent(title)}`
    : "/api/og/color-test";

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

export default function ColorTestPage() {
  return <GameClient />;
}
