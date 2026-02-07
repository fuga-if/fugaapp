import type { Metadata } from "next";
import GameClient from "./GameClient";

interface Props {
  searchParams: Promise<{ score?: string }>;
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const params = await searchParams;
  const score = params.score;

  const hasResult = !!score;
  const pageTitle = hasResult
    ? `タップ速度テスト結果: 10秒間に${score}回タップ！`
    : "タップ速度テスト - 10秒間で何回タップできる？";
  const description = hasResult
    ? `タップ速度テストで10秒間に${score}回タップを記録！あなたも挑戦してみよう！`
    : "10秒間で何回タップできるか挑戦！タップ回数とCPSでランク判定。";

  const ogUrl = hasResult
    ? `/api/og/tap-speed?score=${score}`
    : "/api/og/tap-speed";

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

export default function TapSpeedPage() {
  return <GameClient />;
}
