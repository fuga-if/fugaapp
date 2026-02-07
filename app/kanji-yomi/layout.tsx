import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "漢字読みテスト - あなたの漢字力は？",
  description: "漢字の読み方を4択から選ぶテスト。全20問であなたの漢字力をランク判定！",
};

export default function KanjiYomiLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
