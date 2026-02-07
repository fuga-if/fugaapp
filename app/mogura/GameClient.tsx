"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { getRank, type MoguraRank } from "@/lib/mogura/ranks";
import Link from "next/link";

const GRID_COLS = 3;
const GRID_ROWS = 4;
const TOTAL_HOLES = GRID_COLS * GRID_ROWS;
const GAME_DURATION = 30;

// 難易度設定
const INITIAL_TARGET_DURATION = 1200;
const MIN_TARGET_DURATION = 500;
const INITIAL_SPAWN_INTERVAL = 1000;
const MIN_SPAWN_INTERVAL = 400;
const MAX_SIMULTANEOUS_TARGETS = 3;

type Phase = "idle" | "playing" | "result";

interface Target {
  id: number;
  holeIndex: number;
  spawnedAt: number;
  duration: number;
  hit: boolean;
  missed: boolean;
}

/* ═══════════════════════════════════════
   SVG Components - ミニマルデザイン
   ═══════════════════════════════════════ */

function TargetSVG({ hit, size = 60 }: { hit?: boolean; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      <defs>
        <radialGradient id="targetGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={hit ? "#666" : "#FFD700"} stopOpacity="1" />
          <stop offset="100%" stopColor={hit ? "#444" : "#D4A500"} stopOpacity="0.8" />
        </radialGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      <circle 
        cx="50" cy="50" r="40" 
        fill="url(#targetGlow)" 
        filter={hit ? "none" : "url(#glow)"}
        style={{ 
          transition: "all 0.1s ease",
          opacity: hit ? 0.4 : 1 
        }}
      />
      <circle cx="50" cy="50" r="25" fill="none" stroke={hit ? "#555" : "#1a3d2e"} strokeWidth="3" opacity="0.4" />
      <circle cx="50" cy="50" r="10" fill={hit ? "#333" : "#1a3d2e"} opacity="0.5" />
    </svg>
  );
}

function HitEffect({ x, y }: { x: number; y: number }) {
  return (
    <div
      className="absolute pointer-events-none"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        transform: "translate(-50%, -50%)",
        animation: "hitBurst 0.4s ease-out forwards",
      }}
    >
      <svg width="60" height="60" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="40" fill="none" stroke="#FFD700" strokeWidth="4" opacity="0.8" />
      </svg>
    </div>
  );
}

function CrosshairIcon({ size = 80 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ filter: "drop-shadow(0 0 15px rgba(255,215,0,0.5))" }}>
      <circle cx="50" cy="50" r="35" fill="none" stroke="#FFD700" strokeWidth="4" />
      <circle cx="50" cy="50" r="20" fill="none" stroke="#FFD700" strokeWidth="2" opacity="0.6" />
      <circle cx="50" cy="50" r="6" fill="#FFD700" />
      <line x1="50" y1="8" x2="50" y2="25" stroke="#FFD700" strokeWidth="3" strokeLinecap="round" />
      <line x1="50" y1="75" x2="50" y2="92" stroke="#FFD700" strokeWidth="3" strokeLinecap="round" />
      <line x1="8" y1="50" x2="25" y2="50" stroke="#FFD700" strokeWidth="3" strokeLinecap="round" />
      <line x1="75" y1="50" x2="92" y2="50" stroke="#FFD700" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

function TrophyIcon({ size = 80, color = "#FFD700" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ filter: `drop-shadow(0 0 15px ${color}60)` }}>
      <path d="M25 20 Q25 55 50 65 Q75 55 75 20 Z" fill={color} stroke="rgba(0,0,0,0.2)" strokeWidth="2" />
      <path d="M25 25 Q10 25 10 38 Q10 48 25 48" fill="none" stroke={color} strokeWidth="6" />
      <path d="M75 25 Q90 25 90 38 Q90 48 75 48" fill="none" stroke={color} strokeWidth="6" />
      <rect x="42" y="63" width="16" height="10" fill={color} />
      <rect x="32" y="72" width="36" height="8" rx="2" fill={color} />
    </svg>
  );
}

function RankIcon({ rankLetter, color, size = 80 }: { rankLetter: string; color: string; size?: number }) {
  switch (rankLetter) {
    case "S":
    case "A":
      return <TrophyIcon size={size} color={color} />;
    default:
      return <CrosshairIcon size={size} />;
  }
}

