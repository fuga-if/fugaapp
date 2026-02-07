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
    ? `記憶力テスト結果: レベル${score}に到達！`
    : "記憶力テスト - あなたの記憶力はどのレベル？";
  const description = hasResult
    ? `記憶力テストでレベル${score}に到達！あなたも挑戦してみよう！`
    : "パネルが光る順番を覚えて、同じ順番にタップ！あなたの記憶力をレベル判定します。";

  const ogUrl = hasResult
    ? `/api/og/memory-test?score=${score}`
    : "/api/og/memory-test";

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

export default function MemoryTestPage() {
  return <GameClient />;
}
