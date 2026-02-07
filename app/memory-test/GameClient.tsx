"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { getRank, getLevelConfig, type MemoryRank } from "@/lib/memory-test/ranks";
import Link from "next/link";

type Phase = "idle" | "memorize" | "answer" | "levelup" | "result";

/* ═══════════════════════════════════════
   CSS Animations & Styles
   ═══════════════════════════════════════ */
function CyberStyles() {
  return (
    <style jsx global>{`
      @keyframes glitch {
        0% { transform: translate(0); }
        20% { transform: translate(-2px, 1px); }
        40% { transform: translate(2px, -1px); }
        60% { transform: translate(-1px, 2px); }
        80% { transform: translate(1px, -2px); }
        100% { transform: translate(0); }
      }
      @keyframes glitchText {
        0%, 100% { text-shadow: 0 0 10px #00FFCC, 0 0 20px #00FFCC40; clip-path: inset(0 0 0 0); }
        10% { text-shadow: -2px 0 #FF3366, 2px 0 #00FFCC; clip-path: inset(20% 0 60% 0); }
        20% { text-shadow: 2px 0 #FF3366, -2px 0 #00FFCC; clip-path: inset(60% 0 10% 0); }
        30% { text-shadow: 0 0 10px #00FFCC, 0 0 20px #00FFCC40; clip-path: inset(0 0 0 0); }
      }
      @keyframes matrixRain {
        0% { transform: translateY(-100%); opacity: 0; }
        10% { opacity: 1; }
        90% { opacity: 0.3; }
        100% { transform: translateY(100vh); opacity: 0; }
      }
      @keyframes panelGlow {
        0%, 100% { box-shadow: 0 0 8px #00FFCC40, inset 0 0 8px #00FFCC20; }
        50% { box-shadow: 0 0 20px #00FFCC80, inset 0 0 15px #00FFCC40; }
      }
      @keyframes pulseGreen {
        0%, 100% { box-shadow: 0 0 8px #00FF8840; }
        50% { box-shadow: 0 0 20px #00FF8880; }
      }
      @keyframes scanline {
        0% { top: -10%; }
        100% { top: 110%; }
      }
      @keyframes slideUp {
        0% { transform: translateY(20px); opacity: 0; }
        100% { transform: translateY(0); opacity: 1; }
      }
      @keyframes fadeIn {
        0% { opacity: 0; }
        100% { opacity: 1; }
      }
      @keyframes levelUpGlitch {
        0%, 100% { transform: scale(1) translate(0); opacity: 1; }
        15% { transform: scale(1.02) translate(-3px, 1px); }
        30% { transform: scale(0.98) translate(3px, -1px); }
        45% { transform: scale(1.01) translate(-1px, 2px); opacity: 0.8; }
        60% { transform: scale(1) translate(2px, -2px); }
        75% { transform: scale(1.02) translate(-2px, 0); opacity: 1; }
      }
      @keyframes borderPulse {
        0%, 100% { border-color: #00FFCC40; }
        50% { border-color: #00FFCC; }
      }
      @keyframes flicker {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.8; }
        92% { opacity: 1; }
        93% { opacity: 0.3; }
        94% { opacity: 1; }
      }
      @keyframes terminalType {
        from { width: 0; }
        to { width: 100%; }
      }
      @keyframes blink {
        0%, 100% { opacity: 1; }
        50% { opacity: 0; }
      }
      @keyframes errorFlash {
        0% { background: rgba(255, 51, 102, 0.3); }
        100% { background: transparent; }
      }
      @keyframes gridBuild {
        0% { transform: scale(0.8); opacity: 0; }
        100% { transform: scale(1); opacity: 1; }
      }
      .cyber-font {
        font-family: 'Courier New', 'Consolas', monospace;
      }
      .cyber-glow {
        text-shadow: 0 0 10px #00FFCC, 0 0 20px #00FFCC40, 0 0 40px #00FFCC20;
      }
      .cyber-glow-sm {
        text-shadow: 0 0 6px #00FFCC, 0 0 12px #00FFCC30;
      }
      .cyber-glow-green {
        text-shadow: 0 0 10px #00FF88, 0 0 20px #00FF8840;
      }
      .cyber-glow-red {
        text-shadow: 0 0 10px #FF3366, 0 0 20px #FF336640;
      }
      .scanline-overlay::after {
        content: '';
        position: absolute;
        top: 0; left: 0; right: 0;
        height: 2px;
        background: rgba(0, 255, 204, 0.08);
        animation: scanline 4s linear infinite;
        pointer-events: none;
      }
      .matrix-bg {
        background-color: #0a0f1a;
        background-image:
          radial-gradient(ellipse at 50% 0%, rgba(0,255,204,0.03) 0%, transparent 60%),
          radial-gradient(ellipse at 80% 100%, rgba(0,255,136,0.02) 0%, transparent 50%);
      }
    `}</style>
  );
}

