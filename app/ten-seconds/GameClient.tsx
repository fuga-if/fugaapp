"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { getRank, type TenSecondsRank } from "@/lib/ten-seconds/ranks";
import Link from "next/link";

const TARGET_MS = 10000;
const MIN_MS = 3000;
const MAX_MS = 20000;
const TIMER_VISIBLE_MS = 2000; // 最初2秒だけタイマー表示

type Phase = "idle" | "counting" | "tooEarly" | "timeout" | "finalResult";

/* ═══════════════════════════════════════
   Game & Watch LCD Style Components
   ═══════════════════════════════════════ */

/* Global keyframes & styles */
function LCDStyles() {
  return (
    <style jsx global>{`
      @keyframes lcdBlink {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.2; }
      }
      @keyframes lcdFlicker {
        0%, 100% { opacity: 0.15; }
        25% { opacity: 0.25; }
        50% { opacity: 0.1; }
        75% { opacity: 0.2; }
      }
      @keyframes dotFlicker1 {
        0%, 100% { opacity: 0.3; }
        33% { opacity: 0.7; }
        66% { opacity: 0.15; }
      }
      @keyframes dotFlicker2 {
        0%, 100% { opacity: 0.5; }
        40% { opacity: 0.1; }
        80% { opacity: 0.6; }
      }
      @keyframes dotFlicker3 {
        0%, 100% { opacity: 0.2; }
        50% { opacity: 0.55; }
      }
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(8px); }
        to { opacity: 1; transform: translateY(0); }
      }
      @keyframes scoreReveal {
        0% { opacity: 0; transform: scale(0.8); }
        60% { transform: scale(1.05); }
        100% { opacity: 1; transform: scale(1); }
      }
      @keyframes btnPulse {
        0%, 100% { box-shadow: 0 4px 0 #991a1a, 0 0 8px rgba(204,51,51,0.3); }
        50% { box-shadow: 0 4px 0 #991a1a, 0 0 20px rgba(204,51,51,0.6); }
      }
      @keyframes errShake {
        0%, 100% { transform: translateX(0); }
        20% { transform: translateX(-4px); }
        40% { transform: translateX(4px); }
        60% { transform: translateX(-3px); }
        80% { transform: translateX(3px); }
      }
      .lcd-segment {
        font-family: 'Courier New', 'Lucida Console', monospace;
        letter-spacing: 0.15em;
        color: #3C4A2E;
      }
      .lcd-segment-ghost {
        font-family: 'Courier New', 'Lucida Console', monospace;
        letter-spacing: 0.15em;
        color: #3C4A2E;
        opacity: 0.1;
      }
    `}</style>
  );
}

/* Screw decoration */
function Screw({ top, left, right, bottom }: { top?: string; left?: string; right?: string; bottom?: string }) {
  return (
    <div
      className="absolute"
      style={{ top, left, right, bottom, width: '12px', height: '12px' }}
    >
      <svg width="12" height="12" viewBox="0 0 12 12">
        <circle cx="6" cy="6" r="5.5" fill="#B8B0A0" stroke="#8A8070" strokeWidth="0.8" />
        <line x1="3" y1="6" x2="9" y2="6" stroke="#8A8070" strokeWidth="1" strokeLinecap="round" />
        <line x1="6" y1="3" x2="6" y2="9" stroke="#8A8070" strokeWidth="1" strokeLinecap="round" />
      </svg>
    </div>
  );
}

/* D-Pad decoration (non-functional) */
function DPad() {
  return (
    <div className="relative" style={{ width: '70px', height: '70px' }}>
      <svg width="70" height="70" viewBox="0 0 70 70">
        {/* Vertical bar */}
        <rect x="23" y="5" width="24" height="60" rx="3" fill="#2A2A2A" stroke="#1A1A1A" strokeWidth="1" />
        {/* Horizontal bar */}
        <rect x="5" y="23" width="60" height="24" rx="3" fill="#2A2A2A" stroke="#1A1A1A" strokeWidth="1" />
        {/* Center circle */}
        <circle cx="35" cy="35" r="8" fill="#222" stroke="#1A1A1A" strokeWidth="0.5" />
        {/* Arrow hints */}
        <polygon points="35,12 31,18 39,18" fill="#3A3A3A" />
        <polygon points="35,58 31,52 39,52" fill="#3A3A3A" />
        <polygon points="12,35 18,31 18,39" fill="#3A3A3A" />
        <polygon points="58,35 52,31 52,39" fill="#3A3A3A" />
      </svg>
    </div>
  );
}