/* ─── Styles ─── */
function GameStyles() {
  return (
    <style jsx global>{`
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }
      @keyframes scaleIn {
        from { opacity: 0; transform: scale(0.8); }
        to { opacity: 1; transform: scale(1); }
      }
      @keyframes targetPop {
        0% { transform: scale(0); opacity: 0; }
        70% { transform: scale(1.15); }
        100% { transform: scale(1); opacity: 1; }
      }
      @keyframes targetHit {
        0% { transform: scale(1); opacity: 1; }
        50% { transform: scale(1.3); }
        100% { transform: scale(0); opacity: 0; }
      }
      @keyframes targetMiss {
        0% { transform: scale(1); opacity: 1; }
        100% { transform: scale(0.5); opacity: 0; }
      }
      @keyframes hitBurst {
        0% { transform: translate(-50%, -50%) scale(0.5); opacity: 1; }
        100% { transform: translate(-50%, -50%) scale(2); opacity: 0; }
      }
      @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.6; }
      }
      @keyframes glow {
        0%, 100% { box-shadow: 0 0 20px rgba(255,215,0,0.3); }
        50% { box-shadow: 0 0 40px rgba(255,215,0,0.5); }
      }
      @keyframes rankPop {
        0% { transform: scale(0) rotate(-15deg); opacity: 0; }
        60% { transform: scale(1.2) rotate(5deg); }
        100% { transform: scale(1) rotate(0deg); opacity: 1; }
      }
      @keyframes timerUrgent {
        0%, 100% { color: #ef4444; }
        50% { color: #fca5a5; }
      }
    `}</style>
  );
}

