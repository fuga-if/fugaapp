"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { DAILY_SEIYUU } from "@/lib/daily-seiyuu";

interface StaffResult {
  id: number;
  name: { full: string; native: string | null };
  image: { large: string };
  favourites: number;
}

interface SelectedSeiyuu {
  id: number;
  name: string;
  image: string;
}

const ANILIST_URL = "https://graphql.anilist.co";
const CACHE_TTL = 24 * 60 * 60 * 1000;
const MAX_SEIYUU = 9;
const DEBOUNCE_MS = 500;
const CANVAS_SIZE = 1080;

const JP_RE = /[\u3000-\u303F\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF]/;
function isJapanese(s: string | null | undefined): s is string {
  return !!s && JP_RE.test(s);
}

function displayName(name: { full: string; native: string | null }): string {
  return isJapanese(name.native) ? name.native : name.full;
}

function getCached<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const { data, ts } = JSON.parse(raw);
    if (Date.now() - ts > CACHE_TTL) {
      localStorage.removeItem(key);
      return null;
    }
    return data as T;
  } catch {
    return null;
  }
}

function setCache<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify({ data, ts: Date.now() }));
  } catch {
    /* localStorage full */
  }
}

class RateLimitError extends Error {
  retryAfter: number;
  constructor(retryAfter: number) {
    super("Rate limited");
    this.retryAfter = retryAfter;
  }
}

const RATE_LIMIT_MSG = "AniList APIが規制中です。しばらくお待ちください。";

async function anilistQuery<T>(
  query: string,
  variables: Record<string, unknown>
): Promise<T> {
  const res = await fetch(ANILIST_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables }),
  });
  if (res.status === 429) {
    const retry = Number(res.headers.get("retry-after")) || 60;
    throw new RateLimitError(retry);
  }
  if (!res.ok) throw new Error("AniList API error");
  const json = await res.json();
  if (json.errors)
    throw new Error(json.errors[0]?.message || "GraphQL error");
  return json.data as T;
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

const KANA_COMBOS: Record<string, string> = {
  きゃ: "kya", きゅ: "kyu", きょ: "kyo",
  しゃ: "sha", しゅ: "shu", しょ: "sho",
  ちゃ: "cha", ちゅ: "chu", ちょ: "cho",
  にゃ: "nya", にゅ: "nyu", にょ: "nyo",
  ひゃ: "hya", ひゅ: "hyu", ひょ: "hyo",
  みゃ: "mya", みゅ: "myu", みょ: "myo",
  りゃ: "rya", りゅ: "ryu", りょ: "ryo",
  ぎゃ: "gya", ぎゅ: "gyu", ぎょ: "gyo",
  じゃ: "ja", じゅ: "ju", じょ: "jo",
  びゃ: "bya", びゅ: "byu", びょ: "byo",
  ぴゃ: "pya", ぴゅ: "pyu", ぴょ: "pyo",
};

const KANA_SINGLES: Record<string, string> = {
  あ: "a", い: "i", う: "u", え: "e", お: "o",
  か: "ka", き: "ki", く: "ku", け: "ke", こ: "ko",
  さ: "sa", し: "shi", す: "su", せ: "se", そ: "so",
  た: "ta", ち: "chi", つ: "tsu", て: "te", と: "to",
  な: "na", に: "ni", ぬ: "nu", ね: "ne", の: "no",
  は: "ha", ひ: "hi", ふ: "fu", へ: "he", ほ: "ho",
  ま: "ma", み: "mi", む: "mu", め: "me", も: "mo",
  や: "ya", ゆ: "yu", よ: "yo",
  ら: "ra", り: "ri", る: "ru", れ: "re", ろ: "ro",
  わ: "wa", を: "wo", ん: "n",
  が: "ga", ぎ: "gi", ぐ: "gu", げ: "ge", ご: "go",
  ざ: "za", じ: "ji", ず: "zu", ぜ: "ze", ぞ: "zo",
  だ: "da", ぢ: "di", づ: "du", で: "de", ど: "do",
  ば: "ba", び: "bi", ぶ: "bu", べ: "be", ぼ: "bo",
  ぱ: "pa", ぴ: "pi", ぷ: "pu", ぺ: "pe", ぽ: "po",
};

