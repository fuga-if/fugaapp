import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "瞬間記憶テスト",
  description: "数字が一瞬表示される。覚えて、小さい順にタップ！あなたの瞬間記憶力はどのレベル？",
};

export default function FlashMemoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
