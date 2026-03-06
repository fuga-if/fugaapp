import type { Metadata } from "next";
import MyBestLP from "./MyBestLP";

export const metadata: Metadata = {
  title: "MY BEST - あなたの推しを語ろう",
  description: "推し声優を選んでベストキャラ3選の画像を作ってXでシェアしよう",
};

export default function MyBestIndex(): React.ReactElement {
  return <MyBestLP />;
}
