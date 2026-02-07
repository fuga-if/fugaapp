import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Memory Match - 神経衰弱",
  description: "カードをめくってペアを見つけよう！少ないターン数でクリアするほど高ランク。",
  openGraph: {
    title: "Memory Match - 神経衰弱",
    description: "カードをめくってペアを見つけよう！",
  },
};

export default function MemoryMatchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
