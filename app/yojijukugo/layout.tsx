import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "四字熟語テスト",
  description: "あなたの四字熟語力を試す！空欄を埋めて全20問に挑戦。",
};

export default function YojijukugoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
