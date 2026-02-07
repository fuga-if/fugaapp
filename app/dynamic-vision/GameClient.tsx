"use client";

import { useState, useRef, useCallback, useEffect, useMemo } from "react";
import { getRank, type DynamicVisionRank } from "@/lib/dynamic-vision/ranks";
import Link from "next/link";

/* ═══════════════════════════════════════
   Constants
   ═══════════════════════════════════════ */
const MAX_LIVES = 3;

type Phase = "idle" | "showing" | "choosing" | "feedback" | "result";
type Direction = "left-right" | "right-left" | "top-bottom";

interface BallConfig {
  number: number;
  color: string;
  size: number;
  direction: Direction;
  duration: number; // ms
  yPosition: number; // % from top
  isTarget?: boolean;
  delay: number; // ms
}

/* ═══════════════════════════════════════
   Level Config
   ═══════════════════════════════════════ */
function getLevelConfig(level: number): {
  duration: number;
  ballSize: number;
  fontSize: number;
  dummyCount: number;
  multiColor: boolean;
  choiceCount: number;
} {
  if (level <= 3) {
    return { duration: 2000 - (level - 1) * 200, ballSize: 72, fontSize: 36, dummyCount: 0, multiColor: false, choiceCount: 3 };
  }
  if (level <= 6) {
    return { duration: 1200 - (level - 4) * 100, ballSize: 60, fontSize: 28, dummyCount: 0, multiColor: false, choiceCount: 3 };
  }
  if (level <= 10) {
    return { duration: 800 - (level - 7) * 50, ballSize: 48, fontSize: 22, dummyCount: 0, multiColor: false, choiceCount: 4 };
  }
  if (level <= 15) {
    return { duration: 600 - (level - 11) * 20, ballSize: 44, fontSize: 20, dummyCount: Math.min(level - 10, 4), multiColor: false, choiceCount: 4 };
  }
  // 16+
  return { duration: Math.max(300, 500 - (level - 16) * 15), ballSize: 40, fontSize: 18, dummyCount: Math.min(level - 12, 6), multiColor: true, choiceCount: 4 };
}

const TARGET_COLORS = ["#EF4444", "#3B82F6", "#22C55E", "#F59E0B", "#A855F7"];
const TARGET_COLOR_NAMES: Record<string, string> = {
  "#EF4444": "赤",
  "#3B82F6": "青",
  "#22C55E": "緑",
  "#F59E0B": "黄",
  "#A855F7": "紫",
};

function randomDirection(): Direction {
  const dirs: Direction[] = ["left-right", "right-left", "top-bottom"];
  return dirs[Math.floor(Math.random() * dirs.length)];
}

function generateChoices(correct: number, count: number): number[] {
  const choices = new Set<number>([correct]);
  while (choices.size < count) {
    const n = Math.floor(Math.random() * 9) + 1;
    choices.add(n);
  }
  return Array.from(choices).sort(() => Math.random() - 0.5);
}

/* ═══════════════════════════════════════
   Styles
   ═══════════════════════════════════════ */
