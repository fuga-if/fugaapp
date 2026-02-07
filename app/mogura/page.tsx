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
    ? `モグラ叩き結果: ${score}匹 - ${rank}ランク「${title}」`
    : "モグラ叩き - 30秒で何匹叩ける？";
  const description = hasResult
    ? `モグラ叩きで${score}匹叩いた！ランク: ${rank}「${title}」あなたも挑戦してみよう！`
    : "30秒間でモグラを何匹叩けるか挑戦！時間が経つほど難しくなる！";

  const ogUrl = hasResult
    ? `/api/og/mogura?score=${score}&rank=${rank}&title=${encodeURIComponent(title)}`
    : "/api/og/mogura";

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

export default function MoguraPage() {
  return <GameClient />;
}
