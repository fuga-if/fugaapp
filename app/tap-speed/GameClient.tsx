"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { getRank, type TapRank } from "@/lib/tap-speed/ranks";
import Link from "next/link";

const DURATION = 10;

type Phase = "idle" | "countdown" | "playing" | "result";

/* ═══════════════════════════════════════
   SVG Icons (no emoji, no images)
   ═══════════════════════════════════════ */

function IconTrophy({ size = 80, color = "#FFCC00" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ filter: `drop-shadow(0 0 12px ${color}80)` }}>
      <path d="M30 20 L30 50 C30 65 40 75 50 75 C60 75 70 65 70 50 L70 20Z" fill={color} stroke="rgba(0,0,0,0.3)" strokeWidth="2" />
      <path d="M30 30 C20 30 10 35 12 50 C14 60 22 58 30 50" fill={color} opacity="0.8" stroke="rgba(0,0,0,0.2)" strokeWidth="1.5" />
      <path d="M70 30 C80 30 90 35 88 50 C86 60 78 58 70 50" fill={color} opacity="0.8" stroke="rgba(0,0,0,0.2)" strokeWidth="1.5" />
      <rect x="42" y="75" width="16" height="8" rx="2" fill={color} opacity="0.9" />
      <rect x="35" y="83" width="30" height="5" rx="2" fill={color} />
    </svg>
  );
}

function IconBolt({ size = 80, color = "#FF6B35" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ filter: `drop-shadow(0 0 12px ${color}80)` }}>
      <polygon points="58,2 22,52 44,52 32,98 78,42 53,42" fill={color} stroke="rgba(0,0,0,0.25)" strokeWidth="2.5" strokeLinejoin="round" />
    </svg>
  );
}

function IconFire({ size = 80, color = "#4ECDC4" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ filter: `drop-shadow(0 0 12px ${color}80)` }}>
      <path d="M50 5 C50 5 75 30 75 58 C75 75 64 90 50 95 C36 90 25 75 25 58 C25 30 50 5 50 5Z" fill={color} stroke="rgba(0,0,0,0.2)" strokeWidth="2" />
      <path d="M50 35 C50 35 62 48 62 60 C62 70 57 78 50 80 C43 78 38 70 38 60 C38 48 50 35 50 35Z" fill="#fff" opacity="0.3" />
    </svg>
  );
}

function IconTarget({ size = 80, color = "#45B7D1" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ filter: `drop-shadow(0 0 10px ${color}60)` }}>
      <circle cx="50" cy="50" r="40" fill="none" stroke={color} strokeWidth="4" />
      <circle cx="50" cy="50" r="28" fill="none" stroke={color} strokeWidth="3" opacity="0.6" />
      <circle cx="50" cy="50" r="15" fill="none" stroke={color} strokeWidth="3" opacity="0.4" />
      <circle cx="50" cy="50" r="5" fill={color} />
    </svg>
  );
}

function IconSnail({ size = 80, color = "#96CEB4" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ filter: `drop-shadow(0 0 10px ${color}60)` }}>
      <ellipse cx="55" cy="65" rx="30" ry="20" fill={color} stroke="rgba(0,0,0,0.2)" strokeWidth="2" />
      <circle cx="55" cy="55" r="18" fill="none" stroke={color} strokeWidth="4" opacity="0.6" />
      <circle cx="55" cy="55" r="10" fill="none" stroke={color} strokeWidth="3" opacity="0.4" />
      <circle cx="55" cy="55" r="4" fill={color} opacity="0.5" />
      <ellipse cx="28" cy="60" rx="10" ry="8" fill={color} opacity="0.9" />
      <circle cx="22" cy="48" r="3" fill={color} />
      <circle cx="30" cy="46" r="3" fill={color} />
      <line x1="22" y1="51" x2="22" y2="58" stroke={color} strokeWidth="2" />
      <line x1="30" y1="49" x2="30" y2="56" stroke={color} strokeWidth="2" />
    </svg>
  );
}

