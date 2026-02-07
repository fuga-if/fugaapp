"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { getRank, getMedian, isMobileDevice, type ReactionRank } from "@/lib/reaction-test/ranks";
import Link from "next/link";

const TOTAL_ROUNDS = 5;
const MAX_FOULS = 3;
const MIN_WAIT = 2000;
const MAX_WAIT = 5000;

type Phase =
  | "idle"
  | "waiting"
  | "tooEarly"
  | "go"
  | "roundResult"
  | "finalResult"
  | "gameOver";

/* ═══════════════════════════════════════
   SVG Icon Components (no emoji!)
   ═══════════════════════════════════════ */

function IconLightning({ size = 80, color = "#FFE600" }: { size?: number; color?: string }) {
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
      <line x1="36" y1="42" x2="50" y2="52" stroke="rgba(0,0,0,0.1)" strokeWidth="1.5" />
      <line x1="64" y1="42" x2="50" y2="52" stroke="rgba(0,0,0,0.1)" strokeWidth="1.5" />
      <line x1="50" y1="36" x2="50" y2="52" stroke="rgba(0,0,0,0.1)" strokeWidth="1.5" />
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
      <line x1="35" y1="50" x2="32" y2="85" stroke="rgba(0,0,0,0.08)" strokeWidth="1.5" />
      <line x1="65" y1="50" x2="68" y2="85" stroke="rgba(0,0,0,0.08)" strokeWidth="1.5" />
    </svg>
  );
}

function IconSkull({ size = 90, color = "#FF3366" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ filter: `drop-shadow(0 0 15px ${color}60)` }}>
      <path d="M50 12 C28 12 14 28 14 48 C14 62 22 72 30 78 L30 88 L70 88 L70 78 C78 72 86 62 86 48 C86 28 72 12 50 12Z"
        fill={color} stroke="rgba(0,0,0,0.3)" strokeWidth="2.5" />
      <ellipse cx="37" cy="46" rx="10" ry="12" fill="#1a1a2e" />
      <ellipse cx="63" cy="46" rx="10" ry="12" fill="#1a1a2e" />
      <ellipse cx="37" cy="44" rx="4" ry="5" fill={color} opacity="0.3" />
      <ellipse cx="63" cy="44" rx="4" ry="5" fill={color} opacity="0.3" />
      <path d="M44 65 L42 72 L46 70 L50 74 L54 70 L58 72 L56 65" fill="#1a1a2e" stroke="rgba(0,0,0,0.2)" strokeWidth="1" />
      <line x1="37" y1="82" x2="37" y2="88" stroke="rgba(0,0,0,0.2)" strokeWidth="2" />
      <line x1="50" y1="82" x2="50" y2="88" stroke="rgba(0,0,0,0.2)" strokeWidth="2" />
      <line x1="63" y1="82" x2="63" y2="88" stroke="rgba(0,0,0,0.2)" strokeWidth="2" />
    </svg>
  );
}

function IconFoul({ size = 70, color = "#FF3366" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ filter: `drop-shadow(0 0 10px ${color}60)` }}>
      <circle cx="50" cy="50" r="40" fill="none" stroke={color} strokeWidth="6" />
      <line x1="30" y1="30" x2="70" y2="70" stroke={color} strokeWidth="6" strokeLinecap="round" />
    </svg>
  );
}

function IconWarning({ size = 14, color = "#FFE600" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '4px' }}>
      <polygon points="50,10 90,85 10,85" fill={color} stroke="rgba(0,0,0,0.2)" strokeWidth="3" strokeLinejoin="round" />
      <text x="50" y="75" textAnchor="middle" fontFamily="Arial Black, sans-serif" fontWeight="900" fontSize="45" fill="#1a1a2e">!</text>
    </svg>
  );
}

