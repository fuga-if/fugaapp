import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "計算スピードテスト - 30秒で何問解ける？",
  description: "30秒間で四則演算の問題を解いて、あなたの計算力を測定しよう！",
};

export default function MathSpeedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
