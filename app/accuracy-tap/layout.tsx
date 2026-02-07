import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "正確タップテスト - あなたのタップ精度を測定",
  description: "レベルが上がるほど小さくなるターゲットをタップ！ミス3回で終了。あなたはどこまで行ける？",
};

export default function AccuracyTapLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