function IconDevice({ mobile }: { mobile: boolean }) {
  if (mobile) {
    return (
      <svg width="14" height="14" viewBox="0 0 100 100" style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '4px' }}>
        <rect x="25" y="5" width="50" height="90" rx="8" fill="none" stroke="currentColor" strokeWidth="6" />
        <circle cx="50" cy="82" r="5" fill="currentColor" />
      </svg>
    );
  }
  return (
    <svg width="14" height="14" viewBox="0 0 100 100" style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '4px' }}>
      <rect x="5" y="10" width="90" height="60" rx="5" fill="none" stroke="currentColor" strokeWidth="6" />
      <line x1="50" y1="70" x2="50" y2="85" stroke="currentColor" strokeWidth="6" />
      <line x1="30" y1="85" x2="70" y2="85" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
    </svg>
  );
}

/* Rank icon dispatcher */
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

/* ─── Ink Splash Blob ─── */
function InkBlob({ color, size, top, left, right, bottom, rotate, delay }: {
  color: string; size: number;
  top?: string; left?: string; right?: string; bottom?: string;
  rotate?: number; delay?: number;
}) {
  return (
    <div
      className="absolute pointer-events-none"
      style={{
        width: `${size}px`, height: `${size}px`,
        background: color,
        borderRadius: '60% 40% 70% 30% / 50% 60% 40% 50%',
        opacity: 0.15,
        top, left, right, bottom,
        transform: `rotate(${rotate ?? 0}deg)`,
        animation: `blobFloat 6s ease-in-out ${delay ?? 0}s infinite`,
      }}
    />
  );
}

/* ─── Keyframes ─── */
function SplatoonStyles() {
  return (
    <style jsx global>{`
      @keyframes bounceIn {
        0% { transform: scale(0) rotate(-8deg); opacity: 0; }
        50% { transform: scale(1.2) rotate(2deg); }
        100% { transform: scale(1) rotate(0deg); opacity: 1; }
      }
      @keyframes bounceInBig {
        0% { transform: scale(0) rotate(-15deg); opacity: 0; }
        40% { transform: scale(1.3) rotate(5deg); }
        70% { transform: scale(0.9) rotate(-2deg); }
        100% { transform: scale(1) rotate(0deg); opacity: 1; }
      }
      @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px) rotate(-1deg); }
        75% { transform: translateX(5px) rotate(1deg); }
      }
      @keyframes flash {
        0% { opacity: 1; }
        50% { opacity: 0.3; }
        100% { opacity: 1; }
      }
      @keyframes blobFloat {
        0%, 100% { transform: rotate(0deg) scale(1); }
        33% { transform: rotate(5deg) scale(1.05); }
        66% { transform: rotate(-3deg) scale(0.95); }
      }
      @keyframes pulse-glow {
        0%, 100% { box-shadow: 0 0 20px rgba(57,255,20,0.4), 0 8px 0 #1a8a00; }
        50% { box-shadow: 0 0 40px rgba(57,255,20,0.7), 0 8px 0 #1a8a00; }
      }
      @keyframes wobble {
        0%, 100% { transform: rotate(-2deg); }
        50% { transform: rotate(2deg); }
      }
      @keyframes explode {
        0% { transform: scale(0); opacity: 0; }
        60% { transform: scale(1.3); opacity: 1; }
        100% { transform: scale(1); opacity: 1; }
      }
      @keyframes crackIn {
        0% { opacity: 0; transform: scale(0.8); }
        100% { opacity: 1; transform: scale(1); }
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
      @keyframes sparkle {
        0%, 100% { opacity: 0; transform: scale(0) rotate(0deg); }
        50% { opacity: 1; transform: scale(1) rotate(180deg); }
      }
      .splatoon-text {
        font-style: italic;
        -webkit-text-stroke: 2px rgba(0,0,0,0.3);
        text-shadow: 3px 3px 0 rgba(0,0,0,0.3), -1px -1px 0 rgba(255,255,255,0.1);
      }
      .splatoon-text-sm {
        font-style: italic;
        -webkit-text-stroke: 1px rgba(0,0,0,0.2);
        text-shadow: 2px 2px 0 rgba(0,0,0,0.3);
      }
      .splatoon-btn {
        border-radius: 55% 45% 55% 45% / 45% 55% 45% 55%;
        transition: transform 0.15s ease;
      }
      .splatoon-btn:hover {
        transform: scale(1.05) rotate(-1deg);
      }
      .splatoon-btn:active {
        transform: scale(0.92) rotate(1deg);
      }
      .stripe-bg {
        background-image: repeating-linear-gradient(
          -45deg,
          transparent,
          transparent 20px,
          rgba(255,255,255,0.02) 20px,
          rgba(255,255,255,0.02) 40px
        );
      }
      .dot-bg {
        background-image: radial-gradient(rgba(255,255,255,0.04) 1px, transparent 1px);
        background-size: 20px 20px;
      }
    `}</style>
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
            width: '8px', height: '8px',
            background: color,
            borderRadius: '50%',
            top: `${15 + Math.random() * 70}%`,
            left: `${10 + Math.random() * 80}%`,
            animation: `sparkle ${1.5 + Math.random() * 2}s ease-in-out ${Math.random() * 2}s infinite`,
          }}
        />
      ))}
    </>
  );
}

