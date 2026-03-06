"use client";

import { useEffect, useState } from "react";
import { DAILY_SEIYUU } from "@/lib/daily-seiyuu";
import { type Locale, t } from "@/lib/i18n/seiyuu";

interface TrendingEntry {
  seiyuu_mal_id: number;
  seiyuu_name: string;
  share_count: number;
}

interface TrendingSeiyuu extends TrendingEntry {
  image: string;
}

const ANILIST_URL = "https://graphql.anilist.co";

async function fetchAnilistImage(malId: number): Promise<string> {
  const query = `query ($id: Int) { Staff(id: $id) { image { large } } }`;
  const res = await fetch(ANILIST_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables: { id: malId } }),
  });
  if (!res.ok) return "";
  const json = await res.json();
  return json?.data?.Staff?.image?.large ?? "";
}

interface Props {
  locale: Locale;
  onSelectSeiyuu: (id: number, name: string) => void;
}

export default function TrendingSection({ locale, onSelectSeiyuu }: Props) {
  const [items, setItems] = useState<TrendingSeiyuu[]>([]);
  const i18n = t(locale);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/my-best/trending")
      .then((r) => r.json())
      .then(async (data: TrendingEntry[]) => {
        if (cancelled || !Array.isArray(data) || data.length === 0) return;
        const withImages: TrendingSeiyuu[] = await Promise.all(
          data.map(async (entry) => {
            const known = DAILY_SEIYUU.find((s) => s.id === entry.seiyuu_mal_id);
            const image = known
              ? known.image
              : await fetchAnilistImage(entry.seiyuu_mal_id).catch(() => "");
            return { ...entry, image };
          })
        );
        if (!cancelled) setItems(withImages);
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);

  if (items.length === 0) return null;

  return (
    <div className="mb-6">
      <p className="text-[10px] text-neutral-500 uppercase tracking-widest mb-2">
        {i18n.trending}
      </p>
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {items.map((va) => (
          <button
            key={va.seiyuu_mal_id}
            onClick={() => onSelectSeiyuu(va.seiyuu_mal_id, va.seiyuu_name)}
            className="flex flex-col items-center gap-1.5 flex-shrink-0"
          >
            <div className="relative">
              {va.image ? (
                <img
                  src={va.image}
                  alt={va.seiyuu_name}
                  className="w-14 h-14 rounded-full object-cover"
                />
              ) : (
                <div className="w-14 h-14 rounded-full bg-neutral-800 flex items-center justify-center text-neutral-600 text-xs">
                  ?
                </div>
              )}
              <span className="absolute -bottom-1 -right-1 bg-neutral-700 text-white text-[8px] rounded-full px-1 py-0.5 leading-none">
                {i18n.trendingShares.replace("{n}", String(va.share_count))}
              </span>
            </div>
            <span className="text-[10px] text-neutral-400 truncate max-w-[60px] text-center">
              {va.seiyuu_name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
