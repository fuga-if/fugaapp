"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { DAILY_SEIYUU } from "@/lib/daily-seiyuu";

type LPLocale = "ja" | "en" | "zh" | "ko";

function detectLocale(): LPLocale {
  if (typeof window === "undefined") return "ja";
  const lang = navigator.language.toLowerCase();
  if (lang.startsWith("ko")) return "ko";
  if (lang.startsWith("zh")) return "zh";
  if (lang.startsWith("en")) return "en";
  return "ja";
}

const lpTranslations = {
  ja: {
    heroTitle: "MY BEST",
    heroSubtitle: "あなたの推しを、もっと語ろう",
    heroCta: "さっそく作る",
    howItWorksTitle: "HOW IT WORKS",
    step1Title: "声優を検索",
    step1Desc: "好きな声優を検索して選ぼう",
    step2Title: "キャラを3つ選ぶ",
    step2Desc: "出演キャラからベスト3を選択",
    step3Title: "生成＆シェア",
    step3Desc: "画像を生成してXでシェア",
    featuresTitle: "FEATURES",
    feature1Title: "私のベスト声優",
    feature1Desc: "推し声優を選んでベストキャラ3選の画像を作ろう",
    feature2Title: "私を構成する9人の声優",
    feature2Desc: "9人の声優を選んで声優マップを作ろう",
    feature3Title: "私を構成する9つのキャラ",
    feature3Desc: "好きなキャラを9人選んでキャラマップを作ろう",
    popularTitle: "POPULAR VOICE ACTORS",
    finalCta: "今すぐ作る",
    terms: "利用規約",
    privacy: "プライバシーポリシー",
  },
  en: {
    heroTitle: "MY BEST",
    heroSubtitle: "Express your love for your favorites",
    heroCta: "Get Started",
    howItWorksTitle: "HOW IT WORKS",
    step1Title: "Search",
    step1Desc: "Search and select your favorite voice actor",
    step2Title: "Pick 3 Characters",
    step2Desc: "Choose your top 3 from their roles",
    step3Title: "Generate & Share",
    step3Desc: "Generate an image and share on X",
    featuresTitle: "FEATURES",
    feature1Title: "My Best Voice Actor",
    feature1Desc: "Pick your top 3 characters and create a shareable image",
    feature2Title: "My 9 Voice Actors",
    feature2Desc: "Choose 9 voice actors to create your voice actor map",
    feature3Title: "My 9 Characters",
    feature3Desc: "Pick 9 anime characters to create your character map",
    popularTitle: "POPULAR VOICE ACTORS",
    finalCta: "Get Started Now",
    terms: "Terms of Service",
    privacy: "Privacy Policy",
  },
  zh: {
    heroTitle: "MY BEST",
    heroSubtitle: "表达你对推的热爱",
    heroCta: "立即开始",
    howItWorksTitle: "使用方法",
    step1Title: "搜索声优",
    step1Desc: "搜索并选择喜欢的声优",
    step2Title: "选择3个角色",
    step2Desc: "从出演角色中选出最佳3名",
    step3Title: "生成并分享",
    step3Desc: "生成图片并分享到X",
    featuresTitle: "功能",
    feature1Title: "我的最佳声优",
    feature1Desc: "选出推的声优最佳角色3选并制作图片",
    feature2Title: "构成我的9位声优",
    feature2Desc: "选择9位声优制作声优地图",
    feature3Title: "构成我的9个角色",
    feature3Desc: "选择9个喜欢的角色制作角色地图",
    popularTitle: "人气声优",
    finalCta: "立即制作",
    terms: "使用条款",
    privacy: "隐私政策",
  },
  ko: {
    heroTitle: "MY BEST",
    heroSubtitle: "당신의 최애를 더 이야기하자",
    heroCta: "바로 만들기",
    howItWorksTitle: "이용 방법",
    step1Title: "성우 검색",
    step1Desc: "좋아하는 성우를 검색해서 선택하세요",
    step2Title: "캐릭터 3명 선택",
    step2Desc: "출연 캐릭터에서 베스트 3를 선택",
    step3Title: "생성 & 공유",
    step3Desc: "이미지를 생성하고 X에 공유",
    featuresTitle: "기능",
    feature1Title: "나의 베스트 성우",
    feature1Desc: "최애 성우의 베스트 캐릭터 3선 이미지를 만들자",
    feature2Title: "나를 구성하는 9명의 성우",
    feature2Desc: "9명의 성우를 선택해서 성우 맵을 만들자",
    feature3Title: "나를 구성하는 9개의 캐릭터",
    feature3Desc: "좋아하는 캐릭터 9명을 선택해서 캐릭터 맵을 만들자",
    popularTitle: "인기 성우",
    finalCta: "지금 바로 만들기",
    terms: "이용약관",
    privacy: "개인정보처리방침",
  },
};

const IMAGE_PROXY = "/api/my-best/image-proxy?url=";
const HERO_SEIYUU = DAILY_SEIYUU.slice(0, 12);
const POPULAR_SEIYUU = DAILY_SEIYUU.slice(0, 20);

function proxyUrl(url: string): string {
  return IMAGE_PROXY + encodeURIComponent(url);
}

