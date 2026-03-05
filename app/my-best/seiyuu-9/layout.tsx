import type { Metadata } from "next";

const TITLE = "私を構成する9人の声優メーカー";
const DESCRIPTION =
  "9人の声優を選んで、あなたを構成する声優マップを作ろう！画像を作ってXでシェア！";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "https://fugaapp.site/my-best/seiyuu-9",
    siteName: "FugaApp",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
};

export default function Seiyuu9Layout({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {
  return <>{children}</>;
}
