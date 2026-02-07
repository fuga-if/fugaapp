import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ことわざテスト | 四択穴埋めクイズ",
  description: "ことわざの空欄に入る言葉を4択で答えるテスト。全20問であなたの語彙力を測定！",
  openGraph: {
    title: "ことわざテスト",
    description: "ことわざの空欄に入る言葉を4択で答えるテスト。全20問であなたの語彙力を測定！",
  },
};

export default function KotowazaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