export default function MyBestLP(): React.ReactElement {
  const [locale, setLocale] = useState<LPLocale>("ja");
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLocale(detectLocale());
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.1 }
    );
    containerRef.current.querySelectorAll(".scroll-reveal").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const t = lpTranslations[locale];

  return (
    <div ref={containerRef} className="bg-black text-white min-h-screen">
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 grid grid-cols-4 grid-rows-3 gap-0">
          {HERO_SEIYUU.map((s, index) => (
            <div key={s.id} className="relative overflow-hidden animate-float" style={{ animationDelay: `${(index * 0.15) % 2}s` }}>
              <img
                src={proxyUrl(s.image)}
                alt={s.name}
                loading="lazy"
                className="w-full h-full object-cover blur-sm scale-110"
              />
            </div>
          ))}
        </div>
        <div className="absolute inset-0 bg-black/70" />

        <div className="relative z-10 text-center px-6">
          <h1 className="text-7xl md:text-9xl font-black tracking-widest mb-4 animate-shimmer">
            {t.heroTitle}
          </h1>
          <p className="text-lg md:text-2xl text-neutral-300 mb-10 animate-fade-in">
            {t.heroSubtitle}
          </p>
          <Link
            href={`/${locale}/my-best/seiyuu`}
            className="inline-block bg-white text-black font-bold px-10 py-4 rounded-full text-lg animate-glow-pulse hover:bg-neutral-200 transition-colors"
          >
            {t.heroCta}
          </Link>
        </div>
      </section>

      <section className="py-24 px-6">
        <h2 className="text-center text-xs tracking-[0.3em] text-neutral-500 mb-16 scroll-reveal">
          {t.howItWorksTitle}
        </h2>
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-12 md:gap-6">
          {[
            { num: "01", title: t.step1Title, desc: t.step1Desc, delay: "100ms" },
            { num: "02", title: t.step2Title, desc: t.step2Desc, delay: "200ms" },
            { num: "03", title: t.step3Title, desc: t.step3Desc, delay: "300ms" },
          ].map((step) => (
            <div
              key={step.num}
              className="flex-1 text-center scroll-reveal"
              style={{ transitionDelay: step.delay }}
            >
              <div className="w-12 h-12 rounded-full border border-neutral-700 flex items-center justify-center mx-auto mb-4">
                <span className="text-xs text-neutral-500 font-mono">{step.num}</span>
              </div>
              <h3 className="text-white font-bold mb-2">{step.title}</h3>
              <p className="text-neutral-500 text-sm">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-24 px-6 bg-neutral-950">
        <h2 className="text-center text-xs tracking-[0.3em] text-neutral-500 mb-16 scroll-reveal">
          {t.featuresTitle}
        </h2>
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { href: `/${locale}/my-best/seiyuu`, title: t.feature1Title, desc: t.feature1Desc, delay: "100ms" },
            { href: "/my-best/seiyuu-9", title: t.feature2Title, desc: t.feature2Desc, delay: "200ms", isNew: true },
            { href: "/my-best/character-9", title: t.feature3Title, desc: t.feature3Desc, delay: "300ms", isNew: true },
          ].map((feature) => (
            <Link
              key={feature.href}
              href={feature.href}
              className={`block bg-neutral-900 border border-neutral-800 rounded-2xl p-6 hover:border-neutral-600 transition-colors scroll-reveal ${feature.isNew ? "relative overflow-hidden" : ""}`}
              style={{ transitionDelay: feature.delay }}
            >
              {feature.isNew && (
                <span className="absolute top-3 right-3 text-[10px] font-bold bg-white text-black px-2 py-0.5 rounded-full">
                  NEW
                </span>
              )}
              <h3 className="text-white font-bold text-base mb-2">{feature.title}</h3>
              <p className="text-neutral-500 text-sm">{feature.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="py-24">
        <h2 className="text-center text-xs tracking-[0.3em] text-neutral-500 mb-12 px-6 scroll-reveal">
          {t.popularTitle}
        </h2>
        <div className="flex gap-6 overflow-x-auto scrollbar-hide px-6 pb-4">
          {POPULAR_SEIYUU.map((s) => (
            <Link
              key={s.id}
              href={`/${locale}/my-best/seiyuu?id=${s.id}`}
              className="flex-none flex flex-col items-center gap-2"
            >
              <div className="w-16 h-16 rounded-full overflow-hidden border border-neutral-800">
                <img
                  src={proxyUrl(s.image)}
                  alt={s.name}
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-[10px] text-neutral-500 text-center whitespace-nowrap max-w-[72px] truncate">
                {s.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="py-32 px-6 text-center scroll-reveal">
        <Link
          href={`/${locale}/my-best/seiyuu`}
          className="inline-block bg-white text-black font-bold px-12 py-5 rounded-full text-xl animate-glow-pulse hover:bg-neutral-200 transition-colors"
        >
          {t.finalCta}
        </Link>
      </section>

      <footer className="pb-12 text-center text-[10px] text-neutral-600 space-y-1">
        <p>
          <Link href="/my-best/terms" className="underline hover:text-neutral-400">
            {t.terms}
          </Link>
          {" | "}
          <Link href="/privacy" className="underline hover:text-neutral-400">
            {t.privacy}
          </Link>
        </p>
        <p>&copy; 2026 fugaapp</p>
      </footer>
    </div>
  );
}