/* ─── Crack overlay for game over ─── */
function CrackOverlay() {
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ animation: 'crackIn 0.3s ease-out' }}>
      <line x1="50%" y1="30%" x2="35%" y2="0%" stroke="rgba(255,255,255,0.15)" strokeWidth="3" />
      <line x1="50%" y1="30%" x2="70%" y2="5%" stroke="rgba(255,255,255,0.12)" strokeWidth="2" />
      <line x1="50%" y1="30%" x2="20%" y2="50%" stroke="rgba(255,255,255,0.1)" strokeWidth="2" />
      <line x1="50%" y1="30%" x2="80%" y2="55%" stroke="rgba(255,255,255,0.08)" strokeWidth="2" />
      <line x1="50%" y1="30%" x2="45%" y2="65%" stroke="rgba(255,255,255,0.1)" strokeWidth="1.5" />
      <line x1="35%" y1="0%" x2="25%" y2="0%" stroke="rgba(255,255,255,0.1)" strokeWidth="2" />
      <line x1="70%" y1="5%" x2="85%" y2="0%" stroke="rgba(255,255,255,0.08)" strokeWidth="1.5" />
      <line x1="20%" y1="50%" x2="0%" y2="60%" stroke="rgba(255,255,255,0.07)" strokeWidth="1.5" />
      <line x1="80%" y1="55%" x2="100%" y2="70%" stroke="rgba(255,255,255,0.07)" strokeWidth="1.5" />
    </svg>
  );
}