function GameStyles() {
  return (
    <style jsx global>{`
      @keyframes moveLeftRight {
        0% { transform: translate(-120%, -50%); }
        100% { transform: translate(calc(100vw + 20%), -50%); }
      }
      @keyframes moveRightLeft {
        0% { transform: translate(calc(100vw + 20%), -50%); }
        100% { transform: translate(-120%, -50%); }
      }
      @keyframes moveTopBottom {
        0% { transform: translate(-50%, -120%); }
        100% { transform: translate(-50%, calc(100vh + 20%)); }
      }
      @keyframes bounceIn {
        0% { transform: scale(0); opacity: 0; }
        50% { transform: scale(1.15); }
        100% { transform: scale(1); opacity: 1; }
      }
      @keyframes slideUp {
        0% { transform: translateY(24px); opacity: 0; }
        100% { transform: translateY(0); opacity: 1; }
      }
      @keyframes shakeX {
        0%, 100% { transform: translateX(0); }
        20% { transform: translateX(-6px); }
        40% { transform: translateX(6px); }
        60% { transform: translateX(-4px); }
        80% { transform: translateX(4px); }
      }
      @keyframes pulse-glow-green {
        0%, 100% { box-shadow: 0 0 16px rgba(34,197,94,0.4), 0 6px 0 #166534; }
        50% { box-shadow: 0 0 32px rgba(34,197,94,0.7), 0 6px 0 #166534; }
      }
      @keyframes fadeIn {
        0% { opacity: 0; }
        100% { opacity: 1; }
      }
      @keyframes scoreboardFlicker {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.85; }
      }
      @keyframes rankReveal {
        0% { transform: scale(0) rotate(-20deg); opacity: 0; }
        60% { transform: scale(1.3) rotate(5deg); }
        80% { transform: scale(0.9) rotate(-2deg); }
        100% { transform: scale(1) rotate(0deg); opacity: 1; }
      }
      @keyframes fieldStripe {
        0% { background-position: 0 0; }
        100% { background-position: 40px 0; }
      }
      .field-bg {
        background-color: #111827;
        background-image:
          repeating-linear-gradient(
            90deg,
            transparent,
            transparent 38px,
            rgba(34,197,94,0.04) 38px,
            rgba(34,197,94,0.04) 40px
          );
      }
      .scoreboard {
        background: #0a0f1a;
        border: 2px solid #22c55e44;
        box-shadow: 0 0 20px rgba(34,197,94,0.15), inset 0 0 30px rgba(0,0,0,0.5);
        font-variant-numeric: tabular-nums;
      }
      .scoreboard-text {
        font-family: 'Courier New', 'Consolas', monospace;
        letter-spacing: 2px;
        text-shadow: 0 0 8px currentColor;
      }
      .sport-text {
        font-weight: 900;
        letter-spacing: 1px;
        text-shadow: 2px 2px 0 rgba(0,0,0,0.4);
      }
    `}</style>
  );
}

/* ═══════════════════════════════════════
   SVG Icons (no emoji!)
   ═══════════════════════════════════════ */
function IconBall({ size = 48, number, fontSize = 24, bgColor = "#ffffff", textColor = "#111827" }: {
  size?: number; number: number; fontSize?: number; bgColor?: string; textColor?: string;
}) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      <defs>
        <radialGradient id={`bg-${number}-${bgColor.replace('#','')}`} cx="35%" cy="35%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.3)" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
      </defs>
      <circle cx="50" cy="50" r="46" fill={bgColor} stroke="rgba(0,0,0,0.2)" strokeWidth="3" />
      <circle cx="50" cy="50" r="46" fill={`url(#bg-${number}-${bgColor.replace('#','')})`} />
      <text x="50" y="54" textAnchor="middle" dominantBaseline="middle"
        fontFamily="Arial Black, Impact, sans-serif" fontWeight="900"
        fontSize={fontSize} fill={textColor}>
        {number}
      </text>
    </svg>
  );
}

function IconLife({ filled }: { filled: boolean }) {
  return (
    <svg width="28" height="28" viewBox="0 0 100 100">
      <circle cx="50" cy="50" r="40" fill={filled ? "#22c55e" : "#374151"} stroke={filled ? "#16a34a" : "#4b5563"} strokeWidth="4" />
      {filled && (
        <circle cx="38" cy="38" r="10" fill="rgba(255,255,255,0.25)" />
      )}
    </svg>
  );
}

function IconCheck({ size = 60, color = "#22c55e" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ filter: `drop-shadow(0 0 10px ${color}80)` }}>
      <circle cx="50" cy="50" r="45" fill={color} />
      <polyline points="28,52 44,68 72,36" fill="none" stroke="#fff" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconX({ size = 60, color = "#ef4444" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ filter: `drop-shadow(0 0 10px ${color}80)` }}>
      <circle cx="50" cy="50" r="45" fill={color} />
      <line x1="32" y1="32" x2="68" y2="68" stroke="#fff" strokeWidth="8" strokeLinecap="round" />
      <line x1="68" y1="32" x2="32" y2="68" stroke="#fff" strokeWidth="8" strokeLinecap="round" />
    </svg>
  );
}

function IconEye({ size = 80, color = "#22c55e" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ filter: `drop-shadow(0 0 12px ${color}60)` }}>
      <path d="M10 50 C10 50 30 20 50 20 C70 20 90 50 90 50 C90 50 70 80 50 80 C30 80 10 50 10 50Z"
        fill="none" stroke={color} strokeWidth="4" />
      <circle cx="50" cy="50" r="16" fill={color} />
      <circle cx="50" cy="50" r="8" fill="#111827" />
      <circle cx="44" cy="44" r="4" fill="rgba(255,255,255,0.5)" />
    </svg>
  );
}

