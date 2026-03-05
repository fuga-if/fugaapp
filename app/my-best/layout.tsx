import type { Metadata } from "next";

const TITLE = "私のベスト声優 | 推しキャラ3選メーカー";
const DESCRIPTION =
  "好きな声優を選んで、ベストキャラ3選の画像を作ってXでシェアしよう！";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "https://fugaapp.site/my-best",
    siteName: "FugaApp",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
};

export default function MyBestLayout({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {
  return (
    <div
      className="min-h-screen"
      style={{
        background: "linear-gradient(135deg, #fff1f2 0%, #f5f3ff 100%)",
      }}
    >
      {children}
    </div>
  );
}
