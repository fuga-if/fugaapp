"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { getRank, type SwipeRank } from "@/lib/swipe-test/ranks";
import Link from "next/link";

const GAME_DURATION = 30;
type Direction = "up" | "down" | "left" | "right";
type Phase = "idle" | "countdown" | "playing" | "result";
type Feedback = "correct" | "miss" | null;

const MIN_SWIPE = 30;

const DIRECTIONS: Direction[] = ["up", "down", "left", "right"];

function randomDirection(): Direction {
  return DIRECTIONS[Math.floor(Math.random() * DIRECTIONS.length)];
}

/* ═══════════════════════════════════════
   SVG Components
   ═══════════════════════════════════════ */

function ArrowSVG({
  direction,
  size = 160,
  color = "#06B6D4",
  glow = true,
  className = "",
  style = {},
}: {
  direction: Direction;
  size?: number;
  color?: string;
  glow?: boolean;
  className?: string;
  style?: React.CSSProperties;
}) {
  const rotations: Record<Direction, number> = {
    up: 0,
    right: 90,
    down: 180,
    left: 270,
  };
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={className}
      style={{
        filter: glow ? `drop-shadow(0 0 20px ${color}80) drop-shadow(0 0 40px ${color}40)` : undefined,
        transform: `rotate(${rotations[direction]}deg)`,
        ...style,
      }}
    >
      <path
        d="M50 10 L80 50 L62 50 L62 85 L38 85 L38 50 L20 50 Z"
        fill={color}
        stroke="rgba(255,255,255,0.3)"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconTarget({ size = 80, color = "#06B6D4" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ filter: `drop-shadow(0 0 12px ${color}60)` }}>
      <circle cx="50" cy="50" r="40" fill="none" stroke={color} strokeWidth="3" opacity="0.4" />
      <circle cx="50" cy="50" r="28" fill="none" stroke={color} strokeWidth="3" opacity="0.6" />
      <circle cx="50" cy="50" r="16" fill="none" stroke={color} strokeWidth="3" opacity="0.8" />
      <circle cx="50" cy="50" r="5" fill={color} />
    </svg>
  );
}

function IconSpeed({ size = 80, color = "#06B6D4" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ filter: `drop-shadow(0 0 12px ${color}60)` }}>
      <path d="M50 15 A35 35 0 1 1 15 50" fill="none" stroke={color} strokeWidth="5" strokeLinecap="round" />
      <line x1="50" y1="50" x2="70" y2="30" stroke={color} strokeWidth="4" strokeLinecap="round" />
      <circle cx="50" cy="50" r="4" fill={color} />
      {/* Speed lines */}
      <line x1="10" y1="35" x2="25" y2="35" stroke={color} strokeWidth="2" strokeLinecap="round" opacity="0.5" />
      <line x1="8" y1="50" x2="20" y2="50" stroke={color} strokeWidth="2" strokeLinecap="round" opacity="0.5" />
      <line x1="12" y1="65" x2="24" y2="65" stroke={color} strokeWidth="2" strokeLinecap="round" opacity="0.5" />
    </svg>
  );
}

function IconLightning({ size = 80, color = "#FFD700" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ filter: `drop-shadow(0 0 12px ${color}80)` }}>
      <polygon points="58,2 22,52 44,52 32,98 78,42 53,42" fill={color} stroke="rgba(0,0,0,0.25)" strokeWidth="2.5" strokeLinejoin="round" />
    </svg>
  );
}

function IconFlame({ size = 80, color = "#FF6B35" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ filter: `drop-shadow(0 0 12px ${color}80)` }}>
      <path d="M50 5 C50 5 75 30 75 58 C75 75 64 90 50 95 C36 90 25 75 25 58 C25 30 50 5 50 5Z" fill={color} stroke="rgba(0,0,0,0.2)" strokeWidth="2" />
      <path d="M50 35 C50 35 62 48 62 60 C62 70 57 78 50 80 C43 78 38 70 38 60 C38 48 50 35 50 35Z" fill="#FFE600" opacity="0.7" />
    </svg>
  );
}

