"use client";

import { useState, useEffect, useRef, useCallback } from "react";

interface SeiyuuResult {
  mal_id: number;
  name: string;
  images: { jpg: { image_url: string } };
  favorites: number;
}

interface VoiceRole {
  character: {
    mal_id: number;
    name: string;
    images: { jpg: { image_url: string } };
  };
  anime: {
    mal_id: number;
    title: string;
  };
}

interface SelectedCharacter {
  mal_id: number;
  name: string;
  image_url: string;
  anime_title: string;
}

const CACHE_TTL = 24 * 60 * 60 * 1000;
const MAX_CHARACTERS = 3;
const DEBOUNCE_MS = 500;

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

function dedupeCharacters(roles: VoiceRole[]): VoiceRole[] {
  const seen = new Set<number>();
  return roles.filter((r) => {
    if (seen.has(r.character.mal_id)) return false;
    seen.add(r.character.mal_id);
    return true;
  });
}

function getCharacterCardClass(isSelected: boolean, isDisabled: boolean): string {
  if (isSelected) {
    return "border-rose-400 bg-rose-50 shadow-md scale-[1.02]";
  }
  if (isDisabled) {
    return "border-gray-100 bg-gray-50 opacity-40 cursor-not-allowed";
  }
  return "border-gray-100 bg-white hover:border-rose-200 hover:shadow-sm active:scale-[0.97]";
}

type Step = "search" | "select" | "result";