function IconZzz({ size = 80, color = "#A8A8A8" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ filter: `drop-shadow(0 0 8px ${color}40)` }}>
      <text x="15" y="80" fontFamily="monospace" fontWeight="900" fontSize="36" fontStyle="italic" fill={color} opacity="0.5">z</text>
      <text x="38" y="58" fontFamily="monospace" fontWeight="900" fontSize="42" fontStyle="italic" fill={color} opacity="0.7">z</text>
      <text x="58" y="34" fontFamily="monospace" fontWeight="900" fontSize="50" fontStyle="italic" fill={color}>Z</text>
    </svg>
  );
}

function RankIcon({ rankLetter, color, size = 80 }: { rankLetter: string; color: string; size?: number }) {
  switch (rankLetter) {
    case "S": return <IconTrophy size={size} color={color} />;
    case "A": return <IconBolt size={size} color={color} />;
    case "B": return <IconFire size={size} color={color} />;
    case "C": return <IconTarget size={size} color={color} />;
    case "D": return <IconSnail size={size} color={color} />;
    case "E": return <IconZzz size={size} color={color} />;
    default: return <IconTrophy size={size} color={color} />;
  }
}

/* ═══════════════════════════════════════
   Arcade Styles
   ═══════════════════════════════════════ */

function ArcadeStyles() {
  return (
    <style jsx global>{`
      @keyframes neonBlink {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.4; }
      }
      @keyframes neonFlicker {
        0%, 19%, 21%, 23%, 25%, 54%, 56%, 100% { opacity: 1; }
        20%, 24%, 55% { opacity: 0.4; }
      }
      @keyframes countBounce {
        0% { transform: scale(0); opacity: 0; }
        50% { transform: scale(1.4); }
        100% { transform: scale(1); opacity: 1; }
      }
      @keyframes goFlash {
        0% { transform: scale(0.5); opacity: 0; }
        30% { transform: scale(1.5); opacity: 1; }
        60% { transform: scale(1); }
        100% { transform: scale(1); opacity: 1; }
      }
      @keyframes btnPress {
        0% { transform: translateY(0); }
        50% { transform: translateY(6px); }
        100% { transform: translateY(0); }
      }
      @keyframes rippleOut {
        0% { transform: scale(0.8); opacity: 0.6; border-width: 4px; }
        100% { transform: scale(1.6); opacity: 0; border-width: 1px; }
      }
      @keyframes slideUp {
        0% { transform: translateY(30px); opacity: 0; }
        100% { transform: translateY(0); opacity: 1; }
      }
      @keyframes typeIn {
        0% { width: 0; }
        100% { width: 100%; }
      }
      @keyframes screenFlash {
        0% { opacity: 0.8; }
        100% { opacity: 0; }
      }
      @keyframes insertCoin {
        0%, 100% { opacity: 1; }
        50% { opacity: 0; }
      }
      @keyframes scanMove {
        0% { top: 0%; }
        100% { top: 100%; }
      }
      @keyframes glowPulse {
        0%, 100% { box-shadow: 0 0 20px rgba(0,255,136,0.3), 0 0 60px rgba(0,255,136,0.1); }
        50% { box-shadow: 0 0 40px rgba(0,255,136,0.5), 0 0 80px rgba(0,255,136,0.2); }
      }
      @keyframes scoreFlash {
        0% { color: #fff; }
        50% { color: inherit; }
        100% { color: inherit; }
      }
      @keyframes rankReveal {
        0% { transform: scale(0) rotate(-20deg); opacity: 0; }
        60% { transform: scale(1.3) rotate(5deg); }
        100% { transform: scale(1) rotate(0deg); opacity: 1; }
      }
      .crt-screen {
        position: relative;
        border: 3px solid #333;
        border-radius: 12px;
        overflow: hidden;
      }
      .crt-screen::before {
        content: '';
        position: absolute;
        inset: 0;
        background: repeating-linear-gradient(
          0deg,
          rgba(0,0,0,0.15) 0px,
          rgba(0,0,0,0.15) 1px,
          transparent 1px,
          transparent 3px
        );
        pointer-events: none;
        z-index: 10;
      }
      .crt-screen::after {
        content: '';
        position: absolute;
        inset: 0;
        box-shadow: inset 0 0 60px rgba(0,255,100,0.1), inset 0 0 120px rgba(0,0,0,0.3);
        border-radius: 12px;
        pointer-events: none;
        z-index: 11;
      }
      .arcade-text {
        font-family: 'Courier New', Courier, monospace;
        letter-spacing: 0.15em;
        text-transform: uppercase;
      }
      .neon-green {
        color: #00FF88;
        text-shadow: 0 0 10px #00FF88, 0 0 20px #00FF8844, 0 0 40px #00FF8822;
      }
      .neon-pink {
        color: #FF0066;
        text-shadow: 0 0 10px #FF0066, 0 0 20px #FF006644, 0 0 40px #FF006622;
      }
      .neon-cyan {
        color: #00CCFF;
        text-shadow: 0 0 10px #00CCFF, 0 0 20px #00CCFF44, 0 0 40px #00CCFF22;
      }
      .neon-yellow {
        color: #FFCC00;
        text-shadow: 0 0 10px #FFCC00, 0 0 20px #FFCC0044, 0 0 40px #FFCC0022;
      }
    `}</style>
  );
}