function IconCrosshair({ size = 80, color = "#4ECDC4" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ filter: `drop-shadow(0 0 10px ${color}60)` }}>
      <circle cx="50" cy="50" r="35" fill="none" stroke={color} strokeWidth="4" />
      <circle cx="50" cy="50" r="20" fill="none" stroke={color} strokeWidth="3" opacity="0.6" />
      <circle cx="50" cy="50" r="5" fill={color} />
      <line x1="50" y1="8" x2="50" y2="25" stroke={color} strokeWidth="3" strokeLinecap="round" />
      <line x1="50" y1="75" x2="50" y2="92" stroke={color} strokeWidth="3" strokeLinecap="round" />
      <line x1="8" y1="50" x2="25" y2="50" stroke={color} strokeWidth="3" strokeLinecap="round" />
      <line x1="75" y1="50" x2="92" y2="50" stroke={color} strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

function IconTurtle({ size = 80, color = "#45B7D1" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ filter: `drop-shadow(0 0 10px ${color}60)` }}>
      <ellipse cx="50" cy="52" rx="30" ry="22" fill={color} stroke="rgba(0,0,0,0.2)" strokeWidth="2" />
      <ellipse cx="50" cy="52" rx="22" ry="16" fill="rgba(0,0,0,0.15)" />
      <circle cx="30" cy="38" r="8" fill={color} stroke="rgba(0,0,0,0.2)" strokeWidth="1.5" />
      <circle cx="28" cy="36" r="2" fill="#fff" />
      <ellipse cx="25" cy="62" rx="7" ry="5" fill={color} opacity="0.8" />
      <ellipse cx="75" cy="62" rx="7" ry="5" fill={color} opacity="0.8" />
      <ellipse cx="28" cy="68" rx="6" ry="4" fill={color} opacity="0.8" />
      <ellipse cx="72" cy="68" rx="6" ry="4" fill={color} opacity="0.8" />
    </svg>
  );
}

function IconSleep({ size = 80, color = "#96CEB4" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ filter: `drop-shadow(0 0 10px ${color}60)` }}>
      <text x="15" y="80" fontFamily="Arial Black, sans-serif" fontWeight="900" fontSize="36" fontStyle="italic" fill={color} opacity="0.5">z</text>
      <text x="38" y="58" fontFamily="Arial Black, sans-serif" fontWeight="900" fontSize="42" fontStyle="italic" fill={color} opacity="0.7">z</text>
      <text x="58" y="34" fontFamily="Arial Black, sans-serif" fontWeight="900" fontSize="50" fontStyle="italic" fill={color}>Z</text>
    </svg>
  );
}

function IconRock({ size = 80, color = "#A8A8A8" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ filter: `drop-shadow(0 0 8px ${color}40)` }}>
      <polygon points="50,15 78,30 85,60 68,85 32,85 15,60 22,30" fill={color} stroke="rgba(0,0,0,0.2)" strokeWidth="2" strokeLinejoin="round" />
      <polygon points="50,15 78,30 65,50 35,50 22,30" fill="rgba(255,255,255,0.1)" />
    </svg>
  );
}

function RankIcon({ rankLetter, color, size = 80 }: { rankLetter: string; color: string; size?: number }) {
  switch (rankLetter) {
    case "S": return <IconLightning size={size} color={color} />;
    case "A": return <IconFlame size={size} color={color} />;
    case "B": return <IconCrosshair size={size} color={color} />;
    case "C": return <IconTurtle size={size} color={color} />;
    case "D": return <IconSleep size={size} color={color} />;
    case "E": return <IconRock size={size} color={color} />;
    default:  return <IconLightning size={size} color={color} />;
  }
}

