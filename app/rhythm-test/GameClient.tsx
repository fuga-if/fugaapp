"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { getRank, type RhythmRank } from "@/lib/rhythm-test/ranks";
import Link from "next/link";

const BPM = 100;
const INTERVAL = (60 / BPM) * 1000; // 600ms
const LISTEN_BEATS = 4;
const GUIDED_TAPS = 8;
const UNGUIDED_TAPS = 8;
const TOTAL_TAPS = GUIDED_TAPS + UNGUIDED_TAPS;

type Phase = "idle" | "listen" | "tapWithGuide" | "tapWithoutGuide" | "result";

/* ═══════════════════════════════════════
   SVG Icon Components
   ═══════════════════════════════════════ */

function IconMetronome({ size = 80, color = "#FFD700" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ filter: `drop-shadow(0 0 12px ${color}80)` }}>
      <polygon points="35,90 65,90 58,15 42,15" fill={color} stroke="rgba(0,0,0,0.25)" strokeWidth="2" opacity="0.9" />
      <line x1="50" y1="75" x2="38" y2="20" stroke="rgba(0,0,0,0.3)" strokeWidth="3" strokeLinecap="round" />
      <circle cx="38" cy="20" r="5" fill={color} stroke="rgba(0,0,0,0.2)" strokeWidth="1.5" />
      <rect x="30" y="88" width="40" height="6" rx="3" fill={color} opacity="0.8" />
    </svg>
  );
}

function IconDrum({ size = 80, color = "#FF6B35" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ filter: `drop-shadow(0 0 12px ${color}80)` }}>
      <ellipse cx="50" cy="65" rx="38" ry="15" fill={color} stroke="rgba(0,0,0,0.2)" strokeWidth="2" />
      <rect x="12" y="35" width="76" height="30" fill={color} stroke="rgba(0,0,0,0.2)" strokeWidth="2" />
      <ellipse cx="50" cy="35" rx="38" ry="15" fill={color} stroke="rgba(0,0,0,0.2)" strokeWidth="2" />
      <ellipse cx="50" cy="35" rx="38" ry="15" fill="rgba(255,255,255,0.15)" />
      <line x1="25" y1="10" x2="40" y2="32" stroke="rgba(0,0,0,0.3)" strokeWidth="3" strokeLinecap="round" />
      <line x1="75" y1="10" x2="60" y2="32" stroke="rgba(0,0,0,0.3)" strokeWidth="3" strokeLinecap="round" />
      <circle cx="25" cy="10" r="4" fill="rgba(255,255,255,0.5)" />
      <circle cx="75" cy="10" r="4" fill="rgba(255,255,255,0.5)" />
    </svg>
  );
}

function IconWave({ size = 80, color = "#4ECDC4" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ filter: `drop-shadow(0 0 10px ${color}60)` }}>
      <path d="M10 50 Q25 25 40 50 Q55 75 70 50 Q85 25 100 50" fill="none" stroke={color} strokeWidth="5" strokeLinecap="round" />
      <path d="M0 50 Q15 30 30 50 Q45 70 60 50 Q75 30 90 50" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" opacity="0.5" transform="translate(5, -12)" />
      <path d="M0 50 Q15 30 30 50 Q45 70 60 50 Q75 30 90 50" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" opacity="0.5" transform="translate(5, 12)" />
    </svg>
  );
}

function IconNote({ size = 80, color = "#45B7D1" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ filter: `drop-shadow(0 0 10px ${color}60)` }}>
      <ellipse cx="35" cy="72" rx="14" ry="10" fill={color} transform="rotate(-15, 35, 72)" />
      <rect x="47" y="18" width="4" height="56" fill={color} />
      <path d="M51 18 Q70 15 68 30 Q66 42 51 38Z" fill={color} opacity="0.8" />
    </svg>
  );
}

