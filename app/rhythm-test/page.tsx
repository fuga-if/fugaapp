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
    ? `リズム感テスト結果: ${score}ms - ${rank}ランク「${title}」`
    : "リズム感テスト - あなたのリズム感を測定！";
  const description = hasResult
    ? `リズム感テストで平均ズレ${score}msを記録！ランク: ${rank}「${title}」あなたも挑戦してみよう！`
    : "光のテンポに合わせてタップ！途中で光が消えてもテンポを維持できる？あなたのリズム感をミリ秒で測定。";

  return {
    title: pageTitle,
    description,
    openGraph: {
      title: pageTitle,
      description,
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description,
    },
  };
}

export default function RhythmTestPage() {
  return <GameClient />;
}