/* ─── Styles ─── */
function SwipeStyles() {
  return (
    <style jsx global>{`
      @keyframes bounceIn {
        0% { transform: scale(0); opacity: 0; }
        50% { transform: scale(1.15); }
        100% { transform: scale(1); opacity: 1; }
      }
      @keyframes bounceInBig {
        0% { transform: scale(0) rotate(-15deg); opacity: 0; }
        40% { transform: scale(1.3) rotate(5deg); }
        70% { transform: scale(0.9) rotate(-2deg); }
        100% { transform: scale(1) rotate(0deg); opacity: 1; }
      }
      @keyframes shake {
        0%, 100% { transform: translateX(0); }
        20% { transform: translateX(-8px); }
        40% { transform: translateX(8px); }
        60% { transform: translateX(-6px); }
        80% { transform: translateX(6px); }
      }
      @keyframes slideUp {
        0% { transform: translateY(30px); opacity: 0; }
        100% { transform: translateY(0); opacity: 1; }
      }
      @keyframes slideOut {
        0% { transform: translate(0, 0) scale(1); opacity: 1; }
        100% { opacity: 0; }
      }
      @keyframes slideOutUp {
        0% { transform: translateY(0) scale(1); opacity: 1; }
        100% { transform: translateY(-120px) scale(0.5); opacity: 0; }
      }
      @keyframes slideOutDown {
        0% { transform: translateY(0) scale(1); opacity: 1; }
        100% { transform: translateY(120px) scale(0.5); opacity: 0; }
      }
      @keyframes slideOutLeft {
        0% { transform: translateX(0) scale(1); opacity: 1; }
        100% { transform: translateX(-120px) scale(0.5); opacity: 0; }
      }
      @keyframes slideOutRight {
        0% { transform: translateX(0) scale(1); opacity: 1; }
        100% { transform: translateX(120px) scale(0.5); opacity: 0; }
      }
      @keyframes flashGreen {
        0% { background-color: rgba(34, 197, 94, 0.3); }
        100% { background-color: transparent; }
      }
      @keyframes flashRed {
        0% { background-color: rgba(239, 68, 68, 0.3); }
        100% { background-color: transparent; }
      }
      @keyframes countdownPop {
        0% { transform: scale(2); opacity: 0; }
        40% { transform: scale(0.9); opacity: 1; }
        100% { transform: scale(1); opacity: 1; }
      }
      @keyframes pulse-glow {
        0%, 100% { box-shadow: 0 0 20px rgba(6,182,212,0.4), 0 6px 0 #0e7490; }
        50% { box-shadow: 0 0 40px rgba(6,182,212,0.7), 0 6px 0 #0e7490; }
      }
      @keyframes rankReveal {
        0% { transform: scale(0) rotate(-30deg); opacity: 0; }
        50% { transform: scale(1.4) rotate(10deg); }
        70% { transform: scale(0.85) rotate(-3deg); }
        100% { transform: scale(1) rotate(-3deg); opacity: 1; }
      }
      @keyframes sparkle {
        0%, 100% { opacity: 0; transform: scale(0) rotate(0deg); }
        50% { opacity: 1; transform: scale(1) rotate(180deg); }
      }
      @keyframes timerPulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.6; }
      }
      @keyframes arrowAppear {
        0% { transform: scale(0) rotate(-10deg); opacity: 0; }
        60% { transform: scale(1.1) rotate(2deg); }
        100% { transform: scale(1) rotate(0deg); opacity: 1; }
      }
      .sport-text {
        font-weight: 900;
        letter-spacing: 0.02em;
        text-shadow: 2px 2px 0 rgba(0,0,0,0.4);
      }
      .sport-text-glow {
        font-weight: 900;
        text-shadow: 0 0 20px rgba(6,182,212,0.6), 2px 2px 0 rgba(0,0,0,0.4);
      }
    `}</style>
  );
}

function Sparkles({ color, count = 6 }: { color: string; count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="absolute pointer-events-none"
          style={{
            width: "8px",
            height: "8px",
            background: color,
            borderRadius: "50%",
            top: `${15 + Math.random() * 70}%`,
            left: `${10 + Math.random() * 80}%`,
            animation: `sparkle ${1.5 + Math.random() * 2}s ease-in-out ${Math.random() * 2}s infinite`,
          }}
        />
      ))}
    </>
  );
}