function IconShuffle({ size = 80, color = "#96CEB4" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ filter: `drop-shadow(0 0 10px ${color}60)` }}>
      <path d="M15 30 Q40 30 50 50 Q60 70 85 70" fill="none" stroke={color} strokeWidth="5" strokeLinecap="round" />
      <path d="M15 70 Q40 70 50 50 Q60 30 85 30" fill="none" stroke={color} strokeWidth="5" strokeLinecap="round" />
      <polygon points="80,22 92,30 80,38" fill={color} />
      <polygon points="80,62 92,70 80,78" fill={color} />
    </svg>
  );
}

function IconSpiral({ size = 80, color = "#A8A8A8" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ filter: `drop-shadow(0 0 8px ${color}40)` }}>
      <path d="M50 50 Q50 35 60 35 Q75 35 75 50 Q75 70 50 70 Q25 70 25 50 Q25 25 50 25 Q80 25 80 50 Q80 78 50 78 Q18 78 18 50" fill="none" stroke={color} strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}

function RankIcon({ rankLetter, color, size = 80 }: { rankLetter: string; color: string; size?: number }) {
  switch (rankLetter) {
    case "S": return <IconMetronome size={size} color={color} />;
    case "A": return <IconDrum size={size} color={color} />;
    case "B": return <IconWave size={size} color={color} />;
    case "C": return <IconNote size={size} color={color} />;
    case "D": return <IconShuffle size={size} color={color} />;
    case "E": return <IconSpiral size={size} color={color} />;
    default: return <IconMetronome size={size} color={color} />;
  }
}

