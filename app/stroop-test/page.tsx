import type { Metadata } from "next";
import GameClient from "./GameClient";

interface Props {
  searchParams: Promise<{ correct?: string; miss?: string; rank?: string; title?: string }>;
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const params = await searchParams;
  const correct = params.correct;
  const miss = params.miss;
  const rank = params.rank;
  const title = params.title;

  const hasResult = correct && rank && title;
  const pageTitle = hasResult
    ? `ストループテスト結果: ${correct}問正解 - ${rank}ランク「${title}」`
    : "ストループテスト - 文字を読むな！色を見ろ！";
  const description = hasResult
    ? `ストループテストで${correct}問正解${miss ? `(ミス${miss}回)` : ""}！ランク: ${rank}「${title}」あなたも挑戦してみよう！`
    : "色の名前が違う色で表示される...文字の「色」を30秒で何問答えられる？脳の処理速度を測定！";

  const ogUrl = hasResult
    ? `/api/og/stroop-test?correct=${correct}&miss=${miss || 0}&rank=${rank}&title=${encodeURIComponent(title)}`
    : "/api/og/stroop-test";

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

export default function StroopTestPage() {
  return <GameClient />;
}
