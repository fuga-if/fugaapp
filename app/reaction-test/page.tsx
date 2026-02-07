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
    ? `反射神経テスト結果: ${score}ms - ${rank}ランク「${title}」`
    : "反射神経テスト - あなたの反射神経は何ミリ秒？";
  const description = hasResult
    ? `反射神経テストで${score}msを記録！ランク: ${rank}「${title}」あなたも挑戦してみよう！`
    : "5回の計測であなたの反射神経を測定！色が変わったらタップして、反応速度をミリ秒で計測。";

  const ogUrl = hasResult
    ? `/api/og/reaction-test?score=${score}&rank=${rank}&title=${encodeURIComponent(title)}`
    : "/api/og/reaction-test";

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

export default function ReactionTestPage() {
  return <GameClient />;
}