/* ═══════════════════════════════════════
   Matrix Rain Background
   ═══════════════════════════════════════ */
function MatrixRain({ intensity = "normal" }: { intensity?: "light" | "normal" | "heavy" }) {
  const count = intensity === "light" ? 8 : intensity === "heavy" ? 20 : 12;
  const chars = "01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン";

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ opacity: intensity === "light" ? 0.15 : 0.25 }}>
      {Array.from({ length: count }).map((_, i) => {
        const left = `${(i / count) * 100 + Math.random() * 5}%`;
        const delay = `${Math.random() * 8}s`;
        const duration = `${6 + Math.random() * 8}s`;
        const charStr = Array.from({ length: 12 + Math.floor(Math.random() * 8) }, () =>
          chars[Math.floor(Math.random() * chars.length)]
        ).join("\n");

        return (
          <div
            key={i}
            className="absolute cyber-font text-xs whitespace-pre leading-tight"
            style={{
              left,
              top: 0,
              color: "#00FFCC",
              opacity: 0.4 + Math.random() * 0.3,
              fontSize: `${9 + Math.random() * 4}px`,
              animation: `matrixRain ${duration} linear ${delay} infinite`,
            }}
          >
            {charStr}
          </div>
        );
      })}
    </div>
  );
}

/* ═══════════════════════════════════════
   SVG Icons (no emoji!)
   ═══════════════════════════════════════ */
function IconBrain({ size = 80, color = "#00FFCC" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ filter: `drop-shadow(0 0 15px ${color}60)` }}>
      <path d="M50 10 C30 10 20 25 20 40 C15 42 10 50 12 58 C10 65 15 75 25 78 C28 85 38 90 50 90 C62 90 72 85 75 78 C85 75 90 65 88 58 C90 50 85 42 80 40 C80 25 70 10 50 10Z"
        fill="none" stroke={color} strokeWidth="2.5" />
      <path d="M50 15 C50 15 50 90 50 90" stroke={color} strokeWidth="1.5" opacity="0.4" />
      <path d="M35 30 C40 35 45 32 50 35" stroke={color} strokeWidth="1.5" fill="none" opacity="0.5" />
      <path d="M65 30 C60 35 55 32 50 35" stroke={color} strokeWidth="1.5" fill="none" opacity="0.5" />
      <path d="M30 50 C35 48 42 52 50 50" stroke={color} strokeWidth="1.5" fill="none" opacity="0.5" />
      <path d="M70 50 C65 48 58 52 50 50" stroke={color} strokeWidth="1.5" fill="none" opacity="0.5" />
      <path d="M35 68 C40 65 45 70 50 68" stroke={color} strokeWidth="1.5" fill="none" opacity="0.5" />
      <path d="M65 68 C60 65 55 70 50 68" stroke={color} strokeWidth="1.5" fill="none" opacity="0.5" />
      <circle cx="35" cy="40" r="3" fill={color} opacity="0.6" />
      <circle cx="65" cy="40" r="3" fill={color} opacity="0.6" />
      <circle cx="30" cy="58" r="2.5" fill={color} opacity="0.5" />
      <circle cx="70" cy="58" r="2.5" fill={color} opacity="0.5" />
    </svg>
  );
}