function RankIcon({ rankLetter, color, size = 80 }: { rankLetter: string; color: string; size?: number }) {
  switch (rankLetter) {
    case "S": return <IconEye size={size} color={color} />;
    case "A":
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" style={{ filter: `drop-shadow(0 0 12px ${color}60)` }}>
          <path d="M50 10 L90 85 L10 85 Z" fill="none" stroke={color} strokeWidth="4" />
          <circle cx="50" cy="55" r="12" fill={color} />
          <circle cx="50" cy="55" r="6" fill="#111827" />
        </svg>
      );
    case "B":
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" style={{ filter: `drop-shadow(0 0 10px ${color}60)` }}>
          <circle cx="50" cy="50" r="35" fill="none" stroke={color} strokeWidth="4" />
          <circle cx="50" cy="50" r="20" fill="none" stroke={color} strokeWidth="3" opacity="0.6" />
          <circle cx="50" cy="50" r="6" fill={color} />
        </svg>
      );
    default:
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" style={{ filter: `drop-shadow(0 0 8px ${color}40)` }}>
          <circle cx="50" cy="50" r="35" fill="none" stroke={color} strokeWidth="4" opacity="0.6" />
          <circle cx="50" cy="50" r="8" fill={color} opacity="0.8" />
        </svg>
      );
  }
}

/* ═══════════════════════════════════════
   Main Game Component
   ═══════════════════════════════════════ */
