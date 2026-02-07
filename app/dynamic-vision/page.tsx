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
    ? `動体視力テスト結果: レベル${level} - ${rank}ランク「${title}」`
    : "動体視力テスト - 高速で動くものを見極めろ！";
  const description = hasResult
    ? `動体視力テストでレベル${level}を達成！ランク: ${rank}「${title}」あなたも挑戦してみよう！`
    : "画面を横切るボールの数字を見極めろ！レベルが上がるほど速くなる動体視力テスト。";

  const ogUrl = hasResult
    ? `/api/og/dynamic-vision?level=${level}&rank=${rank}&title=${encodeURIComponent(title)}`
    : "/api/og/dynamic-vision";

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

export default function DynamicVisionPage() {
  return <GameClient />;
}
