import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "動体視力テスト - 高速で動くものを見極めろ！",
  description:
    "画面を横切るボールの数字を見極めろ！レベルが上がるほど速くなる動体視力テスト。あなたはどこまで見える？",
};

export default function DynamicVisionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
