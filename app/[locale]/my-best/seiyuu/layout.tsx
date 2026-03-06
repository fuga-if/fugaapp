import type { Metadata } from "next";
import { type Locale, LOCALES } from "@/lib/i18n/seiyuu";

const META: Record<Locale, { title: string; description: string }> = {
  ja: {
    title: "私のベスト声優 | 推しキャラ3選メーカー",
    description: "好きな声優を選んで、ベストキャラ3選の画像を作ってXでシェアしよう！",
  },
  en: {
    title: "My Best Voice Actor | Top 3 Character Maker",
    description: "Pick your favorite voice actor, create a top 3 characters image, and share it on X!",
  },
  zh: {
    title: "我的最佳声优 | 推荐角色3选制作器",
    description: "选择你喜欢的声优，制作最佳角色3选图片，分享到X！",
  },
  ko: {
    title: "나의 베스트 성우 | 최애 캐릭터 3선 메이커",
    description: "좋아하는 성우를 선택하고 베스트 캐릭터 3선 이미지를 만들어 X에 공유하세요!",
  },
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const loc = LOCALES.includes(locale as Locale) ? (locale as Locale) : "ja";
  const meta = META[loc];
  return {
    title: meta.title,
    description: meta.description,
    openGraph: {
      title: meta.title,
      description: meta.description,
      url: `https://fugaapp.site/${loc}/my-best/seiyuu`,
      siteName: "FugaApp",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: meta.title,
      description: meta.description,
    },
  };
}

export default function SeiyuuLayout({ children }: { children: React.ReactNode }): React.ReactElement {
  return <div className="min-h-screen bg-black">{children}</div>;
}
