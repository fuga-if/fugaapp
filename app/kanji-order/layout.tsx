import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "書き順テスト - 何画目はどれ？",
  description:
    "漢字がSVGで表示され、正しい画をタップ！全15問であなたの書き順力をランク判定。",
};

export default function KanjiOrderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