export default function GameClient() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [level, setLevel] = useState(1);
  const [lives, setLives] = useState(MAX_LIVES);
  const [rank, setRank] = useState<DynamicVisionRank | null>(null);

  // Round state
  const [balls, setBalls] = useState<BallConfig[]>([]);
  const [targetNumber, setTargetNumber] = useState(0);
  const [targetColor, setTargetColor] = useState("");
  const [choices, setChoices] = useState<number[]>([]);
  const [questionText, setQuestionText] = useState("");
  const [feedbackCorrect, setFeedbackCorrect] = useState(false);
  const [animationDone, setAnimationDone] = useState(false);

  const arenaRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  /* ─── Start Game ─── */
  const handleStart = useCallback(() => {
    setLevel(1);
    setLives(MAX_LIVES);
    setRank(null);
    startRound(1);
  }, []);

  /* ─── Start Round ─── */
  const startRound = useCallback((lvl: number) => {
    const config = getLevelConfig(lvl);
    const answer = Math.floor(Math.random() * 9) + 1;
    const dir = randomDirection();

    // Target ball
    const yPos = 20 + Math.random() * 60;
    let tColor = "#ffffff";
    let tTextColor = "#111827";
    let question = "今の数字は？";

    if (config.multiColor) {
      const colorIdx = Math.floor(Math.random() * TARGET_COLORS.length);
      tColor = TARGET_COLORS[colorIdx];
      tTextColor = "#ffffff";
      question = `${TARGET_COLOR_NAMES[tColor]}い数字は？`;
    }

    const mainBall: BallConfig = {
      number: answer,
      color: tColor,
      size: config.ballSize,
      direction: dir,
      duration: config.duration,
      yPosition: yPos,
      isTarget: true,
      delay: 0,
    };

    // Dummy balls
    const dummies: BallConfig[] = [];
    for (let i = 0; i < config.dummyCount; i++) {
      let dummyNum = Math.floor(Math.random() * 9) + 1;
      // In multiColor mode, dummies get different colors
      let dummyColor = "#ffffff";
      let dummyTextColor = "#111827";
      if (config.multiColor) {
        const availableColors = TARGET_COLORS.filter(c => c !== tColor);
        dummyColor = availableColors[Math.floor(Math.random() * availableColors.length)];
        dummyTextColor = "#ffffff";
      }
      // Avoid same number in dummies for multiColor
      if (config.multiColor && dummyNum === answer) {
        dummyNum = (answer % 9) + 1;
      }

      dummies.push({
        number: dummyNum,
        color: dummyColor,
        size: config.ballSize - 4 + Math.floor(Math.random() * 8),
        direction: randomDirection(),
        duration: config.duration + Math.floor(Math.random() * 300) - 150,
        yPosition: 15 + Math.random() * 70,
        isTarget: false,
        delay: Math.floor(Math.random() * 200),
      });
    }

    const allBalls = [mainBall, ...dummies].sort(() => Math.random() - 0.5);

    setTargetNumber(answer);
    setTargetColor(tColor);
    setQuestionText(question);
    setChoices(generateChoices(answer, config.choiceCount));
    setBalls(allBalls);
    setAnimationDone(false);
    setPhase("showing");

    // Wait for animation to finish, then show choices
    const maxDuration = Math.max(...allBalls.map(b => b.duration + b.delay));
    timerRef.current = setTimeout(() => {
      setAnimationDone(true);
      setPhase("choosing");
    }, maxDuration + 100);
  }, []);

  /* ─── Handle Choice ─── */
  const handleChoice = useCallback((chosen: number) => {
    if (phase !== "choosing") return;

    const correct = chosen === targetNumber;
    setFeedbackCorrect(correct);
    setPhase("feedback");

    if (correct) {
      const nextLevel = level + 1;
      timerRef.current = setTimeout(() => {
        setLevel(nextLevel);
        startRound(nextLevel);
      }, 800);
    } else {
      const newLives = lives - 1;
      setLives(newLives);
      if (newLives <= 0) {
        timerRef.current = setTimeout(() => {
          setRank(getRank(level));
          setPhase("result");
        }, 1000);
      } else {
        timerRef.current = setTimeout(() => {
          startRound(level);
        }, 1000);
      }
    }
  }, [phase, targetNumber, level, lives, startRound]);

  /* ─── Share ─── */
  const shareUrl = useMemo(() => {
    if (typeof window === "undefined" || !rank) return "";
    return `${window.location.origin}/dynamic-vision?level=${level}&rank=${rank.rank}&title=${encodeURIComponent(rank.title)}`;
  }, [rank, level]);

  const shareText = rank
    ? `動体視力テストでレベル${level}を達成！\nランク: ${rank.rank} ${rank.title}\n#動体視力テスト\n`
    : "";

  const twitterUrl = rank
    ? `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`
    : "";

  const handleNativeShare = useCallback(async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: "動体視力テスト", text: shareText, url: shareUrl });
      } catch { /* cancelled */ }
    }
  }, [shareText, shareUrl]);

  /* ═══════════════════════════════════════
     IDLE Screen
     ═══════════════════════════════════════ */
  if (phase === "idle") {
    return (
      <div className="relative flex flex-col items-center justify-center min-h-screen px-4 text-center overflow-hidden field-bg"
        style={{ touchAction: "manipulation" }}>
        <GameStyles />

        {/* Decorative field lines */}
        <div className="absolute inset-0 pointer-events-none" style={{ opacity: 0.06 }}>
          <div className="absolute top-1/2 left-0 right-0 h-px bg-green-500" />
          <div className="absolute top-0 bottom-0 left-1/2 w-px bg-green-500" />
          <div className="absolute top-1/2 left-1/2 w-32 h-32 -translate-x-1/2 -translate-y-1/2 border border-green-500 rounded-full" />
        </div>

        <div className="mb-6" style={{ animation: "bounceIn 0.5s ease-out" }}>
          <IconEye size={90} color="#22c55e" />
        </div>

        <h1 className="sport-text text-4xl sm:text-5xl text-white mb-3"
          style={{ animation: "bounceIn 0.5s ease-out 0.1s both" }}>
          動体視力テスト
        </h1>

        <p className="text-green-400 font-bold text-lg mb-2"
          style={{ animation: "slideUp 0.5s ease-out 0.2s both" }}>
          高速で動くボールの数字を見極めろ！
        </p>

        <div className="text-gray-400 text-sm max-w-xs leading-relaxed mb-8"
          style={{ animation: "slideUp 0.5s ease-out 0.3s both" }}>
          画面を横切るボールに書かれた数字を当てよう。
          <br />レベルが上がるほど速く、難しくなる！
          <br /><span className="text-red-400 font-bold">3回ミスでゲームオーバー</span>
        </div>

        {/* Level preview */}
        <div className="scoreboard rounded-lg px-6 py-3 mb-8"
          style={{ animation: "slideUp 0.5s ease-out 0.4s both" }}>
          <div className="scoreboard-text text-green-400 text-xs mb-1">LEVEL PREVIEW</div>
          <div className="flex gap-4 text-xs text-gray-400">
            <span>Lv1-3: 遅い</span>
            <span>Lv7+: 速い</span>
            <span>Lv16+: 超速</span>
          </div>
        </div>

        <button
          onClick={handleStart}
          className="px-12 py-4 text-xl font-black text-gray-900 rounded-lg"
          style={{
            background: "#22c55e",
            border: "3px solid #166534",
            boxShadow: "0 0 16px rgba(34,197,94,0.4), 0 6px 0 #166534",
            animation: "pulse-glow-green 2s ease-in-out infinite, slideUp 0.5s ease-out 0.5s both",
            letterSpacing: "2px",
          }}
        >
          START
        </button>

        <Link href="/"
          className="mt-8 text-gray-500 hover:text-green-400 text-sm transition-colors font-bold"
          style={{ animation: "slideUp 0.5s ease-out 0.6s both" }}>
          ← トップへ
        </Link>
      </div>
    );
  }

  /* ═══════════════════════════════════════
     SHOWING & CHOOSING & FEEDBACK
     ═══════════════════════════════════════ */
  if (phase === "showing" || phase === "choosing" || phase === "feedback") {
    const config = getLevelConfig(level);

    return (
      <div className="relative flex flex-col min-h-screen overflow-hidden field-bg"
        style={{ touchAction: "manipulation" }}>
        <GameStyles />

        {/* Top HUD - Scoreboard */}
        <div className="relative z-10 flex items-center justify-between px-4 pt-4 pb-2">
          <div className="scoreboard rounded px-3 py-1.5"
            style={{ animation: "scoreboardFlicker 3s ease-in-out infinite" }}>
            <div className="scoreboard-text text-green-400 text-[10px]">LEVEL</div>
            <div className="scoreboard-text text-green-300 text-xl font-black">{level}</div>
          </div>

          <div className="flex gap-1.5">
            {Array.from({ length: MAX_LIVES }).map((_, i) => (
              <IconLife key={i} filled={i < lives} />
            ))}
          </div>
        </div>

        {/* Arena */}
        <div ref={arenaRef} className="relative flex-1 overflow-hidden">
          {/* Field center circle decoration */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full border border-green-500/10 pointer-events-none" />
          <div className="absolute top-1/2 left-0 right-0 h-px bg-green-500/5 pointer-events-none" />

          {/* Balls */}
          {(phase === "showing") && balls.map((ball, i) => {
            const animName =
              ball.direction === "left-right" ? "moveLeftRight" :
              ball.direction === "right-left" ? "moveRightLeft" : "moveTopBottom";

            const posStyle: React.CSSProperties =
              ball.direction === "top-bottom"
                ? { left: `${ball.yPosition}%`, top: 0 }
                : { left: 0, top: `${ball.yPosition}%` };

            return (
              <div
                key={`ball-${i}-${level}`}
                className="absolute pointer-events-none"
                style={{
                  ...posStyle,
                  animation: `${animName} ${ball.duration}ms linear ${ball.delay}ms forwards`,
                  zIndex: ball.isTarget ? 10 : 5,
                }}
              >
                <IconBall
                  size={ball.size}
                  number={ball.number}
                  fontSize={config.fontSize}
                  bgColor={ball.color}
                  textColor={ball.color === "#ffffff" ? "#111827" : "#ffffff"}
                />
              </div>
            );
          })}

          {/* Question overlay */}
          {phase === "choosing" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center px-6"
              style={{ animation: "fadeIn 0.3s ease-out" }}>

              <div className="scoreboard rounded-lg px-6 py-3 mb-8">
                <div className="scoreboard-text text-green-300 text-xl font-black">
                  {questionText}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 w-full max-w-xs">
                {choices.map((num) => (
                  <button
                    key={num}
                    onClick={() => handleChoice(num)}
                    className="relative py-5 rounded-lg font-black text-3xl text-white transition-transform active:scale-90"
                    style={{
                      background: "rgba(255,255,255,0.08)",
                      border: "2px solid rgba(255,255,255,0.15)",
                      boxShadow: "0 4px 0 rgba(0,0,0,0.3)",
                    }}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Feedback overlay */}
          {phase === "feedback" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center"
              style={{ animation: "fadeIn 0.2s ease-out" }}>
              <div style={{ animation: "bounceIn 0.4s ease-out" }}>
                {feedbackCorrect ? <IconCheck size={80} /> : <IconX size={80} />}
              </div>
              <div className="sport-text text-2xl mt-3"
                style={{
                  color: feedbackCorrect ? "#22c55e" : "#ef4444",
                  animation: feedbackCorrect ? "bounceIn 0.3s ease-out 0.1s both" : "shakeX 0.4s ease-out",
                }}>
                {feedbackCorrect ? "正解！" : `不正解... 答え: ${targetNumber}`}
              </div>
              {!feedbackCorrect && lives > 0 && (
                <div className="text-gray-400 text-sm mt-2 font-bold"
                  style={{ animation: "slideUp 0.3s ease-out 0.2s both" }}>
                  残り {lives - 1} ライフ
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  /* ═══════════════════════════════════════
     RESULT Screen
     ═══════════════════════════════════════ */
  if (phase === "result" && rank) {
    return (
      <div className="relative flex flex-col items-center justify-center min-h-screen px-4 py-8 overflow-hidden field-bg"
        style={{ touchAction: "manipulation" }}>
        <GameStyles />

        {/* Decorative lines */}
        <div className="absolute inset-0 pointer-events-none" style={{ opacity: 0.05 }}>
          <div className="absolute top-1/2 left-0 right-0 h-px bg-green-500" />
          <div className="absolute top-0 bottom-0 left-1/2 w-px bg-green-500" />
        </div>

        <div className="text-gray-400 text-sm font-bold mb-4"
          style={{ animation: "slideUp 0.4s ease-out" }}>
          GAME OVER
        </div>

        {/* Rank Icon */}
        <div className="mb-3" style={{ animation: "rankReveal 0.7s ease-out" }}>
          <RankIcon rankLetter={rank.rank} color={rank.color} size={90} />
        </div>

        {/* Rank Letter */}
        <div className="sport-text text-7xl sm:text-8xl mb-1"
          style={{
            color: rank.color,
            animation: "rankReveal 0.7s ease-out 0.1s both",
            textShadow: `3px 3px 0 rgba(0,0,0,0.4), 0 0 25px ${rank.color}60`,
          }}>
          {rank.rank}
        </div>

        <div className="sport-text text-2xl text-white mb-1"
          style={{ animation: "slideUp 0.5s ease-out 0.3s both" }}>
          {rank.title}
        </div>
        <div className="text-gray-400 text-sm mb-6 text-center max-w-xs"
          style={{ animation: "slideUp 0.5s ease-out 0.4s both" }}>
          {rank.description}
        </div>

        {/* Level Score */}
        <div className="scoreboard rounded-lg px-10 py-5 mb-8 text-center"
          style={{ animation: "bounceIn 0.5s ease-out 0.5s both" }}>
          <div className="scoreboard-text text-green-400/60 text-xs mb-1">REACHED LEVEL</div>
          <div className="scoreboard-text text-green-300 text-5xl font-black">{level}</div>
        </div>

        {/* Share & actions */}
        <div className="flex flex-col gap-3 w-full max-w-xs"
          style={{ animation: "slideUp 0.5s ease-out 0.7s both" }}>

          {typeof navigator !== "undefined" && typeof navigator.share === "function" && (
            <button
              onClick={handleNativeShare}
              className="w-full py-4 text-lg font-black rounded-lg transition-transform active:scale-95"
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
              className="flex-1 py-3 text-white font-black text-center text-sm rounded-lg transition-transform active:scale-95"
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
              className="flex-1 py-3 text-white font-black text-center text-sm rounded-lg transition-transform active:scale-95"
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
            className="w-full py-3 font-black mt-2 rounded-lg transition-transform active:scale-95"
            style={{
              background: "rgba(255,255,255,0.08)",
              color: "#fff",
              border: "3px solid rgba(255,255,255,0.15)",
              boxShadow: "0 4px 0 rgba(0,0,0,0.3)",
            }}
          >
            もう一回
          </button>
          <Link href="/"
            className="text-center text-gray-500 hover:text-green-400 text-sm mt-2 transition-colors font-bold">
            ← トップへ
          </Link>
        </div>
      </div>
    );
  }

  return null;
}