function toRomaji(input: string): string {
  const hira = input.replace(/[\u30A1-\u30F6]/g, (ch) =>
    String.fromCharCode(ch.charCodeAt(0) - 0x60)
  );
  let result = "";
  let i = 0;
  while (i < hira.length) {
    if (hira[i] === "っ" && i + 1 < hira.length) {
      const next = KANA_SINGLES[hira[i + 1]] || "";
      if (next) result += next[0];
      i++;
      continue;
    }
    if (i + 1 < hira.length && KANA_COMBOS[hira.slice(i, i + 2)]) {
      result += KANA_COMBOS[hira.slice(i, i + 2)];
      i += 2;
      continue;
    }
    if (KANA_SINGLES[hira[i]]) {
      result += KANA_SINGLES[hira[i]];
      i++;
      continue;
    }
    result += hira[i];
    i++;
  }
  return result;
}

function containsKana(str: string): boolean {
  return /[\u3040-\u309F\u30A0-\u30FF]/.test(str);
}

function padSearch(term: string): string {
  return term.padEnd(3, " ");
}

function filterStaffByQuery(
  results: StaffResult[],
  rawQuery: string
): StaffResult[] {
  const q = rawQuery.trim();
  if (!q || !/[\u4E00-\u9FFF]/.test(q)) return results;
  return results.filter((s) => (s.name.native ?? "").includes(q));
}

function dailyToStaff(
  va: (typeof DAILY_SEIYUU)[number]
): StaffResult {
  return {
    id: va.id,
    name: { full: va.name, native: va.name },
    image: { large: va.image },
    favourites: 0,
  };
}

const SEARCH_QUERY = `
  query ($search: String) {
    Page(perPage: 10) {
      staff(search: $search, sort: [SEARCH_MATCH]) {
        id
        name { full native }
        image { large }
        favourites
      }
    }
  }
`;

type Step = "select" | "result";