export default function ReactionTestPage() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [round, setRound] = useState(0);
  const [results, setResults] = useState<number[]>([]);
  const [currentTime, setCurrentTime] = useState(0);
  const [medianScore, setMedianScore] = useState(0);
  const [rank, setRank] = useState<ReactionRank | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [fouls, setFouls] = useState(0);

  useEffect(() => {
    setIsMobile(isMobileDevice());
  }, []);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const goTimestampRef = useRef(0);
  const animFrameRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  const startRound = useCallback(() => {
    setPhase("waiting");
    const delay = MIN_WAIT + Math.random() * (MAX_WAIT - MIN_WAIT);
    timerRef.current = setTimeout(() => {
      goTimestampRef.current = performance.now();
      setPhase("go");
    }, delay);
  }, []);

  const handleStart = useCallback(() => {
    setResults([]);
    setRound(1);
    setCurrentTime(0);
    setMedianScore(0);
    setRank(null);
    setFouls(0);
    startRound();
  }, [startRound]);

  const handleTap = useCallback(() => {
    if (phase === "waiting") {
      if (timerRef.current) clearTimeout(timerRef.current);
      const newFouls = fouls + 1;
      setFouls(newFouls);
      if (newFouls >= MAX_FOULS) {
        setPhase("gameOver");
      } else {
        setPhase("tooEarly");
      }
      return;
    }

    if (phase === "go") {
      const elapsed = Math.round(performance.now() - goTimestampRef.current);
      setCurrentTime(elapsed);

      const newResults = [...results, elapsed];
      setResults(newResults);

      if (newResults.length >= TOTAL_ROUNDS) {
        const median = getMedian(newResults);
        setMedianScore(median);
        setRank(getRank(median, isMobile));
        setPhase("finalResult");
      } else {
        setPhase("roundResult");
      }
    }
  }, [phase, results, fouls, isMobile]);

  const handleNextRound = useCallback(() => {
    setRound((r) => r + 1);
    setCurrentTime(0);
    startRound();
  }, [startRound]);

  const handleRetryAfterFoul = useCallback(() => {
    startRound();
  }, [startRound]);

  // シェア (emoji in share text is OK)
  const shareUrl =
    typeof window !== "undefined" && rank
      ? `${window.location.origin}/reaction-test?score=${medianScore}&rank=${rank.rank}&title=${encodeURIComponent(rank.title)}`
      : "";

  const shareText = rank
    ? `反射神経テストで${medianScore}msを記録！\nランク: ${rank.rank} ${rank.title} ${rank.emoji}\n#反射神経テスト\n`
    : "";

  const twitterUrl = rank
    ? `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`
    : "";

  const handleNativeShare = useCallback(async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "反射神経テスト",
          text: shareText,
          url: shareUrl,
        });
      } catch {
        // user cancelled
      }
    }
  }, [shareText, shareUrl]);

  // ===== IDLE =====
  if (phase === "idle") {
    return (
      <div className="relative flex flex-col items-center justify-center min-h-screen px-4 text-center overflow-hidden stripe-bg"
        style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)' }}>
        <SplatoonStyles />

        <InkBlob color="#FF3366" size={180} top="-5%" left="-8%" rotate={-15} delay={0} />
        <InkBlob color="#00D4FF" size={140} top="15%" right="-6%" rotate={20} delay={1} />
        <InkBlob color="#39FF14" size={100} bottom="10%" left="5%" rotate={-30} delay={2} />
        <InkBlob color="#FFE600" size={120} bottom="5%" right="-3%" rotate={10} delay={0.5} />
        <Sparkles color="#FFE600" count={5} />

        {/* Lightning icon */}
        <div style={{ animation: 'bounceIn 0.6s ease-out' }} className="mb-4">
          <IconLightning size={100} color="#FFE600" />
        </div>

        {/* Title */}
        <h1 className="splatoon-text text-5xl sm:text-6xl font-black text-white mb-3"
          style={{ transform: 'rotate(-3deg)', animation: 'bounceIn 0.5s ease-out' }}>
          反射神経テスト
        </h1>

        <p className="splatoon-text-sm text-lg text-cyan-300 mb-2"
          style={{ animation: 'slideUp 0.6s ease-out 0.2s both' }}>
          あなたの反射神経は何ミリ秒？
        </p>
        <p className="text-gray-400 mb-6 text-sm max-w-xs leading-relaxed"
          style={{ animation: 'slideUp 0.6s ease-out 0.3s both' }}>
          画面が<span className="text-green-400 font-bold">緑</span>に変わったら、できるだけ早くタップ！
          <br />5回計測して中央値でランク判定
          <br />
          <span className="text-pink-400 font-bold"><IconWarning size={13} color="#FF3366" />フライング3回でゲームオーバー</span>
        </p>

        <div className="text-xs text-gray-300 mb-8 px-4 py-2 font-bold"
          style={{
            background: 'rgba(255,255,255,0.05)',
            borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
            border: '2px solid rgba(255,255,255,0.1)',
            animation: 'slideUp 0.6s ease-out 0.4s both',
          }}>
          <IconDevice mobile={isMobile} /> {isMobile ? "スマホモード" : "PCモード"}
        </div>

        {/* Start button */}
        <button
          onClick={handleStart}
          className="splatoon-btn px-12 py-5 text-white text-2xl font-black tracking-wider"
          style={{
            background: '#39FF14',
            color: '#0a2e00',
            border: '4px solid #1a8a00',
            boxShadow: '0 0 20px rgba(57,255,20,0.4), 0 8px 0 #1a8a00',
            animation: 'pulse-glow 2s ease-in-out infinite, slideUp 0.6s ease-out 0.5s both',
            WebkitTextStroke: '1px rgba(0,0,0,0.1)',
          }}
        >
          スタート！
        </button>

        <Link href="/"
          className="mt-8 text-gray-500 hover:text-cyan-400 text-sm transition-colors font-bold"
          style={{ animation: 'slideUp 0.6s ease-out 0.6s both' }}>
          ← トップへ
        </Link>
      </div>
    );
  }

  // ===== WAITING (赤) =====
  if (phase === "waiting") {
    return (
      <div
        onPointerDown={handleTap}
        className="relative flex flex-col items-center justify-center min-h-screen cursor-pointer select-none overflow-hidden dot-bg"
        style={{
          background: 'linear-gradient(135deg, #FF3366 0%, #cc1144 100%)',
          touchAction: 'manipulation',
        }}
      >
        <SplatoonStyles />

        <InkBlob color="#ff0044" size={200} top="-5%" left="-10%" rotate={-20} />
        <InkBlob color="#ff6699" size={150} bottom="5%" right="-5%" rotate={15} delay={1} />
        <InkBlob color="#cc0033" size={100} top="50%" left="-8%" rotate={45} delay={2} />

        <div className="text-white/50 text-sm mb-3 font-bold splatoon-text-sm"
          style={{ animation: 'slideUp 0.3s ease-out' }}>
          {round} / {TOTAL_ROUNDS}
        </div>

        <div className="splatoon-text text-5xl sm:text-6xl font-black text-white"
          style={{ animation: 'wobble 1.5s ease-in-out infinite' }}>
          待って...
        </div>

        <div className="text-white/60 text-base mt-5 font-bold splatoon-text-sm">
          緑に変わったらタップ！
        </div>

        {fouls > 0 && (
          <div className="mt-8 px-5 py-2 font-black text-sm"
            style={{
              background: 'rgba(0,0,0,0.3)',
              borderRadius: '55% 45% 50% 50% / 50% 50% 50% 50%',
              color: '#FFE600',
              border: '2px solid rgba(255,230,0,0.3)',
              animation: 'shake 0.5s ease-in-out',
            }}>
            <IconWarning size={13} color="#FFE600" /> フライング {fouls}/{MAX_FOULS}
          </div>
        )}
      </div>
    );
  }

  // ===== TOO EARLY =====
  if (phase === "tooEarly") {
    return (
      <div
        onPointerDown={handleRetryAfterFoul}
        className="relative flex flex-col items-center justify-center min-h-screen cursor-pointer select-none overflow-hidden stripe-bg"
        style={{
          background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
          touchAction: 'manipulation',
        }}
      >
        <SplatoonStyles />

        <InkBlob color="#FF3366" size={160} top="5%" right="-5%" rotate={25} />
        <InkBlob color="#FF6B35" size={120} bottom="10%" left="-3%" rotate={-20} delay={1} />

        <div className="mb-4" style={{ animation: 'bounceIn 0.4s ease-out' }}>
          <IconFoul size={80} color="#FF3366" />
        </div>
        <div className="splatoon-text text-4xl font-black mb-3"
          style={{ color: '#FF3366', animation: 'shake 0.5s ease-in-out' }}>
          早すぎ！
        </div>
        <div className="font-black text-base mb-2 px-5 py-2"
          style={{
            color: '#FFE600',
            background: 'rgba(255,230,0,0.1)',
            borderRadius: '55% 45% 50% 50% / 50% 50% 50% 50%',
            border: '2px solid rgba(255,230,0,0.2)',
          }}>
          <IconWarning size={14} color="#FFE600" /> フライング {fouls}/{MAX_FOULS}
        </div>
        <div className="text-gray-400 text-sm mt-4 font-bold splatoon-text-sm">
          タップしてもう一度（{round} / {TOTAL_ROUNDS}）
        </div>
      </div>
    );
  }

  // ===== GAME OVER =====
  if (phase === "gameOver") {
    return (
      <div
        className="relative flex flex-col items-center justify-center min-h-screen px-4 text-center overflow-hidden stripe-bg"
        style={{ background: 'linear-gradient(135deg, #0a0a15 0%, #1a1a2e 100%)' }}
      >
        <SplatoonStyles />
        <CrackOverlay />

        <InkBlob color="#FF3366" size={200} top="-5%" left="-10%" rotate={-10} />
        <InkBlob color="#ff0044" size={150} bottom="0%" right="-5%" rotate={20} delay={1} />

        {/* Skull */}
        <div className="mb-4" style={{ animation: 'bounceInBig 0.6s ease-out' }}>
          <IconSkull size={100} color="#FF3366" />
        </div>

        <div className="splatoon-text text-4xl sm:text-5xl font-black mb-3"
          style={{ color: '#FF3366', animation: 'shake 0.6s ease-in-out 0.3s both' }}>
          ゲームオーバー
        </div>
        <div className="text-gray-400 text-sm mb-10 font-bold">
          フライング{MAX_FOULS}回で失格！<br />落ち着いて待とう
        </div>

        <button
          onClick={handleStart}
          className="splatoon-btn px-10 py-4 text-xl font-black"
          style={{
            background: '#39FF14',
            color: '#0a2e00',
            border: '4px solid #1a8a00',
            boxShadow: '0 0 15px rgba(57,255,20,0.3), 0 6px 0 #1a8a00',
            animation: 'slideUp 0.5s ease-out 0.5s both',
          }}
        >
          もう一回
        </button>
        <Link href="/"
          className="mt-6 text-gray-500 hover:text-cyan-400 text-sm transition-colors font-bold"
          style={{ animation: 'slideUp 0.5s ease-out 0.6s both' }}>
          ← トップへ
        </Link>
      </div>
    );
  }

  // ===== GO (緑) =====
  if (phase === "go") {
    return (
      <div
        onPointerDown={handleTap}
        className="relative flex flex-col items-center justify-center min-h-screen cursor-pointer select-none overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #39FF14 0%, #20cc00 100%)',
          touchAction: 'manipulation',
          animation: 'flash 0.3s ease-out',
        }}
      >
        <SplatoonStyles />

        <InkBlob color="#00ff00" size={200} top="-8%" right="-10%" rotate={30} />
        <InkBlob color="#66ff33" size={140} bottom="5%" left="-5%" rotate={-15} delay={0.5} />

        <div className="text-green-900/50 text-sm mb-3 font-bold splatoon-text-sm">
          {round} / {TOTAL_ROUNDS}
        </div>

        <div className="splatoon-text text-7xl sm:text-8xl font-black"
          style={{
            color: '#ffffff',
            textShadow: '4px 4px 0 rgba(0,80,0,0.4), -2px -2px 0 rgba(255,255,255,0.3)',
            animation: 'explode 0.3s ease-out',
          }}>
          タップ！
        </div>
      </div>
    );
  }

  // ===== ROUND RESULT =====
  if (phase === "roundResult") {
    const isGood = currentTime < 250;
    return (
      <div
        onPointerDown={handleNextRound}
        className="relative flex flex-col items-center justify-center min-h-screen cursor-pointer select-none overflow-hidden dot-bg"
        style={{
          background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
          touchAction: 'manipulation',
        }}
      >
        <SplatoonStyles />

        <InkBlob color="#00D4FF" size={140} top="5%" left="-5%" rotate={-10} />
        <InkBlob color="#39FF14" size={100} bottom="15%" right="-3%" rotate={25} delay={1} />
        {isGood && <Sparkles color="#FFE600" count={8} />}

        <div className="text-gray-400 text-sm mb-3 font-bold splatoon-text-sm"
          style={{ animation: 'slideUp 0.3s ease-out' }}>
          {round} / {TOTAL_ROUNDS}
        </div>

        <div className="splatoon-text text-7xl sm:text-8xl font-black mb-2"
          style={{
            color: isGood ? '#39FF14' : '#00D4FF',
            animation: 'bounceInBig 0.5s ease-out',
          }}>
          {currentTime}
          <span className="text-3xl ml-1" style={{ opacity: 0.7 }}>ms</span>
        </div>

        {/* Round chips */}
        <div className="flex gap-2 mt-6 mb-6 flex-wrap justify-center">
          {results.map((r, i) => {
            const chipColors = ['#FF3366', '#00D4FF', '#FFE600', '#39FF14', '#FF6B35'];
            return (
              <div
                key={i}
                className="px-4 py-1.5 font-black text-xs"
                style={{
                  background: `${chipColors[i % chipColors.length]}22`,
                  border: `2px solid ${chipColors[i % chipColors.length]}44`,
                  borderRadius: '55% 45% 55% 45% / 45% 55% 45% 55%',
                  color: chipColors[i % chipColors.length],
                  animation: `slideUp 0.3s ease-out ${i * 0.1}s both`,
                }}
              >
                {r}ms
              </div>
            );
          })}
        </div>

        <div className="text-gray-500 text-sm font-bold splatoon-text-sm"
          style={{ animation: 'slideUp 0.5s ease-out 0.3s both' }}>
          タップして次へ →
        </div>
      </div>
    );
  }

  // ===== FINAL RESULT =====
  if (phase === "finalResult" && rank) {
    return (
      <div
        className="relative flex flex-col items-center justify-center min-h-screen px-4 py-8 overflow-hidden stripe-bg"
        style={{
          background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
          touchAction: 'manipulation',
        }}
      >
        <SplatoonStyles />

        {/* Background splashes in rank color */}
        <InkBlob color={rank.color} size={250} top="-8%" left="-15%" rotate={-15} />
        <InkBlob color={rank.color} size={200} bottom="-5%" right="-10%" rotate={20} delay={0.5} />
        <InkBlob color="#00D4FF" size={120} top="40%" left="-8%" rotate={45} delay={1} />
        <Sparkles color={rank.color} count={10} />

        <div className="flex items-center gap-2 text-sm text-gray-300 mb-4 font-bold splatoon-text-sm"
          style={{ animation: 'slideUp 0.4s ease-out' }}>
          <span>結果発表</span>
          <span className="px-3 py-1 text-xs font-black"
            style={{
              background: 'rgba(255,255,255,0.08)',
              borderRadius: '55% 45% 50% 50% / 50% 50% 50% 50%',
              border: '2px solid rgba(255,255,255,0.1)',
            }}>
            <IconDevice mobile={isMobile} /> {isMobile ? "スマホ" : "PC"}モード
          </span>
        </div>

        {/* Rank SVG icon */}
        <div className="mb-2"
          style={{
            animation: 'rankReveal 0.7s ease-out',
            filter: `drop-shadow(0 0 25px ${rank.color}80)`,
          }}>
          <RankIcon rankLetter={rank.rank} color={rank.color} size={90} />
        </div>

        {/* Rank letter */}
        <div className="splatoon-text text-7xl sm:text-8xl font-black mb-1"
          style={{
            color: rank.color,
            animation: 'rankReveal 0.7s ease-out 0.1s both',
            textShadow: `4px 4px 0 rgba(0,0,0,0.4), 0 0 30px ${rank.color}60`,
            transform: 'rotate(-3deg)',
          }}>
          {rank.rank}
        </div>

        <div className="splatoon-text-sm text-2xl font-black text-white mb-1"
          style={{ animation: 'slideUp 0.5s ease-out 0.3s both' }}>
          {rank.title}
        </div>
        <div className="text-gray-400 text-sm mb-6 font-bold"
          style={{ animation: 'slideUp 0.5s ease-out 0.4s both' }}>
          {rank.description}
        </div>

        {/* Median score box */}
        <div className="relative px-10 py-5 mb-4 text-center"
          style={{
            background: 'rgba(255,255,255,0.05)',
            border: `3px solid ${rank.color}44`,
            borderRadius: '55% 45% 55% 45% / 45% 55% 45% 55%',
            boxShadow: `0 0 20px ${rank.color}20, inset 0 0 30px rgba(0,0,0,0.2)`,
            animation: 'bounceIn 0.5s ease-out 0.5s both',
          }}>
          <div className="text-gray-400 text-xs mb-1 font-bold">中央値</div>
          <div className="splatoon-text text-6xl font-black" style={{ color: rank.color }}>
            {medianScore}
            <span className="text-xl ml-1" style={{ opacity: 0.6 }}>ms</span>
          </div>
        </div>

        {/* Fouls */}
        {fouls > 0 && (
          <div className="text-xs mb-4 font-black px-4 py-1"
            style={{
              color: '#FFE600',
              background: 'rgba(255,230,0,0.1)',
              borderRadius: '50%/60%',
              border: '2px solid rgba(255,230,0,0.2)',
              animation: 'slideUp 0.4s ease-out 0.6s both',
            }}>
            <IconWarning size={12} color="#FFE600" /> フライング {fouls}回
          </div>
        )}

        {/* Round results */}
        <div className="flex gap-2 flex-wrap justify-center mb-8">
          {results.map((r, i) => {
            const chipColors = ['#FF3366', '#00D4FF', '#FFE600', '#39FF14', '#FF6B35'];
            return (
              <div
                key={i}
                className="flex flex-col items-center px-4 py-2"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: `2px solid ${chipColors[i % chipColors.length]}33`,
                  borderRadius: '45% 55% 50% 50% / 50% 45% 55% 50%',
                  animation: `slideUp 0.3s ease-out ${0.6 + i * 0.1}s both`,
                }}
              >
                <div className="text-[10px] font-bold" style={{ color: chipColors[i % chipColors.length] }}>#{i + 1}</div>
                <div className="text-white font-black text-sm">{r}ms</div>
              </div>
            );
          })}
        </div>

        {/* Share & actions */}
        <div className="flex flex-col gap-3 w-full max-w-xs"
          style={{ animation: 'slideUp 0.5s ease-out 0.8s both' }}>

          {typeof navigator !== "undefined" && typeof navigator.share === "function" && (
            <button
              onClick={handleNativeShare}
              className="splatoon-btn w-full py-4 text-lg font-black"
              style={{
                background: rank.color,
                color: '#000',
                border: '3px solid rgba(0,0,0,0.2)',
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
              className="splatoon-btn flex-1 py-3 text-white font-black text-center text-sm"
              style={{
                background: '#000',
                border: '3px solid #333',
                boxShadow: '0 4px 0 #000',
              }}
            >
              𝕏 シェア
            </a>
            <a
              href={`https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(shareUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="splatoon-btn flex-1 py-3 text-white font-black text-center text-sm"
              style={{
                background: '#06C755',
                border: '3px solid #04a043',
                boxShadow: '0 4px 0 #04a043',
              }}
            >
              LINE
            </a>
          </div>

          <button
            onClick={handleStart}
            className="splatoon-btn w-full py-3 font-black mt-2"
            style={{
              background: 'rgba(255,255,255,0.08)',
              color: '#fff',
              border: '3px solid rgba(255,255,255,0.15)',
              boxShadow: '0 4px 0 rgba(0,0,0,0.3)',
            }}
          >
            もう一回
          </button>
          <Link href="/"
            className="text-center text-gray-500 hover:text-cyan-400 text-sm mt-2 transition-colors font-bold">
            ← トップへ
          </Link>
        </div>
      </div>
    );
  }

  return null;
}