/* AB Buttons decoration (non-functional) */
function ABButtons() {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex gap-4">
        <div style={{
          width: '30px', height: '30px', borderRadius: '50%',
          background: 'linear-gradient(145deg, #3A3A3A, #2A2A2A)',
          border: '1px solid #1A1A1A',
          boxShadow: '0 2px 0 #1A1A1A, inset 0 1px 0 rgba(255,255,255,0.1)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <span style={{ fontSize: '10px', color: '#666', fontWeight: 'bold', fontFamily: 'Arial, sans-serif' }}>B</span>
        </div>
        <div style={{
          width: '30px', height: '30px', borderRadius: '50%',
          background: 'linear-gradient(145deg, #3A3A3A, #2A2A2A)',
          border: '1px solid #1A1A1A',
          boxShadow: '0 2px 0 #1A1A1A, inset 0 1px 0 rgba(255,255,255,0.1)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <span style={{ fontSize: '10px', color: '#666', fontWeight: 'bold', fontFamily: 'Arial, sans-serif' }}>A</span>
        </div>
      </div>
    </div>
  );
}

/* LCD flickering dots for counting phase */
function LCDDots() {
  return (
    <div className="flex gap-3 justify-center mt-3">
      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          style={{
            width: '6px',
            height: '6px',
            background: '#3C4A2E',
            animation: `dotFlicker${((i % 3) + 1)} ${1.2 + i * 0.3}s ease-in-out infinite`,
          }}
        />
      ))}
    </div>
  );
}

/* Rank icon for each rank (SVG, no emoji) */
function RankBadge({ rankLetter, color, size = 56 }: { rankLetter: string; color: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 60 60">
      {/* Hexagonal badge */}
      <polygon
        points="30,2 55,16 55,44 30,58 5,44 5,16"
        fill="none"
        stroke={color}
        strokeWidth="2.5"
      />
      <polygon
        points="30,7 51,19 51,41 30,53 9,41 9,19"
        fill={`${color}15`}
        stroke={color}
        strokeWidth="1"
        opacity="0.5"
      />
      <text
        x="30"
        y="38"
        textAnchor="middle"
        fontFamily="'Courier New', monospace"
        fontWeight="900"
        fontSize="28"
        fill={color}
        style={{ letterSpacing: '0.05em' }}
      >
        {rankLetter}
      </text>
    </svg>
  );
}

/* The main LCD screen area */
function LCDScreen({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        background: 'linear-gradient(180deg, #C5CFA0 0%, #B8C294 50%, #AEBB88 100%)',
        border: '3px solid #7A8560',
        borderRadius: '6px',
        boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.15), inset 0 -1px 4px rgba(255,255,255,0.2)',
        padding: '20px 16px',
        width: '100%',
        maxWidth: '300px',
        minHeight: '200px',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Scanline overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px)',
          borderRadius: '4px',
        }}
      />
      {children}
    </div>
  );
}

/* Full console body wrapper */
function ConsoleBody({ children, onPointerDown }: { children: React.ReactNode; onPointerDown?: () => void }) {
  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen px-4 py-6"
      style={{
        background: 'linear-gradient(135deg, #4A4540 0%, #3A3530 100%)',
        touchAction: 'manipulation',
      }}
      onPointerDown={onPointerDown}
    >
      <LCDStyles />
      <div
        style={{
          background: 'linear-gradient(180deg, #F5E6C8 0%, #E8D8B8 30%, #D4D0C8 100%)',
          borderRadius: '16px',
          border: '2px solid #B8B0A0',
          boxShadow: '0 8px 24px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.4)',
          padding: '20px 20px 24px',
          width: '100%',
          maxWidth: '360px',
          position: 'relative',
        }}
      >
        {/* Corner screws */}
        <Screw top="10px" left="10px" />
        <Screw top="10px" right="10px" />
        <Screw bottom="10px" left="10px" />
        <Screw bottom="10px" right="10px" />

        {children}
      </div>
    </div>
  );
}

