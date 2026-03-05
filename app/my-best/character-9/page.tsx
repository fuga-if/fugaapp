"use client";

import { useState, useEffect, useRef, useCallback } from "react";

/* ------------------------------------------------------------------ */
/*  Types                                                             */
/* ------------------------------------------------------------------ */

interface CharacterResult {
  id: number;
  name: { full: string; native: string | null };
  image: { large: string };
  media?: {
    nodes?: { title: { romaji: string; native: string | null } }[];
  };
}

interface MediaResult {
  id: number;
  title: { romaji: string; native: string | null };
  characters?: {
    nodes?: CharacterResult[];
  };
}

interface SelectedCharacter {
  id: number;
  name: string;
  image: string;
  animeName: string;
}

/* ------------------------------------------------------------------ */
/*  Constants                                                         */
/* ------------------------------------------------------------------ */

const ANILIST_URL = "https://graphql.anilist.co";
const CACHE_TTL = 24 * 60 * 60 * 1000;
const MAX_CHARS = 9;
const DEBOUNCE_MS = 500;
const CANVAS_SIZE = 1080;

/* ------------------------------------------------------------------ */
/*  Helpers                                                           */
/* ------------------------------------------------------------------ */

const JP_RE = /[\u3000-\u303F\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF]/;

function isJapanese(s: string | null | undefined): s is string {
  return !!s && JP_RE.test(s);
}

function displayCharName(name: {
  full: string;
  native: string | null;
}): string {
  return isJapanese(name.native) ? name.native : name.full;
}

