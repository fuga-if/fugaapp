"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import {
  getRank,
  getGridSize,
  getColorDelta,
  generateBaseColor,
  hslToString,
  percentileDistribution,
  type ColorRank,
} from "@/lib/color-test/ranks";
import Link from "next/link";

const TIME_LIMIT = 30000; // 30秒
const LEVEL_UP_DELAY = 500;

type Phase = "idle" | "playing" | "levelUp" | "result";

interface GridData {
  baseColor: string;
  diffColor: string;
  diffIndex: number;
  gridSize: number;
}

function generateGrid(level: number): GridData {
  const gridSize = getGridSize(level);
  const delta = getColorDelta(level);
  const base = generateBaseColor();
  const totalCells = gridSize * gridSize;
  const diffIndex = Math.floor(Math.random() * totalCells);

  const direction = Math.random() > 0.5 ? 1 : -1;
  let diffL = base.l + delta * direction;
  if (diffL > 95) diffL = base.l - delta;
  if (diffL < 5) diffL = base.l + delta;

  return {
    baseColor: hslToString(base.h, base.s, base.l),
    diffColor: hslToString(base.h, base.s, diffL),
    diffIndex,
    gridSize,
  };
}

/* ═══════════════════════════════════════
   Gallery Styles
   ═══════════════════════════════════════ */

function GalleryStyles() {
  return (
    <style jsx global>{`
      @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400;1,700&display=swap');

      @keyframes galleryFadeIn {
        0% { opacity: 0; transform: translateY(12px); }
        100% { opacity: 1; transform: translateY(0); }
      }
      @keyframes galleryFadeInSlow {
        0% { opacity: 0; }
        100% { opacity: 1; }
      }
      @keyframes spotlightFlash {
        0% { box-shadow: 0 0 0 rgba(255,255,255,0); }
        30% { box-shadow: 0 0 60px rgba(255,255,255,0.3); }
        100% { box-shadow: 0 0 0 rgba(255,255,255,0); }
      }
      @keyframes frameSlideOut {
        0% { opacity: 1; transform: translateX(0) scale(1); }
        100% { opacity: 0; transform: translateX(-40px) scale(0.95); }
      }
      @keyframes frameSlideIn {
        0% { opacity: 0; transform: translateX(40px) scale(0.95); }
        100% { opacity: 1; transform: translateX(0) scale(1); }
      }
      @keyframes correctFlash {
        0% { background: #FAFAF8; }
        30% { background: #f0faf0; }
        100% { background: #FAFAF8; }
      }
      @keyframes wrongFlash {
        0% { background: #FAFAF8; }
        30% { background: #faf0f0; }
        100% { background: #FAFAF8; }
      }
      @keyframes elegantReveal {
        0% { opacity: 0; transform: translateY(20px); }
        100% { opacity: 1; transform: translateY(0); }
      }
      @keyframes shimmer {
        0% { opacity: 0.4; }
        50% { opacity: 0.8; }
        100% { opacity: 0.4; }
      }
      @keyframes progressShrink {
        from { transform: scaleX(1); }
        to { transform: scaleX(0); }
      }

      .gallery-serif {
        font-family: 'Playfair Display', Georgia, 'Times New Roman', serif;
      }
      .gallery-sans {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      }
      .gallery-bg {
        background: linear-gradient(180deg, #FAFAF8 0%, #F5F2ED 50%, #F0EDE8 100%);
      }
    `}</style>
  );
}

/* ═══════════════════════════════════════
   SVG Icons (no emoji)
   ═══════════════════════════════════════ */

function IconEye({ size = 48, color = "#C9A96E" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      <path d="M50 25C20 25 5 50 5 50s15 25 45 25 45-25 45-25-15-25-45-25z"
        stroke={color} strokeWidth="3" fill="none" />
      <circle cx="50" cy="50" r="14" stroke={color} strokeWidth="3" fill="none" />
      <circle cx="50" cy="50" r="6" fill={color} />
    </svg>
  );
}

