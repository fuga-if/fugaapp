import type { Metadata } from "next";
import GameClient from "./GameClient";

interface Props {
  searchParams: Promise<{ level?: string; rank?: string; title?: string }>;
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const params = await searchParams;
  const level = params.level;
  const rank = params.rank;
  const title = params.title;

  const hasResult = level && rank && title;
  const pageTitle = hasResult
    ? `瞬間記憶テスト結果: Level ${level} - ${rank}ランク「${title}」`
    : "瞬間記憶テスト - あなたの瞬間記憶力はどのレベル？";
  const description = hasResult
    ? `瞬間記憶テストでLevel ${level}に到達！ランク: ${rank}「${title}」あなたも挑戦してみよう！`
    : "数字が一瞬だけ表示される。覚えて、小さい順にタップ！レベルが上がるほど難しくなる瞬間記憶力テスト。";

  const ogUrl = hasResult
    ? `/api/og/flash-memory?level=${level}&rank=${rank}&title=${encodeURIComponent(title)}`
    : "/api/og/flash-memory";

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

export default function FlashMemoryPage() {
  return <GameClient />;
}
