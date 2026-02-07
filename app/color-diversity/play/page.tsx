import type { Metadata } from "next";
import PlayContent from "./PlayContent";

export const metadata: Metadata = {
  title: "色覚多様性チェック - テスト中",
  description: "石原式風のドットパターンで色覚タイプをチェック中！",
  robots: { index: false, follow: false },
};

export default function PlayPage() {
  return <PlayContent />;
}
