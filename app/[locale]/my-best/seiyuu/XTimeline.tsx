"use client";

import { useEffect, useRef, useState } from "react";
import type { Locale } from "@/lib/i18n/seiyuu";

declare global {
  interface Window {
    twttr?: {
      widgets: {
        createTimeline(
          source: { sourceType: string; query: string },
          el: HTMLElement,
          options: Record<string, unknown>
        ): Promise<HTMLElement | undefined>;
      };
    };
  }
}

interface Props {
  locale: Locale;
  hashtag: string;
  label: string;
}

export default function XTimeline({ locale, hashtag, label }: Props): React.ReactElement {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;
    const el = containerRef.current;
    el.innerHTML = "";

    function tryRender(): void {
      if (!window.twttr?.widgets || !el) {
        setFailed(true);
        return;
      }
      window.twttr.widgets
        .createTimeline(
          { sourceType: "search", query: `${hashtag} #mybest3character` },
          el,
          {
            theme: "dark",
            chrome: "noheader nofooter noborders transparent",
            height: 400,
            lang: locale,
            dnt: true,
          }
        )
        .then((result) => {
          if (result) setLoaded(true);
          else setFailed(true);
        })
        .catch(() => setFailed(true));
    }

    if (window.twttr?.widgets) {
      tryRender();
    } else {
      const script = document.createElement("script");
      script.src = "https://platform.twitter.com/widgets.js";
      script.async = true;
      script.onload = () => setTimeout(tryRender, 500);
      script.onerror = () => setFailed(true);
      document.head.appendChild(script);
    }
  }, [hashtag, locale]);

  const searchUrl = `https://x.com/search?q=${encodeURIComponent(`${hashtag} #mybest3character`)}&f=live`;

  if (failed) {
    return (
      <a
        href={searchUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="block w-full text-center py-3 rounded-xl border border-neutral-700 text-neutral-300 text-sm hover:bg-neutral-800 transition-colors mt-4"
      >
        {label}
      </a>
    );
  }

  return (
    <div className="mt-4">
      <div
        ref={containerRef}
        className={`rounded-xl overflow-hidden ${loaded ? "" : "h-[100px] animate-pulse bg-neutral-900"}`}
      />
      <a
        href={searchUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="block text-center text-xs text-neutral-500 mt-2 hover:text-neutral-300 transition-colors"
      >
        {label} →
      </a>
    </div>
  );
}
