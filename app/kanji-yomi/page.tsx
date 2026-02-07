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
    ? `漢字読みテスト結果: ${score}/20正解 - ${rank}ランク「${title}」`
    : "漢字読みテスト - あなたの漢字力は？";
  const description = hasResult
    ? `漢字読みテストで${score}/20正解！ランク: ${rank}「${title}」あなたも挑戦してみよう！`
    : "漢字の読み方を4択から選ぶテスト。全20問であなたの漢字力をランク判定！";

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

export default function KanjiYomiPage() {
  return <GameClient />;
}