export default function MyBestPage(): React.ReactElement {
  const [step, setStep] = useState<Step>("search");
  const [query, setQuery] = useState("");
  const [seiyuuResults, setSeiyuuResults] = useState<SeiyuuResult[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [selectedSeiyuu, setSelectedSeiyuu] = useState<SeiyuuResult | null>(null);
  const [voiceRoles, setVoiceRoles] = useState<VoiceRole[]>([]);
  const [rolesLoading, setRolesLoading] = useState(false);
  const [rolesError, setRolesError] = useState("");
  const [selectedChars, setSelectedChars] = useState<SelectedCharacter[]>([]);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);

  const captureRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const searchSeiyuu = useCallback(async (q: string) => {
    if (q.trim().length < 1) {
      setSeiyuuResults([]);
      setSearchError("");
      return;
    }

    const cacheKey = `mybest_search_${q.trim()}`;
    const cached = getCached<SeiyuuResult[]>(cacheKey);
    if (cached) {
      setSeiyuuResults(cached);
      setSearchError("");
      return;
    }

    setSearchLoading(true);
    setSearchError("");
    try {
      const res = await fetch(
        `https://api.jikan.moe/v4/people?q=${encodeURIComponent(q.trim())}&order_by=favorites&sort=desc&limit=10`
      );
      if (!res.ok) throw new Error("API error");
      const json = await res.json();
      const data = json.data as SeiyuuResult[];
      setSeiyuuResults(data);
      setCache(cacheKey, data);
    } catch {
      setSeiyuuResults([]);
      setSearchError("検索に失敗しました。少し時間をおいて再度お試しください。");
    } finally {
      setSearchLoading(false);
    }
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => searchSeiyuu(query), DEBOUNCE_MS);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, searchSeiyuu]);

  async function handleSelectSeiyuu(seiyuu: SeiyuuResult): Promise<void> {
    setSelectedSeiyuu(seiyuu);
    setSelectedChars([]);
    setGeneratedImage(null);
    setStep("select");

    const cacheKey = `mybest_voices_${seiyuu.mal_id}`;
    const cached = getCached<VoiceRole[]>(cacheKey);
    if (cached) {
      setVoiceRoles(dedupeCharacters(cached));
      return;
    }

    setRolesLoading(true);
    setRolesError("");
    try {
      const res = await fetch(
        `https://api.jikan.moe/v4/people/${seiyuu.mal_id}/voices`
      );
      if (!res.ok) throw new Error("API error");
      const json = await res.json();
      const data = json.data as VoiceRole[];
      setVoiceRoles(dedupeCharacters(data));
      setCache(cacheKey, data);
    } catch {
      setVoiceRoles([]);
      setRolesError("キャラクター情報の取得に失敗しました。少し時間をおいて再度お試しください。");
    } finally {
      setRolesLoading(false);
    }
  }

  function toggleCharacter(role: VoiceRole): void {
    const isAlreadySelected = selectedChars.some(
      (c) => c.mal_id === role.character.mal_id
    );
    if (isAlreadySelected) {
      setSelectedChars(
        selectedChars.filter((c) => c.mal_id !== role.character.mal_id)
      );
    } else if (selectedChars.length < MAX_CHARACTERS) {
      setSelectedChars([
        ...selectedChars,
        {
          mal_id: role.character.mal_id,
          name: role.character.name,
          image_url: role.character.images.jpg.image_url,
          anime_title: role.anime.title,
        },
      ]);
    }
  }

  function removeChar(malId: number): void {
    setSelectedChars(selectedChars.filter((c) => c.mal_id !== malId));
  }

  async function generateImage(): Promise<void> {
    if (selectedChars.length !== MAX_CHARACTERS || !captureRef.current) return;
    setGenerating(true);

    try {
      const html2canvas = (await import("html2canvas")).default;
      const canvas = await html2canvas(captureRef.current, {
        useCORS: true,
        allowTaint: false,
        scale: 2,
        width: 1200,
        height: 630,
        backgroundColor: null,
      });
      const dataUrl = canvas.toDataURL("image/png");
      setGeneratedImage(dataUrl);
      setStep("result");
    } catch {
      alert("画像の生成に失敗しました。もう一度お試しください。");
    } finally {
      setGenerating(false);
    }
  }

  function fireShareApi(): void {
    if (!selectedSeiyuu) return;
    fetch("/api/my-best/share", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        seiyuu_mal_id: selectedSeiyuu.mal_id,
        seiyuu_name: selectedSeiyuu.name,
        characters: selectedChars.map((c) => ({
          mal_id: c.mal_id,
          name: c.name,
          anime_title: c.anime_title,
        })),
      }),
    }).catch(() => {});
  }

  function downloadImage(): void {
    if (!generatedImage || !selectedSeiyuu) return;
    const a = document.createElement("a");
    a.href = generatedImage;
    a.download = `私のベスト${selectedSeiyuu.name}.png`;
    a.click();
    fireShareApi();
  }

  function shareToX(): void {
    if (!selectedSeiyuu) return;
    const text = `私のベスト${selectedSeiyuu.name}\n\nfugaapp.site/my-best`;
    const hashtags = `私のベスト${selectedSeiyuu.name},fugaapp`;
    const url = `https://x.com/intent/tweet?text=${encodeURIComponent(text)}&hashtags=${encodeURIComponent(hashtags)}`;
    window.open(url, "_blank");
    fireShareApi();
  }

  function reset(): void {
    setStep("search");
    setQuery("");
    setSeiyuuResults([]);
    setSelectedSeiyuu(null);
    setVoiceRoles([]);
    setSelectedChars([]);
    setGeneratedImage(null);
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="mb-2 text-3xl font-bold bg-gradient-to-r from-rose-500 to-violet-500 bg-clip-text text-transparent">
          私のベスト声優
        </h1>
        <p className="text-gray-500 text-sm">
          推し声優のベストキャラ3選を作ってシェアしよう！
        </p>
      </div>

      <div className="mb-6 flex items-center justify-center gap-2 text-xs text-gray-400">
        <span
          className={`rounded-full px-3 py-1 ${step === "search" ? "bg-rose-100 text-rose-600 font-bold" : "bg-gray-100"}`}
        >
          1. 声優検索
        </span>
        <span className="text-gray-300">&rarr;</span>
        <span
          className={`rounded-full px-3 py-1 ${step === "select" ? "bg-rose-100 text-rose-600 font-bold" : "bg-gray-100"}`}
        >
          2. キャラ選択
        </span>
        <span className="text-gray-300">&rarr;</span>
        <span
          className={`rounded-full px-3 py-1 ${step === "result" ? "bg-rose-100 text-rose-600 font-bold" : "bg-gray-100"}`}
        >
          3. シェア
        </span>
      </div>

      {step === "search" && (
        <div className="animate-fade-in">
          <div className="relative mb-4">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="声優名を入力（例: 花澤香菜）"
              className="w-full rounded-2xl border border-rose-200 bg-white px-5 py-4 text-base shadow-sm outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-200 transition-all"
              autoFocus
            />
            {searchLoading && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-rose-300 border-t-transparent" />
              </div>
            )}
          </div>

          {searchError && (
            <p className="text-center text-sm text-rose-500 bg-rose-50 rounded-2xl px-4 py-3">
              {searchError}
            </p>
          )}

          {seiyuuResults.length > 0 && (
            <div className="space-y-2">
              {seiyuuResults.map((s) => (
                <button
                  key={s.mal_id}
                  onClick={() => handleSelectSeiyuu(s)}
                  className="flex w-full items-center gap-4 rounded-2xl bg-white p-4 shadow-sm border border-gray-100 hover:border-rose-300 hover:shadow-md transition-all active:scale-[0.98]"
                >
                  <img
                    src={s.images.jpg.image_url}
                    alt={s.name}
                    className="h-14 w-14 rounded-full object-cover border-2 border-rose-100"
                  />
                  <div className="flex-1 text-left">
                    <div className="font-bold text-gray-800">{s.name}</div>
                    <div className="text-xs text-gray-400">
                      ♥ {s.favorites.toLocaleString()} お気に入り
                    </div>
                  </div>
                  <svg
                    className="h-5 w-5 text-gray-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              ))}
            </div>
          )}

          {query.length >= 1 &&
            !searchLoading &&
            !searchError &&
            seiyuuResults.length === 0 && (
              <p className="text-center text-sm text-gray-400 py-8">
                該当する声優が見つかりませんでした
              </p>
            )}
        </div>
      )}

      {step === "select" && selectedSeiyuu && (
        <div className="animate-fade-in">
          <button
            onClick={reset}
            className="mb-4 text-sm text-gray-400 hover:text-rose-500 transition-colors"
          >
            &larr; 声優を選び直す
          </button>

          <div className="mb-6 flex items-center gap-4">
            <img
              src={selectedSeiyuu.images.jpg.image_url}
              alt={selectedSeiyuu.name}
              className="h-16 w-16 rounded-full object-cover border-2 border-rose-200"
            />
            <div>
              <h2 className="text-xl font-bold text-gray-800">
                {selectedSeiyuu.name}
              </h2>
              <p className="text-xs text-gray-400">
                ベストキャラを3つ選んでください
              </p>
            </div>
          </div>

          <div className="sticky top-0 z-10 bg-gradient-to-b from-rose-50/95 to-rose-50/80 backdrop-blur-sm py-4 mb-4 -mx-4 px-4">
            <div className="grid grid-cols-3 gap-3">
              {[0, 1, 2].map((i) => {
                const char = selectedChars[i];
                return (
                  <div
                    key={i}
                    className={`relative rounded-2xl border-2 border-dashed p-2 text-center transition-all ${
                      char
                        ? "border-rose-300 bg-white shadow-sm"
                        : "border-gray-200 bg-white/50"
                    }`}
                  >
                    {char ? (
                      <button
                        onClick={() => removeChar(char.mal_id)}
                        className="w-full group"
                      >
                        <img
                          src={char.image_url}
                          alt={char.name}
                          className="mx-auto h-16 w-16 rounded-xl object-cover"
                        />
                        <p className="mt-1 text-xs font-bold text-gray-700 truncate">
                          {char.name}
                        </p>
                        <div className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-rose-400 text-white text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          &times;
                        </div>
                      </button>
                    ) : (
                      <div className="py-4">
                        <div className="mx-auto h-16 w-16 rounded-xl bg-gray-100 flex items-center justify-center text-2xl text-gray-300 font-bold">
                          {i + 1}
                        </div>
                        <p className="mt-1 text-xs text-gray-300">未選択</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {selectedChars.length === MAX_CHARACTERS && (
              <button
                onClick={generateImage}
                disabled={generating}
                className="mt-4 w-full rounded-2xl bg-gradient-to-r from-rose-500 to-violet-500 py-4 text-white font-bold text-base shadow-lg hover:shadow-xl transition-all active:scale-[0.98] disabled:opacity-60"
              >
                {generating ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    生成中...
                  </span>
                ) : (
                  "画像を生成する"
                )}
              </button>
            )}
          </div>

          {rolesLoading ? (
            <div className="flex items-center justify-center py-16">
              <div className="h-8 w-8 animate-spin rounded-full border-[3px] border-rose-300 border-t-transparent" />
            </div>
          ) : rolesError ? (
            <p className="text-center text-sm text-rose-500 bg-rose-50 rounded-2xl px-4 py-3 mx-4">
              {rolesError}
            </p>
          ) : voiceRoles.length === 0 ? (
            <p className="text-center text-sm text-gray-400 py-8">
              キャラクターデータが見つかりませんでした
            </p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {voiceRoles.map((role) => {
                const isSelected = selectedChars.some(
                  (c) => c.mal_id === role.character.mal_id
                );
                const isDisabled =
                  selectedChars.length >= MAX_CHARACTERS && !isSelected;
                return (
                  <button
                    key={role.character.mal_id}
                    onClick={() => toggleCharacter(role)}
                    disabled={isDisabled}
                    className={`rounded-2xl border-2 p-3 text-center transition-all ${getCharacterCardClass(isSelected, isDisabled)}`}
                  >
                    <img
                      src={role.character.images.jpg.image_url}
                      alt={role.character.name}
                      className="mx-auto h-24 w-24 rounded-xl object-cover"
                    />
                    <p className="mt-2 text-xs font-bold text-gray-700 truncate">
                      {role.character.name}
                    </p>
                    <p className="text-[10px] text-gray-400 truncate">
                      {role.anime.title}
                    </p>
                    {isSelected && (
                      <div className="mt-1 text-xs text-rose-500 font-bold">
                        ✓ 選択中
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

      {step === "result" && generatedImage && selectedSeiyuu && (
        <div className="animate-fade-in text-center">
          <h2 className="mb-4 text-xl font-bold text-gray-800">
            画像が完成しました！
          </h2>

          <div className="mb-6 overflow-hidden rounded-2xl shadow-lg border border-gray-100">
            <img
              src={generatedImage}
              alt={`私のベスト${selectedSeiyuu.name}`}
              className="w-full"
            />
          </div>

          <div className="flex gap-3 mb-6">
            <button
              onClick={downloadImage}
              className="flex-1 rounded-2xl bg-white border-2 border-gray-200 py-4 font-bold text-gray-700 hover:border-gray-400 transition-all active:scale-[0.98]"
            >
              ダウンロード
            </button>
            <button
              onClick={shareToX}
              className="flex-1 rounded-2xl bg-black py-4 font-bold text-white hover:bg-gray-800 transition-all active:scale-[0.98]"
            >
              X でシェア
            </button>
          </div>

          <button
            onClick={reset}
            className="text-sm text-gray-400 hover:text-rose-500 transition-colors"
          >
            別の声優で作り直す &rarr;
          </button>
        </div>
      )}

      {/* Hidden capture target for html2canvas (1200x630 OG image) */}
      <div
        style={{
          position: "absolute",
          left: "-9999px",
          top: 0,
          width: 1200,
          height: 630,
          overflow: "hidden",
        }}
      >
        <div
          ref={captureRef}
          style={{
            width: 1200,
            height: 630,
            background: "linear-gradient(135deg, #fda4af 0%, #8b5cf6 100%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: '"Zen Maru Gothic", "Noto Sans JP", sans-serif',
            padding: 40,
            boxSizing: "border-box",
          }}
        >
          <div
            style={{
              color: "white",
              fontSize: 48,
              fontWeight: "bold",
              marginBottom: 32,
              textShadow: "0 2px 8px rgba(0,0,0,0.2)",
            }}
          >
            私のベスト {selectedSeiyuu?.name}
          </div>

          <div
            style={{
              display: "flex",
              gap: 24,
              justifyContent: "center",
            }}
          >
            {selectedChars.map((char) => (
              <div
                key={char.mal_id}
                style={{
                  width: 320,
                  background: "rgba(255,255,255,0.95)",
                  borderRadius: 24,
                  padding: 20,
                  textAlign: "center",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
                }}
              >
                <img
                  src={char.image_url}
                  alt={char.name}
                  crossOrigin="anonymous"
                  style={{
                    width: 200,
                    height: 200,
                    objectFit: "cover",
                    borderRadius: 16,
                    margin: "0 auto 12px",
                    display: "block",
                  }}
                />
                <div
                  style={{
                    fontSize: 22,
                    fontWeight: "bold",
                    color: "#1f2937",
                    marginBottom: 4,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {char.name}
                </div>
                <div
                  style={{
                    fontSize: 14,
                    color: "#9ca3af",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {char.anime_title}
                </div>
              </div>
            ))}
          </div>

          <div
            style={{
              color: "rgba(255,255,255,0.8)",
              fontSize: 20,
              marginTop: 28,
            }}
          >
            fugaapp.site
          </div>
        </div>
      </div>
    </div>
  );
}