/* ─── Time Bar ─── */
function TimeBar({ timeLeft, total }: { timeLeft: number; total: number }) {
  const pct = (timeLeft / total) * 100;
  const isLow = timeLeft <= 5;
  return (
    <div className="w-full max-w-sm mx-auto h-3 rounded-full overflow-hidden"
      style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)" }}>
      <div
        className="h-full rounded-full transition-all duration-1000 ease-linear"
        style={{
          width: `${pct}%`,
          background: isLow
            ? "linear-gradient(90deg, #EF4444, #F97316)"
            : "linear-gradient(90deg, #06B6D4, #22D3EE)",
          boxShadow: isLow
            ? "0 0 10px rgba(239,68,68,0.5)"
            : "0 0 10px rgba(6,182,212,0.5)",
          animation: isLow ? "timerPulse 0.5s ease-in-out infinite" : undefined,
        }}
      />
    </div>
  );
}

/* ─── Score Board ─── */
function ScoreBoard({ correct, miss }: { correct: number; miss: number }) {
  return (
    <div className="flex gap-6 items-center">
      <div className="flex flex-col items-center px-4 py-2 rounded-lg"
        style={{ background: "rgba(34,197,94,0.15)", border: "1px solid rgba(34,197,94,0.3)" }}>
        <span className="text-xs font-bold text-green-400 uppercase tracking-wider">Correct</span>
        <span className="text-3xl font-black text-green-400">{correct}</span>
      </div>
      <div className="flex flex-col items-center px-4 py-2 rounded-lg"
        style={{ background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.3)" }}>
        <span className="text-xs font-bold text-red-400 uppercase tracking-wider">Miss</span>
        <span className="text-3xl font-black text-red-400">{miss}</span>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   Main Game Component
   ═══════════════════════════════════════ */

export default function SwipeTestGame() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [countdown, setCountdown] = useState(3);
  const [currentDir, setCurrentDir] = useState<Direction>("up");
  const [correct, setCorrect] = useState(0);
  const [miss, setMiss] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [feedback, setFeedback] = useState<Feedback>(null);
  const [flyDir, setFlyDir] = useState<Direction | null>(null);
  const [rank, setRank] = useState<SwipeRank | null>(null);
  const [streak, setStreak] = useState(0);
  const [arrowVisible, setArrowVisible] = useState(true);
  const [arrowKey, setArrowKey] = useState(0);

  const pointerStartRef = useRef<{ x: number; y: number } | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const feedbackTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const gameEndTimeRef = useRef(0);
  const animFrameRef = useRef<number | null>(null);

  // Cleanup
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (feedbackTimerRef.current) clearTimeout(feedbackTimerRef.current);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  // Precise timer with requestAnimationFrame
  const startGameTimer = useCallback(() => {
    gameEndTimeRef.current = Date.now() + GAME_DURATION * 1000;

    const tick = () => {
      const remaining = Math.max(0, Math.ceil((gameEndTimeRef.current - Date.now()) / 1000));
      setTimeLeft(remaining);
      if (remaining <= 0) {
        return; // game end handled by effect
      }
      animFrameRef.current = requestAnimationFrame(tick);
    };
    animFrameRef.current = requestAnimationFrame(tick);
  }, []);

  // Check time up
  useEffect(() => {
    if (phase === "playing" && timeLeft <= 0) {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      // Use functional state to get latest correct
      setPhase("result");
    }
  }, [phase, timeLeft]);

  // Set rank when entering result
  useEffect(() => {
    if (phase === "result") {
      setRank(getRank(correct));
    }
  }, [phase, correct]);

  // Level up: hide arrow briefly based on streak
  useEffect(() => {
    if (phase !== "playing") return;
    if (streak >= 10) {
      // Show arrow for only 400ms
      setArrowVisible(true);
      const t = setTimeout(() => setArrowVisible(false), 400);
      return () => clearTimeout(t);
    } else if (streak >= 5) {
      // Show arrow for only 800ms
      setArrowVisible(true);
      const t = setTimeout(() => setArrowVisible(false), 800);
      return () => clearTimeout(t);
    } else {
      setArrowVisible(true);
    }
  }, [phase, streak, currentDir, arrowKey]);

  const nextArrow = useCallback(() => {
    let next = randomDirection();
    // Avoid same direction twice in a row
    while (next === currentDir) {
      next = randomDirection();
    }
    setCurrentDir(next);
    setArrowKey((k) => k + 1);
  }, [currentDir]);

  const handleStart = useCallback(() => {
    setCorrect(0);
    setMiss(0);
    setTimeLeft(GAME_DURATION);
    setFeedback(null);
    setFlyDir(null);
    setRank(null);
    setStreak(0);
    setArrowVisible(true);
    setArrowKey(0);
    setCountdown(3);
    setPhase("countdown");

    let c = 3;
    const cdInterval = setInterval(() => {
      c--;
      if (c > 0) {
        setCountdown(c);
      } else {
        clearInterval(cdInterval);
        setCountdown(0);
        setCurrentDir(randomDirection());
        setPhase("playing");
        // start timer in next tick
      }
    }, 1000);

    timerRef.current = cdInterval;
  }, []);

  // Start game timer when entering playing phase
  useEffect(() => {
    if (phase === "playing" && timeLeft === GAME_DURATION) {
      if (timerRef.current) clearInterval(timerRef.current);
      startGameTimer();
    }
  }, [phase, timeLeft, startGameTimer]);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (phase !== "playing") return;
      e.preventDefault();
      pointerStartRef.current = { x: e.clientX, y: e.clientY };
    },
    [phase]
  );

  const handlePointerUp = useCallback(
    (e: React.PointerEvent) => {
      if (phase !== "playing" || !pointerStartRef.current) return;
      e.preventDefault();

      const start = pointerStartRef.current;
      pointerStartRef.current = null;

      const dx = e.clientX - start.x;
      const dy = e.clientY - start.y;
      const absDx = Math.abs(dx);
      const absDy = Math.abs(dy);

      if (Math.max(absDx, absDy) < MIN_SWIPE) return; // too short

      let swiped: Direction;
      if (absDx > absDy) {
        swiped = dx > 0 ? "right" : "left";
      } else {
        swiped = dy > 0 ? "down" : "up";
      }

      if (swiped === currentDir) {
        setCorrect((c) => c + 1);
        setStreak((s) => s + 1);
        setFeedback("correct");
        setFlyDir(swiped);
      } else {
        setMiss((m) => m + 1);
        setStreak(0);
        setFeedback("miss");
        setFlyDir(null);
      }

      // Clear feedback after short delay
      if (feedbackTimerRef.current) clearTimeout(feedbackTimerRef.current);
      feedbackTimerRef.current = setTimeout(() => {
        setFeedback(null);
        setFlyDir(null);
      }, 300);

      nextArrow();
    },
    [phase, currentDir, nextArrow]
  );

  // Share
  const shareUrl =
    typeof window !== "undefined" && rank
      ? `${window.location.origin}/swipe-test?score=${correct}&rank=${rank.rank}&title=${encodeURIComponent(rank.title)}`
      : "";

  const shareText = rank
    ? `スワイプ方向テストで30秒間に${correct}問正解！\nランク: ${rank.rank} ${rank.title} ${rank.emoji}\n#スワイプ方向テスト\n`
    : "";

  const twitterUrl = rank
    ? `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`
    : "";

  const handleNativeShare = useCallback(async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "スワイプ方向テスト",
          text: shareText,
          url: shareUrl,
        });
      } catch {
        // user cancelled
      }
    }
  }, [shareText, shareUrl]);

  // Fly-out animation name
  const flyAnimName = flyDir
    ? `slideOut${flyDir.charAt(0).toUpperCase() + flyDir.slice(1)}`
    : "slideOut";

  // ===== IDLE =====
  if (phase === "idle") {
    return (
      <div
        className="relative flex flex-col items-center justify-center min-h-screen px-4 text-center overflow-hidden"
        style={{ background: "linear-gradient(135deg, #0F172A 0%, #1E293B 100%)" }}
      >
        <SwipeStyles />

        {/* Decorative arrows */}
        <div className="absolute top-[10%] left-[5%] opacity-10 pointer-events-none" style={{ animation: "bounceIn 1s ease-out 0.2s both" }}>
          <ArrowSVG direction="up" size={60} color="#06B6D4" glow={false} />
        </div>
        <div className="absolute top-[20%] right-[8%] opacity-10 pointer-events-none" style={{ animation: "bounceIn 1s ease-out 0.4s both" }}>
          <ArrowSVG direction="right" size={50} color="#06B6D4" glow={false} />
        </div>
        <div className="absolute bottom-[15%] left-[10%] opacity-10 pointer-events-none" style={{ animation: "bounceIn 1s ease-out 0.6s both" }}>
          <ArrowSVG direction="left" size={45} color="#06B6D4" glow={false} />
        </div>
        <div className="absolute bottom-[25%] right-[5%] opacity-10 pointer-events-none" style={{ animation: "bounceIn 1s ease-out 0.8s both" }}>
          <ArrowSVG direction="down" size={55} color="#06B6D4" glow={false} />
        </div>

        {/* Icon */}
        <div style={{ animation: "bounceIn 0.6s ease-out" }} className="mb-4">
          <IconSpeed size={90} color="#06B6D4" />
        </div>

        {/* Title */}
        <h1
          className="sport-text text-4xl sm:text-5xl text-white mb-3"
          style={{ animation: "bounceIn 0.5s ease-out 0.1s both" }}
        >
          スワイプ方向テスト
        </h1>

        <p
          className="sport-text-glow text-lg text-cyan-300 mb-2"
          style={{ animation: "slideUp 0.6s ease-out 0.2s both" }}
        >
          矢印の方向に素早くスワイプ！
        </p>
        <p
          className="text-gray-400 mb-8 text-sm max-w-xs leading-relaxed"
          style={{ animation: "slideUp 0.6s ease-out 0.3s both" }}
        >
          画面に表示される矢印の方向にスワイプ。
          <br />
          30秒間で何問正解できるかチャレンジ！
          <br />
          <span className="text-cyan-400 font-bold">連続正解でレベルアップ</span>
        </p>

        {/* Direction preview */}
        <div
          className="flex gap-3 mb-8"
          style={{ animation: "slideUp 0.6s ease-out 0.4s both" }}
        >
          {DIRECTIONS.map((dir) => (
            <div
              key={dir}
              className="p-2 rounded-lg"
              style={{ background: "rgba(6,182,212,0.1)", border: "1px solid rgba(6,182,212,0.2)" }}
            >
              <ArrowSVG direction={dir} size={32} color="#06B6D4" glow={false} />
            </div>
          ))}
        </div>

        {/* Start button */}
        <button
          onClick={handleStart}
          className="px-12 py-5 text-white text-2xl font-black tracking-wider rounded-2xl"
          style={{
            background: "linear-gradient(135deg, #06B6D4, #0891B2)",
            border: "3px solid #0E7490",
            boxShadow: "0 0 20px rgba(6,182,212,0.4), 0 6px 0 #0E7490",
            animation: "pulse-glow 2s ease-in-out infinite, slideUp 0.6s ease-out 0.5s both",
          }}
        >
          START
        </button>

        <Link
          href="/"
          className="mt-8 text-gray-500 hover:text-cyan-400 text-sm transition-colors font-bold"
          style={{ animation: "slideUp 0.6s ease-out 0.6s both" }}
        >
          ← トップへ
        </Link>
      </div>
    );
  }

  // ===== COUNTDOWN =====
  if (phase === "countdown") {
    return (
      <div
        className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden"
        style={{ background: "linear-gradient(135deg, #0F172A 0%, #1E293B 100%)" }}
      >
        <SwipeStyles />

        <div
          key={countdown}
          className="sport-text text-9xl text-cyan-400"
          style={{
            animation: "countdownPop 0.8s ease-out",
            textShadow: "0 0 40px rgba(6,182,212,0.6), 3px 3px 0 rgba(0,0,0,0.4)",
          }}
        >
          {countdown > 0 ? countdown : "GO!"}
        </div>
      </div>
    );
  }

  // ===== PLAYING =====
  if (phase === "playing") {
    return (
      <div
        className="relative flex flex-col items-center justify-between min-h-screen select-none overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #0F172A 0%, #1E293B 100%)",
          touchAction: "none",
        }}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerCancel={() => { pointerStartRef.current = null; }}
      >
        <SwipeStyles />

        {/* Feedback flash overlay */}
        {feedback === "correct" && (
          <div
            className="absolute inset-0 pointer-events-none z-10"
            style={{ animation: "flashGreen 0.3s ease-out forwards" }}
          />
        )}
        {feedback === "miss" && (
          <div
            className="absolute inset-0 pointer-events-none z-10"
            style={{ animation: "flashRed 0.3s ease-out forwards" }}
          />
        )}

        {/* Top: Timer + Score */}
        <div className="w-full px-4 pt-6 pb-2 z-20">
          <div className="flex justify-between items-center mb-3">
            <div className="text-sm font-bold text-gray-400 uppercase tracking-wider">
              Time
            </div>
            <div
              className="sport-text text-2xl"
              style={{
                color: timeLeft <= 5 ? "#EF4444" : "#06B6D4",
                animation: timeLeft <= 5 ? "timerPulse 0.5s ease-in-out infinite" : undefined,
              }}
            >
              {timeLeft}s
            </div>
          </div>
          <TimeBar timeLeft={timeLeft} total={GAME_DURATION} />
          <div className="mt-4 flex justify-center">
            <ScoreBoard correct={correct} miss={miss} />
          </div>
          {/* Streak indicator */}
          {streak >= 3 && (
            <div className="text-center mt-2">
              <span
                className="text-xs font-black px-3 py-1 rounded-full inline-block"
                style={{
                  background: streak >= 10 ? "rgba(255,215,0,0.2)" : "rgba(6,182,212,0.2)",
                  color: streak >= 10 ? "#FFD700" : "#06B6D4",
                  border: `1px solid ${streak >= 10 ? "rgba(255,215,0,0.4)" : "rgba(6,182,212,0.4)"}`,
                }}
              >
                {streak} COMBO
                {streak >= 10 ? " !!" : streak >= 5 ? " !" : ""}
              </span>
            </div>
          )}
        </div>

        {/* Center: Arrow */}
        <div
          className="flex-1 flex items-center justify-center relative"
          style={{
            animation: feedback === "miss" ? "shake 0.3s ease-in-out" : undefined,
          }}
        >
          {/* Flying-out arrow (on correct) */}
          {flyDir && (
            <div
              className="absolute pointer-events-none"
              style={{ animation: `${flyAnimName} 0.3s ease-in forwards` }}
            >
              <ArrowSVG direction={flyDir} size={140} color="#22C55E" />
            </div>
          )}

          {/* Current arrow */}
          <div
            key={arrowKey}
            style={{
              opacity: arrowVisible ? 1 : 0.15,
              transition: "opacity 0.2s ease",
              animation: "arrowAppear 0.25s ease-out",
            }}
          >
            <ArrowSVG
              direction={currentDir}
              size={160}
              color={feedback === "correct" ? "#22C55E" : feedback === "miss" ? "#EF4444" : "#06B6D4"}
            />
          </div>
        </div>

        {/* Bottom hint */}
        <div className="pb-8 text-center z-20">
          <p className="text-gray-500 text-xs font-bold">
            矢印の方向にスワイプ
          </p>
        </div>
      </div>
    );
  }

  // ===== RESULT =====
  if (phase === "result" && rank) {
    return (
      <div
        className="relative flex flex-col items-center justify-center min-h-screen px-4 py-8 overflow-hidden"
        style={{ background: "linear-gradient(135deg, #0F172A 0%, #1E293B 100%)" }}
      >
        <SwipeStyles />
        <Sparkles color={rank.color} count={10} />

        {/* Header */}
        <div
          className="flex items-center gap-2 text-sm text-gray-300 mb-4 font-bold"
          style={{ animation: "slideUp 0.4s ease-out" }}
        >
          RESULT
        </div>

        {/* Rank icon */}
        <div
          className="mb-2"
          style={{
            animation: "rankReveal 0.7s ease-out",
            filter: `drop-shadow(0 0 25px ${rank.color}80)`,
          }}
        >
          <RankIcon rankLetter={rank.rank} color={rank.color} size={90} />
        </div>

        {/* Rank letter */}
        <div
          className="sport-text text-7xl sm:text-8xl text-white mb-1"
          style={{
            color: rank.color,
            animation: "rankReveal 0.7s ease-out 0.1s both",
            textShadow: `4px 4px 0 rgba(0,0,0,0.4), 0 0 30px ${rank.color}60`,
            transform: "rotate(-3deg)",
          }}
        >
          {rank.rank}
        </div>

        <div
          className="sport-text text-2xl text-white mb-1"
          style={{ animation: "slideUp 0.5s ease-out 0.3s both" }}
        >
          {rank.title}
        </div>
        <div
          className="text-gray-400 text-sm mb-6 font-bold text-center"
          style={{ animation: "slideUp 0.5s ease-out 0.4s both" }}
        >
          {rank.description}
        </div>

        {/* Score box */}
        <div
          className="relative px-8 py-5 mb-4 text-center rounded-2xl"
          style={{
            background: "rgba(255,255,255,0.05)",
            border: `2px solid ${rank.color}44`,
            boxShadow: `0 0 20px ${rank.color}20`,
            animation: "bounceIn 0.5s ease-out 0.5s both",
          }}
        >
          <div className="flex gap-8 items-end justify-center">
            <div>
              <div className="text-gray-400 text-xs mb-1 font-bold uppercase">Correct</div>
              <div className="sport-text text-5xl" style={{ color: "#22C55E" }}>
                {correct}
              </div>
            </div>
            <div className="text-gray-600 text-2xl font-bold pb-1">/</div>
            <div>
              <div className="text-gray-400 text-xs mb-1 font-bold uppercase">Miss</div>
              <div className="sport-text text-5xl" style={{ color: "#EF4444" }}>
                {miss}
              </div>
            </div>
          </div>
          <div className="mt-2 text-gray-500 text-xs font-bold">
            正答率: {correct + miss > 0 ? Math.round((correct / (correct + miss)) * 100) : 0}%
          </div>
        </div>

        {/* Share & actions */}
        <div
          className="flex flex-col gap-3 w-full max-w-xs"
          style={{ animation: "slideUp 0.5s ease-out 0.8s both" }}
        >
          {typeof navigator !== "undefined" && typeof navigator.share === "function" && (
            <button
              onClick={handleNativeShare}
              className="w-full py-4 text-lg font-black rounded-2xl"
              style={{
                background: rank.color,
                color: "#000",
                border: "3px solid rgba(0,0,0,0.2)",
                boxShadow: `0 0 15px ${rank.color}40, 0 5px 0 rgba(0,0,0,0.2)`,
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
              className="flex-1 py-3 text-white font-black text-center text-sm rounded-xl"
              style={{
                background: "#000",
                border: "3px solid #333",
                boxShadow: "0 4px 0 #000",
              }}
            >
              X share
            </a>
            <a
              href={`https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(shareUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-3 text-white font-black text-center text-sm rounded-xl"
              style={{
                background: "#06C755",
                border: "3px solid #04a043",
                boxShadow: "0 4px 0 #04a043",
              }}
            >
              LINE
            </a>
          </div>

          <button
            onClick={handleStart}
            className="w-full py-3 font-black mt-2 rounded-xl"
            style={{
              background: "rgba(255,255,255,0.08)",
              color: "#fff",
              border: "3px solid rgba(255,255,255,0.15)",
              boxShadow: "0 4px 0 rgba(0,0,0,0.3)",
            }}
          >
            もう一回
          </button>
          <Link
            href="/"
            className="text-center text-gray-500 hover:text-cyan-400 text-sm mt-2 transition-colors font-bold"
          >
            ← トップへ
          </Link>
        </div>
      </div>
    );
  }

  return null;
}