/* CRT Scanline moving bar */
function CRTScanbar() {
  return (
    <div
      className="absolute left-0 w-full pointer-events-none"
      style={{
        height: '4px',
        background: 'linear-gradient(180deg, transparent, rgba(0,255,136,0.08), transparent)',
        animation: 'scanMove 4s linear infinite',
        zIndex: 12,
      }}
    />
  );
}

/* ═══════════════════════════════════════
   Main Component
   ═══════════════════════════════════════ */

export default function TapSpeedGameClient() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [countdownNum, setCountdownNum] = useState(3);
  const [taps, setTaps] = useState(0);
  const [timeLeft, setTimeLeft] = useState(DURATION);
  const [rank, setRank] = useState<TapRank | null>(null);
  const [pulseKey, setPulseKey] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const startTimeRef = useRef(0);
  const tapsRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const countdownRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (countdownRef.current) clearTimeout(countdownRef.current);
    };
  }, []);

  const timerLoop = useCallback(() => {
    const elapsed = (performance.now() - startTimeRef.current) / 1000;
    const remaining = Math.max(0, DURATION - elapsed);
    setTimeLeft(remaining);

    if (remaining <= 0) {
      const finalTaps = tapsRef.current;
      const r = getRank(finalTaps);
      setRank(r);
      setTaps(finalTaps);
      setPhase("result");
      setShowResult(false);
      setTimeout(() => setShowResult(true), 1200);
      return;
    }
    rafRef.current = requestAnimationFrame(timerLoop);
  }, []);

  const startGame = useCallback(() => {
    tapsRef.current = 0;
    setTaps(0);
    setTimeLeft(DURATION);
    setRank(null);
    setShowResult(false);
    setPhase("countdown");
    setCountdownNum(3);

    let count = 3;
    const tick = () => {
      count--;
      if (count > 0) {
        setCountdownNum(count);
        countdownRef.current = setTimeout(tick, 700);
      } else {
        setCountdownNum(0);
        countdownRef.current = setTimeout(() => {
          startTimeRef.current = performance.now();
          setPhase("playing");
          rafRef.current = requestAnimationFrame(timerLoop);
        }, 400);
      }
    };
    countdownRef.current = setTimeout(tick, 700);
  }, [timerLoop]);

  const handleTap = useCallback(() => {
    if (phase !== "playing") return;
    tapsRef.current++;
    setTaps(tapsRef.current);
    setPulseKey((k) => k + 1);
  }, [phase]);

  const cps = rank ? (taps / DURATION).toFixed(1) : "0";
  const shareUrl =
    typeof window !== "undefined" && rank
      ? `${window.location.origin}/tap-speed?score=${taps}`
      : "";

  const shareText = rank
    ? `TAP SPEED TEST - 10秒間に${taps}回タップ！（${cps} CPS）\nランク: ${rank.rank} ${rank.title}\n#タップ速度テスト #fugaapp\n`
    : "";

  const twitterUrl = rank
    ? `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`
    : "";

  const handleNativeShare = useCallback(async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: "タップ速度テスト", text: shareText, url: shareUrl });
      } catch { /* cancelled */ }
    }
  }, [shareText, shareUrl]);

  const progress = (timeLeft / DURATION) * 100;
  const padTaps = String(taps).padStart(3, "0");
  const elapsed = DURATION - timeLeft;

  // Neon color based on tap intensity
  const getTapColor = (t: number) => {
    if (t >= 80) return "#FF0066";
    if (t >= 50) return "#FFCC00";
    return "#00FF88";
  };

  const tapColor = getTapColor(taps);

  // Time bar dots
  const totalDots = 20;
  const filledDots = Math.round((timeLeft / DURATION) * totalDots);

  // Rank neon color mapping
  const getRankNeon = (r: string) => {
    switch (r) {
      case "S": return "#FFCC00";
      case "A": return "#FF6B35";
      case "B": return "#4ECDC4";
      case "C": return "#45B7D1";
      case "D": return "#96CEB4";
      case "E": return "#A8A8A8";
      default: return "#00FF88";
    }
  };

  // ===== IDLE =====
  if (phase === "idle") {
    return (
      <div
        className="flex flex-col items-center justify-center min-h-screen px-4"
        style={{ background: "#0a0a0a" }}
      >
        <ArcadeStyles />

        <div
          className="crt-screen w-full max-w-md flex flex-col items-center justify-center px-6 py-12"
          style={{
            background: "radial-gradient(ellipse at center, #0d1a0d 0%, #050a05 70%, #020502 100%)",
            minHeight: "70vh",
            animation: "glowPulse 3s ease-in-out infinite",
          }}
        >
          <CRTScanbar />

          {/* Title */}
          <div
            className="arcade-text text-3xl sm:text-4xl font-bold text-center mb-2 neon-green"
            style={{ animation: "neonFlicker 3s ease-in-out infinite" }}
          >
            TAP SPEED
          </div>
          <div
            className="arcade-text text-3xl sm:text-4xl font-bold text-center mb-8 neon-green"
            style={{ animation: "neonFlicker 3s ease-in-out infinite" }}
          >
            TEST
          </div>

          {/* Decorative line */}
          <div className="w-48 h-px mb-6" style={{ background: "linear-gradient(90deg, transparent, #00FF8866, transparent)" }} />

          {/* Description */}
          <div className="arcade-text text-xs text-center mb-2" style={{ color: "#00FF8888" }}>
            10 SECONDS RAPID TAP CHALLENGE
          </div>
          <div className="arcade-text text-xs text-center mb-8" style={{ color: "#00FF8866" }}>
            TAP COUNT AND CPS RANK JUDGEMENT
          </div>

          {/* Insert Coin / Press Start */}
          <button
            onClick={startGame}
            className="arcade-text text-lg font-bold px-8 py-3 mb-6 border-2 transition-all"
            style={{
              color: "#FFCC00",
              borderColor: "#FFCC0066",
              background: "rgba(255,204,0,0.05)",
              textShadow: "0 0 10px #FFCC00, 0 0 20px #FFCC0044",
              animation: "insertCoin 1.2s ease-in-out infinite",
            }}
          >
            PRESS START
          </button>

          <div className="arcade-text text-xs" style={{ color: "#00FF8844" }}>
            INSERT COIN - 0 CREDIT
          </div>
        </div>

        <Link
          href="/"
          className="mt-6 arcade-text text-xs transition-colors"
          style={{ color: "#00FF8844" }}
        >
          &lt; BACK TO TOP
        </Link>
      </div>
    );
  }

  // ===== COUNTDOWN =====
  if (phase === "countdown") {
    return (
      <div
        className="flex flex-col items-center justify-center min-h-screen px-4 select-none"
        style={{ background: "#0a0a0a" }}
      >
        <ArcadeStyles />

        <div
          className="crt-screen w-full max-w-md flex flex-col items-center justify-center px-6"
          style={{
            background: "radial-gradient(ellipse at center, #0d1a0d 0%, #050a05 70%, #020502 100%)",
            minHeight: "70vh",
          }}
        >
          <CRTScanbar />

          <div className="arcade-text text-sm mb-8" style={{ color: "#00FF8866" }}>
            GET READY
          </div>

          <div
            key={countdownNum}
            className="arcade-text font-bold"
            style={{
              fontSize: countdownNum > 0 ? "8rem" : "6rem",
              color: countdownNum > 0 ? "#FFCC00" : "#00FF88",
              textShadow: countdownNum > 0
                ? "0 0 20px #FFCC00, 0 0 40px #FFCC0066, 0 0 80px #FFCC0033"
                : "0 0 30px #00FF88, 0 0 60px #00FF8866, 0 0 100px #00FF8833",
              animation: countdownNum > 0 ? "countBounce 0.6s ease-out" : "goFlash 0.4s ease-out",
              lineHeight: 1,
            }}
          >
            {countdownNum > 0 ? countdownNum : "GO!"}
          </div>

          {/* Flash overlay on GO */}
          {countdownNum === 0 && (
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: "#00FF88",
                animation: "screenFlash 0.4s ease-out forwards",
                zIndex: 20,
                borderRadius: "12px",
              }}
            />
          )}
        </div>
      </div>
    );
  }

  // ===== PLAYING =====
  if (phase === "playing") {
    return (
      <div
        className="flex flex-col items-center justify-center min-h-screen select-none px-4"
        style={{
          background: "#0a0a0a",
          touchAction: "manipulation",
          WebkitUserSelect: "none",
          userSelect: "none",
        }}
      >
        <ArcadeStyles />

        <div
          className="crt-screen w-full max-w-md flex flex-col items-center justify-between px-6 py-8"
          style={{
            background: "radial-gradient(ellipse at center, #0d1a0d 0%, #050a05 70%, #020502 100%)",
            minHeight: "70vh",
          }}
        >
          <CRTScanbar />

          {/* Score display */}
          <div className="flex flex-col items-center" style={{ zIndex: 5 }}>
            <div className="arcade-text text-xs mb-1" style={{ color: "#00FF8866" }}>
              TAPS
            </div>
            <div
              className="arcade-text font-bold text-6xl tabular-nums"
              style={{
                color: tapColor,
                textShadow: `0 0 15px ${tapColor}, 0 0 30px ${tapColor}66`,
                animation: taps > 0 ? "scoreFlash 0.1s ease-out" : "none",
              }}
            >
              {padTaps}
            </div>
            <div className="arcade-text text-xs mt-1 tabular-nums" style={{ color: "#00CCFF88" }}>
              {elapsed > 0.1 ? (taps / elapsed).toFixed(1) : "0.0"} CPS
            </div>
          </div>

          {/* Tap Button */}
          <div className="relative flex items-center justify-center" style={{ zIndex: 5 }}>
            {/* Ripple */}
            <div
              key={pulseKey}
              className="absolute rounded-full pointer-events-none"
              style={{
                width: "min(55vw, 220px)",
                height: "min(55vw, 220px)",
                border: `3px solid ${tapColor}`,
                animation: "rippleOut 0.3s ease-out forwards",
              }}
            />

            {/* Button */}
            <button
              onPointerDown={handleTap}
              className="relative rounded-full flex items-center justify-center"
              style={{
                width: "min(55vw, 220px)",
                height: "min(55vw, 220px)",
                background: `radial-gradient(circle at 40% 35%, ${tapColor}44, ${tapColor}11 60%, transparent)`,
                border: `4px solid ${tapColor}`,
                boxShadow: `0 0 30px ${tapColor}44, 0 0 60px ${tapColor}22, inset 0 0 30px ${tapColor}11`,
                touchAction: "manipulation",
                transition: "box-shadow 0.1s",
              }}
            >
              <div
                className="arcade-text font-bold text-xl"
                style={{
                  color: tapColor,
                  textShadow: `0 0 10px ${tapColor}`,
                }}
              >
                TAP!
              </div>
            </button>
          </div>

          {/* Time bar (dot-based) */}
          <div className="flex flex-col items-center w-full" style={{ zIndex: 5 }}>
            <div className="arcade-text text-xs mb-2" style={{ color: "#00FF8866" }}>
              TIME
            </div>
            <div className="flex gap-1 justify-center flex-wrap">
              {Array.from({ length: totalDots }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-sm"
                  style={{
                    width: "10px",
                    height: "10px",
                    background: i < filledDots
                      ? (filledDots > 14 ? "#00FF88" : filledDots > 6 ? "#FFCC00" : "#FF0066")
                      : "#1a1a1a",
                    boxShadow: i < filledDots
                      ? `0 0 4px ${filledDots > 14 ? "#00FF88" : filledDots > 6 ? "#FFCC00" : "#FF0066"}44`
                      : "none",
                    transition: "background 0.1s",
                  }}
                />
              ))}
            </div>
            <div
              className="arcade-text text-lg font-bold tabular-nums mt-2"
              style={{
                color: filledDots > 14 ? "#00FF88" : filledDots > 6 ? "#FFCC00" : "#FF0066",
                textShadow: `0 0 8px ${filledDots > 14 ? "#00FF88" : filledDots > 6 ? "#FFCC00" : "#FF0066"}66`,
              }}
            >
              {timeLeft.toFixed(1)}s
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ===== RESULT =====
  if (phase === "result" && rank) {
    const neonColor = getRankNeon(rank.rank);
    return (
      <div
        className="flex flex-col items-center justify-center min-h-screen px-4 py-4"
        style={{ background: "#0a0a0a" }}
      >
        <ArcadeStyles />

        <div
          className="crt-screen w-full max-w-md flex flex-col items-center px-6 py-8"
          style={{
            background: "radial-gradient(ellipse at center, #0d1a0d 0%, #050a05 70%, #020502 100%)",
            minHeight: "70vh",
          }}
        >
          <CRTScanbar />

          {/* GAME OVER header */}
          {!showResult && (
            <div className="flex-1 flex items-center justify-center">
              <div
                className="arcade-text text-4xl sm:text-5xl font-bold neon-pink"
                style={{ animation: "neonBlink 0.5s ease-in-out infinite" }}
              >
                GAME OVER
              </div>
            </div>
          )}

          {/* Result content */}
          {showResult && (
            <div className="flex flex-col items-center w-full" style={{ zIndex: 5 }}>
              <div
                className="arcade-text text-sm mb-4"
                style={{ color: "#00FF8866", animation: "slideUp 0.4s ease-out" }}
              >
                - RESULT -
              </div>

              {/* Rank icon */}
              <div style={{ animation: "rankReveal 0.7s ease-out", marginBottom: "8px" }}>
                <RankIcon rankLetter={rank.rank} color={neonColor} size={80} />
              </div>

              {/* Rank letter */}
              <div
                className="arcade-text font-bold"
                style={{
                  fontSize: "4.5rem",
                  lineHeight: 1,
                  color: neonColor,
                  textShadow: `0 0 20px ${neonColor}, 0 0 40px ${neonColor}66, 0 0 80px ${neonColor}33`,
                  animation: "rankReveal 0.7s ease-out 0.1s both",
                }}
              >
                {rank.rank}
              </div>

              {/* Rank title */}
              <div
                className="arcade-text text-lg font-bold mt-1 mb-1"
                style={{
                  color: neonColor,
                  textShadow: `0 0 10px ${neonColor}66`,
                  animation: "slideUp 0.5s ease-out 0.3s both",
                }}
              >
                {rank.title}
              </div>
              <div
                className="arcade-text text-xs mb-6 text-center"
                style={{ color: "#00FF8866", animation: "slideUp 0.5s ease-out 0.4s both" }}
              >
                {rank.description}
              </div>

              {/* Score boxes */}
              <div
                className="flex gap-4 mb-6 w-full justify-center"
                style={{ animation: "slideUp 0.5s ease-out 0.5s both" }}
              >
                <div
                  className="flex-1 max-w-[140px] py-4 text-center border"
                  style={{
                    borderColor: `${neonColor}44`,
                    background: `${neonColor}08`,
                  }}
                >
                  <div className="arcade-text text-xs mb-1" style={{ color: "#00FF8866" }}>
                    TAPS
                  </div>
                  <div
                    className="arcade-text text-3xl font-bold tabular-nums"
                    style={{
                      color: neonColor,
                      textShadow: `0 0 10px ${neonColor}66`,
                    }}
                  >
                    {String(taps).padStart(3, "0")}
                  </div>
                </div>
                <div
                  className="flex-1 max-w-[140px] py-4 text-center border"
                  style={{
                    borderColor: "#00CCFF44",
                    background: "#00CCFF08",
                  }}
                >
                  <div className="arcade-text text-xs mb-1" style={{ color: "#00CCFF88" }}>
                    CPS
                  </div>
                  <div
                    className="arcade-text text-3xl font-bold tabular-nums"
                    style={{
                      color: "#00CCFF",
                      textShadow: "0 0 10px #00CCFF66",
                    }}
                  >
                    {cps}
                  </div>
                </div>
              </div>

              {/* Decorative line */}
              <div
                className="w-48 h-px mb-6"
                style={{
                  background: `linear-gradient(90deg, transparent, ${neonColor}66, transparent)`,
                  animation: "slideUp 0.5s ease-out 0.6s both",
                }}
              />

              {/* NAME ENTRY / Share area */}
              <div
                className="arcade-text text-xs mb-4"
                style={{
                  color: "#FFCC0088",
                  animation: "slideUp 0.5s ease-out 0.7s both, insertCoin 1.5s ease-in-out 1.5s infinite",
                }}
              >
                - NAME ENTRY -
              </div>

              <div
                className="flex flex-col gap-3 w-full max-w-xs"
                style={{ animation: "slideUp 0.5s ease-out 0.8s both" }}
              >
                {typeof navigator !== "undefined" && typeof navigator.share === "function" && (
                  <button
                    onClick={handleNativeShare}
                    className="arcade-text w-full py-3 text-sm font-bold border-2 transition-all active:scale-95"
                    style={{
                      color: neonColor,
                      borderColor: neonColor,
                      background: `${neonColor}11`,
                      textShadow: `0 0 8px ${neonColor}`,
                      boxShadow: `0 0 15px ${neonColor}33`,
                    }}
                  >
                    SHARE RESULT
                  </button>
                )}

                <div className="flex gap-3">
                  <a
                    href={twitterUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="arcade-text flex-1 py-3 text-xs font-bold text-center border-2 transition-all"
                    style={{
                      color: "#fff",
                      borderColor: "#444",
                      background: "#ffffff08",
                    }}
                  >
                    X POST
                  </a>
                  <a
                    href={`https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(shareUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="arcade-text flex-1 py-3 text-xs font-bold text-center border-2 transition-all"
                    style={{
                      color: "#06C755",
                      borderColor: "#06C75566",
                      background: "#06C75511",
                    }}
                  >
                    LINE
                  </a>
                </div>

                <button
                  onClick={startGame}
                  className="arcade-text w-full py-3 text-sm font-bold border-2 transition-all active:scale-95 mt-1"
                  style={{
                    color: "#00FF88",
                    borderColor: "#00FF8866",
                    background: "#00FF8811",
                    textShadow: "0 0 8px #00FF8866",
                  }}
                >
                  CONTINUE? - PRESS START
                </button>

                <Link
                  href="/"
                  className="arcade-text text-center text-xs mt-2 transition-colors"
                  style={{ color: "#00FF8844" }}
                >
                  &lt; BACK TO TOP
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return null;
}