function displayMediaTitle(title: {
  romaji: string;
  native: string | null;
}): string {
  return isJapanese(title.native) ? title.native : title.romaji;
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

function padSearch(term: string): string {
  return term.padEnd(3, " ");
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

/* ------------------------------------------------------------------ */
/*  GraphQL Queries                                                   */
/* ------------------------------------------------------------------ */

const CHARACTER_SEARCH_QUERY = `
  query ($search: String) {
    Page(perPage: 12) {
      characters(search: $search, sort: [SEARCH_MATCH]) {
        id
        name { full native }
        image { large }
        media(type: ANIME, perPage: 1) {
          nodes {
            title { romaji native }
          }
        }
      }
    }
  }
`;

const MEDIA_SEARCH_QUERY = `
  query ($search: String) {
    Page(perPage: 6) {
      media(search: $search, type: ANIME, sort: [SEARCH_MATCH]) {
        id
        title { romaji native }
        characters(sort: [FAVOURITES_DESC], perPage: 20) {
          nodes {
            id
            name { full native }
            image { large }
          }
        }
      }
    }
  }
`;

/* ------------------------------------------------------------------ */
/*  Component                                                         */
/* ------------------------------------------------------------------ */

type Step = "select" | "browse" | "result";
type SearchMode = "character" | "anime";

export default function Character9Page(): React.ReactElement {
  const [step, setStep] = useState<Step>("select");
  const [query, setQuery] = useState("");
  const [searchMode, setSearchMode] = useState<SearchMode>("character");
  const [charResults, setCharResults] = useState<CharacterResult[]>([]);
  const [mediaResults, setMediaResults] = useState<MediaResult[]>([]);
  const [browseMedia, setBrowseMedia] = useState<MediaResult | null>(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [selectedChars, setSelectedChars] = useState<SelectedCharacter[]>([]);
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
        setBrowseMedia(null);
      }
      if (prev !== "browse") {
        setBrowseMedia(null);
      }
    }
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  /* ---------------------------------------------------------------- */
  /*  Search logic                                                    */
  /* ---------------------------------------------------------------- */

  const doSearch = useCallback(
    async (q: string) => {
      if (q.trim().length < 1) {
        setCharResults([]);
        setMediaResults([]);
        setSearchError("");
        return;
      }

      const raw = q.trim();
      const cacheKey = `mybest_char9_${searchMode}_${raw}`;
      const cached = getCached<CharacterResult[] | MediaResult[]>(cacheKey);

      if (cached) {
        if (searchMode === "character") {
          setCharResults(cached as CharacterResult[]);
          setMediaResults([]);
        } else {
          setMediaResults(cached as MediaResult[]);
          setCharResults([]);
        }
        setSearchError("");
        return;
      }

      setSearchLoading(true);
      setSearchError("");

      try {
        let searchTerm = raw;
        if (containsKana(raw)) {
          searchTerm = toRomaji(raw);
        }

        if (searchMode === "character") {
          const data = await anilistQuery<{
            Page: { characters: CharacterResult[] };
          }>(CHARACTER_SEARCH_QUERY, { search: padSearch(searchTerm) });
          const results = data.Page.characters;
          setCharResults(results);
          setMediaResults([]);
          setCache(cacheKey, results);
        } else {
          const data = await anilistQuery<{
            Page: { media: MediaResult[] };
          }>(MEDIA_SEARCH_QUERY, { search: padSearch(searchTerm) });
          const results = data.Page.media;
          setMediaResults(results);
          setCharResults([]);
          setCache(cacheKey, results);
        }
      } catch (err) {
        setCharResults([]);
        setMediaResults([]);
        setSearchError(
          err instanceof RateLimitError
            ? RATE_LIMIT_MSG
            : "検索に失敗しました。少し時間をおいて再度お試しください。"
        );
      } finally {
        setSearchLoading(false);
      }
    },
    [searchMode]
  );

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => doSearch(query), DEBOUNCE_MS);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, doSearch]);

  /* ---------------------------------------------------------------- */
  /*  Selection logic                                                 */
  /* ---------------------------------------------------------------- */

  function addCharFromSearch(char: CharacterResult): void {
    if (selectedChars.length >= MAX_CHARS) return;
    if (selectedChars.some((c) => c.id === char.id)) return;
    const anime = char.media?.nodes?.[0];
    setSelectedChars((prev) => [
      ...prev,
      {
        id: char.id,
        name: displayCharName(char.name),
        image: char.image.large,
        animeName: anime ? displayMediaTitle(anime.title) : "",
      },
    ]);
  }

  function addCharFromBrowse(
    char: CharacterResult,
    mediaTitle: { romaji: string; native: string | null }
  ): void {
    if (selectedChars.length >= MAX_CHARS) return;
    if (selectedChars.some((c) => c.id === char.id)) return;
    setSelectedChars((prev) => [
      ...prev,
      {
        id: char.id,
        name: displayCharName(char.name),
        image: char.image.large,
        animeName: displayMediaTitle(mediaTitle),
      },
    ]);
  }

  function removeChar(id: number): void {
    setSelectedChars((prev) => prev.filter((c) => c.id !== id));
  }

  function openMediaBrowse(media: MediaResult): void {
    setBrowseMedia(media);
    goToStep("browse");
  }

  /* ---------------------------------------------------------------- */
  /*  Image generation                                                */
  /* ---------------------------------------------------------------- */

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
    if (selectedChars.length < 1) return;
    setGenerating(true);

    try {
      const dataUrls = await Promise.all(
        selectedChars.map((c) => fetchImageAsDataUrl(c.image))
      );
      const images = await Promise.all(dataUrls.map(loadImage));

      const size = CANVAS_SIZE;
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d")!;

      ctx.fillStyle = "#0a0a0a";
      ctx.fillRect(0, 0, size, size);

      const titleH = 80;
      const footerH = 40;
      const gridArea = size - titleH - footerH;
      const cellSize = Math.floor(gridArea / 3);
      const gridOffset = titleH;
      const gap = 3;

      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 32px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("私を構成する9つのキャラ", size / 2, titleH / 2);

      const count = selectedChars.length;
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

          // Character name + anime name label
          const labelH = 36;
          ctx.fillStyle = "rgba(0,0,0,0.75)";
          ctx.fillRect(x, y + h - labelH, w, labelH);
          ctx.fillStyle = "#ffffff";
          ctx.font = "bold 13px sans-serif";
          ctx.textAlign = "center";
          ctx.textBaseline = "top";
          ctx.fillText(
            selectedChars[i].name,
            x + w / 2,
            y + h - labelH + 4,
            w - 8
          );
          if (selectedChars[i].animeName) {
            ctx.fillStyle = "rgba(255,255,255,0.5)";
            ctx.font = "10px sans-serif";
            ctx.fillText(
              selectedChars[i].animeName,
              x + w / 2,
              y + h - labelH + 21,
              w - 8
            );
          }
        } else {
          ctx.fillStyle = "#1a1a1a";
          ctx.fillRect(x, y, w, h);
        }
      }

      ctx.fillStyle = "#555555";
      ctx.font = "13px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(
        "fugaapp.site/my-best/character-9",
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
    const nameList = selectedChars.map((c) => c.name).join("、");
    const text = `私を構成する9つのキャラ\n\n${nameList}\n\nfugaapp.site/my-best/character-9`;
    const hashtags = "#私を構成する9つのキャラ #アニメ好きと繋がりたい ";

    if (navigator.share && navigator.canShare) {
      try {
        const res = await fetch(generatedImage);
        const blob = await res.blob();
        const file = new File([blob], "私を構成する9つのキャラ.png", {
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
    a.download = "私を構成する9つのキャラ.png";
    a.click();

    const encoded = encodeURIComponent(`${text}\n${hashtags}`);
    setTimeout(() => {
      window.open(`https://x.com/intent/tweet?text=${encoded}`, "_blank");
    }, 800);
  }

  function reset(): void {
    setSelectedChars([]);
    setGeneratedImage(null);
    setQuery("");
    setCharResults([]);
    setMediaResults([]);
    setBrowseMedia(null);
    setShowSearch(false);
    if (stepRef.current === "result") {
      history.back();
    }
  }

  /* ---------------------------------------------------------------- */
  /*  UI                                                              */
  /* ---------------------------------------------------------------- */

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

  /* ---- Browse media characters step ---- */
  if (step === "browse" && browseMedia) {
    const chars = browseMedia.characters?.nodes ?? [];
    return (
      <div>
        <div className="sticky top-0 z-20 bg-black/90 backdrop-blur-md border-b border-neutral-800/60">
          <div className="flex items-center gap-2.5 px-4 h-11">
            <button
              onClick={() => history.back()}
              className="text-neutral-400 active:text-white transition-colors -ml-1 p-1"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <span className="font-bold text-[13px] text-white flex-1 truncate">
              {displayMediaTitle(browseMedia.title)}
            </span>
            <span className="text-neutral-500 text-xs tabular-nums">
              {selectedChars.length} / {MAX_CHARS}
            </span>
          </div>
        </div>

        <div className={`grid grid-cols-3 gap-px bg-neutral-900 ${selectedChars.length >= 1 ? "pb-20" : "pb-4"}`}>
          {chars.map((char) => {
            const isSelected = selectedChars.some((c) => c.id === char.id);
            const isDisabled = selectedChars.length >= MAX_CHARS && !isSelected;
            return (
              <button
                key={char.id}
                onClick={() => {
                  if (isSelected) {
                    removeChar(char.id);
                  } else {
                    addCharFromBrowse(char, browseMedia.title);
                  }
                }}
                disabled={isDisabled && !isSelected}
                className={`relative aspect-[3/4] overflow-hidden bg-black ${isDisabled ? "opacity-25" : ""} ${isSelected ? "ring-1 ring-inset ring-white" : ""}`}
              >
                <img
                  src={char.image.large}
                  alt={displayCharName(char.name)}
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent px-1.5 pb-1.5 pt-6">
                  <p className="text-[10px] font-medium text-white truncate leading-tight">
                    {displayCharName(char.name)}
                  </p>
                </div>
                {isSelected && (
                  <div className="absolute top-1 right-1 w-5 h-5 rounded-full bg-white flex items-center justify-center shadow-sm">
                    <svg className="w-3 h-3 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {chars.length === 0 && (
          <p className="text-center text-xs text-neutral-600 py-12">
            キャラクターが見つかりませんでした
          </p>
        )}

        {selectedChars.length >= 1 && (
          <div className="fixed bottom-0 left-0 right-0 px-4 pb-5 pt-4 bg-gradient-to-t from-black via-black/95 to-transparent">
            <button
              onClick={generateImage}
              disabled={generating}
              className="w-full bg-white text-black text-sm font-bold py-3 rounded-lg active:scale-[0.98] transition-transform disabled:opacity-50"
            >
              {generating
                ? "生成中..."
                : `画像を生成する（${selectedChars.length}人）`}
            </button>
          </div>
        )}

        {footer}
      </div>
    );
  }

  /* ---- Select step ---- */
  if (step === "select") {
    return (
      <div>
        <div className="px-4 pt-12 pb-8">
          <h1 className="text-xl font-bold text-center text-white tracking-tight">
            私を構成する9つのキャラ
          </h1>
          <p className="text-neutral-500 text-center text-[11px] mt-1 mb-6">
            好きなアニメキャラを9人選んで画像を作ろう
          </p>

          {/* Selected grid preview */}
          <div className="grid grid-cols-3 gap-1.5 mb-6 max-w-xs mx-auto">
            {Array.from({ length: MAX_CHARS }, (_, i) => {
              const char = selectedChars[i];
              return (
                <div
                  key={i}
                  className="relative aspect-square rounded-lg overflow-hidden"
                >
                  {char ? (
                    <button
                      onClick={() => removeChar(char.id)}
                      className="w-full h-full group"
                    >
                      <img
                        src={char.image}
                        alt={char.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/0 group-active:bg-black/40 transition-colors" />
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-1 pb-1 pt-3">
                        <p className="text-[8px] text-white truncate text-center font-medium">
                          {char.name}
                        </p>
                        {char.animeName && (
                          <p className="text-[7px] text-white/50 truncate text-center">
                            {char.animeName}
                          </p>
                        )}
                      </div>
                      <div className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 group-active:opacity-100 transition-opacity">
                        <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
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
            {selectedChars.length} / {MAX_CHARS}
          </p>

          {/* Search */}
          {selectedChars.length < MAX_CHARS && (
            <>
              {showSearch ? (
                <div className="mb-4">
                  {/* Mode toggle */}
                  <div className="flex gap-1 mb-3">
                    <button
                      onClick={() => {
                        setSearchMode("character");
                        setQuery("");
                        setCharResults([]);
                        setMediaResults([]);
                      }}
                      className={`flex-1 py-1.5 rounded-md text-xs font-medium transition-colors ${searchMode === "character" ? "bg-white text-black" : "bg-neutral-900 text-neutral-500 border border-neutral-800"}`}
                    >
                      キャラ名で検索
                    </button>
                    <button
                      onClick={() => {
                        setSearchMode("anime");
                        setQuery("");
                        setCharResults([]);
                        setMediaResults([]);
                      }}
                      className={`flex-1 py-1.5 rounded-md text-xs font-medium transition-colors ${searchMode === "anime" ? "bg-white text-black" : "bg-neutral-900 text-neutral-500 border border-neutral-800"}`}
                    >
                      作品名で検索
                    </button>
                  </div>

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
                      placeholder={
                        searchMode === "character"
                          ? "キャラ名を入力"
                          : "作品名を入力"
                      }
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

                  {/* Character search results */}
                  {searchMode === "character" && charResults.length > 0 && (
                    <div className="grid grid-cols-3 gap-2 mt-3">
                      {charResults.map((c) => {
                        const alreadySelected = selectedChars.some(
                          (sel) => sel.id === c.id
                        );
                        const anime = c.media?.nodes?.[0];
                        return (
                          <button
                            key={c.id}
                            onClick={() => addCharFromSearch(c)}
                            disabled={alreadySelected}
                            className={`flex flex-col items-center gap-1 py-2 rounded-xl active:bg-neutral-800/60 transition-colors ${alreadySelected ? "opacity-30" : ""}`}
                          >
                            <img
                              src={c.image.large}
                              alt={displayCharName(c.name)}
                              className="h-20 w-16 rounded-md object-cover"
                            />
                            <div className="text-center min-w-0 w-full px-1">
                              <div className="font-bold text-[11px] text-white truncate leading-tight">
                                {displayCharName(c.name)}
                              </div>
                              {anime && (
                                <div className="text-[9px] text-neutral-500 truncate leading-tight mt-0.5">
                                  {displayMediaTitle(anime.title)}
                                </div>
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* Anime search results */}
                  {searchMode === "anime" && mediaResults.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {mediaResults.map((m) => (
                        <button
                          key={m.id}
                          onClick={() => openMediaBrowse(m)}
                          className="flex items-center gap-3 w-full px-3 py-3 bg-neutral-900/80 rounded-xl active:bg-neutral-800 transition-colors text-left"
                        >
                          <div className="flex-1 min-w-0">
                            <p className="text-white font-bold text-sm truncate">
                              {displayMediaTitle(m.title)}
                            </p>
                            <p className="text-neutral-500 text-[11px]">
                              {m.characters?.nodes?.length ?? 0}キャラ
                            </p>
                          </div>
                          <svg
                            className="h-4 w-4 text-neutral-600 flex-shrink-0"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      ))}
                    </div>
                  )}

                  {query.length >= 1 &&
                    !searchLoading &&
                    !searchError &&
                    charResults.length === 0 &&
                    mediaResults.length === 0 && (
                      <p className="text-center text-xs text-neutral-600 py-8">
                        {searchMode === "character"
                          ? "該当するキャラが見つかりませんでした"
                          : "該当する作品が見つかりませんでした"}
                      </p>
                    )}

                  <button
                    onClick={() => {
                      setShowSearch(false);
                      setQuery("");
                      setCharResults([]);
                      setMediaResults([]);
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
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  キャラ名・作品名で検索して追加
                </button>
              )}
            </>
          )}

          {/* Generate button */}
          {selectedChars.length >= 1 && (
            <div className="fixed bottom-0 left-0 right-0 px-4 pb-5 pt-4 bg-gradient-to-t from-black via-black/95 to-transparent">
              <button
                onClick={generateImage}
                disabled={generating}
                className="w-full bg-white text-black text-sm font-bold py-3 rounded-lg active:scale-[0.98] transition-transform disabled:opacity-50"
              >
                {generating
                  ? "生成中..."
                  : `画像を生成する（${selectedChars.length}人）`}
              </button>
            </div>
          )}

          {footer}
        </div>
      </div>
    );
  }

  /* ---- Result step ---- */
  if (step === "result" && generatedImage) {
    return (
      <div>
        <div className="px-4 pt-6 pb-4">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => history.back()}
              className="text-neutral-500 active:text-white transition-colors p-1 -ml-1"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <p className="text-sm font-bold text-white">
              私を構成する9つのキャラ
            </p>
            <div className="w-7" />
          </div>

          <div className="overflow-hidden rounded-lg">
            <img
              src={generatedImage}
              alt="私を構成する9つのキャラ"
              className="w-full block"
            />
          </div>
        </div>

        <div className="px-4 mt-1 space-y-3">
          <div className="rounded-2xl bg-[#2c2c2e] overflow-hidden shadow-lg">
            <p className="text-[11px] text-neutral-400 text-center pt-2.5 pb-2">
              下のボタンで共有メニューが開きます
            </p>
            <div className="flex items-center gap-3 mx-3 mb-3 px-3 py-2.5 rounded-xl bg-[#1c1c1e]">
              <div className="w-10 h-10 rounded-lg bg-[#3a3a3c] flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="min-w-0">
                <p className="text-[12px] text-white truncate">
                  私を構成する9つのキャラ.png
                </p>
                <p className="text-[10px] text-neutral-500">PNG画像</p>
              </div>
            </div>
            <div className="h-px bg-[#3a3a3c] mx-3" />
            <div className="flex items-start px-4 py-3 gap-5">
              <div className="flex flex-col items-center gap-1.5">
                <div className="w-[52px] h-[52px] rounded-[13px] bg-black flex items-center justify-center ring-[2.5px] ring-blue-400">
                  <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
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
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
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
    );
  }

  return <div />;
}
