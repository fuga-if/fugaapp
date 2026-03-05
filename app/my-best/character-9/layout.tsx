import type { Metadata } from "next";

const TITLE = "私を構成する9つのキャラメーカー";
const DESCRIPTION =
  "好きなアニメキャラを9人選んで、あなたを構成するキャラマップを作ろう！画像を作ってXでシェア！";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "https://fugaapp.site/my-best/character-9",
    siteName: "FugaApp",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
};

export default function Character9Layout({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {
  return <>{children}</>;
}