export default function Seiyuu9Page(): React.ReactElement {
  const [step, setStep] = useState<Step>("select");
  const [query, setQuery] = useState("");
  const [staffResults, setStaffResults] = useState<StaffResult[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [selectedSeiyuu, setSelectedSeiyuu] = useState<SelectedSeiyuu[]>([]);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const stepRef = useRef<Step>("select");
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  function goToStep(next: Step): void {
    if (next !== stepRef.current) {
      history.pushState({ step: next }, "");
    }
    stepRef.current = next;
    setStep(next);
  }

  useEffect(() => {
    history.replaceState({ step: "select" }, "");

    function onPopState(e: PopStateEvent): void {
      const prev = (e.state?.step as Step) || "select";
      stepRef.current = prev;
      setStep(prev);
      if (prev === "select") {
        setGeneratedImage(null);
      }
    }
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  const searchStaff = useCallback(async (q: string) => {
    if (q.trim().length < 1) {
      setStaffResults([]);
      setSearchError("");
      return;
    }

    const cacheKey = `mybest9_search_${q.trim()}`;
    const cached = getCached<StaffResult[]>(cacheKey);
    if (cached) {
      setStaffResults(filterStaffByQuery(cached, q.trim()));
      setSearchError("");
      return;
    }

    setSearchLoading(true);
    setSearchError("");
    try {
      const raw = q.trim();
      let results: StaffResult[] = [];

      if (containsKana(raw)) {
        const romaji = toRomaji(raw);
        if (!romaji.includes(" ") && romaji.length >= 3) {
          const mid = Math.floor(romaji.length / 2);
          const positions: number[] = [];
          for (let off = 0; off <= mid; off++) {
            if (mid + off <= romaji.length - 1) positions.push(mid + off);
            if (off > 0 && mid - off >= 2) positions.push(mid - off);
          }
          const queries = [
            romaji,
            ...positions
              .slice(0, 5)
              .map((i) => romaji.slice(0, i) + " " + romaji.slice(i)),
          ];
          const all = await Promise.all(
            queries.map((term) =>
              anilistQuery<{ Page: { staff: StaffResult[] } }>(SEARCH_QUERY, {
                search: padSearch(term),
              }).catch(() => ({ Page: { staff: [] } }))
            )
          );
          const seen = new Set<number>();
          for (const d of all) {
            for (const s of d.Page.staff) {
              if (!seen.has(s.id)) {
                seen.add(s.id);
                results.push(s);
              }
            }
          }
        } else {
          const data = await anilistQuery<{
            Page: { staff: StaffResult[] };
          }>(SEARCH_QUERY, { search: padSearch(romaji) });
          results = data.Page.staff;
        }
      } else {
        const data = await anilistQuery<{
          Page: { staff: StaffResult[] };
        }>(SEARCH_QUERY, { search: padSearch(raw) });
        results = data.Page.staff;
      }

      setStaffResults(filterStaffByQuery(results, raw));
      setCache(cacheKey, results);
    } catch (err) {
      setStaffResults([]);
      setSearchError(
        err instanceof RateLimitError
          ? RATE_LIMIT_MSG
          : "検索に失敗しました。少し時間をおいて再度お試しください。"
      );
    } finally {
      setSearchLoading(false);
    }
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => searchStaff(query), DEBOUNCE_MS);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, searchStaff]);

  function selectSeiyuu(staff: StaffResult): void {
    if (selectedSeiyuu.length >= MAX_SEIYUU) return;
    if (selectedSeiyuu.some((s) => s.id === staff.id)) return;
    setSelectedSeiyuu((prev) => [
      ...prev,
      {
        id: staff.id,
        name: displayName(staff.name),
        image: staff.image.large,
      },
    ]);
    setQuery("");
    setStaffResults([]);
    setShowSearch(false);
  }

  function selectDailySeiyuu(
    va: (typeof DAILY_SEIYUU)[number]
  ): void {
    if (selectedSeiyuu.length >= MAX_SEIYUU) return;
    if (selectedSeiyuu.some((s) => s.id === va.id)) return;
    setSelectedSeiyuu((prev) => [
      ...prev,
      { id: va.id, name: va.name, image: va.image },
    ]);
  }

  function removeSeiyuu(id: number): void {
    setSelectedSeiyuu((prev) => prev.filter((s) => s.id !== id));
  }

  async function fetchImageAsDataUrl(imageUrl: string): Promise<string> {
    try {
      const res = await fetch(
        `/api/my-best/image-proxy?url=${encodeURIComponent(imageUrl)}`
      );
      const blob = await res.blob();
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = () => resolve(imageUrl);
        reader.readAsDataURL(blob);
      });
    } catch {
      return imageUrl;
    }
  }

  async function generateImage(): Promise<void> {
    if (selectedSeiyuu.length < 1) return;
    setGenerating(true);

    try {
      const dataUrls = await Promise.all(
        selectedSeiyuu.map((s) => fetchImageAsDataUrl(s.image))
      );
      const images = await Promise.all(dataUrls.map(loadImage));

      const size = CANVAS_SIZE;
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d")!;

      // Background
      ctx.fillStyle = "#0a0a0a";
      ctx.fillRect(0, 0, size, size);

      // Title area
      const titleH = 80;
      const footerH = 40;
      const gridArea = size - titleH - footerH;
      const cellSize = Math.floor(gridArea / 3);
      const gridOffset = titleH;
      const gap = 3;

      // Title
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 32px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("私を構成する9人の声優", size / 2, titleH / 2);

      // Draw 3x3 grid
      const count = selectedSeiyuu.length;
      for (let i = 0; i < 9; i++) {
        const row = Math.floor(i / 3);
        const col = i % 3;
        const x = col * cellSize + gap;
        const y = gridOffset + row * cellSize + gap;
        const w = cellSize - gap * 2;
        const h = cellSize - gap * 2;

        if (i < count) {
          const img = images[i];
          const imgAspect = img.naturalWidth / img.naturalHeight;
          const cellAspect = w / h;
          let drawW: number, drawH: number;
          if (imgAspect > cellAspect) {
            drawH = h;
            drawW = h * imgAspect;
          } else {
            drawW = w;
            drawH = w / imgAspect;
          }

          ctx.save();
          ctx.beginPath();
          ctx.rect(x, y, w, h);
          ctx.clip();
          ctx.drawImage(
            img,
            x + (w - drawW) / 2,
            y + (h - drawH) / 2,
            drawW,
            drawH
          );
          ctx.restore();

          // Name label at bottom of cell
          const labelH = 28;
          ctx.fillStyle = "rgba(0,0,0,0.7)";
          ctx.fillRect(x, y + h - labelH, w, labelH);
          ctx.fillStyle = "#ffffff";
          ctx.font = "bold 14px sans-serif";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          const nameText = selectedSeiyuu[i].name;
          ctx.fillText(nameText, x + w / 2, y + h - labelH / 2, w - 8);
        } else {
          // Empty cell
          ctx.fillStyle = "#1a1a1a";
          ctx.fillRect(x, y, w, h);
        }
      }

      // Footer
      ctx.fillStyle = "#555555";
      ctx.font = "13px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(
        "fugaapp.site/my-best/seiyuu-9",
        size / 2,
        size - footerH / 2
      );

      setGeneratedImage(canvas.toDataURL("image/png"));
      goToStep("result");
    } catch {
      alert("画像の生成に失敗しました。もう一度お試しください。");
    } finally {
      setGenerating(false);
    }
  }

  async function shareToX(): Promise<void> {
    if (!generatedImage) return;
    const nameList = selectedSeiyuu.map((s) => s.name).join("、");
    const text = `私を構成する9人の声優\n\n${nameList}\n\nfugaapp.site/my-best/seiyuu-9`;
    const hashtags = "#私を構成する9人の声優 #声優好きと繋がりたい ";

    if (navigator.share && navigator.canShare) {
      try {
        const res = await fetch(generatedImage);
        const blob = await res.blob();
        const file = new File([blob], "私を構成する9人の声優.png", {
          type: "image/png",
        });
        if (navigator.canShare({ files: [file] })) {
          await navigator.share({
            text: `${text}\n${hashtags}`,
            files: [file],
          });
          return;
        }
      } catch {
        return;
      }
    }

    const a = document.createElement("a");
    a.href = generatedImage;
    a.download = "私を構成する9人の声優.png";
    a.click();

    const encoded = encodeURIComponent(`${text}\n${hashtags}`);
    setTimeout(() => {
      window.open(`https://x.com/intent/tweet?text=${encoded}`, "_blank");
    }, 800);
  }

  function reset(): void {
    setSelectedSeiyuu([]);
    setGeneratedImage(null);
    setQuery("");
    setStaffResults([]);
    setShowSearch(false);
    if (stepRef.current === "result") {
      history.back();
    }
  }

  const availableDaily = DAILY_SEIYUU.filter(
    (va) => !selectedSeiyuu.some((s) => s.id === va.id)
  );

  const footer = (
    <footer className="px-4 py-6 mt-8 border-t border-neutral-800/50 text-center text-[10px] text-neutral-600 space-y-1">
      <p>
        データ提供:{" "}
        <a
          href="https://anilist.co"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-neutral-400"
        >
          AniList
        </a>
      </p>
      <p>
        <a href="/my-best/terms" className="underline hover:text-neutral-400">
          利用規約
        </a>
        {" | "}
        <a href="/privacy" className="underline hover:text-neutral-400">
          プライバシーポリシー
        </a>
      </p>
      <p>&copy; 2026 fugaapp</p>
    </footer>
  );

  return (
    <div>
      {step === "select" && (
        <div className="px-4 pt-12 pb-8">
          <h1 className="text-xl font-bold text-center text-white tracking-tight">
            私を構成する9人の声優
          </h1>
          <p className="text-neutral-500 text-center text-[11px] mt-1 mb-6">
            好きな声優を9人選んで画像を作ろう
          </p>

          {/* Selected grid preview */}
          <div className="grid grid-cols-3 gap-1.5 mb-6 max-w-xs mx-auto">
            {Array.from({ length: MAX_SEIYUU }, (_, i) => {
              const seiyuu = selectedSeiyuu[i];
              return (
                <div
                  key={i}
                  className="relative aspect-square rounded-lg overflow-hidden"
                >
                  {seiyuu ? (
                    <button
                      onClick={() => removeSeiyuu(seiyuu.id)}
                      className="w-full h-full group"
                    >
                      <img
                        src={seiyuu.image}
                        alt={seiyuu.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/0 group-active:bg-black/40 transition-colors" />
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-1 pb-1 pt-3">
                        <p className="text-[9px] text-white truncate text-center font-medium">
                          {seiyuu.name}
                        </p>
                      </div>
                      <div className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 group-active:opacity-100 transition-opacity">
                        <svg
                          className="w-2.5 h-2.5 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={3}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </div>
                    </button>
                  ) : (
                    <div className="w-full h-full border border-dashed border-neutral-700 bg-neutral-900/50 rounded-lg flex items-center justify-center">
                      <span className="text-neutral-700 text-lg">+</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <p className="text-center text-xs text-neutral-500 mb-4 tabular-nums">
            {selectedSeiyuu.length} / {MAX_SEIYUU}
          </p>

          {/* Search toggle */}
          {selectedSeiyuu.length < MAX_SEIYUU && (
            <>
              {showSearch ? (
                <div className="mb-4">
                  <div className="relative">
                    <svg
                      className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                    <input
                      ref={searchInputRef}
                      type="text"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="声優名を検索"
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-lg pl-9 pr-4 py-2.5 text-white text-sm placeholder-neutral-600 outline-none focus:border-neutral-600 transition-colors"
                      autoFocus
                    />
                    {searchLoading && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-neutral-500 border-t-transparent" />
                      </div>
                    )}
                  </div>

                  {searchError && (
                    <p className="text-center text-xs text-red-400 mt-2">
                      {searchError}
                    </p>
                  )}

                  <div className="grid grid-cols-3 gap-2 mt-3">
                    {staffResults.map((s) => {
                      const alreadySelected = selectedSeiyuu.some(
                        (sel) => sel.id === s.id
                      );
                      return (
                        <button
                          key={s.id}
                          onClick={() => selectSeiyuu(s)}
                          disabled={alreadySelected}
                          className={`flex flex-col items-center gap-1.5 py-3 rounded-xl active:bg-neutral-800/60 transition-colors ${alreadySelected ? "opacity-30" : ""}`}
                        >
                          <img
                            src={s.image.large}
                            alt={displayName(s.name)}
                            className="h-16 w-16 rounded-full object-cover"
                          />
                          <div className="text-center min-w-0 w-full px-1">
                            <div className="font-bold text-[12px] text-white truncate leading-tight">
                              {displayName(s.name)}
                            </div>
                            {s.name.native && s.name.full && (
                              <div className="text-[10px] text-neutral-500 truncate leading-tight mt-0.5">
                                {s.name.full}
                              </div>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {query.length >= 1 &&
                    !searchLoading &&
                    !searchError &&
                    staffResults.length === 0 && (
                      <p className="text-center text-xs text-neutral-600 py-8">
                        該当する声優が見つかりませんでした
                      </p>
                    )}

                  <button
                    onClick={() => {
                      setShowSearch(false);
                      setQuery("");
                      setStaffResults([]);
                    }}
                    className="w-full text-neutral-500 text-xs py-2 mt-2 active:text-neutral-300 transition-colors"
                  >
                    閉じる
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setShowSearch(true);
                    setTimeout(() => searchInputRef.current?.focus(), 100);
                  }}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-lg py-2.5 text-neutral-400 text-sm mb-4 active:bg-neutral-800 transition-colors flex items-center justify-center gap-2"
                >
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                  声優を検索して追加
                </button>
              )}
            </>
          )}

          {/* Popular picks */}
          {selectedSeiyuu.length < MAX_SEIYUU && !showSearch && (
            <>
              <p className="text-[10px] text-neutral-500 uppercase tracking-widest mb-2">
                POPULAR
              </p>
              <div className="grid grid-cols-3 gap-2 pb-4">
                {availableDaily.map((va) => (
                  <button
                    key={va.id}
                    onClick={() => selectDailySeiyuu(va)}
                    className="flex flex-col items-center gap-1.5 py-3 rounded-xl active:bg-neutral-800/60 transition-colors"
                  >
                    <img
                      src={va.image}
                      alt={va.name}
                      className="w-14 h-14 rounded-full object-cover"
                    />
                    <span className="text-[11px] text-neutral-400 truncate w-full text-center px-1">
                      {va.name}
                    </span>
                  </button>
                ))}
              </div>
            </>
          )}

          {/* Generate button */}
          {selectedSeiyuu.length >= 1 && (
            <div className="fixed bottom-0 left-0 right-0 px-4 pb-5 pt-4 bg-gradient-to-t from-black via-black/95 to-transparent">
              <button
                onClick={generateImage}
                disabled={generating}
                className="w-full bg-white text-black text-sm font-bold py-3 rounded-lg active:scale-[0.98] transition-transform disabled:opacity-50"
              >
                {generating
                  ? "生成中..."
                  : `画像を生成する（${selectedSeiyuu.length}人）`}
              </button>
            </div>
          )}

          {footer}
        </div>
      )}

      {step === "result" && generatedImage && (
        <div>
          <div className="px-4 pt-6 pb-4">
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={() => history.back()}
                className="text-neutral-500 active:text-white transition-colors p-1 -ml-1"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <p className="text-sm font-bold text-white">
                私を構成する9人の声優
              </p>
              <div className="w-7" />
            </div>

            <div className="overflow-hidden rounded-lg">
              <img
                src={generatedImage}
                alt="私を構成する9人の声優"
                className="w-full block"
              />
            </div>
          </div>

          <div className="px-4 mt-1 space-y-3">
            {/* Share guide */}
            <div className="rounded-2xl bg-[#2c2c2e] overflow-hidden shadow-lg">
              <p className="text-[11px] text-neutral-400 text-center pt-2.5 pb-2">
                下のボタンで共有メニューが開きます
              </p>
              <div className="flex items-center gap-3 mx-3 mb-3 px-3 py-2.5 rounded-xl bg-[#1c1c1e]">
                <div className="w-10 h-10 rounded-lg bg-[#3a3a3c] flex items-center justify-center flex-shrink-0">
                  <svg
                    className="w-5 h-5 text-neutral-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div className="min-w-0">
                  <p className="text-[12px] text-white truncate">
                    私を構成する9人の声優.png
                  </p>
                  <p className="text-[10px] text-neutral-500">PNG画像</p>
                </div>
              </div>
              <div className="h-px bg-[#3a3a3c] mx-3" />
              <div className="flex items-start px-4 py-3 gap-5">
                <div className="flex flex-col items-center gap-1.5">
                  <div className="w-[52px] h-[52px] rounded-[13px] bg-black flex items-center justify-center ring-[2.5px] ring-blue-400">
                    <svg
                      className="w-6 h-6 text-white"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  </div>
                  <span className="text-[10px] text-white">X</span>
                </div>
                <div className="flex flex-col items-center gap-1.5 opacity-30">
                  <div className="w-[52px] h-[52px] rounded-[13px] bg-[#ffdc58]" />
                  <span className="text-[10px] text-neutral-500">メモ</span>
                </div>
                <div className="flex flex-col items-center gap-1.5 opacity-30">
                  <div className="w-[52px] h-[52px] rounded-[13px] bg-[#3a3a3c]" />
                  <span className="text-[10px] text-neutral-500">その他</span>
                </div>
              </div>
              <p className="text-[11px] text-blue-400 text-center pb-3 font-medium">
                ここをタップ！画像も自動で添付されます
              </p>
            </div>

            <button
              onClick={shareToX}
              className="w-full bg-white text-black text-sm font-bold py-3 rounded-lg active:scale-[0.98] transition-transform flex items-center justify-center gap-2"
            >
              <svg
                className="w-4 h-4"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              Xでシェア
            </button>
          </div>

          <div className="px-4 pt-4 pb-8">
            <button
              onClick={reset}
              className="w-full text-neutral-600 text-[11px] py-3 active:text-neutral-300 transition-colors"
            >
              もう一度作る
            </button>
          </div>

          {footer}
        </div>
      )}
    </div>
  );
}
