"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { DAILY_SEIYUU } from "@/lib/daily-seiyuu";

interface StaffResult {
  id: number;
  name: { full: string; native: string | null };
  image: { large: string };
  favourites: number;
}

interface VoiceRole {
  characterId: number;
  characterName: string;
  characterImage: string;
  animeTitle: string;
}

interface SelectedCharacter {
  id: number;
  name: string;
  image_url: string;
  anime_title: string;
}

const ANILIST_URL = "https://graphql.anilist.co";
const CACHE_TTL = 24 * 60 * 60 * 1000;
const MAX_CHARACTERS = 3;
const DEBOUNCE_MS = 500;
const CANVAS_W = 1200;
const CANVAS_H = 630;
const SKEW = 60;
const SLASH_GAP = 6;

function displayName(name: { full: string; native: string | null }): string {
  return name.native || name.full;
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

function dedupeRoles(roles: VoiceRole[]): VoiceRole[] {
  const seen = new Set<number>();
  return roles.filter((r) => {
    if (seen.has(r.characterId)) return false;
    seen.add(r.characterId);
    return true;
  });
}

class RateLimitError extends Error {
  retryAfter: number;
  constructor(retryAfter: number) {
    super("Rate limited");
    this.retryAfter = retryAfter;
  }
}

const RATE_LIMIT_MSG =
  "AniList APIが規制中です。しばらくお待ちください。";

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
  if (json.errors) throw new Error(json.errors[0]?.message || "GraphQL error");
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

// AniList search requires 3+ characters. Pad short queries with a space.
function padSearch(term: string): string {
  return term.padEnd(3, " ");
}

// For CJK queries, post-filter results where the query is a substring of native name.
function filterStaffByQuery(
  results: StaffResult[],
  rawQuery: string
): StaffResult[] {
  const q = rawQuery.trim();
  if (!q || !/[\u4E00-\u9FFF]/.test(q)) return results;
  return results.filter((s) => (s.name.native ?? "").includes(q));
}

function dailyToStaff(va: (typeof DAILY_SEIYUU)[number]): StaffResult {
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

const VOICES_QUERY = `
  query ($id: Int, $page: Int) {
    Staff(id: $id) {
      characterMedia(sort: [POPULARITY_DESC], perPage: 50, page: $page) {
        pageInfo { hasNextPage }
        edges {
          characters {
            id
            name { full native }
            image { large }
          }
          node {
            title { native romaji }
          }
        }
      }
    }
  }
`;

const STAFF_BY_ID_QUERY = `
  query ($id: Int) {
    Staff(id: $id) {
      id
      name { full native }
      image { large }
      favourites
    }
  }
`;

type Step = "search" | "select" | "result";

export default function MyBestPage(): React.ReactElement {
  const [step, setStep] = useState<Step>("search");
  const [query, setQuery] = useState("");
  const [staffResults, setStaffResults] = useState<StaffResult[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [selectedStaff, setSelectedStaff] = useState<StaffResult | null>(null);
  const [voiceRoles, setVoiceRoles] = useState<VoiceRole[]>([]);
  const [rolesLoading, setRolesLoading] = useState(false);
  const [rolesLoadingMore, setRolesLoadingMore] = useState(false);
  const [rolesError, setRolesError] = useState("");
  const [rolesHasMore, setRolesHasMore] = useState(false);
  const rolesPage = useRef(1);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const [selectedChars, setSelectedChars] = useState<SelectedCharacter[]>([]);
  const [charFilter, setCharFilter] = useState("");
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [ageRange, setAgeRange] = useState<string | null>(null);
  const [gender, setGender] = useState<string | null>(null);


  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const didAutoSelect = useRef(false);
  const stepRef = useRef<Step>("search");

  // Sync step changes with browser history
  function goToStep(next: Step): void {
    if (next !== stepRef.current) {
      history.pushState({ step: next }, "");
    }
    stepRef.current = next;
    setStep(next);
  }

  useEffect(() => {
    // Replace initial state so popstate always has step info
    history.replaceState({ step: "search" }, "");

    function onPopState(e: PopStateEvent): void {
      const prev = (e.state?.step as Step) || "search";
      stepRef.current = prev;
      setStep(prev);
      if (prev === "search") {
        setSelectedStaff(null);
        setVoiceRoles([]);
        setSelectedChars([]);
        setCharFilter("");
        setGeneratedImage(null);
        // Remove ?id= param so auto-select doesn't re-trigger on remount
        if (window.location.search) {
          history.replaceState({ step: "search" }, "", window.location.pathname);
        }
      } else if (prev === "select") {
        setSelectedChars([]);
        setGeneratedImage(null);
        setCharFilter("");
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

    const cacheKey = `mybest_search_${q.trim()}`;
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
        // スペースがなければ全分割位置で並行検索
        if (!romaji.includes(" ") && romaji.length >= 3) {
          const mid = Math.floor(romaji.length / 2);
          const positions: number[] = [];
          for (let off = 0; off <= mid; off++) {
            if (mid + off <= romaji.length - 1) positions.push(mid + off);
            if (off > 0 && mid - off >= 2) positions.push(mid - off);
          }
          const queries = [romaji, ...positions.slice(0, 5).map(
            (i) => romaji.slice(0, i) + " " + romaji.slice(i)
          )];
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

  async function fetchVoiceRolesPage(
    staffId: number,
    page: number
  ): Promise<{ roles: VoiceRole[]; hasMore: boolean }> {
    const data = await anilistQuery<{
      Staff: {
        characterMedia: {
          pageInfo: { hasNextPage: boolean };
          edges: {
            characters: {
              id: number;
              name: { full: string; native: string | null };
              image: { large: string };
            }[];
            node: {
              title: { native: string | null; romaji: string };
            };
          }[];
        };
      };
    }>(VOICES_QUERY, { id: staffId, page });

    const roles: VoiceRole[] = [];
    for (const edge of data.Staff.characterMedia.edges) {
      for (const char of edge.characters) {
        roles.push({
          characterId: char.id,
          characterName: char.name.native || char.name.full,
          characterImage: char.image.large,
          animeTitle: edge.node.title.native || edge.node.title.romaji,
        });
      }
    }
    return { roles, hasMore: data.Staff.characterMedia.pageInfo.hasNextPage };
  }

  const loadingMore = useRef(false);

  async function loadMoreRoles(): Promise<void> {
    if (!selectedStaff || loadingMore.current || !rolesHasMore) return;
    loadingMore.current = true;
    setRolesLoadingMore(true);
    try {
      const { roles, hasMore } = await fetchVoiceRolesPage(
        selectedStaff.id,
        rolesPage.current
      );
      setVoiceRoles((prev) => dedupeRoles([...prev, ...roles]));
      setRolesHasMore(hasMore);
      if (hasMore) rolesPage.current++;
    } catch {
      // Silently fail, user can scroll again
    } finally {
      loadingMore.current = false;
      setRolesLoadingMore(false);
    }
  }

  async function handleSelectStaff(staff: StaffResult): Promise<void> {
    setSelectedStaff(staff);
    setSelectedChars([]);
    setGeneratedImage(null);
    goToStep("select");

    const cacheKey = `mybest_voices_${staff.id}`;
    const cached = getCached<VoiceRole[]>(cacheKey);
    if (cached) {
      setVoiceRoles(dedupeRoles(cached));
      setRolesHasMore(false);
      return;
    }

    setRolesLoading(true);
    setRolesError("");
    rolesPage.current = 1;
    try {
      const { roles, hasMore } = await fetchVoiceRolesPage(staff.id, 1);
      const deduped = dedupeRoles(roles);
      setVoiceRoles(deduped);
      setRolesHasMore(hasMore);
      rolesPage.current = 2;
    } catch (err) {
      setVoiceRoles([]);
      setRolesError(
        err instanceof RateLimitError
          ? RATE_LIMIT_MSG
          : "キャラクター情報の取得に失敗しました。少し時間をおいて再度お試しください。"
      );
    } finally {
      setRolesLoading(false);
    }
  }

  useEffect(() => {
    if (didAutoSelect.current) return;
    const params = new URLSearchParams(window.location.search);
    const idParam = params.get("id");
    if (!idParam) return;
    const staffId = Number(idParam);
    if (!Number.isInteger(staffId) || staffId <= 0) return;
    didAutoSelect.current = true;

    const daily = DAILY_SEIYUU.find((va) => va.id === staffId);
    if (daily) {
      handleSelectStaff(dailyToStaff(daily));
      return;
    }

    anilistQuery<{ Staff: StaffResult }>(STAFF_BY_ID_QUERY, { id: staffId })
      .then((data) => handleSelectStaff(data.Staff))
      .catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Infinite scroll: observe sentinel element
  useEffect(() => {
    if (!loadMoreRef.current || !rolesHasMore) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) loadMoreRoles();
      },
      { rootMargin: "200px" }
    );
    observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rolesHasMore, rolesLoadingMore, selectedStaff]);

  function toggleCharacter(role: VoiceRole): void {
    const isAlreadySelected = selectedChars.some(
      (c) => c.id === role.characterId
    );
    if (isAlreadySelected) {
      setSelectedChars(
        selectedChars.filter((c) => c.id !== role.characterId)
      );
    } else if (selectedChars.length < MAX_CHARACTERS) {
      setSelectedChars([
        ...selectedChars,
        {
          id: role.characterId,
          name: role.characterName,
          image_url: role.characterImage,
          anime_title: role.animeTitle,
        },
      ]);
    }
  }

  function removeChar(charId: number): void {
    setSelectedChars(selectedChars.filter((c) => c.id !== charId));
  }

  const dragFrom = useRef<number | null>(null);

  function reorderChars(fromIdx: number, toIdx: number): void {
    if (fromIdx === toIdx) return;
    setSelectedChars((prev) => {
      const next = [...prev];
      const [moved] = next.splice(fromIdx, 1);
      next.splice(toIdx, 0, moved);
      return next;
    });
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
    const count = selectedChars.length;
    if (count < 1) return;
    setGenerating(true);

    try {
      const dataUrls = await Promise.all(
        selectedChars.map((c) => fetchImageAsDataUrl(c.image_url))
      );
      const images = await Promise.all(dataUrls.map(loadImage));

      const cw = count === 1 ? 800 : CANVAS_W;
      const ch = count === 1 ? 1000 : count === 2 ? 800 : CANVAS_H;

      const canvas = document.createElement("canvas");
      canvas.width = cw;
      canvas.height = ch;
      const ctx = canvas.getContext("2d")!;

      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, cw, ch);

      const halfSkew = SKEW / 2;
      const halfGap = SLASH_GAP / 2;

      function buildPanels(n: number): number[][][] {
        if (n === 1) {
          return [[[0, 0], [cw, 0], [cw, ch], [0, ch]]];
        }
        if (n === 2) {
          const mid = cw / 2;
          return [
            [[0, 0], [mid + halfSkew - halfGap, 0], [mid - halfSkew - halfGap, ch], [0, ch]],
            [[mid + halfSkew + halfGap, 0], [cw, 0], [cw, ch], [mid - halfSkew + halfGap, ch]],
          ];
        }
        const third = cw / 3;
        return [
          [[0, 0], [third + halfSkew - halfGap, 0], [third - halfSkew - halfGap, ch], [0, ch]],
          [[third + halfSkew + halfGap, 0], [2 * third + halfSkew - halfGap, 0], [2 * third - halfSkew - halfGap, ch], [third - halfSkew + halfGap, ch]],
          [[2 * third + halfSkew + halfGap, 0], [cw, 0], [cw, ch], [2 * third - halfSkew + halfGap, ch]],
        ];
      }

      const panels = buildPanels(count);

      for (let i = 0; i < count; i++) {
        const poly = panels[i];
        const img = images[i];
        const xs = poly.map((p) => p[0]);
        const minX = Math.min(...xs);
        const maxX = Math.max(...xs);
        const boxW = maxX - minX;

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(poly[0][0], poly[0][1]);
        for (let j = 1; j < poly.length; j++) {
          ctx.lineTo(poly[j][0], poly[j][1]);
        }
        ctx.closePath();
        ctx.clip();

        const imgAspect = img.naturalWidth / img.naturalHeight;
        const boxAspect = boxW / ch;
        let drawW: number, drawH: number;
        if (imgAspect > boxAspect) {
          drawH = ch;
          drawW = ch * imgAspect;
        } else {
          drawW = boxW;
          drawH = boxW / imgAspect;
        }
        ctx.drawImage(img, minX + (boxW - drawW) / 2, (ch - drawH) / 2, drawW, drawH);
        ctx.restore();
      }

      setGeneratedImage(canvas.toDataURL("image/png"));
      goToStep("result");
      fireShareApi();
    } catch {
      alert("画像の生成に失敗しました。もう一度お試しください。");
    } finally {
      setGenerating(false);
    }
  }

  const hasFiredShare = useRef(false);

  async function generateToken(): Promise<string> {
    const ts = Date.now().toString();
    const key = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode("mybest-k8x2v"),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );
    const sig = await crypto.subtle.sign(
      "HMAC",
      key,
      new TextEncoder().encode(ts)
    );
    const hash = btoa(String.fromCharCode(...new Uint8Array(sig))).slice(0, 16);
    return `${ts}.${hash}`;
  }

  function fireShareApi(): void {
    if (!selectedStaff || hasFiredShare.current) return;
    hasFiredShare.current = true;
    const seiyuuName = displayName(selectedStaff.name);
    generateToken()
      .then((token) =>
        fetch("/api/my-best/share", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-mybest-token": token,
          },
          body: JSON.stringify({
            seiyuu_mal_id: selectedStaff.id,
            seiyuu_name: seiyuuName,
            characters: selectedChars.map((c) => ({
              mal_id: c.id,
              name: c.name,
              anime_title: c.anime_title,
            })),
            ...(ageRange && { age_range: ageRange }),
            ...(gender && { gender }),
          }),
        })
      )
      .catch(() => {});
  }

  async function shareToX(): Promise<void> {
    if (!selectedStaff || !generatedImage) return;
    const name = displayName(selectedStaff.name);
    const charList = selectedChars
      .map((c) => `${c.name} ─ ${c.anime_title}`)
      .join("\n");
    const text = `私のベスト【${name}】\n\n${charList}\n\nfugaapp.site/my-best/seiyuu?id=${selectedStaff.id}`;
    const hashtags = `#私のベスト${name} #mybest3character `;

    if (navigator.share && navigator.canShare) {
      try {
        const res = await fetch(generatedImage);
        const blob = await res.blob();
        const file = new File([blob], `私のベスト${name}.png`, {
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
        // User cancelled share — do nothing
        return;
      }
    }

    // Desktop fallback: save image then open X web intent
    const a = document.createElement("a");
    a.href = generatedImage;
    a.download = `私のベスト${name}.png`;
    a.click();

    const encoded = encodeURIComponent(`${text}\n${hashtags}`);
    setTimeout(() => {
      window.open(`https://x.com/intent/tweet?text=${encoded}`, "_blank");
    }, 800);
  }

  function backToSelect(): void {
    history.back();
  }

  function reset(): void {
    // Go back to search step, clearing history entries
    setQuery("");
    setStaffResults([]);
    setAgeRange(null);
    setGender(null);
    hasFiredShare.current = false;
    // If on result, go back twice (result→select→search)
    // If on select, go back once
    if (stepRef.current === "result") {
      history.go(-2);
    } else {
      history.back();
    }
  }

  const seiyuuName = selectedStaff ? displayName(selectedStaff.name) : "";
  const todayIndex = Math.floor(Date.now() / 86400000) % DAILY_SEIYUU.length;
  const todaySeiyuu = DAILY_SEIYUU[todayIndex];
  const popularSeiyuu = DAILY_SEIYUU.filter((_, i) => i !== todayIndex);

  const filteredRoles = useMemo(() => {
    if (!charFilter.trim()) return voiceRoles;
    const q = charFilter.trim().toLowerCase();
    return voiceRoles.filter(
      (role) =>
        role.characterName.toLowerCase().includes(q) ||
        role.animeTitle.toLowerCase().includes(q)
    );
  }, [voiceRoles, charFilter]);

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
      {step === "search" && (
        <div className="px-4 pt-12 pb-8">
          <h1 className="text-xl font-bold text-center text-white tracking-tight">
            私のベスト声優
          </h1>
          <p className="text-neutral-500 text-center text-[11px] mt-1 mb-6">
            推しキャラ3選を作ってXでシェア
          </p>

          <div className="relative mb-4">
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
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="声優名を入力"
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
            <p className="text-center text-xs text-red-400 mb-4">
              {searchError}
            </p>
          )}

          {!query && !searchLoading && (
            <>
              <div className="mb-6">
                <p className="text-[10px] text-neutral-500 uppercase tracking-widest mb-2">
                  TODAY&apos;S PICK
                </p>
                <button
                  onClick={() => handleSelectStaff(dailyToStaff(todaySeiyuu))}
                  className="flex items-center gap-3 w-full px-3 py-3 bg-neutral-900/80 rounded-xl active:bg-neutral-800 transition-colors"
                >
                  <img
                    src={todaySeiyuu.image}
                    alt={todaySeiyuu.name}
                    className="w-14 h-14 rounded-full object-cover ring-2 ring-white/10"
                  />
                  <div className="flex-1 text-left">
                    <p className="text-white font-bold text-sm">
                      {todaySeiyuu.name}
                    </p>
                    <p className="text-neutral-500 text-[11px]">
                      今日のお題で作ってみよう
                    </p>
                  </div>
                  <svg
                    className="h-4 w-4 text-neutral-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>

              <p className="text-[10px] text-neutral-500 uppercase tracking-widest mb-2">
                POPULAR
              </p>
              <div className="grid grid-cols-3 gap-2 pb-8">
                {popularSeiyuu.map((va) => (
                  <button
                    key={va.id}
                    onClick={() => handleSelectStaff(dailyToStaff(va))}
                    className="flex flex-col items-center gap-1.5 py-3 rounded-xl active:bg-neutral-800/60 transition-colors"
                  >
                    <img
                      src={va.image}
                      alt={va.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <span className="text-[11px] text-neutral-400 truncate w-full text-center px-1">
                      {va.name}
                    </span>
                  </button>
                ))}
              </div>
            </>
          )}

          <div className="grid grid-cols-3 gap-2 px-3">
            {staffResults.map((s) => (
              <button
                key={s.id}
                onClick={() => handleSelectStaff(s)}
                className="flex flex-col items-center gap-1.5 py-3 rounded-xl active:bg-neutral-800/60 transition-colors"
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
            ))}
          </div>

          {query.length >= 1 &&
            !searchLoading &&
            !searchError &&
            staffResults.length === 0 && (
              <p className="text-center text-xs text-neutral-600 py-16">
                該当する声優が見つかりませんでした
              </p>
            )}

          {footer}
        </div>
      )}

      {step === "select" && selectedStaff && (
        <div>
          <div className="sticky top-0 z-20 bg-black/90 backdrop-blur-md border-b border-neutral-800/60">
            <div className="flex items-center gap-2.5 px-4 h-11">
              <button
                onClick={reset}
                className="text-neutral-400 active:text-white transition-colors -ml-1 p-1"
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
              <img
                src={selectedStaff.image.large}
                alt={seiyuuName}
                className="w-6 h-6 rounded-full object-cover"
              />
              <span className="font-bold text-[13px] text-white flex-1 truncate">
                {seiyuuName}
              </span>
              <span className="text-neutral-500 text-xs tabular-nums">
                {selectedChars.length} / {MAX_CHARACTERS}
              </span>
            </div>

            <div className="flex items-center gap-1.5 px-4 pb-2.5 pt-0.5">
              {Array.from({ length: MAX_CHARACTERS }, (_, i) => i).map((i) => {
                const char = selectedChars[i];
                return (
                  <div
                    key={i}
                    className={`relative w-10 h-10 rounded-md overflow-hidden flex-shrink-0 transition-transform ${char ? "cursor-grab active:cursor-grabbing" : "border border-dashed border-neutral-700 bg-neutral-900/50"}`}
                    draggable={!!char}
                    onDragStart={() => {
                      dragFrom.current = i;
                    }}
                    onDragOver={(e) => {
                      e.preventDefault();
                    }}
                    onDrop={() => {
                      if (dragFrom.current !== null && char) {
                        reorderChars(dragFrom.current, i);
                      }
                      dragFrom.current = null;
                    }}
                    onTouchStart={() => {
                      if (char) dragFrom.current = i;
                    }}
                    onTouchEnd={(e) => {
                      if (dragFrom.current === null || !char) return;
                      const touch = e.changedTouches[0];
                      const el = document.elementFromPoint(
                        touch.clientX,
                        touch.clientY
                      );
                      const slot = el?.closest("[data-slot]");
                      if (slot) {
                        const toIdx = Number(
                          slot.getAttribute("data-slot")
                        );
                        reorderChars(dragFrom.current, toIdx);
                      }
                      dragFrom.current = null;
                    }}
                    data-slot={i}
                  >
                    {char ? (
                      <button
                        onClick={() => removeChar(char.id)}
                        className="w-full h-full group"
                      >
                        <img
                          src={char.image_url}
                          alt={char.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/0 group-active:bg-black/40 transition-colors" />
                      </button>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-neutral-700 text-[10px]" />
                    )}
                  </div>
                );
              })}
            </div>

            {!rolesLoading && voiceRoles.length > 0 && (
              <div className="px-4 pb-2.5">
                <div className="relative">
                  <svg
                    className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-600"
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
                    type="text"
                    value={charFilter}
                    onChange={(e) => setCharFilter(e.target.value)}
                    placeholder="絞り込み"
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-md pl-8 pr-3 py-1.5 text-white text-xs placeholder-neutral-600 outline-none focus:border-neutral-600 transition-colors"
                  />
                </div>
              </div>
            )}
          </div>

          {rolesLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-neutral-700 border-t-neutral-400" />
            </div>
          ) : rolesError ? (
            <p className="text-center text-xs text-red-400 px-6 py-12">
              {rolesError}
            </p>
          ) : voiceRoles.length === 0 ? (
            <p className="text-center text-xs text-neutral-600 py-12">
              キャラクターデータが見つかりませんでした
            </p>
          ) : (
            <>
              <div
                className={`grid grid-cols-3 gap-px bg-neutral-900 ${selectedChars.length >= 1 ? "pb-20" : "pb-4"}`}
              >
                {filteredRoles.map((role) => {
                  const isSelected = selectedChars.some(
                    (c) => c.id === role.characterId
                  );
                  const selectedIndex = selectedChars.findIndex(
                    (c) => c.id === role.characterId
                  );
                  const isDisabled =
                    selectedChars.length >= MAX_CHARACTERS && !isSelected;
                  return (
                    <button
                      key={role.characterId}
                      onClick={() => toggleCharacter(role)}
                      disabled={isDisabled}
                      className={`relative aspect-[3/4] overflow-hidden bg-black ${isDisabled ? "opacity-25" : ""} ${isSelected ? "ring-1 ring-inset ring-white" : ""}`}
                    >
                      <img
                        src={role.characterImage}
                        alt={role.characterName}
                        loading="lazy"
                        decoding="async"
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent px-1.5 pb-1.5 pt-6">
                        <p className="text-[10px] font-medium text-white truncate leading-tight">
                          {role.characterName}
                        </p>
                        <p className="text-[8px] text-white/40 truncate leading-tight mt-px">
                          {role.animeTitle}
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
              {rolesHasMore && (
                <div ref={loadMoreRef} className="flex justify-center py-4">
                  {rolesLoadingMore && (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-neutral-700 border-t-neutral-400" />
                  )}
                </div>
              )}
              <p className="text-center text-[10px] text-neutral-600 py-3">
                ※ アニメ出演キャラのみ表示（ゲーム・吹替等は含みません）
              </p>
            </>
          )}

          {selectedChars.length >= 1 && (
            <div className="fixed bottom-0 left-0 right-0 px-4 pb-5 pt-4 bg-gradient-to-t from-black via-black/95 to-transparent">
              <div className="flex items-center gap-1.5 justify-center mb-2.5 flex-wrap">
                {["10代", "20代", "30代", "40代", "50代〜"].map((a) => (
                  <button
                    key={a}
                    onClick={() => setAgeRange(ageRange === a ? null : a)}
                    className={`px-2 py-1 rounded-full text-[10px] border transition-colors ${ageRange === a ? "bg-white text-black border-white" : "text-neutral-500 border-neutral-700 active:border-neutral-500"}`}
                  >
                    {a}
                  </button>
                ))}
                <span className="text-neutral-800 text-[10px]">|</span>
                {["男性", "女性", "他"].map((g) => (
                  <button
                    key={g}
                    onClick={() => setGender(gender === g ? null : g)}
                    className={`px-2 py-1 rounded-full text-[10px] border transition-colors ${gender === g ? "bg-white text-black border-white" : "text-neutral-500 border-neutral-700 active:border-neutral-500"}`}
                  >
                    {g}
                  </button>
                ))}
              </div>
              <button
                onClick={generateImage}
                disabled={generating}
                className="w-full bg-white text-black text-sm font-bold py-3 rounded-lg active:scale-[0.98] transition-transform disabled:opacity-50"
              >
                {generating ? "生成中..." : "画像を生成する"}
              </button>
            </div>
          )}

          {footer}
        </div>
      )}

      {step === "result" && generatedImage && selectedStaff && (
        <div>
          <div className="px-4 pt-6 pb-4">
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={backToSelect}
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
                私のベスト{seiyuuName}
              </p>
              <div className="w-7" />
            </div>

            <div className="overflow-hidden rounded-lg">
              <img
                src={generatedImage}
                alt={`私のベスト${seiyuuName}`}
                className="w-full block"
              />
            </div>

            <div className="flex gap-2 mt-3 text-[10px] text-neutral-500">
              {selectedChars.map((c) => (
                <span key={c.id} className="truncate flex-1 text-center">
                  {c.name}
                </span>
              ))}
            </div>
          </div>

          <div className="px-4 mt-1 space-y-3">
            {/* iOS share sheet guide */}
            <div className="rounded-2xl bg-[#2c2c2e] overflow-hidden shadow-lg">
              <p className="text-[11px] text-neutral-400 text-center pt-2.5 pb-2">
                下のボタンで共有メニューが開きます
              </p>
              {/* File preview row */}
              <div className="flex items-center gap-3 mx-3 mb-3 px-3 py-2.5 rounded-xl bg-[#1c1c1e]">
                <div className="w-10 h-10 rounded-lg bg-[#3a3a3c] flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="min-w-0">
                  <p className="text-[12px] text-white truncate">私のベスト○○.png</p>
                  <p className="text-[10px] text-neutral-500">PNG画像</p>
                </div>
              </div>
              {/* Divider */}
              <div className="h-px bg-[#3a3a3c] mx-3" />
              {/* App icons row */}
              <div className="flex items-start px-4 py-3 gap-5">
                <div className="flex flex-col items-center gap-1.5 relative">
                  <div className="w-[52px] h-[52px] rounded-[13px] bg-black flex items-center justify-center ring-[2.5px] ring-blue-400">
                    <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  </div>
                  <span className="text-[10px] text-white">X</span>
                  {/* Arrow pointing to X */}
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
              別の声優で作る
            </button>
          </div>

          {footer}
        </div>
      )}
    </div>
  );
}