/* ─── Styles ─── */
function RhythmStyles() {
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
      @keyframes slideUp {
        0% { transform: translateY(30px); opacity: 0; }
        100% { transform: translateY(0); opacity: 1; }
      }
      @keyframes rankReveal {
        0% { transform: scale(0) rotate(-30deg); opacity: 0; }
        50% { transform: scale(1.4) rotate(10deg); }
        70% { transform: scale(0.85) rotate(-3deg); }
        100% { transform: scale(1) rotate(-3deg); opacity: 1; }
      }
      @keyframes pulse-beat {
        0% { transform: scale(1); box-shadow: 0 0 30px rgba(255,20,147,0.3); }
        15% { transform: scale(1.25); box-shadow: 0 0 80px rgba(255,20,147,0.8), 0 0 120px rgba(255,20,147,0.3); }
        30% { transform: scale(1); box-shadow: 0 0 30px rgba(255,20,147,0.3); }
        100% { transform: scale(1); box-shadow: 0 0 30px rgba(255,20,147,0.3); }
      }
      @keyframes pulse-glow-btn {
        0%, 100% { box-shadow: 0 0 20px rgba(255,20,147,0.4), 0 8px 0 #8b0a4a; }
        50% { box-shadow: 0 0 40px rgba(255,20,147,0.7), 0 8px 0 #8b0a4a; }
      }
      @keyframes ripple {
        0% { transform: scale(0.5); opacity: 0.8; }
        100% { transform: scale(3); opacity: 0; }
      }
      @keyframes wave-flow {
        0% { transform: translateX(0); }
        100% { transform: translateX(-200px); }
      }
      @keyframes fade-deviation {
        0% { opacity: 1; transform: translateY(0); }
        70% { opacity: 1; }
        100% { opacity: 0; transform: translateY(-30px); }
      }
      @keyframes sparkle {
        0%, 100% { opacity: 0; transform: scale(0) rotate(0deg); }
        50% { opacity: 1; transform: scale(1) rotate(180deg); }
      }
      @keyframes countdown-pulse {
        0% { transform: scale(1.3); opacity: 1; }
        100% { transform: scale(0.8); opacity: 0.3; }
      }
      .rhythm-btn {
        border-radius: 16px;
        transition: transform 0.15s ease;
      }
      .rhythm-btn:hover {
        transform: scale(1.05);
      }
      .rhythm-btn:active {
        transform: scale(0.92);
      }
    `}</style>
  );
}

/* ─── Wave Background ─── */
function WaveBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <svg
        className="absolute bottom-0 left-0 w-[200%] h-32 opacity-10"
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
        style={{ animation: "wave-flow 8s linear infinite" }}
      >
        <path d="M0 60 Q150 20 300 60 Q450 100 600 60 Q750 20 900 60 Q1050 100 1200 60 L1200 120 L0 120Z" fill="#FF1493" />
      </svg>
      <svg
        className="absolute bottom-0 left-0 w-[200%] h-24 opacity-5"
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
        style={{ animation: "wave-flow 12s linear infinite reverse" }}
      >
        <path d="M0 80 Q150 40 300 80 Q450 120 600 80 Q750 40 900 80 Q1050 120 1200 80 L1200 120 L0 120Z" fill="#00FFFF" />
      </svg>
    </div>
  );
}

/* ─── Sparkle decorations ─── */
function Sparkles({ color, count = 6 }: { color: string; count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="absolute pointer-events-none"
          style={{
            width: "6px",
            height: "6px",
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

/* ─── Deviation Popup ─── */
function DeviationPopup({ deviation, signed }: { deviation: number; signed: number }) {
  const color = deviation < 30 ? "#00FFFF" : deviation < 70 ? "#FFD700" : "#FF1493";
  const prefix = signed >= 0 ? "+" : "";
  return (
    <div
      className="absolute font-black text-lg pointer-events-none"
      style={{
        color,
        top: "35%",
        left: "50%",
        transform: "translateX(-50%)",
        animation: "fade-deviation 1s ease-out forwards",
        textShadow: `0 0 10px ${color}80`,
      }}
    >
      {prefix}{signed}ms
    </div>
  );
}

/* ═══════════════════════════════════════
   Main Game Component
   ═══════════════════════════════════════ */

export default function RhythmTestGame() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [rank, setRank] = useState<RhythmRank | null>(null);
  const [avgDeviation, setAvgDeviation] = useState(0);
  const [deviations, setDeviations] = useState<number[]>([]);
  const [signedDeviations, setSignedDeviations] = useState<number[]>([]);
  const [tapCount, setTapCount] = useState(0);
  const [beatFlash, setBeatFlash] = useState(false);
  const [listenCount, setListenCount] = useState(0);
  const [lastDeviation, setLastDeviation] = useState<{ abs: number; signed: number; key: number } | null>(null);
  const [ripples, setRipples] = useState<number[]>([]);

  // Refs for timing
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const beatTimeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const expectedNextTapRef = useRef(0);
  const tapCountRef = useRef(0);
  const deviationsRef = useRef<number[]>([]);
  const signedDeviationsRef = useRef<number[]>([]);
  const phaseRef = useRef<Phase>("idle");
  const guideBeatCountRef = useRef(0);

  // Keep phaseRef in sync
  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      beatTimeoutsRef.current.forEach((t) => clearTimeout(t));
    };
  }, []);

  const clearTimers = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    beatTimeoutsRef.current.forEach((t) => clearTimeout(t));
    beatTimeoutsRef.current = [];
  }, []);

  const flashBeat = useCallback(() => {
    setBeatFlash(true);
    setTimeout(() => setBeatFlash(false), 150);
  }, []);

  const addRipple = useCallback(() => {
    const id = Date.now();
    setRipples((prev) => [...prev, id]);
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r !== id));
    }, 600);
  }, []);

  /* ─── Start Game ─── */
  const handleStart = useCallback(() => {
    clearTimers();
    setDeviations([]);
    setSignedDeviations([]);
    setTapCount(0);
    setRank(null);
    setAvgDeviation(0);
    setLastDeviation(null);
    setListenCount(0);
    setRipples([]);
    tapCountRef.current = 0;
    deviationsRef.current = [];
    signedDeviationsRef.current = [];
    guideBeatCountRef.current = 0;

    // Start LISTEN phase
    setPhase("listen");

    let count = 0;
    // First flash immediately
    flashBeat();
    count++;
    setListenCount(count);

    const listenInterval = setInterval(() => {
      count++;
      flashBeat();
      setListenCount(count);
      if (count >= LISTEN_BEATS) {
        clearInterval(listenInterval);
        // Transition to TAP_WITH_GUIDE after one more interval
        setTimeout(() => {
          setPhase("tapWithGuide");
          guideBeatCountRef.current = 0;
          // Start guide beats
          const guideInterval = setInterval(() => {
            if (phaseRef.current !== "tapWithGuide") {
              clearInterval(guideInterval);
              return;
            }
            guideBeatCountRef.current++;
            flashBeat();
            if (guideBeatCountRef.current >= GUIDED_TAPS) {
              clearInterval(guideInterval);
            }
          }, INTERVAL);
          intervalRef.current = guideInterval;
          // First guide beat immediately
          guideBeatCountRef.current++;
          flashBeat();
          // Set expected first tap time
          expectedNextTapRef.current = performance.now();
        }, INTERVAL);
      }
    }, INTERVAL);

    beatTimeoutsRef.current.push(listenInterval as unknown as ReturnType<typeof setTimeout>);
  }, [clearTimers, flashBeat]);

  /* ─── Handle Tap ─── */
  const handleTap = useCallback(() => {
    if (phase !== "tapWithGuide" && phase !== "tapWithoutGuide") return;

    const now = performance.now();
    addRipple();

    const currentTapCount = tapCountRef.current;

    if (currentTapCount === 0) {
      // First tap: just record the time as the base, no deviation
      expectedNextTapRef.current = now + INTERVAL;
      tapCountRef.current = 1;
      setTapCount(1);
      return;
    }

    // Calculate deviation from expected time
    const expected = expectedNextTapRef.current;
    const signedDev = Math.round(now - expected);
    const absDev = Math.abs(signedDev);

    deviationsRef.current = [...deviationsRef.current, absDev];
    signedDeviationsRef.current = [...signedDeviationsRef.current, signedDev];
    setDeviations([...deviationsRef.current]);
    setSignedDeviations([...signedDeviationsRef.current]);

    const newCount = currentTapCount + 1;
    tapCountRef.current = newCount;
    setTapCount(newCount);

    setLastDeviation({ abs: absDev, signed: signedDev, key: Date.now() });

    // Next expected tap = previous expected + INTERVAL (not from actual tap, to detect drift)
    expectedNextTapRef.current = expected + INTERVAL;

    // Check phase transitions
    if (phase === "tapWithGuide" && newCount >= GUIDED_TAPS) {
      // Transition to unguided
      clearTimers();
      setPhase("tapWithoutGuide");
      // expectedNextTapRef stays as is (continuing from last expected)
    } else if (phase === "tapWithoutGuide" && newCount >= TOTAL_TAPS) {
      // Game done
      clearTimers();
      const allDevs = deviationsRef.current;
      const avg = Math.round(allDevs.reduce((a, b) => a + b, 0) / allDevs.length);
      setAvgDeviation(avg);
      setRank(getRank(avg));
      setPhase("result");
    }
  }, [phase, addRipple, clearTimers]);

  // Share
  const shareUrl =
    typeof window !== "undefined" && rank
      ? `${window.location.origin}/rhythm-test?score=${avgDeviation}&rank=${rank.rank}&title=${encodeURIComponent(rank.title)}`
      : "";

  const shareText = rank
    ? `リズム感テストで平均ズレ${avgDeviation}msを記録！\nランク: ${rank.rank} ${rank.title}\n#リズム感テスト\n`
    : "";

  const twitterUrl = rank
    ? `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`
    : "";

  const handleNativeShare = useCallback(async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: "リズム感テスト", text: shareText, url: shareUrl });
      } catch { /* cancelled */ }
    }
  }, [shareText, shareUrl]);

  /* ═══════════════════════════════════════
     RENDER
     ═══════════════════════════════════════ */

  // ===== IDLE =====
  if (phase === "idle") {
    return (
      <div
        className="relative flex flex-col items-center justify-center min-h-screen px-4 text-center overflow-hidden"
        style={{ background: "linear-gradient(135deg, #1a0a2e 0%, #0a1628 100%)" }}
      >
        <RhythmStyles />
        <WaveBackground />
        <Sparkles color="#FF1493" count={5} />
        <Sparkles color="#00FFFF" count={4} />

        <div style={{ animation: "bounceIn 0.6s ease-out" }} className="mb-4 relative z-10">
          <IconMetronome size={100} color="#FF1493" />
        </div>

        <h1
          className="text-5xl sm:text-6xl font-black text-white mb-3 relative z-10"
          style={{
            textShadow: "0 0 30px rgba(255,20,147,0.5), 3px 3px 0 rgba(0,0,0,0.3)",
            animation: "bounceIn 0.5s ease-out",
          }}
        >
          リズム感テスト
        </h1>

        <p
          className="text-lg mb-2 relative z-10"
          style={{ color: "#00FFFF", animation: "slideUp 0.6s ease-out 0.2s both" }}
        >
          あなたのリズム感は何ミリ秒？
        </p>

        <div
          className="text-gray-400 mb-8 text-sm max-w-xs leading-relaxed relative z-10"
          style={{ animation: "slideUp 0.6s ease-out 0.3s both" }}
        >
          <p className="mb-2">
            光のテンポを覚えて、同じリズムでタップ！
          </p>
          <p>
            途中で<span className="font-bold" style={{ color: "#FF1493" }}>光が消えても</span>テンポを維持できる？
          </p>
          <p className="mt-2 text-xs text-gray-500">
            BPM 100 (600ms間隔) / 全16回タップ
          </p>
        </div>

        <button
          onClick={handleStart}
          className="rhythm-btn px-12 py-5 text-white text-2xl font-black tracking-wider relative z-10"
          style={{
            background: "linear-gradient(135deg, #FF1493 0%, #cc0077 100%)",
            border: "4px solid #8b0a4a",
            boxShadow: "0 0 20px rgba(255,20,147,0.4), 0 8px 0 #8b0a4a",
            animation: "pulse-glow-btn 2s ease-in-out infinite, slideUp 0.6s ease-out 0.5s both",
          }}
        >
          スタート
        </button>

        <Link
          href="/"
          className="mt-8 text-gray-500 hover:text-cyan-400 text-sm transition-colors font-bold relative z-10"
          style={{ animation: "slideUp 0.6s ease-out 0.6s both" }}
        >
          &larr; トップへ
        </Link>
      </div>
    );
  }

  // ===== LISTEN =====
  if (phase === "listen") {
    return (
      <div
        className="relative flex flex-col items-center justify-center min-h-screen select-none overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #1a0a2e 0%, #0a1628 100%)",
          touchAction: "manipulation",
        }}
      >
        <RhythmStyles />
        <WaveBackground />

        <div className="text-sm font-bold mb-8 relative z-10" style={{ color: "#00FFFF" }}>
          テンポを覚えてください
        </div>

        {/* Central beat circle */}
        <div className="relative mb-8">
          <div
            className="w-40 h-40 rounded-full relative z-10 flex items-center justify-center transition-all duration-150"
            style={{
              background: beatFlash
                ? "radial-gradient(circle, #FF1493 0%, #cc0077 60%, #1a0a2e 100%)"
                : "radial-gradient(circle, #2a1040 0%, #1a0a2e 100%)",
              boxShadow: beatFlash
                ? "0 0 80px rgba(255,20,147,0.8), 0 0 120px rgba(255,20,147,0.3), inset 0 0 30px rgba(255,20,147,0.3)"
                : "0 0 30px rgba(255,20,147,0.15), inset 0 0 20px rgba(0,0,0,0.5)",
              border: `3px solid ${beatFlash ? "#FF1493" : "rgba(255,20,147,0.2)"}`,
              transform: beatFlash ? "scale(1.15)" : "scale(1)",
            }}
          >
            <div
              className="w-8 h-8 rounded-full"
              style={{
                background: beatFlash ? "#fff" : "rgba(255,20,147,0.3)",
                boxShadow: beatFlash ? "0 0 20px #fff" : "none",
                transition: "all 0.1s",
              }}
            />
          </div>
        </div>

        {/* Beat counter */}
        <div className="flex gap-3 relative z-10">
          {Array.from({ length: LISTEN_BEATS }).map((_, i) => (
            <div
              key={i}
              className="w-4 h-4 rounded-full"
              style={{
                background: i < listenCount ? "#FF1493" : "rgba(255,20,147,0.2)",
                boxShadow: i < listenCount ? "0 0 10px rgba(255,20,147,0.6)" : "none",
                transition: "all 0.15s",
              }}
            />
          ))}
        </div>

        <div className="text-gray-500 text-xs mt-6 relative z-10">
          BPM 100 = 600ms間隔
        </div>
      </div>
    );
  }

  // ===== TAP_WITH_GUIDE / TAP_WITHOUT_GUIDE =====
  if (phase === "tapWithGuide" || phase === "tapWithoutGuide") {
    const isGuided = phase === "tapWithGuide";
    const progress = tapCount;
    const maxTaps = isGuided ? GUIDED_TAPS : TOTAL_TAPS;
    const phaseLabel = isGuided ? "ガイド付き" : "ガイドなし";

    return (
      <div
        onPointerDown={handleTap}
        className="relative flex flex-col items-center justify-center min-h-screen cursor-pointer select-none overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #1a0a2e 0%, #0a1628 100%)",
          touchAction: "manipulation",
        }}
      >
        <RhythmStyles />
        <WaveBackground />

        {/* Phase indicator */}
        <div className="text-sm font-bold mb-2 relative z-10" style={{ color: isGuided ? "#FF1493" : "#00FFFF" }}>
          {phaseLabel}
        </div>

        {/* Tap counter */}
        <div className="text-xs text-gray-500 mb-6 relative z-10">
          {progress} / {maxTaps}
        </div>

        {/* Central beat circle */}
        <div className="relative mb-6">
          {/* Ripples */}
          {ripples.map((id) => (
            <div
              key={id}
              className="absolute inset-0 rounded-full pointer-events-none"
              style={{
                border: "2px solid #00FFFF",
                animation: "ripple 0.6s ease-out forwards",
                width: "160px",
                height: "160px",
              }}
            />
          ))}

          <div
            className="w-40 h-40 rounded-full relative z-10 flex items-center justify-center transition-all duration-150"
            style={{
              background:
                isGuided && beatFlash
                  ? "radial-gradient(circle, #FF1493 0%, #cc0077 60%, #1a0a2e 100%)"
                  : "radial-gradient(circle, #2a1040 0%, #1a0a2e 100%)",
              boxShadow:
                isGuided && beatFlash
                  ? "0 0 80px rgba(255,20,147,0.8), 0 0 120px rgba(255,20,147,0.3), inset 0 0 30px rgba(255,20,147,0.3)"
                  : "0 0 30px rgba(255,20,147,0.15), inset 0 0 20px rgba(0,0,0,0.5)",
              border: `3px solid ${isGuided && beatFlash ? "#FF1493" : isGuided ? "rgba(255,20,147,0.2)" : "rgba(0,255,255,0.2)"}`,
              transform: isGuided && beatFlash ? "scale(1.15)" : "scale(1)",
            }}
          >
            {/* Center dot */}
            <div
              className="w-8 h-8 rounded-full"
              style={{
                background: isGuided
                  ? beatFlash
                    ? "#fff"
                    : "rgba(255,20,147,0.3)"
                  : "rgba(0,255,255,0.3)",
                boxShadow: isGuided && beatFlash ? "0 0 20px #fff" : "none",
                transition: "all 0.1s",
              }}
            />
          </div>

          {/* Deviation popup */}
          {lastDeviation && (
            <DeviationPopup
              key={lastDeviation.key}
              deviation={lastDeviation.abs}
              signed={lastDeviation.signed}
            />
          )}
        </div>

        {/* Progress dots */}
        <div className="flex gap-2 flex-wrap justify-center max-w-xs relative z-10">
          {Array.from({ length: TOTAL_TAPS }).map((_, i) => {
            const isGuidedDot = i < GUIDED_TAPS;
            const isFilled = i < progress;
            const isCurrent = i === progress;
            const dotColor = isGuidedDot ? "#FF1493" : "#00FFFF";
            return (
              <div
                key={i}
                className="w-3 h-3 rounded-full"
                style={{
                  background: isFilled ? dotColor : isCurrent ? `${dotColor}66` : "rgba(255,255,255,0.1)",
                  boxShadow: isFilled ? `0 0 6px ${dotColor}80` : "none",
                  transition: "all 0.15s",
                }}
              />
            );
          })}
        </div>

        {/* Instruction */}
        <div className="text-gray-500 text-sm mt-8 font-bold relative z-10">
          {isGuided ? "光に合わせてタップ！" : "テンポを維持してタップ！"}
        </div>

        {/* Phase label for no-guide */}
        {!isGuided && (
          <div
            className="text-xs mt-3 px-4 py-1 rounded-full relative z-10"
            style={{
              color: "#00FFFF",
              background: "rgba(0,255,255,0.1)",
              border: "1px solid rgba(0,255,255,0.2)",
            }}
          >
            光なし - 記憶だけが頼り！
          </div>
        )}
      </div>
    );
  }

  // ===== RESULT =====
  if (phase === "result" && rank) {
    // Split deviations into guided/unguided (first tap has no deviation)
    const guidedDevs = deviations.slice(0, GUIDED_TAPS - 1);
    const unguidedDevs = deviations.slice(GUIDED_TAPS - 1);
    const guidedSigned = signedDeviations.slice(0, GUIDED_TAPS - 1);
    const unguidedSigned = signedDeviations.slice(GUIDED_TAPS - 1);
    const guidedAvg = guidedDevs.length > 0 ? Math.round(guidedDevs.reduce((a, b) => a + b, 0) / guidedDevs.length) : 0;
    const unguidedAvg = unguidedDevs.length > 0 ? Math.round(unguidedDevs.reduce((a, b) => a + b, 0) / unguidedDevs.length) : 0;

    return (
      <div
        className="relative flex flex-col items-center justify-center min-h-screen px-4 py-8 overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #1a0a2e 0%, #0a1628 100%)",
          touchAction: "manipulation",
        }}
      >
        <RhythmStyles />
        <WaveBackground />
        <Sparkles color={rank.color} count={10} />

        <div
          className="flex items-center gap-2 text-sm text-gray-300 mb-4 font-bold relative z-10"
          style={{ animation: "slideUp 0.4s ease-out" }}
        >
          結果発表
        </div>

        {/* Rank icon */}
        <div
          className="mb-2 relative z-10"
          style={{
            animation: "rankReveal 0.7s ease-out",
            filter: `drop-shadow(0 0 25px ${rank.color}80)`,
          }}
        >
          <RankIcon rankLetter={rank.rank} color={rank.color} size={90} />
        </div>

        {/* Rank letter */}
        <div
          className="text-7xl sm:text-8xl font-black mb-1 relative z-10"
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
          className="text-2xl font-black text-white mb-1 relative z-10"
          style={{ animation: "slideUp 0.5s ease-out 0.3s both" }}
        >
          {rank.title}
        </div>
        <div
          className="text-gray-400 text-sm mb-6 relative z-10"
          style={{ animation: "slideUp 0.5s ease-out 0.4s both" }}
        >
          {rank.description}
        </div>

        {/* Score box */}
        <div
          className="relative px-10 py-5 mb-4 text-center rounded-2xl relative z-10"
          style={{
            background: "rgba(255,255,255,0.05)",
            border: `3px solid ${rank.color}44`,
            boxShadow: `0 0 20px ${rank.color}20, inset 0 0 30px rgba(0,0,0,0.2)`,
            animation: "bounceIn 0.5s ease-out 0.5s both",
          }}
        >
          <div className="text-gray-400 text-xs mb-1 font-bold">平均ズレ</div>
          <div className="text-6xl font-black" style={{ color: rank.color }}>
            {avgDeviation}
            <span className="text-xl ml-1" style={{ opacity: 0.6 }}>ms</span>
          </div>
        </div>

        {/* Guided vs Unguided breakdown */}
        <div
          className="flex gap-3 mb-6 relative z-10"
          style={{ animation: "slideUp 0.4s ease-out 0.6s both" }}
        >
          <div
            className="text-center px-4 py-2 rounded-xl"
            style={{ background: "rgba(255,20,147,0.1)", border: "1px solid rgba(255,20,147,0.2)" }}
          >
            <div className="text-[10px] font-bold" style={{ color: "#FF1493" }}>ガイド付き</div>
            <div className="text-white font-black text-sm">{guidedAvg}ms</div>
          </div>
          <div
            className="text-center px-4 py-2 rounded-xl"
            style={{ background: "rgba(0,255,255,0.1)", border: "1px solid rgba(0,255,255,0.2)" }}
          >
            <div className="text-[10px] font-bold" style={{ color: "#00FFFF" }}>ガイドなし</div>
            <div className="text-white font-black text-sm">{unguidedAvg}ms</div>
          </div>
        </div>

        {/* Individual deviations */}
        <div
          className="flex gap-1.5 flex-wrap justify-center mb-8 max-w-xs relative z-10"
          style={{ animation: "slideUp 0.4s ease-out 0.7s both" }}
        >
          {/* Guided section */}
          {guidedSigned.map((s, i) => (
            <div
              key={`g-${i}`}
              className="flex flex-col items-center px-2 py-1 rounded-lg text-[10px]"
              style={{
                background: "rgba(255,20,147,0.08)",
                border: "1px solid rgba(255,20,147,0.2)",
              }}
            >
              <span className="font-bold" style={{ color: "#FF1493" }}>
                {s >= 0 ? "+" : ""}{s}
              </span>
            </div>
          ))}
          {/* Divider */}
          <div className="w-px h-8 mx-1" style={{ background: "rgba(255,255,255,0.15)" }} />
          {/* Unguided section */}
          {unguidedSigned.map((s, i) => (
            <div
              key={`u-${i}`}
              className="flex flex-col items-center px-2 py-1 rounded-lg text-[10px]"
              style={{
                background: "rgba(0,255,255,0.08)",
                border: "1px solid rgba(0,255,255,0.2)",
              }}
            >
              <span className="font-bold" style={{ color: "#00FFFF" }}>
                {s >= 0 ? "+" : ""}{s}
              </span>
            </div>
          ))}
        </div>

        {/* Share & actions */}
        <div
          className="flex flex-col gap-3 w-full max-w-xs relative z-10"
          style={{ animation: "slideUp 0.5s ease-out 0.8s both" }}
        >
          {typeof navigator !== "undefined" && typeof navigator.share === "function" && (
            <button
              onClick={handleNativeShare}
              className="rhythm-btn w-full py-4 text-lg font-black"
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
              className="rhythm-btn flex-1 py-3 text-white font-black text-center text-sm"
              style={{
                background: "#000",
                border: "3px solid #333",
                boxShadow: "0 4px 0 #000",
              }}
            >
              X Share
            </a>
            <a
              href={`https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(shareUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="rhythm-btn flex-1 py-3 text-white font-black text-center text-sm"
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
            className="rhythm-btn w-full py-3 font-black mt-2"
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
            &larr; トップへ
          </Link>
        </div>
      </div>
    );
  }

  return null;
}
