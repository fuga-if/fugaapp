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
    ? `書き順テスト結果: ${score}/15 - ${rank}ランク「${title}」`
    : "書き順テスト - 何画目はどれ？";
  const description = hasResult
    ? `書き順テストで${score}/15問正解！ランク: ${rank}「${title}」あなたも挑戦してみよう！`
    : "漢字の画をタップして書き順をテスト！全15問であなたの書き順力をランク判定。";

  return {
    title: pageTitle,
    description,
    openGraph: {
      title: pageTitle,
      description,
    },
    twitter: {
      card: "summary",
      title: pageTitle,
      description,
    },
  };
}

export default function KanjiOrderPage() {
  return <GameClient />;
}