export default function TapTargetGame() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [targets, setTargets] = useState<Target[]>([]);
  const [effects, setEffects] = useState<{ id: number; x: number; y: number }[]>([]);
  const [rank, setRank] = useState<MoguraRank | null>(null);

  // Refs for stable references
  const targetIdRef = useRef(0);
  const effectIdRef = useRef(0);
  const gameTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const spawnTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const gameStartTimeRef = useRef(0);
  const isPlayingRef = useRef(false); // ← バグ修正: refで状態を追跡

  // 難易度計算
  const getDifficulty = useCallback((elapsed: number) => {
    const progress = Math.min(elapsed / (GAME_DURATION * 1000), 1);
    const targetDuration = INITIAL_TARGET_DURATION - (INITIAL_TARGET_DURATION - MIN_TARGET_DURATION) * progress;
    const spawnInterval = INITIAL_SPAWN_INTERVAL - (INITIAL_SPAWN_INTERVAL - MIN_SPAWN_INTERVAL) * progress;
    const simultaneousTargets = Math.min(1 + Math.floor(progress * MAX_SIMULTANEOUS_TARGETS), MAX_SIMULTANEOUS_TARGETS);
    return { targetDuration, spawnInterval, simultaneousTargets };
  }, []);

  // ターゲット出現 - refを使って状態をチェック
  const spawnTarget = useCallback(() => {
    if (!isPlayingRef.current) return; // refで確実にチェック

    const elapsed = Date.now() - gameStartTimeRef.current;
    const { targetDuration, spawnInterval, simultaneousTargets } = getDifficulty(elapsed);

    setTargets((prev) => {
      const activeHoles = new Set(prev.filter((t) => !t.hit && !t.missed).map((t) => t.holeIndex));
      const availableHoles = Array.from({ length: TOTAL_HOLES }, (_, i) => i).filter(
        (i) => !activeHoles.has(i)
      );

      if (availableHoles.length === 0) return prev;

      const currentActive = activeHoles.size;
      const toSpawn = Math.min(
        Math.random() < 0.3 ? simultaneousTargets : 1,
        availableHoles.length,
        simultaneousTargets - currentActive
      );

      const newTargets: Target[] = [];
      const shuffled = availableHoles.sort(() => Math.random() - 0.5);

      for (let i = 0; i < toSpawn; i++) {
        newTargets.push({
          id: ++targetIdRef.current,
          holeIndex: shuffled[i],
          spawnedAt: Date.now(),
          duration: targetDuration + Math.random() * 200 - 100,
          hit: false,
          missed: false,
        });
      }

      return [...prev, ...newTargets];
    });

    // 次のターゲット出現をスケジュール - refでチェック
    if (isPlayingRef.current) {
      spawnTimerRef.current = setTimeout(spawnTarget, spawnInterval + Math.random() * 200);
    }
  }, [getDifficulty]);

  // ターゲットのタイムアウトチェック
  useEffect(() => {
    if (phase !== "playing") return;

    const checkInterval = setInterval(() => {
      const now = Date.now();
      setTargets((prev) =>
        prev.map((target) => {
          if (!target.hit && !target.missed && now - target.spawnedAt > target.duration) {
            return { ...target, missed: true };
          }
          return target;
        })
      );
    }, 100);

    return () => clearInterval(checkInterval);
  }, [phase]);

  // 古いターゲットのクリーンアップ
  useEffect(() => {
    if (phase !== "playing") return;
    const cleanup = setInterval(() => {
      setTargets((prev) => prev.filter((t) => {
        if (t.hit || t.missed) {
          return Date.now() - t.spawnedAt < t.duration + 500;
        }
        return true;
      }));
    }, 500);
    return () => clearInterval(cleanup);
  }, [phase]);

  // エフェクト削除
  useEffect(() => {
    if (effects.length === 0) return;
    const timer = setTimeout(() => {
      setEffects([]);
    }, 500);
    return () => clearTimeout(timer);
  }, [effects]);

  // ゲーム開始
  const handleStart = useCallback(() => {
    isPlayingRef.current = true; // ← バグ修正: refを先に設定
    setPhase("playing");
    setScore(0);
    setTimeLeft(GAME_DURATION);
    setTargets([]);
    setEffects([]);
    setRank(null);
    targetIdRef.current = 0;
    effectIdRef.current = 0;
    gameStartTimeRef.current = Date.now();

    // タイマー開始
    gameTimerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          isPlayingRef.current = false; // ← ゲーム終了
          if (gameTimerRef.current) clearInterval(gameTimerRef.current);
          if (spawnTimerRef.current) clearTimeout(spawnTimerRef.current);
          setPhase("result");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // 最初のターゲット出現
    setTimeout(spawnTarget, 500);
  }, [spawnTarget]);

  // ランク計算
  useEffect(() => {
    if (phase === "result") {
      setRank(getRank(score));
    }
  }, [phase, score]);

  // クリーンアップ
  useEffect(() => {
    return () => {
      isPlayingRef.current = false;
      if (gameTimerRef.current) clearInterval(gameTimerRef.current);
      if (spawnTimerRef.current) clearTimeout(spawnTimerRef.current);
    };
  }, []);

  // ターゲットをタップ
  const handleTargetHit = useCallback((targetId: number, holeIndex: number, event: React.MouseEvent | React.TouchEvent) => {
    event.preventDefault();

    setTargets((prev) =>
      prev.map((target) => {
        if (target.id === targetId && !target.hit && !target.missed) {
          setScore((s) => s + 1);
          
          const col = holeIndex % GRID_COLS;
          const row = Math.floor(holeIndex / GRID_COLS);
          setEffects((e) => [
            ...e,
            {
              id: ++effectIdRef.current,
              x: ((col + 0.5) / GRID_COLS) * 100,
              y: ((row + 0.5) / GRID_ROWS) * 100,
            },
          ]);

          return { ...target, hit: true };
        }
        return target;
      })
    );
  }, []);

  // シェア
  const shareUrl =
    typeof window !== "undefined" && rank
      ? `${window.location.origin}/mogura?score=${score}&rank=${rank.rank}&title=${encodeURIComponent(rank.title)}`
      : "";

  const shareText = rank
    ? `タップターゲットで${score}個ヒット！\nランク: ${rank.rank} ${rank.title} ${rank.emoji}\n#タップターゲット\n`
    : "";

  const twitterUrl = rank
    ? `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`
    : "";

  const lineUrl = rank
    ? `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(shareUrl)}`
    : "";

  const handleNativeShare = useCallback(async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: "タップターゲット", text: shareText, url: shareUrl });
      } catch { /* cancelled */ }
    }
  }, [shareText, shareUrl]);

  // ===== IDLE =====
  if (phase === "idle") {
    return (
      <div
        className="relative flex flex-col items-center justify-center min-h-screen px-4 text-center overflow-hidden"
        style={{ background: "linear-gradient(180deg, #0d1f17 0%, #1a3d2e 50%, #0d1f17 100%)" }}
      >
        <GameStyles />

        {/* Subtle pattern overlay */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: "radial-gradient(circle at 2px 2px, #FFD700 1px, transparent 0)",
            backgroundSize: "40px 40px",
          }}
        />

        {/* Icon */}
        <div style={{ animation: "scaleIn 0.5s ease-out" }} className="mb-6">
          <CrosshairIcon size={100} />
        </div>

        {/* Title */}
        <h1
          className="text-4xl sm:text-5xl font-bold text-white mb-2 tracking-tight"
          style={{ animation: "fadeIn 0.5s ease-out 0.1s both" }}
        >
          タップターゲット
        </h1>

        <p
          className="text-gray-400 mb-2 text-sm"
          style={{ animation: "fadeIn 0.5s ease-out 0.2s both" }}
        >
          光るターゲットをタップ！
        </p>
        <p
          className="text-gray-500 mb-8 text-xs max-w-xs leading-relaxed"
          style={{ animation: "fadeIn 0.5s ease-out 0.3s both" }}
        >
          制限時間 <span className="text-amber-400 font-semibold">30秒</span>
          <br />
          時間が経つほど難しくなる
        </p>

        {/* Start button */}
        <button
          onClick={handleStart}
          className="px-10 py-4 text-lg font-bold rounded-full transition-all"
          style={{
            background: "linear-gradient(135deg, #FFD700 0%, #D4A500 100%)",
            color: "#1a3d2e",
            boxShadow: "0 4px 20px rgba(255,215,0,0.3)",
            animation: "fadeIn 0.5s ease-out 0.4s both, glow 2s ease-in-out infinite",
          }}
        >
          スタート
        </button>

        <Link
          href="/"
          className="mt-8 text-gray-500 hover:text-amber-400 text-sm transition-colors"
          style={{ animation: "fadeIn 0.5s ease-out 0.5s both" }}
        >
          ← トップへ
        </Link>
      </div>
    );
  }

  // ===== PLAYING =====
  if (phase === "playing") {
    return (
      <div
        className="relative flex flex-col items-center justify-center min-h-screen p-4 overflow-hidden"
        style={{
          background: "linear-gradient(180deg, #0d1f17 0%, #1a3d2e 50%, #0d1f17 100%)",
          touchAction: "manipulation",
        }}
      >
        <GameStyles />

        {/* HUD */}
        <div className="flex justify-between items-center w-full max-w-md mb-4">
          <div
            className="px-5 py-2 rounded-full font-bold text-white"
            style={{ background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,215,0,0.2)" }}
          >
            <span className="text-amber-400 text-2xl">{score}</span>
          </div>

          <div
            className={`px-5 py-2 rounded-full font-bold`}
            style={{
              background: "rgba(0,0,0,0.4)",
              border: `1px solid ${timeLeft <= 5 ? "rgba(239,68,68,0.5)" : "rgba(255,255,255,0.1)"}`,
              color: timeLeft <= 5 ? "#ef4444" : "#fff",
              animation: timeLeft <= 5 ? "timerUrgent 0.5s ease-in-out infinite" : "none",
            }}
          >
            <span className="text-2xl">{timeLeft}</span>
            <span className="text-sm ml-1 opacity-60">s</span>
          </div>
        </div>

        {/* Game Grid */}
        <div
          className="relative w-full max-w-md aspect-[3/4] rounded-2xl p-3"
          style={{
            background: "rgba(0,0,0,0.3)",
            border: "1px solid rgba(255,215,0,0.1)",
          }}
        >
          <div
            className="grid gap-2 h-full"
            style={{
              gridTemplateColumns: `repeat(${GRID_COLS}, 1fr)`,
              gridTemplateRows: `repeat(${GRID_ROWS}, 1fr)`,
            }}
          >
            {Array.from({ length: TOTAL_HOLES }).map((_, index) => {
              const target = targets.find(
                (t) => t.holeIndex === index && Date.now() - t.spawnedAt < t.duration + 400
              );
              const isHit = target?.hit;
              const isMissed = target?.missed;

              return (
                <div
                  key={index}
                  className="relative flex items-center justify-center rounded-xl"
                  style={{
                    background: "rgba(255,215,0,0.03)",
                    border: "1px solid rgba(255,215,0,0.05)",
                  }}
                >
                  {target && (
                    <div
                      className="cursor-pointer"
                      onClick={(e) => handleTargetHit(target.id, index, e)}
                      onTouchStart={(e) => handleTargetHit(target.id, index, e)}
                      style={{
                        animation: isHit
                          ? "targetHit 0.3s ease-out forwards"
                          : isMissed
                          ? "targetMiss 0.3s ease-out forwards"
                          : "targetPop 0.2s ease-out",
                      }}
                    >
                      <TargetSVG hit={isHit} size={56} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Hit effects */}
          {effects.map((effect) => (
            <HitEffect key={effect.id} x={effect.x} y={effect.y} />
          ))}
        </div>
      </div>
    );
  }

  // ===== RESULT =====
  if (phase === "result" && rank) {
    return (
      <div
        className="relative flex flex-col items-center justify-center min-h-screen px-4 py-8 overflow-hidden"
        style={{ background: "linear-gradient(180deg, #0d1f17 0%, #1a3d2e 50%, #0d1f17 100%)" }}
      >
        <GameStyles />

        {/* Subtle glow */}
        <div
          className="absolute top-1/3 left-1/2 w-64 h-64 rounded-full pointer-events-none"
          style={{
            background: `radial-gradient(circle, ${rank.color}20 0%, transparent 70%)`,
            transform: "translate(-50%, -50%)",
          }}
        />

        <div className="text-sm text-gray-400 mb-6" style={{ animation: "fadeIn 0.4s ease-out" }}>
          結果
        </div>

        {/* Rank icon */}
        <div className="mb-4" style={{ animation: "rankPop 0.6s ease-out" }}>
          <RankIcon rankLetter={rank.rank} color={rank.color} size={80} />
        </div>

        {/* Rank letter */}
        <div
          className="text-7xl font-bold mb-2"
          style={{
            color: rank.color,
            textShadow: `0 0 40px ${rank.color}60`,
            animation: "rankPop 0.6s ease-out 0.1s both",
          }}
        >
          {rank.rank}
        </div>

        <div
          className="text-xl font-semibold text-white mb-1"
          style={{ animation: "fadeIn 0.5s ease-out 0.2s both" }}
        >
          {rank.title}
        </div>
        <div
          className="text-gray-400 text-sm mb-6"
          style={{ animation: "fadeIn 0.5s ease-out 0.3s both" }}
        >
          {rank.description}
        </div>

        {/* Score */}
        <div
          className="px-8 py-4 rounded-2xl mb-8 text-center"
          style={{
            background: "rgba(0,0,0,0.3)",
            border: `1px solid ${rank.color}33`,
            animation: "scaleIn 0.5s ease-out 0.4s both",
          }}
        >
          <div className="text-gray-400 text-xs mb-1">SCORE</div>
          <div className="text-5xl font-bold" style={{ color: rank.color }}>
            {score}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3 w-full max-w-xs" style={{ animation: "fadeIn 0.5s ease-out 0.5s both" }}>
          {typeof navigator !== "undefined" && typeof navigator.share === "function" && (
            <button
              onClick={handleNativeShare}
              className="w-full py-3 rounded-full font-semibold transition-all"
              style={{
                background: rank.color,
                color: "#1a3d2e",
              }}
            >
              結果をシェア
            </button>
          )}

          <div className="flex gap-3">
            <a
              href={twitterUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-3 rounded-full font-semibold text-center text-sm text-white transition-all"
              style={{ background: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.1)" }}
            >
              𝕏
            </a>
            <a
              href={lineUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-3 rounded-full font-semibold text-center text-sm text-white transition-all"
              style={{ background: "#06C755" }}
            >
              LINE
            </a>
          </div>

          <button
            onClick={handleStart}
            className="w-full py-3 rounded-full font-semibold text-white transition-all mt-2"
            style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.1)" }}
          >
            もう一回
          </button>
          <Link href="/" className="text-center text-gray-500 hover:text-amber-400 text-sm mt-2 transition-colors">
            ← トップへ
          </Link>
        </div>
      </div>
    );
  }

  return null;
}
