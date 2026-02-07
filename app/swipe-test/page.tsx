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
    ? `スワイプ方向テスト結果: ${score}問正解 - ${rank}ランク「${title}」`
    : "スワイプ方向テスト - 矢印の方向に素早くスワイプ！";
  const description = hasResult
    ? `スワイプ方向テストで30秒間に${score}問正解！ランク: ${rank}「${title}」あなたも挑戦してみよう！`
    : "画面に表示される矢印の方向に素早くスワイプ！30秒間で何問正解できる？反射神経と判断力を測定。";

  const ogUrl = hasResult
    ? `/api/og/swipe-test?score=${score}&rank=${rank}&title=${encodeURIComponent(title)}`
    : "/api/og/swipe-test";

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

export default function SwipeTestPage() {
  return <GameClient />;
}