function IconArrowLeft({ size = 16, color = "#8C8C8C" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
      <path d="M15 18l-6-6 6-6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconShare({ size = 16, color = "#8C8C8C" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
      <path d="M4 12v7a2 2 0 002 2h12a2 2 0 002-2v-7M16 6l-4-4-4 4M12 2v13" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconRepeat({ size = 16, color = "#8C8C8C" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
      <path d="M1 4v6h6M23 20v-6h-6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M20.49 9A9 9 0 005.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 013.51 15" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* Rank icon for result - abstract art */
function RankArtwork({ rank, color, size = 120 }: { rank: string; color: string; size?: number }) {
  // Abstract art pieces for each rank
  switch (rank) {
    case "S":
      return (
        <svg width={size} height={size} viewBox="0 0 120 120">
          <defs>
            <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#B8860B" />
              <stop offset="50%" stopColor="#FFD700" />
              <stop offset="100%" stopColor="#B8860B" />
            </linearGradient>
          </defs>
          <circle cx="60" cy="60" r="45" fill="none" stroke="url(#goldGrad)" strokeWidth="2" />
          <circle cx="60" cy="60" r="30" fill="none" stroke="url(#goldGrad)" strokeWidth="1.5" opacity="0.6" />
          <circle cx="60" cy="60" r="15" fill="url(#goldGrad)" opacity="0.3" />
          <path d="M60 15L67 42h28L72 58l8 27-20-15-20 15 8-27-23-16h28z" fill="url(#goldGrad)" opacity="0.8" />
        </svg>
      );
    case "A":
      return (
        <svg width={size} height={size} viewBox="0 0 120 120">
          <circle cx="60" cy="60" r="40" fill="none" stroke={color} strokeWidth="2" />
          <polygon points="60,20 80,50 95,90 60,75 25,90 40,50" fill="none" stroke={color} strokeWidth="1.5" opacity="0.7" />
          <circle cx="60" cy="55" r="12" fill={color} opacity="0.25" />
        </svg>
      );
    case "B":
      return (
        <svg width={size} height={size} viewBox="0 0 120 120">
          <rect x="25" y="25" width="70" height="70" rx="3" fill="none" stroke={color} strokeWidth="2" />
          <rect x="40" y="40" width="40" height="40" rx="2" fill="none" stroke={color} strokeWidth="1.5" opacity="0.5" />
          <circle cx="60" cy="60" r="10" fill={color} opacity="0.2" />
        </svg>
      );
    default:
      return (
        <svg width={size} height={size} viewBox="0 0 120 120">
          <circle cx="60" cy="60" r="40" fill="none" stroke={color} strokeWidth="1.5" opacity="0.4" />
          <circle cx="60" cy="60" r="20" fill={color} opacity="0.15" />
        </svg>
      );
  }
}

/* ═══════════════════════════════════════
   Main Component
   ═══════════════════════════════════════ */

export default function ColorTestGameClient() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [level, setLevel] = useState(1);
  const [grid, setGrid] = useState<GridData | null>(null);
  const [rank, setRank] = useState<ColorRank | null>(null);
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT);
  const [flash, setFlash] = useState<"correct" | "wrong" | null>(null);
  const [gridKey, setGridKey] = useState(0);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef(0);
  const animFrameRef = useRef<number | null>(null);
  const phaseRef = useRef<Phase>("idle");

  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
  }, []);

  const startTimer = useCallback(() => {
    stopTimer();
    startTimeRef.current = performance.now();
    setTimeLeft(TIME_LIMIT);

    // setIntervalで確実にUIを更新（30ms間隔）
    timerRef.current = setInterval(() => {
      const elapsed = performance.now() - startTimeRef.current;
      const remaining = Math.max(0, TIME_LIMIT - elapsed);
      setTimeLeft(remaining);

      if (remaining <= 0) {
        stopTimer();
        setPhase("result");
      }
    }, 30);
  }, [stopTimer]);

  const startLevel = useCallback(
    (lvl: number) => {
      const newGrid = generateGrid(lvl);
      setGrid(newGrid);
      setLevel(lvl);
      setGridKey((k) => k + 1);
      setPhase("playing");
      startTimer();
    },
    [startTimer]
  );

  const handleStart = useCallback(() => {
    setRank(null);
    setFlash(null);
    startLevel(1);
  }, [startLevel]);

  const handleCellTap = useCallback(
    (index: number) => {
      if (phase !== "playing" || !grid) return;

      if (index === grid.diffIndex) {
        stopTimer();
        setFlash("correct");
        const nextLevel = level + 1;

        setTimeout(() => {
          setFlash(null);
          setPhase("levelUp");
          setTimeout(() => {
            startLevel(nextLevel);
          }, LEVEL_UP_DELAY);
        }, 300);
      } else {
        stopTimer();
        setFlash("wrong");
        const finalLevel = level - 1;
        setTimeout(() => {
          setFlash(null);
          setRank(getRank(finalLevel));
          setLevel(finalLevel);
          setPhase("result");
        }, 500);
      }
    },
    [phase, grid, level, stopTimer, startLevel]
  );

  useEffect(() => {
    if (phase === "result" && !rank) {
      const finalLevel = level - 1;
      setLevel(finalLevel);
      setRank(getRank(finalLevel));
    }
  }, [phase, rank, level]);

  // Share
  const finalScore = phase === "result" ? level : 0;
  const shareUrl =
    typeof window !== "undefined" && rank
      ? `${window.location.origin}/color-test?score=${finalScore}&rank=${rank.rank}&title=${encodeURIComponent(rank.title)}`
      : "";

  const shareText = rank
    ? `色覚テストでレベル${finalScore}に到達！ランク: ${rank.rank}「${rank.title}」\n#色覚テスト\n`
    : "";

  const twitterUrl = rank
    ? `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`
    : "";

  const handleNativeShare = useCallback(async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Color Perception Test",
          text: shareText,
          url: shareUrl,
        });
      } catch {
        // user cancelled
      }
    }
  }, [shareText, shareUrl]);

  const timerPercent = (timeLeft / TIME_LIMIT) * 100;

  // ===== IDLE =====
  if (phase === "idle") {
    return (
      <div className="gallery-bg flex flex-col items-center justify-center min-h-screen px-6 text-center">
        <GalleryStyles />

        {/* Subtle decorative lines */}
        <div className="absolute top-0 left-0 w-full h-px" style={{ background: 'linear-gradient(90deg, transparent, #C9A96E40, transparent)' }} />

        <div style={{ animation: 'galleryFadeIn 0.8s ease-out' }}>
          <IconEye size={56} color="#C9A96E" />
        </div>

        <h1
          className="gallery-serif text-4xl sm:text-5xl font-normal mt-6 mb-3 tracking-wide"
          style={{
            color: '#2C2C2C',
            animation: 'galleryFadeIn 0.8s ease-out 0.1s both',
            letterSpacing: '0.04em',
          }}
        >
          Color Perception Test
        </h1>

        <p
          className="gallery-sans text-sm mb-1"
          style={{
            color: '#8C8C8C',
            animation: 'galleryFadeIn 0.8s ease-out 0.2s both',
          }}
        >
          あなたの色覚を試しましょう
        </p>

        <div
          className="gallery-sans text-xs max-w-xs leading-relaxed mt-4 mb-10"
          style={{
            color: '#ACACAC',
            animation: 'galleryFadeIn 0.8s ease-out 0.3s both',
          }}
        >
          <p>グリッドの中から1つだけ異なる色のパネルを見つけてください</p>
          <p className="mt-1" style={{ color: '#B0A090' }}>制限時間 30秒</p>
        </div>

        <button
          onClick={handleStart}
          className="gallery-serif text-lg px-10 py-3 transition-all active:scale-95"
          style={{
            color: '#2C2C2C',
            background: 'transparent',
            border: '1.5px solid #2C2C2C',
            letterSpacing: '0.1em',
            animation: 'galleryFadeIn 0.8s ease-out 0.4s both',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#2C2C2C';
            e.currentTarget.style.color = '#FAFAF8';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.color = '#2C2C2C';
          }}
        >
          Begin
        </button>

        <Link
          href="/"
          className="gallery-sans mt-10 text-xs transition-colors"
          style={{
            color: '#BCBCBC',
            animation: 'galleryFadeIn 0.8s ease-out 0.5s both',
          }}
        >
          <IconArrowLeft size={12} color="#BCBCBC" /> Back to Gallery
        </Link>
      </div>
    );
  }

  // ===== LEVEL UP (brief transition) =====
  if (phase === "levelUp") {
    return (
      <div className="gallery-bg flex flex-col items-center justify-center min-h-screen">
        <GalleryStyles />
        <div
          className="gallery-serif text-2xl font-normal"
          style={{
            color: '#8C8C8C',
            animation: 'galleryFadeIn 0.4s ease-out',
            letterSpacing: '0.1em',
          }}
        >
          Level {level + 1}
        </div>
      </div>
    );
  }

  // ===== PLAYING =====
  if (phase === "playing" && grid) {
    const cellCount = grid.gridSize * grid.gridSize;
    const gap = grid.gridSize <= 3 ? 4 : grid.gridSize <= 5 ? 3 : 2;

    // Flash background
    const flashAnim = flash === "correct" ? 'correctFlash 0.4s ease-out' :
                      flash === "wrong" ? 'wrongFlash 0.5s ease-out' : 'none';

    return (
      <div
        className="gallery-bg flex flex-col items-center min-h-screen"
        style={{
          animation: flashAnim,
          touchAction: 'manipulation',
        }}
      >
        <GalleryStyles />

        {/* Top bar - museum info style */}
        <div className="w-full max-w-lg px-6 pt-4 pb-2">
          {/* Timer seek bar */}
          <div
            className="w-full overflow-hidden rounded-full mb-2"
            style={{
              height: '10px',
              background: '#E8E4DE',
              boxShadow: timerPercent < 30 ? '0 0 8px rgba(196,90,58,0.3)' : 'none',
            }}
          >
            <div
              className="h-full rounded-full transition-colors duration-500"
              style={{
                width: `${timerPercent}%`,
                background: timerPercent > 60
                  ? 'linear-gradient(90deg, #C9A96E, #D4B87A)'
                  : timerPercent > 30
                  ? 'linear-gradient(90deg, #D4A030, #C9A96E)'
                  : 'linear-gradient(90deg, #C45A3A, #D4603A)',
                transition: 'width 0.1s linear',
                boxShadow: timerPercent < 30
                  ? '0 0 6px rgba(196,90,58,0.5)'
                  : timerPercent < 60
                  ? '0 0 4px rgba(212,160,48,0.3)'
                  : 'none',
              }}
            />
          </div>

          <div className="flex justify-between items-baseline">
            <span
              className="gallery-sans text-xs tracking-widest"
              style={{ color: '#ACACAC', letterSpacing: '0.15em' }}
            >
              No. {level}
            </span>
            <span
              className="gallery-sans text-xs"
              style={{
                color: timerPercent < 30 ? '#C45A3A' : '#ACACAC',
                fontWeight: timerPercent < 30 ? 600 : 400,
                transition: 'color 0.3s ease',
              }}
            >
              {Math.ceil(timeLeft / 1000)}s
            </span>
            <span
              className="gallery-serif text-sm italic"
              style={{ color: '#8C8C8C' }}
            >
              Level {level}
            </span>
          </div>
        </div>

        {/* Grid area with frame */}
        <div
          className="flex-1 flex items-center justify-center px-6 pb-6 w-full"
          key={gridKey}
          style={{ animation: 'frameSlideIn 0.35s ease-out' }}
        >
          <div className="flex flex-col items-center">
            {/* Frame */}
            <div
              style={{
                padding: '8px',
                border: '2px solid #C9A96E',
                boxShadow: 'inset 0 0 0 1px #D4B87A40, 0 4px 24px rgba(0,0,0,0.08)',
                background: '#F8F6F2',
              }}
            >
              <div
                style={{
                  width: 'min(85vw, 85vh - 140px, 460px)',
                  aspectRatio: '1',
                  display: 'grid',
                  gridTemplateColumns: `repeat(${grid.gridSize}, 1fr)`,
                  gap: `${gap}px`,
                  background: '#F0EDE8',
                  padding: `${gap}px`,
                }}
              >
                {Array.from({ length: cellCount }).map((_, i) => (
                  <button
                    key={i}
                    onPointerDown={() => handleCellTap(i)}
                    style={{
                      background:
                        i === grid.diffIndex ? grid.diffColor : grid.baseColor,
                      border: 'none',
                      cursor: 'pointer',
                      touchAction: 'manipulation',
                      WebkitTapHighlightColor: 'transparent',
                      borderRadius: '1px',
                      transition: 'transform 0.1s ease',
                    }}
                    aria-label={`Panel ${i + 1}`}
                  />
                ))}
              </div>
            </div>

            {/* Caption (museum label style) */}
            <div className="mt-4 text-center">
              <div
                className="gallery-serif text-xs italic"
                style={{ color: '#ACACAC', letterSpacing: '0.05em' }}
              >
                {grid.gridSize} x {grid.gridSize} &mdash; Find the different hue
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ===== RESULT =====
  if (phase === "result" && rank) {
    const isTopRank = rank.rank === "S";
    const rankColor = isTopRank ? '#B8860B' : rank.color;

    return (
      <div
        className="gallery-bg flex flex-col items-center justify-center min-h-screen px-6 py-10"
        style={{ touchAction: 'manipulation' }}
      >
        <GalleryStyles />

        {/* Decorative line */}
        <div
          className="w-12 mb-8"
          style={{
            height: '1px',
            background: '#C9A96E',
            animation: 'galleryFadeInSlow 1s ease-out',
          }}
        />

        {/* Rank artwork */}
        <div style={{ animation: 'elegantReveal 0.8s ease-out 0.1s both' }}>
          <RankArtwork rank={rank.rank} color={rankColor} size={100} />
        </div>

        {/* Score */}
        <div
          className="gallery-sans text-6xl sm:text-7xl font-light mt-6 mb-2"
          style={{
            color: '#2C2C2C',
            animation: 'elegantReveal 0.8s ease-out 0.2s both',
            letterSpacing: '-0.02em',
          }}
        >
          {finalScore}
        </div>

        <div
          className="gallery-serif text-base italic mb-2"
          style={{
            color: '#8C8C8C',
            animation: 'elegantReveal 0.8s ease-out 0.3s both',
          }}
        >
          Your perception reached Level {finalScore}
        </div>

        {/* Rank */}
        <div
          className="mt-4 mb-1 gallery-sans text-sm font-medium tracking-widest"
          style={{
            color: rankColor,
            letterSpacing: '0.2em',
            animation: 'elegantReveal 0.8s ease-out 0.4s both',
          }}
        >
          RANK {rank.rank}
        </div>

        <div
          className="gallery-serif text-2xl italic mb-2"
          style={{
            color: '#2C2C2C',
            animation: 'elegantReveal 0.8s ease-out 0.45s both',
          }}
        >
          {rank.title}
        </div>

        <div
          className="gallery-sans text-xs max-w-xs text-center mb-6"
          style={{
            color: '#ACACAC',
            animation: 'elegantReveal 0.8s ease-out 0.5s both',
            lineHeight: '1.6',
          }}
        >
          {rank.description}
        </div>

        {/* Percentile Badge */}
        <div
          className="gallery-sans text-sm mb-6 px-4 py-1.5"
          style={{
            color: rankColor,
            border: `1px solid ${rankColor}40`,
            animation: 'elegantReveal 0.8s ease-out 0.52s both',
            letterSpacing: '0.05em',
          }}
        >
          上位 {rank.percentile}%
        </div>

        {/* Distribution Graph */}
        <div
          className="w-full max-w-xs mb-8"
          style={{ animation: 'elegantReveal 0.8s ease-out 0.55s both' }}
        >
          <div className="gallery-sans text-[10px] mb-3 text-center" style={{ color: '#BCBCBC', letterSpacing: '0.1em' }}>
            SCORE DISTRIBUTION
          </div>
          <div className="flex items-end justify-center gap-1.5" style={{ height: '80px' }}>
            {percentileDistribution.map((d) => {
              const isUserBucket = finalScore >= d.level && (d.level === 25 || finalScore < d.level + 5);
              const barHeight = (d.percent / 30) * 100;
              return (
                <div key={d.level} className="flex flex-col items-center gap-1" style={{ flex: 1 }}>
                  <div
                    className="gallery-sans text-[9px]"
                    style={{ color: isUserBucket ? rankColor : '#CCCCCC' }}
                  >
                    {d.percent}%
                  </div>
                  <div
                    className="w-full rounded-sm transition-all"
                    style={{
                      height: `${barHeight}%`,
                      minHeight: '4px',
                      background: isUserBucket ? rankColor : '#E0DDD8',
                      boxShadow: isUserBucket ? `0 0 8px ${rankColor}40` : 'none',
                    }}
                  />
                  <div
                    className="gallery-sans text-[8px]"
                    style={{
                      color: isUserBucket ? '#2C2C2C' : '#BCBCBC',
                      fontWeight: isUserBucket ? 600 : 400,
                    }}
                  >
                    {d.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Decorative line */}
        <div
          className="w-16 mb-8"
          style={{
            height: '1px',
            background: 'linear-gradient(90deg, transparent, #C9A96E, transparent)',
          }}
        />

        {/* Share section */}
        <div
          className="flex flex-col gap-3 w-full max-w-xs"
          style={{ animation: 'elegantReveal 0.8s ease-out 0.6s both' }}
        >
          {typeof navigator !== "undefined" &&
            typeof navigator.share === "function" && (
              <button
                onClick={handleNativeShare}
                className="gallery-sans w-full py-3 text-sm tracking-widest transition-all active:scale-95"
                style={{
                  color: '#FAFAF8',
                  background: '#2C2C2C',
                  border: 'none',
                  letterSpacing: '0.15em',
                }}
              >
                <IconShare size={14} color="#FAFAF8" /> Share Result
              </button>
            )}

          <div className="flex gap-3">
            <a
              href={twitterUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="gallery-sans flex-1 py-2.5 text-center text-xs tracking-wider transition-colors"
              style={{
                color: '#2C2C2C',
                border: '1px solid #DDDAD5',
                background: 'transparent',
                letterSpacing: '0.1em',
              }}
            >
              Post on X
            </a>
            <a
              href={`https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(shareUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="gallery-sans flex-1 py-2.5 text-center text-xs tracking-wider transition-colors"
              style={{
                color: '#06C755',
                border: '1px solid #06C75540',
                background: 'transparent',
                letterSpacing: '0.1em',
              }}
            >
              LINE
            </a>
          </div>

          <button
            onClick={handleStart}
            className="gallery-sans w-full py-2.5 text-xs tracking-widest mt-2 transition-all active:scale-95"
            style={{
              color: '#8C8C8C',
              background: 'transparent',
              border: '1px solid #DDDAD5',
              letterSpacing: '0.15em',
            }}
          >
            <IconRepeat size={13} color="#8C8C8C" /> Try Again
          </button>

          <Link
            href="/"
            className="gallery-sans text-center text-xs mt-3 transition-colors"
            style={{ color: '#BCBCBC' }}
          >
            <IconArrowLeft size={12} color="#BCBCBC" /> Back to Gallery
          </Link>
        </div>
      </div>
    );
  }

  return null;
}
