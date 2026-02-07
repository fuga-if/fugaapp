import { Metadata } from "next";

export const metadata: Metadata = {
  title: "都道府県クイズ | 日本地理テスト",
  description: "都道府県に関する4択クイズ。県庁所在地、名物、地域、隣接県の知識を試そう！",
  openGraph: {
    title: "都道府県クイズ | 日本地理テスト",
    description: "都道府県に関する4択クイズ。県庁所在地、名物、地域、隣接県の知識を試そう！",
  },
};

export default function PrefectureLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