function IconCheckmark({ size = 14, color = "#00FF88" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function IconCross({ size = 14, color = "#FF3366" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

/* Rank icon per rank letter */
function RankIcon({ rankLetter, color, size = 60 }: { rankLetter: string; color: string; size?: number }) {
  // Circuit-style icons for each rank
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ filter: `drop-shadow(0 0 12px ${color}60)` }}>
      <circle cx="50" cy="50" r="40" fill="none" stroke={color} strokeWidth="2" opacity="0.3" />
      <circle cx="50" cy="50" r="30" fill="none" stroke={color} strokeWidth="1.5" opacity="0.2" />
      {/* Corner nodes */}
      <circle cx="50" cy="10" r="3" fill={color} opacity="0.6" />
      <circle cx="50" cy="90" r="3" fill={color} opacity="0.6" />
      <circle cx="10" cy="50" r="3" fill={color} opacity="0.6" />
      <circle cx="90" cy="50" r="3" fill={color} opacity="0.6" />
      {/* Rank letter */}
      <text x="50" y="58" textAnchor="middle" fontFamily="'Courier New', monospace" fontWeight="900" fontSize="36" fill={color}
        style={{ textShadow: `0 0 10px ${color}` }}>
        {rankLetter}
      </text>
      {/* Circuit lines */}
      <line x1="50" y1="13" x2="50" y2="28" stroke={color} strokeWidth="1" opacity="0.3" />
      <line x1="50" y1="72" x2="50" y2="87" stroke={color} strokeWidth="1" opacity="0.3" />
      <line x1="13" y1="50" x2="28" y2="50" stroke={color} strokeWidth="1" opacity="0.3" />
      <line x1="72" y1="50" x2="87" y2="50" stroke={color} strokeWidth="1" opacity="0.3" />
    </svg>
  );
}

/* ═══════════════════════════════════════
   Terminal Typewriter Text
   ═══════════════════════════════════════ */
function TerminalLine({ text, delay = 0, color = "#00FFCC" }: { text: string; delay?: number; color?: string }) {
  const [displayed, setDisplayed] = useState("");
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    let idx = 0;
    const startTimeout = setTimeout(() => {
      const interval = setInterval(() => {
        if (idx < text.length) {
          setDisplayed(text.slice(0, idx + 1));
          idx++;
        } else {
          clearInterval(interval);
          setTimeout(() => setShowCursor(false), 500);
        }
      }, 40);
      return () => clearInterval(interval);
    }, delay);
    return () => clearTimeout(startTimeout);
  }, [text, delay]);

  return (
    <div className="cyber-font" style={{ color, minHeight: "1.5em" }}>
      {displayed}
      {showCursor && <span style={{ animation: "blink 0.8s step-end infinite" }}>_</span>}
    </div>
  );
}

/* ═══════════════════════════════════════
   Progress Bar (data transfer style)
   ═══════════════════════════════════════ */