export default function TenSecondsPage() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [currentElapsed, setCurrentElapsed] = useState(0);
  const [errorMs, setErrorMs] = useState(0);
  const [rank, setRank] = useState<TenSecondsRank | null>(null);
  const [displayTime, setDisplayTime] = useState(0);
  const [timerVisible, setTimerVisible] = useState(true);

  const startTimeRef = useRef(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const timerHideRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (timerHideRef.current) clearTimeout(timerHideRef.current);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const stopTimerDisplay = useCallback(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }, []);

  const startCounting = useCallback(() => {
    setPhase("counting");
    setTimerVisible(true);
    setDisplayTime(0);
    startTimeRef.current = performance.now();

    const updateTimer = () => {
      const elapsed = performance.now() - startTimeRef.current;
      if (elapsed < TIMER_VISIBLE_MS) {
        setDisplayTime(elapsed);
        rafRef.current = requestAnimationFrame(updateTimer);
      } else {
        setDisplayTime(TIMER_VISIBLE_MS);
      }
    };
    rafRef.current = requestAnimationFrame(updateTimer);

    timerHideRef.current = setTimeout(() => {
      setTimerVisible(false);
    }, TIMER_VISIBLE_MS);

    timeoutRef.current = setTimeout(() => {
      stopTimerDisplay();
      const elapsed = performance.now() - startTimeRef.current;
      setCurrentElapsed(elapsed);
      const error = Math.abs(elapsed - TARGET_MS);
      setErrorMs(error);
      setRank(getRank(error));
      setPhase("timeout");
    }, MAX_MS);
  }, [stopTimerDisplay]);

  const handleStart = useCallback(() => {
    setCurrentElapsed(0);
    setErrorMs(0);
    setRank(null);
    startCounting();
  }, [startCounting]);

  const handleStop = useCallback(() => {
    if (phase !== "counting") return;
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (timerHideRef.current) clearTimeout(timerHideRef.current);
    stopTimerDisplay();

    const elapsed = performance.now() - startTimeRef.current;

    if (elapsed < MIN_MS) {
      setPhase("tooEarly");
      return;
    }

    setCurrentElapsed(elapsed);
    const error = Math.abs(elapsed - TARGET_MS);
    setErrorMs(error);
    setRank(getRank(error));
    setPhase("finalResult");
  }, [phase, stopTimerDisplay]);

  const handleRetryAfterEarly = useCallback(() => {
    setCurrentElapsed(0);
    startCounting();
  }, [startCounting]);

  // シェア
  const absError = Math.round(errorMs);
  const shareUrl =
    typeof window !== "undefined" && rank
      ? `${window.location.origin}/ten-seconds?score=${absError}&rank=${rank.rank}&title=${encodeURIComponent(rank.title)}`
      : "";

  const shareText = rank
    ? `10秒チャレンジで誤差${absError}msを記録！\nランク: ${rank.rank} ${rank.title} ${rank.emoji}\n#10秒チャレンジ\n`
    : "";

  const twitterUrl = rank
    ? `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`
    : "";

  const handleNativeShare = useCallback(async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: "10秒チャレンジ", text: shareText, url: shareUrl });
      } catch { /* cancelled */ }
    }
  }, [shareText, shareUrl]);

  const formatElapsed = (ms: number) => (ms / 1000).toFixed(3);
  const formatSignedError = (elapsed: number) => {
    const diff = elapsed - TARGET_MS;
    const sign = diff >= 0 ? "+" : "";
    return `${sign}${Math.round(diff)}`;
  };

  // ===== IDLE =====
  if (phase === "idle") {
    return (
      <ConsoleBody>
        {/* Logo */}
        <div className="text-center mb-4">
          <div
            style={{
              fontFamily: 'Arial Black, Arial, sans-serif',
              fontSize: '11px',
              fontWeight: 900,
              color: '#6B5E4E',
              letterSpacing: '0.25em',
              textTransform: 'uppercase',
            }}
          >
            GAME &amp; TIME
          </div>
          <div
            style={{
              fontFamily: 'Arial, sans-serif',
              fontSize: '8px',
              color: '#9A8D7D',
              letterSpacing: '0.3em',
              marginTop: '2px',
            }}
          >
            BODY CLOCK
          </div>
        </div>

        {/* LCD Screen */}
        <LCDScreen>
          {/* Ghost segments background */}
          <div className="lcd-segment-ghost text-center" style={{ fontSize: '14px', position: 'absolute', top: '12px', left: '0', right: '0' }}>
            88:88.888
          </div>

          <div className="lcd-segment text-center" style={{ fontSize: '13px', fontWeight: 'bold', marginBottom: '8px' }}>
            10 SEC
          </div>
          <div className="lcd-segment text-center" style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '4px' }}>
            CHALLENGE
          </div>

          <div style={{ width: '60%', height: '1px', background: '#3C4A2E', opacity: 0.2, margin: '10px auto' }} />

          <div className="lcd-segment text-center" style={{ fontSize: '11px', opacity: 0.6, lineHeight: '1.6' }}>
            PRESS START
          </div>

          {/* Small clock icon (LCD style) */}
          <div className="mt-3">
            <svg width="32" height="32" viewBox="0 0 32 32" style={{ opacity: 0.25 }}>
              <circle cx="16" cy="16" r="14" fill="none" stroke="#3C4A2E" strokeWidth="2" />
              <line x1="16" y1="16" x2="16" y2="7" stroke="#3C4A2E" strokeWidth="2" strokeLinecap="round" />
              <line x1="16" y1="16" x2="22" y2="16" stroke="#3C4A2E" strokeWidth="1.5" strokeLinecap="round" />
              <circle cx="16" cy="16" r="1.5" fill="#3C4A2E" />
            </svg>
          </div>
        </LCDScreen>

        {/* Controls area */}
        <div className="flex items-center justify-between w-full mt-5 px-2" style={{ maxWidth: '300px' }}>
          {/* D-Pad (decorative) */}
          <DPad />

          {/* START button */}
          <button
            onClick={handleStart}
            style={{
              background: 'linear-gradient(145deg, #DD3333, #BB2222)',
              color: '#fff',
              fontFamily: 'Arial Black, Arial, sans-serif',
              fontSize: '14px',
              fontWeight: 900,
              letterSpacing: '0.15em',
              padding: '12px 24px',
              borderRadius: '50px',
              border: '2px solid #991A1A',
              boxShadow: '0 4px 0 #991a1a, 0 0 12px rgba(204,51,51,0.3)',
              cursor: 'pointer',
              transition: 'transform 0.1s',
              animation: 'btnPulse 2s ease-in-out infinite',
            }}
            onMouseDown={(e) => { (e.currentTarget.style.transform = 'translateY(2px)'); }}
            onMouseUp={(e) => { (e.currentTarget.style.transform = 'translateY(0)'); }}
          >
            START
          </button>

          {/* AB buttons (decorative) */}
          <ABButtons />
        </div>

        {/* Description below console */}
        <div className="text-center mt-4 px-4" style={{ maxWidth: '300px' }}>
          <p style={{ color: '#8A8070', fontSize: '11px', lineHeight: '1.7' }}>
            STARTでタイマーが動き出す
          </p>
          <p style={{ color: '#8A8070', fontSize: '11px', lineHeight: '1.7' }}>
            <span style={{ color: '#C5CFA0' }}>最初の2秒だけ</span>タイマーが見える
          </p>
          <p style={{ color: '#8A8070', fontSize: '11px', lineHeight: '1.7' }}>
            ぴったり10秒でSTOP！
          </p>
        </div>

        <Link href="/" className="mt-4 text-sm transition-colors" style={{ color: '#6B5E4E' }}>
          ← TOP
        </Link>
      </ConsoleBody>
    );
  }

  // ===== COUNTING =====
  if (phase === "counting") {
    return (
      <ConsoleBody onPointerDown={handleStop}>
        {/* Logo */}
        <div className="text-center mb-4">
          <div style={{ fontFamily: 'Arial Black, Arial, sans-serif', fontSize: '11px', fontWeight: 900, color: '#6B5E4E', letterSpacing: '0.25em' }}>
            GAME &amp; TIME
          </div>
        </div>

        {/* LCD Screen */}
        <LCDScreen>
          {/* Ghost segments */}
          <div className="lcd-segment-ghost text-center" style={{ fontSize: '42px', position: 'absolute', top: '30px', left: '0', right: '0' }}>
            88.8
          </div>

          {/* Timer visible phase */}
          <div
            style={{
              transition: 'opacity 0.5s ease, transform 0.5s ease',
              opacity: timerVisible ? 1 : 0,
              transform: timerVisible ? 'scale(1)' : 'scale(0.8)',
              position: timerVisible ? 'relative' : 'absolute',
            }}
          >
            {timerVisible && (
              <div className="lcd-segment text-center" style={{ fontSize: '42px', fontWeight: 'bold' }}>
                {(displayTime / 1000).toFixed(1)}
              </div>
            )}
          </div>

          {/* Hidden timer phase */}
          <div
            style={{
              transition: 'opacity 0.7s ease, transform 0.7s ease',
              opacity: timerVisible ? 0 : 1,
              transform: timerVisible ? 'translateY(10px)' : 'translateY(0)',
            }}
          >
            {!timerVisible && (
              <>
                <div className="lcd-segment text-center" style={{ fontSize: '36px', fontWeight: 'bold', animation: 'lcdFlicker 3s ease-in-out infinite' }}>
                  --:--
                </div>
                <LCDDots />
              </>
            )}
          </div>

          <div style={{ width: '60%', height: '1px', background: '#3C4A2E', opacity: 0.15, margin: '12px auto 0' }} />

          <div className="lcd-segment text-center" style={{ fontSize: '10px', opacity: 0.5, marginTop: '8px' }}>
            TAP TO STOP
          </div>
        </LCDScreen>

        {/* STOP button area */}
        <div className="flex items-center justify-center w-full mt-5" style={{ maxWidth: '300px' }}>
          <div
            style={{
              background: 'linear-gradient(145deg, #DD3333, #BB2222)',
              color: '#fff',
              fontFamily: 'Arial Black, Arial, sans-serif',
              fontSize: '14px',
              fontWeight: 900,
              letterSpacing: '0.15em',
              padding: '12px 28px',
              borderRadius: '50px',
              border: '2px solid #991A1A',
              boxShadow: '0 4px 0 #991a1a',
              pointerEvents: 'none',
            }}
          >
            STOP
          </div>
        </div>

        <div className="text-center mt-3" style={{ color: '#8A8070', fontSize: '11px' }}>
          10秒だと思ったらタップ！
        </div>
      </ConsoleBody>
    );
  }

  // ===== TOO EARLY =====
  if (phase === "tooEarly") {
    return (
      <ConsoleBody onPointerDown={handleRetryAfterEarly}>
        <div className="text-center mb-4">
          <div style={{ fontFamily: 'Arial Black, Arial, sans-serif', fontSize: '11px', fontWeight: 900, color: '#6B5E4E', letterSpacing: '0.25em' }}>
            GAME &amp; TIME
          </div>
        </div>

        <LCDScreen>
          <div
            className="lcd-segment text-center"
            style={{
              fontSize: '48px',
              fontWeight: 'bold',
              animation: 'lcdBlink 0.6s ease-in-out infinite, errShake 0.5s ease-in-out',
            }}
          >
            ERR
          </div>
          <div
            className="lcd-segment text-center"
            style={{
              fontSize: '14px',
              fontWeight: 'bold',
              marginTop: '8px',
              animation: 'lcdBlink 0.6s ease-in-out infinite',
            }}
          >
            TOO EARLY
          </div>
          <div style={{ width: '60%', height: '1px', background: '#3C4A2E', opacity: 0.15, margin: '12px auto 0' }} />
          <div className="lcd-segment text-center" style={{ fontSize: '10px', opacity: 0.5, marginTop: '8px' }}>
            3 SEC MINIMUM
          </div>
        </LCDScreen>

        <div className="text-center mt-5" style={{ color: '#8A8070', fontSize: '11px' }}>
          タップしてやり直し
        </div>
      </ConsoleBody>
    );
  }

  // ===== TIMEOUT =====
  if (phase === "timeout") {
    return (
      <ConsoleBody>
        <div className="text-center mb-4">
          <div style={{ fontFamily: 'Arial Black, Arial, sans-serif', fontSize: '11px', fontWeight: 900, color: '#6B5E4E', letterSpacing: '0.25em' }}>
            GAME &amp; TIME
          </div>
        </div>

        <LCDScreen>
          <div className="lcd-segment text-center" style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '6px', animation: 'lcdBlink 1s ease-in-out infinite' }}>
            TIME OVER
          </div>
          <div className="lcd-segment text-center" style={{ fontSize: '32px', fontWeight: 'bold' }}>
            {formatElapsed(currentElapsed)}
          </div>
          <div className="lcd-segment text-center" style={{ fontSize: '10px', opacity: 0.6, marginTop: '4px' }}>
            SEC
          </div>
          <div style={{ width: '60%', height: '1px', background: '#3C4A2E', opacity: 0.15, margin: '10px auto' }} />
          <div className="lcd-segment text-center" style={{ fontSize: '18px', fontWeight: 'bold' }}>
            {formatSignedError(currentElapsed)}ms
          </div>
        </LCDScreen>

        <div className="flex items-center justify-center w-full mt-5" style={{ maxWidth: '300px' }}>
          <button
            onClick={handleStart}
            style={{
              background: 'linear-gradient(145deg, #DD3333, #BB2222)',
              color: '#fff',
              fontFamily: 'Arial Black, Arial, sans-serif',
              fontSize: '13px',
              fontWeight: 900,
              letterSpacing: '0.15em',
              padding: '10px 22px',
              borderRadius: '50px',
              border: '2px solid #991A1A',
              boxShadow: '0 4px 0 #991a1a',
              cursor: 'pointer',
            }}
          >
            RETRY
          </button>
        </div>

        <Link href="/" className="mt-4 text-sm transition-colors" style={{ color: '#6B5E4E' }}>
          ← TOP
        </Link>
      </ConsoleBody>
    );
  }

  // ===== FINAL RESULT =====
  if (phase === "finalResult" && rank) {
    const isGood = errorMs < 500;
    const rankColor = rank.rank === "S" ? "#CC8800" : rank.color;

    return (
      <ConsoleBody>
        <div className="text-center mb-4">
          <div style={{ fontFamily: 'Arial Black, Arial, sans-serif', fontSize: '11px', fontWeight: 900, color: '#6B5E4E', letterSpacing: '0.25em' }}>
            GAME &amp; TIME
          </div>
        </div>

        <LCDScreen>
          {/* Ghost segments */}
          <div className="lcd-segment-ghost text-center" style={{ fontSize: '32px', position: 'absolute', top: '20px', left: '0', right: '0' }}>
            88.888
          </div>

          <div className="lcd-segment text-center" style={{ fontSize: '10px', opacity: 0.5, marginBottom: '4px', animation: 'fadeIn 0.3s ease-out' }}>
            YOUR TIME
          </div>

          <div className="lcd-segment text-center" style={{ fontSize: '32px', fontWeight: 'bold', animation: 'scoreReveal 0.5s ease-out' }}>
            {formatElapsed(currentElapsed)}
          </div>

          <div className="lcd-segment text-center" style={{ fontSize: '10px', opacity: 0.6, marginTop: '2px' }}>
            SEC
          </div>

          <div style={{ width: '80%', height: '1px', background: '#3C4A2E', opacity: 0.15, margin: '8px auto' }} />

          <div className="lcd-segment text-center" style={{ fontSize: '10px', opacity: 0.5 }}>
            ERROR
          </div>
          <div
            className="lcd-segment text-center"
            style={{
              fontSize: '22px',
              fontWeight: 'bold',
              animation: 'scoreReveal 0.5s ease-out 0.2s both',
            }}
          >
            {formatSignedError(currentElapsed)}ms
          </div>
        </LCDScreen>

        {/* Rank display below LCD */}
        <div
          className="flex flex-col items-center mt-4"
          style={{ animation: 'fadeIn 0.5s ease-out 0.4s both' }}
        >
          <RankBadge rankLetter={rank.rank} color={rankColor} size={56} />
          <div
            style={{
              fontFamily: 'Arial Black, Arial, sans-serif',
              fontSize: '18px',
              fontWeight: 900,
              color: rankColor,
              marginTop: '4px',
              letterSpacing: '0.1em',
            }}
          >
            {rank.title}
          </div>
          <div style={{ fontSize: '11px', color: '#8A8070', marginTop: '2px', textAlign: 'center', maxWidth: '250px' }}>
            {rank.description}
          </div>
        </div>

        {/* Comment */}
        <div className="text-center mt-3" style={{ fontSize: '11px', color: isGood ? '#6B8A4E' : '#8A7060' }}>
          {errorMs < 100 ? "PERFECT! INCREDIBLE!" :
           errorMs < 250 ? "GREAT! VERY ACCURATE!" :
           errorMs < 500 ? "GOOD! ALMOST THERE!" :
           errorMs < 1000 ? "NOT BAD... TRY AGAIN!" :
           "KEEP PRACTICING..."}
        </div>

        {/* Share & Actions */}
        <div className="flex flex-col gap-2 w-full mt-4 px-2" style={{ maxWidth: '300px', animation: 'fadeIn 0.5s ease-out 0.6s both' }}>
          {typeof navigator !== "undefined" && typeof navigator.share === "function" && (
            <button
              onClick={handleNativeShare}
              style={{
                background: rankColor,
                color: '#fff',
                fontFamily: 'Arial Black, Arial, sans-serif',
                fontSize: '13px',
                fontWeight: 900,
                letterSpacing: '0.1em',
                padding: '10px 20px',
                borderRadius: '50px',
                border: `2px solid ${rankColor}`,
                boxShadow: `0 3px 0 rgba(0,0,0,0.2)`,
                cursor: 'pointer',
                width: '100%',
              }}
            >
              SHARE
            </button>
          )}

          <div className="flex gap-2">
            <a
              href={twitterUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                flex: 1,
                background: '#222',
                color: '#fff',
                fontFamily: 'Arial Black, Arial, sans-serif',
                fontSize: '12px',
                fontWeight: 900,
                padding: '8px 12px',
                borderRadius: '50px',
                border: '2px solid #444',
                boxShadow: '0 3px 0 #111',
                textAlign: 'center',
                textDecoration: 'none',
                display: 'block',
              }}
            >
              X SHARE
            </a>
            <a
              href={`https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(shareUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                flex: 1,
                background: '#06C755',
                color: '#fff',
                fontFamily: 'Arial Black, Arial, sans-serif',
                fontSize: '12px',
                fontWeight: 900,
                padding: '8px 12px',
                borderRadius: '50px',
                border: '2px solid #04a043',
                boxShadow: '0 3px 0 #04a043',
                textAlign: 'center',
                textDecoration: 'none',
                display: 'block',
              }}
            >
              LINE
            </a>
          </div>

          <button
            onClick={handleStart}
            style={{
              background: '#D4D0C8',
              color: '#4A4540',
              fontFamily: 'Arial Black, Arial, sans-serif',
              fontSize: '12px',
              fontWeight: 900,
              letterSpacing: '0.1em',
              padding: '8px 20px',
              borderRadius: '50px',
              border: '2px solid #B8B0A0',
              boxShadow: '0 3px 0 #8A8070',
              cursor: 'pointer',
              width: '100%',
            }}
          >
            RETRY
          </button>

          <Link
            href="/"
            className="text-center mt-1 transition-colors block"
            style={{ color: '#6B5E4E', fontSize: '11px' }}
          >
            ← TOP
          </Link>
        </div>
      </ConsoleBody>
    );
  }

  return null;
}
