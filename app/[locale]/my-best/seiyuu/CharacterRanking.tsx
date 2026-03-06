"use client";

import { useEffect, useState } from "react";
import { type Locale, t, AGE_RANGE_VALUES, GENDER_VALUES } from "@/lib/i18n/seiyuu";

interface RankingEntry {
  mal_id: number;
  name: string;
  anime_title: string;
  pick_count: number;
}

interface Props {
  locale: Locale;
  seiyuuMalId: number;
}

export default function CharacterRanking({ locale, seiyuuMalId }: Props): React.ReactElement {
  const [data, setData] = useState<RankingEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [ageFilter, setAgeFilter] = useState<string | null>(null);
  const [genderFilter, setGenderFilter] = useState<string | null>(null);
  const i18n = t(locale);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(false);
    const params = new URLSearchParams({ seiyuu_mal_id: String(seiyuuMalId) });
    if (ageFilter) params.set("age_range", ageFilter);
    if (genderFilter) params.set("gender", genderFilter);
    fetch(`/api/my-best/ranking?${params}`)
      .then((r) => r.json())
      .then((d: RankingEntry[]) => {
        if (!cancelled) setData(Array.isArray(d) ? d : []);
      })
      .catch(() => {
        if (!cancelled) {
          setData([]);
          setError(true);
        }
      })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [seiyuuMalId, ageFilter, genderFilter]);

  const ageOptions = [null, ...AGE_RANGE_VALUES];
  const ageLabels = [i18n.allFilter, ...i18n.ageRanges];
  const genderOptions = [null, ...GENDER_VALUES];
  const genderLabels = [i18n.allFilter, ...i18n.genders];

  function pillClass(isActive: boolean): string {
    const base = "px-2 py-0.5 rounded-full text-[10px] border transition-colors";
    return isActive
      ? `${base} bg-white text-black border-white`
      : `${base} text-neutral-500 border-neutral-700 active:border-neutral-500`;
  }

  function renderContent(): React.ReactElement {
    if (loading) {
      return (
        <div className="flex justify-center py-8">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-neutral-700 border-t-neutral-400" />
        </div>
      );
    }
    if (error || data.length === 0) {
      return <p className="text-center text-xs text-neutral-600 py-6">{i18n.noRankingData}</p>;
    }
    return (
      <ol className="space-y-1.5">
        {data.map((entry, idx) => (
          <li key={entry.mal_id} className="flex items-center gap-3 py-2 border-b border-neutral-800/50">
            <span className={`text-sm font-bold w-5 text-center flex-shrink-0 ${idx < 3 ? "text-white" : "text-neutral-600"}`}>
              {idx + 1}
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-[12px] text-white font-medium truncate">{entry.name}</p>
              <p className="text-[10px] text-neutral-500 truncate">{entry.anime_title}</p>
            </div>
            <span className="text-[10px] text-neutral-400 flex-shrink-0">
              {i18n.picks.replace("{n}", String(entry.pick_count))}
            </span>
          </li>
        ))}
      </ol>
    );
  }

  return (
    <div className="mt-6">
      <p className="text-[11px] font-bold text-white mb-3">{i18n.charRankingTitle}</p>

      <div className="flex gap-1.5 flex-wrap mb-2">
        {ageOptions.map((val, i) => (
          <button
            key={val ?? "all-age"}
            onClick={() => setAgeFilter(val)}
            className={pillClass(ageFilter === val)}
          >
            {ageLabels[i]}
          </button>
        ))}
        <span className="text-neutral-800 text-[10px] self-center">|</span>
        {genderOptions.map((val, i) => (
          <button
            key={val ?? "all-gender"}
            onClick={() => setGenderFilter(val)}
            className={pillClass(genderFilter === val)}
          >
            {genderLabels[i]}
          </button>
        ))}
      </div>

      {renderContent()}
    </div>
  );
}