function DataProgressBar({ current, total }: { current: number; total: number }) {
  const pct = Math.round((current / total) * 100);
  return (
    <div className="w-full max-w-xs mx-auto">
      <div className="flex justify-between text-xs cyber-font mb-1" style={{ color: "#00FFCC80" }}>
        <span>LOAD</span>
        <span>{pct}%</span>
      </div>
      <div className="w-full h-1.5 rounded-full" style={{ background: "#1e293b", border: "1px solid #334155" }}>
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{
            width: `${pct}%`,
            background: "linear-gradient(90deg, #00FFCC, #00FF88)",
            boxShadow: "0 0 8px #00FFCC60",
          }}
        />
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   Main Game Component
   ═══════════════════════════════════════ */
export default function GameClient() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [level, setLevel] = useState(1);
  const [sequence, setSequence] = useState<number[]>([]);
  const [activePanel, setActivePanel] = useState<number | null>(null);
  const [answerIndex, setAnswerIndex] = useState(0);
  const [correctPanels, setCorrectPanels] = useState<Set<number>>(new Set());
  const [wrongPanel, setWrongPanel] = useState<number | null>(null);
  const [rank, setRank] = useState<MemoryRank | null>(null);
  const [finalLevel, setFinalLevel] = useState(0);
  const [showGlitch, setShowGlitch] = useState(false);
  const [memorizeProgress, setMemorizeProgress] = useState(0);

  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    return () => {
      timersRef.current.forEach(clearTimeout);
    };
  }, []);

  const clearTimers = useCallback(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  }, []);

  const generateSequence = useCallback((gridSize: number, panelCount: number): number[] => {
    const total = gridSize * gridSize;
    const indices: number[] = [];
    while (indices.length < panelCount) {
      const idx = Math.floor(Math.random() * total);
      if (!indices.includes(idx)) {
        indices.push(idx);
      }
    }
    return indices;
  }, []);

  const startMemorizePhase = useCallback(
    (lvl: number) => {
      clearTimers();
      const config = getLevelConfig(lvl);
      const seq = generateSequence(config.gridSize, config.panelCount);
      setSequence(seq);
      setAnswerIndex(0);
      setCorrectPanels(new Set());
      setWrongPanel(null);
      setActivePanel(null);
      setMemorizeProgress(0);
      setPhase("memorize");

      seq.forEach((panelIdx, i) => {
        const onTimer = setTimeout(() => {
          setActivePanel(panelIdx);
          setMemorizeProgress(i + 1);
        }, i * config.displayTime);
        const offTimer = setTimeout(() => {
          setActivePanel(null);
        }, i * config.displayTime + config.displayTime * 0.8);
        timersRef.current.push(onTimer, offTimer);
      });

      const answerTimer = setTimeout(() => {
        setActivePanel(null);
        setPhase("answer");
      }, seq.length * config.displayTime + 200);
      timersRef.current.push(answerTimer);
    },
    [clearTimers, generateSequence]
  );

  const startGame = useCallback(() => {
    setLevel(1);
    setRank(null);
    setFinalLevel(0);
    setShowGlitch(false);
    startMemorizePhase(1);
  }, [startMemorizePhase]);

  const handlePanelTap = useCallback(
    (panelIdx: number) => {
      if (phase !== "answer") return;

      const expectedIdx = sequence[answerIndex];

      if (panelIdx === expectedIdx) {
        const newCorrect = new Set(correctPanels);
        newCorrect.add(panelIdx);
        setCorrectPanels(newCorrect);

        const nextAnswerIndex = answerIndex + 1;
        setAnswerIndex(nextAnswerIndex);

        if (nextAnswerIndex >= sequence.length) {
          const nextLevel = level + 1;
          setLevel(nextLevel);
          setPhase("levelup");

          const timer = setTimeout(() => {
            startMemorizePhase(nextLevel);
          }, 800);
          timersRef.current.push(timer);
        }
      } else {
        setWrongPanel(panelIdx);
        setShowGlitch(true);
        const reachedLevel = level;
        setFinalLevel(reachedLevel);
        setRank(getRank(reachedLevel));
        setPhase("result");
      }
    },
    [phase, sequence, answerIndex, correctPanels, level, startMemorizePhase]
  );

  const config = getLevelConfig(level);
  const gridSize = config.gridSize;
  const totalPanels = gridSize * gridSize;

  // Share
  const shareUrl =
    typeof window !== "undefined" && rank
      ? `${window.location.origin}/memory-test?score=${finalLevel}`
      : "";

  const shareText = rank
    ? `記憶力テストでレベル${finalLevel}に到達！\nランク: ${rank.rank} ${rank.title}\n#記憶力テスト #fugaapp\n`
    : "";

  const twitterUrl = rank
    ? `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`
    : "";

  const handleNativeShare = useCallback(async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: "記憶力テスト", text: shareText, url: shareUrl });
      } catch {
        /* cancelled */
      }
    }
  }, [shareText, shareUrl]);

  // Rank color mapping for cyberpunk
  const getRankColor = (r: MemoryRank) => {
    switch (r.rank) {
      case "S": return "#00FFCC";
      case "A": return "#FF6B35";
      case "B": return "#4ECDC4";
      case "C": return "#45B7D1";
      case "D": return "#96CEB4";
      case "E": return "#A8A8A8";
      default: return "#00FFCC";
    }
  };

  // ===== IDLE =====
  if (phase === "idle") {
    return (
      <div className="relative flex flex-col items-center justify-center min-h-screen px-4 text-center overflow-hidden matrix-bg scanline-overlay">
        <CyberStyles />
        <MatrixRain intensity="normal" />

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: "linear-gradient(rgba(0,255,204,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,204,0.02) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }} />

        {/* Brain icon */}
        <div className="relative z-10 mb-6" style={{ animation: "fadeIn 0.8s ease-out" }}>
          <IconBrain size={100} color="#00FFCC" />
        </div>

        {/* Title */}
        <h1 className="relative z-10 cyber-font cyber-glow text-4xl sm:text-5xl font-black tracking-wider mb-2"
          style={{ color: "#00FFCC", animation: "fadeIn 0.6s ease-out 0.2s both" }}>
          MEMORY.TEST
        </h1>

        <div className="relative z-10 cyber-font text-sm mb-2"
          style={{ color: "#00FFCC80", animation: "fadeIn 0.6s ease-out 0.3s both" }}>
          // NEURAL CAPACITY ANALYZER v2.1
        </div>

        <p className="relative z-10 cyber-font text-sm mb-2"
          style={{ color: "#E0E0E0", animation: "slideUp 0.6s ease-out 0.4s both" }}>
          データノードが順番に起動します
        </p>
        <p className="relative z-10 cyber-font text-xs max-w-xs mb-8"
          style={{ color: "#E0E0E080", animation: "slideUp 0.6s ease-out 0.5s both" }}>
          シーケンスを記憶し、同じ順番で入力せよ
        </p>

        {/* Start button */}
        <button
          onClick={startGame}
          className="relative z-10 cyber-font px-10 py-4 text-lg font-bold tracking-widest transition-all active:scale-95"
          style={{
            background: "transparent",
            color: "#00FFCC",
            border: "2px solid #00FFCC",
            boxShadow: "0 0 15px #00FFCC30, inset 0 0 15px #00FFCC10",
            animation: "borderPulse 2s ease-in-out infinite, slideUp 0.6s ease-out 0.6s both",
          }}
        >
          {"> "}INITIALIZE
        </button>

        <Link href="/"
          className="relative z-10 mt-6 cyber-font text-sm transition-colors"
          style={{ color: "#334155", animation: "slideUp 0.6s ease-out 0.7s both" }}>
          {"<-"} EXIT
        </Link>
      </div>
    );
  }

  // ===== RESULT =====
  if (phase === "result" && rank) {
    const rankColor = getRankColor(rank);

    return (
      <div className={`relative flex flex-col items-center justify-center min-h-screen px-4 py-8 overflow-hidden matrix-bg scanline-overlay ${showGlitch ? "" : ""}`}
        style={{ animation: showGlitch ? "errorFlash 0.5s ease-out" : undefined }}>
        <CyberStyles />
        <MatrixRain intensity="heavy" />

        {/* Grid overlay */}
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: "linear-gradient(rgba(0,255,204,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,204,0.02) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }} />

        {/* Terminal output */}
        <div className="relative z-10 w-full max-w-sm px-4 py-3 mb-6 border rounded"
          style={{
            background: "#0a0f1a",
            borderColor: "#334155",
            animation: "fadeIn 0.5s ease-out",
          }}>
          <div className="text-xs cyber-font mb-2" style={{ color: "#33415580" }}>
            --- ANALYSIS COMPLETE ---
          </div>
          <TerminalLine text={`> MEMORY CAPACITY: LEVEL ${String(finalLevel).padStart(2, "0")}`} delay={200} color={rankColor} />
          <TerminalLine text={`> RANK: ${rank.rank} -- ${rank.title}`} delay={800} color={rankColor} />
          <TerminalLine text={`> ${rank.description}`} delay={1400} color="#E0E0E080" />
        </div>

        {/* Rank icon */}
        <div className="relative z-10 mb-2" style={{ animation: "fadeIn 0.8s ease-out 0.5s both" }}>
          <RankIcon rankLetter={rank.rank} color={rankColor} size={80} />
        </div>

        {/* Score */}
        <div className="relative z-10 mb-6 px-8 py-4 text-center border rounded"
          style={{
            background: "#111827",
            borderColor: `${rankColor}40`,
            boxShadow: `0 0 20px ${rankColor}15`,
            animation: "fadeIn 0.6s ease-out 0.8s both",
          }}>
          <div className="text-xs cyber-font mb-1" style={{ color: "#E0E0E060" }}>LEVEL REACHED</div>
          <div className="cyber-font text-5xl font-bold" style={{ color: rankColor, textShadow: `0 0 15px ${rankColor}60` }}>
            {String(finalLevel).padStart(2, "0")}
          </div>
        </div>

        {/* Missed panel grid preview */}
        <div className="relative z-10 mb-6" style={{ animation: "fadeIn 0.6s ease-out 1s both" }}>
          <div className="text-xs cyber-font mb-2 text-center" style={{ color: "#E0E0E040" }}>
            SEQUENCE MAP
          </div>
          <div
            className="grid gap-1 mx-auto"
            style={{
              gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
              width: `${Math.min(200, gridSize * 36)}px`,
            }}
          >
            {Array.from({ length: totalPanels }).map((_, i) => {
              const seqIdx = sequence.indexOf(i);
              const isInSequence = seqIdx !== -1;
              const isCorrect = correctPanels.has(i);
              const isWrong = wrongPanel === i;
              return (
                <div
                  key={i}
                  className="aspect-square rounded flex items-center justify-center cyber-font text-xs font-bold"
                  style={{
                    background: isWrong
                      ? "#FF336640"
                      : isCorrect
                        ? "#00FF8840"
                        : isInSequence
                          ? "#00FFCC30"
                          : "#1e293b",
                    color: isWrong ? "#FF3366" : isInSequence ? "#00FFCC" : "transparent",
                    border: isWrong
                      ? "1px solid #FF3366"
                      : isCorrect
                        ? "1px solid #00FF88"
                        : isInSequence
                          ? "1px solid #00FFCC60"
                          : "1px solid #334155",
                    boxShadow: isWrong ? "0 0 8px #FF336640" : isCorrect ? "0 0 8px #00FF8840" : "none",
                  }}
                >
                  {isWrong ? <IconCross size={12} color="#FF3366" /> : isInSequence ? seqIdx + 1 : ""}
                </div>
              );
            })}
          </div>
        </div>

        {/* Share & actions */}
        <div className="relative z-10 flex flex-col gap-3 w-full max-w-xs"
          style={{ animation: "slideUp 0.5s ease-out 1.2s both" }}>

          {typeof navigator !== "undefined" && typeof navigator.share === "function" && (
            <button
              onClick={handleNativeShare}
              className="w-full py-4 cyber-font text-base font-bold tracking-wider transition-all active:scale-95"
              style={{
                background: `${rankColor}20`,
                color: rankColor,
                border: `2px solid ${rankColor}`,
                boxShadow: `0 0 15px ${rankColor}30`,
              }}
            >
              {">"} SHARE RESULT
            </button>
          )}

          <div className="flex gap-3">
            <a
              href={twitterUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-3 cyber-font font-bold text-center text-sm tracking-wider transition-all"
              style={{
                background: "#000",
                color: "#E0E0E0",
                border: "1px solid #334155",
              }}
            >
              X POST
            </a>
            <a
              href={`https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(shareUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-3 cyber-font font-bold text-center text-sm tracking-wider transition-all"
              style={{
                background: "#06C75520",
                color: "#06C755",
                border: "1px solid #06C75560",
              }}
            >
              LINE
            </a>
          </div>

          <button
            onClick={startGame}
            className="w-full py-3 cyber-font font-bold tracking-wider transition-all active:scale-95 mt-1"
            style={{
              background: "#1e293b",
              color: "#00FFCC",
              border: "1px solid #334155",
            }}
          >
            {">"} REINITIALIZE
          </button>
          <Link href="/"
            className="text-center cyber-font text-sm mt-1 transition-colors"
            style={{ color: "#334155" }}>
            {"<-"} EXIT
          </Link>
        </div>
      </div>
    );
  }

  // ===== GAME (memorize / answer / levelup) =====
  const statusText =
    phase === "memorize"
      ? `DOWNLOADING... LEVEL:${String(level).padStart(2, "0")}`
      : phase === "answer"
        ? `INPUT SEQUENCE [${answerIndex}/${sequence.length}]`
        : phase === "levelup"
          ? `LEVEL UP`
          : "";

  return (
    <div
      className="relative flex flex-col items-center justify-center min-h-screen px-4 select-none overflow-hidden matrix-bg scanline-overlay"
      style={{
        touchAction: "manipulation",
        WebkitUserSelect: "none",
        userSelect: "none",
      }}
    >
      <CyberStyles />
      <MatrixRain intensity="light" />

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: "linear-gradient(rgba(0,255,204,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,204,0.015) 1px, transparent 1px)",
        backgroundSize: "40px 40px",
      }} />

      {/* Level & status */}
      <div className="relative z-10 mb-4 text-center">
        <div className="cyber-font text-xs mb-1 tracking-widest" style={{ color: "#E0E0E050" }}>
          NODE_GRID v{gridSize}.{gridSize}
        </div>
        <div
          className="cyber-font text-lg sm:text-xl font-bold tracking-wider transition-all"
          style={{
            color:
              phase === "memorize"
                ? "#00FFCC"
                : phase === "levelup"
                  ? "#00FF88"
                  : "#E0E0E0",
            textShadow:
              phase === "memorize"
                ? "0 0 10px #00FFCC60"
                : phase === "levelup"
                  ? "0 0 10px #00FF8860"
                  : "none",
            animation: phase === "levelup" ? "levelUpGlitch 0.6s ease-in-out" : undefined,
          }}
        >
          {statusText}
        </div>
      </div>

      {/* Progress bar during memorize */}
      {phase === "memorize" && (
        <div className="relative z-10 mb-4 w-full max-w-xs" style={{ animation: "fadeIn 0.3s ease-out" }}>
          <DataProgressBar current={memorizeProgress} total={sequence.length} />
        </div>
      )}

      {/* Grid */}
      <div
        className="relative z-10 grid mx-auto"
        style={{
          gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
          gap: "6px",
          width: `min(${gridSize * 72}px, calc(100vw - 48px))`,
          maxWidth: "400px",
          animation: phase === "levelup" ? "gridBuild 0.5s ease-out" : undefined,
        }}
      >
        {Array.from({ length: totalPanels }).map((_, i) => {
          const isActive = activePanel === i;
          const isCorrectlyTapped = correctPanels.has(i);
          const isWrong = wrongPanel === i;

          let bg = "#1e293b";
          let border = "2px solid #334155";
          let shadow = "none";
          let scale = "scale(1)";
          let anim: string | undefined;

          if (isActive) {
            bg = "#00FFCC20";
            border = "2px solid #00FFCC";
            shadow = "0 0 20px #00FFCC60, inset 0 0 10px #00FFCC30";
            scale = "scale(1.03)";
            anim = "panelGlow 0.8s ease-in-out infinite";
          } else if (isCorrectlyTapped) {
            bg = "#00FF8820";
            border = "2px solid #00FF88";
            shadow = "0 0 10px #00FF8840";
          } else if (isWrong) {
            bg = "#FF336630";
            border = "2px solid #FF3366";
            shadow = "0 0 15px #FF336660";
            anim = "glitch 0.3s ease-in-out";
          }

          return (
            <div
              key={i}
              onPointerDown={() => handlePanelTap(i)}
              className="aspect-square rounded-lg cursor-pointer transition-all duration-150 flex items-center justify-center"
              style={{
                background: bg,
                boxShadow: shadow,
                transform: scale,
                border,
                animation: anim,
              }}
            >
              {isCorrectlyTapped && <IconCheckmark size={Math.min(20, 60 / gridSize * 2)} color="#00FF88" />}
              {isWrong && <IconCross size={Math.min(20, 60 / gridSize * 2)} color="#FF3366" />}
            </div>
          );
        })}
      </div>

      {/* Answer progress dots */}
      {phase === "answer" && (
        <div className="relative z-10 mt-6 flex gap-2">
          {sequence.map((_, i) => (
            <div
              key={i}
              className="w-3 h-3 rounded-full transition-all duration-300"
              style={{
                background: i < answerIndex ? "#00FF88" : "#334155",
                boxShadow: i < answerIndex ? "0 0 6px #00FF8860" : "none",
              }}
            />
          ))}
        </div>
      )}

      {/* Level up text */}
      {phase === "levelup" && (
        <div
          className="relative z-10 mt-6 cyber-font text-2xl font-bold tracking-widest cyber-glow-green"
          style={{
            color: "#00FF88",
            animation: "levelUpGlitch 0.6s ease-in-out",
          }}
        >
          {"> "}LEVEL:{String(level).padStart(2, "0")}
        </div>
      )}

      {/* Phase indicator at bottom */}
      <div className="relative z-10 mt-6 cyber-font text-xs tracking-wider" style={{ color: "#33415580" }}>
        {phase === "memorize" && "// OBSERVE AND MEMORIZE"}
        {phase === "answer" && "// TAP IN CORRECT ORDER"}
        {phase === "levelup" && "// LOADING NEXT LEVEL..."}
      </div>
    </div>
  );
}
