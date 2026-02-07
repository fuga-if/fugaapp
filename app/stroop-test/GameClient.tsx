"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { getRank, type StroopRank } from "@/lib/stroop-test/ranks";
import Link from "next/link";

/* ═══════════════════════════════════════
   Constants
   ═══════════════════════════════════════ */

const GAME_DURATION = 30_000; // 30 seconds
const TIMER_TICK = 50; // progress bar update interval

const COLORS = [
  { name: "あか", color: "#EF4444", label: "赤" },
  { name: "あお", color: "#3B82F6", label: "青" },
  { name: "きいろ", color: "#EAB308", label: "黄" },
  { name: "みどり", color: "#22C55E", label: "緑" },
] as const;

type Phase = "idle" | "playing" | "result";

interface Question {
  textName: string;    // displayed text (e.g. "あか")
  displayColor: string; // actual CSS color of the text
  answerIndex: number;  // index in COLORS for correct answer
  shuffledOrder: number[]; // randomized button order
}

/* ═══════════════════════════════════════
   Question Generator
   ═══════════════════════════════════════ */

function generateQuestion(): Question {
  const textIndex = Math.floor(Math.random() * COLORS.length);
  let colorIndex = textIndex;
  // Ensure Stroop effect: display color differs from text meaning
  while (colorIndex === textIndex) {
    colorIndex = Math.floor(Math.random() * COLORS.length);
  }
  // Shuffle button order
  const order = [0, 1, 2, 3];
  for (let i = order.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }
  return {
    textName: COLORS[textIndex].name,
    displayColor: COLORS[colorIndex].color,
    answerIndex: colorIndex,
    shuffledOrder: order,
  };
}

/* ═══════════════════════════════════════
   Particle System
   ═══════════════════════════════════════ */

interface Particle {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
  angle: number;
  speed: number;
  life: number;
}

function ConfettiParticles({ particles }: { particles: Particle[] }) {
  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-sm"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: `${p.size}px`,
            height: `${p.size * 0.6}px`,
            backgroundColor: p.color,
            transform: `rotate(${p.angle}deg)`,
            opacity: p.life,
            transition: "opacity 0.3s",
          }}
        />
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════
   Feedback Icons (SVG, no emoji)
   ═══════════════════════════════════════ */

function IconCheck({ size = 48 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      <circle cx="50" cy="50" r="45" fill="#22C55E" opacity="0.2" />
      <polyline
        points="28,52 44,68 72,34"
        fill="none"
        stroke="#22C55E"
        strokeWidth="8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconCross({ size = 48 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      <circle cx="50" cy="50" r="45" fill="#EF4444" opacity="0.2" />
      <line x1="32" y1="32" x2="68" y2="68" stroke="#EF4444" strokeWidth="8" strokeLinecap="round" />
      <line x1="68" y1="32" x2="32" y2="68" stroke="#EF4444" strokeWidth="8" strokeLinecap="round" />
    </svg>
  );
}

function IconBrain({ size = 80, color = "#8B5CF6" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ filter: `drop-shadow(0 0 12px ${color}60)` }}>
      <path
        d="M50 90 C50 90 50 65 50 55 M50 55 C38 55 25 48 25 35 C25 22 35 15 45 15 C48 10 55 8 60 12 C68 10 80 18 78 32 C82 36 82 48 72 52 C65 56 55 55 50 55Z"
        fill={color}
        stroke="rgba(0,0,0,0.2)"
        strokeWidth="2"
      />
      <path
        d="M50 55 C50 55 50 48 50 42 M40 30 C40 30 50 35 60 28"
        fill="none"
        stroke="rgba(255,255,255,0.3)"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function RankIcon({ rankLetter, color, size = 80 }: { rankLetter: string; color: string; size?: number }) {
  switch (rankLetter) {
    case "S":
      return <IconBrain size={size} color={color} />;
    case "A":
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" style={{ filter: `drop-shadow(0 0 12px ${color}60)` }}>
          <polygon points="50,10 61,40 95,40 67,58 78,90 50,72 22,90 33,58 5,40 39,40" fill={color} stroke="rgba(0,0,0,0.2)" strokeWidth="2" />
        </svg>
      );
    case "B":
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" style={{ filter: `drop-shadow(0 0 10px ${color}60)` }}>
          <circle cx="50" cy="50" r="38" fill="none" stroke={color} strokeWidth="5" />
          <circle cx="50" cy="50" r="8" fill={color} />
          <line x1="50" y1="12" x2="50" y2="28" stroke={color} strokeWidth="4" strokeLinecap="round" />
          <line x1="50" y1="72" x2="50" y2="88" stroke={color} strokeWidth="4" strokeLinecap="round" />
          <line x1="12" y1="50" x2="28" y2="50" stroke={color} strokeWidth="4" strokeLinecap="round" />
          <line x1="72" y1="50" x2="88" y2="50" stroke={color} strokeWidth="4" strokeLinecap="round" />
        </svg>
      );
    default:
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" style={{ filter: `drop-shadow(0 0 8px ${color}40)` }}>
          <circle cx="50" cy="50" r="35" fill={color} opacity="0.3" />
          <circle cx="50" cy="50" r="20" fill={color} opacity="0.5" />
          <circle cx="50" cy="50" r="8" fill={color} />
        </svg>
      );
  }
}

/* ═══════════════════════════════════════
   Styles
   ═══════════════════════════════════════ */

function StroopStyles() {
  return (
    <style jsx global>{`
      @keyframes bounceIn {
        0% { transform: scale(0); opacity: 0; }
        50% { transform: scale(1.15); }
        100% { transform: scale(1); opacity: 1; }
      }
      @keyframes bounceButton {
        0% { transform: scale(1); }
        30% { transform: scale(1.25); }
        60% { transform: scale(0.9); }
        100% { transform: scale(1); }
      }
      @keyframes shakeScreen {
        0%, 100% { transform: translateX(0); }
        10% { transform: translateX(-8px) rotate(-1deg); }
        30% { transform: translateX(8px) rotate(1deg); }
        50% { transform: translateX(-6px); }
        70% { transform: translateX(6px); }
        90% { transform: translateX(-3px); }
      }
      @keyframes slideUp {
        0% { transform: translateY(20px); opacity: 0; }
        100% { transform: translateY(0); opacity: 1; }
      }
      @keyframes fadeIn {
        0% { opacity: 0; }
        100% { opacity: 1; }
      }
      @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.05); }
      }
      @keyframes rankReveal {
        0% { transform: scale(0) rotate(-20deg); opacity: 0; }
        50% { transform: scale(1.3) rotate(5deg); }
        70% { transform: scale(0.9) rotate(-2deg); }
        100% { transform: scale(1) rotate(0deg); opacity: 1; }
      }
      @keyframes textPop {
        0% { transform: scale(0.3) rotate(-5deg); opacity: 0; }
        60% { transform: scale(1.1) rotate(2deg); }
        100% { transform: scale(1) rotate(0deg); opacity: 1; }
      }
      @keyframes timerPulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.6; }
      }
      @keyframes feedbackIn {
        0% { transform: scale(0) rotate(-10deg); opacity: 0; }
        100% { transform: scale(1) rotate(0deg); opacity: 1; }
      }
      @keyframes colorShift {
        0% { color: #EF4444; }
        25% { color: #3B82F6; }
        50% { color: #EAB308; }
        75% { color: #22C55E; }
        100% { color: #EF4444; }
      }
    `}</style>
  );
}

/* ═══════════════════════════════════════
   Main Component
   ═══════════════════════════════════════ */

export default function GameClient() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [question, setQuestion] = useState<Question | null>(null);
  const [correct, setCorrect] = useState(0);
  const [miss, setMiss] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [rank, setRank] = useState<StroopRank | null>(null);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [shaking, setShaking] = useState(false);
  const [bouncingButton, setBouncingButton] = useState<number | null>(null);
  const [particles, setParticles] = useState<Particle[]>([]);

  const startTimeRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const feedbackTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const particleIdRef = useRef(0);
  const correctRef = useRef(0);
  const missRef = useRef(0);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (feedbackTimerRef.current) clearTimeout(feedbackTimerRef.current);
    };
  }, []);

  // Spawn confetti particles
  const spawnConfetti = useCallback((btnIndex: number) => {
    const btnColor = COLORS[btnIndex].color;
    const newParticles: Particle[] = [];
    const confettiColors = [btnColor, "#FFD700", "#FF69B4", "#00FFFF", "#FF6B35"];
    for (let i = 0; i < 12; i++) {
      newParticles.push({
        id: particleIdRef.current++,
        x: 25 + (btnIndex % 2) * 50 + Math.random() * 10 - 5,
        y: 70 + Math.random() * 10,
        color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
        size: 6 + Math.random() * 8,
        angle: Math.random() * 360,
        speed: 2 + Math.random() * 3,
        life: 1,
      });
    }
    setParticles((prev) => [...prev, ...newParticles]);
    // Fade out
    setTimeout(() => {
      setParticles((prev) =>
        prev.map((p) =>
          newParticles.find((np) => np.id === p.id) ? { ...p, life: 0 } : p
        )
      );
    }, 400);
    // Remove
    setTimeout(() => {
      setParticles((prev) =>
        prev.filter((p) => !newParticles.find((np) => np.id === p.id))
      );
    }, 800);
  }, []);

  const handleStart = useCallback(() => {
    setCorrect(0);
    setMiss(0);
    correctRef.current = 0;
    missRef.current = 0;
    setRank(null);
    setFeedback(null);
    setShaking(false);
    setBouncingButton(null);
    setParticles([]);

    const q = generateQuestion();
    setQuestion(q);
    setTimeLeft(GAME_DURATION);
    startTimeRef.current = performance.now();
    setPhase("playing");

    // Timer
    timerRef.current = setInterval(() => {
      const elapsed = performance.now() - startTimeRef.current;
      const remaining = Math.max(0, GAME_DURATION - elapsed);
      setTimeLeft(remaining);

      if (remaining <= 0) {
        if (timerRef.current) clearInterval(timerRef.current);
        const finalRank = getRank(correctRef.current);
        setRank(finalRank);
        setPhase("result");
      }
    }, TIMER_TICK);
  }, []);

  const handleAnswer = useCallback(
    (answerIndex: number) => {
      if (phase !== "playing" || !question) return;

      // Clear previous feedback timer
      if (feedbackTimerRef.current) clearTimeout(feedbackTimerRef.current);

      const isCorrect = answerIndex === question.answerIndex;

      if (isCorrect) {
        correctRef.current += 1;
        setCorrect(correctRef.current);
        setFeedback("correct");
        setBouncingButton(answerIndex);
        spawnConfetti(answerIndex);
      } else {
        missRef.current += 1;
        setMiss(missRef.current);
        setFeedback("wrong");
        setShaking(true);
      }

      // Next question after brief feedback
      feedbackTimerRef.current = setTimeout(() => {
        setFeedback(null);
        setShaking(false);
        setBouncingButton(null);
        setQuestion(generateQuestion());
      }, 250);
    },
    [phase, question, spawnConfetti]
  );

  // Share logic
  const shareUrl =
    typeof window !== "undefined" && rank
      ? `${window.location.origin}/stroop-test?correct=${correct}&miss=${miss}&rank=${rank.rank}&title=${encodeURIComponent(rank.title)}`
      : "";

  const shareText = rank
    ? `ストループテストで${correct}問正解(ミス${miss}回)！\nランク: ${rank.rank} ${rank.title} ${rank.emoji}\n#ストループテスト\n`
    : "";

  const twitterUrl = rank
    ? `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`
    : "";

  const handleNativeShare = useCallback(async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: "ストループテスト", text: shareText, url: shareUrl });
      } catch {
        // cancelled
      }
    }
  }, [shareText, shareUrl]);

  /* ─── IDLE ─── */
  if (phase === "idle") {
    return (
      <div className="relative flex flex-col items-center justify-center min-h-screen px-4 text-center overflow-hidden"
        style={{ background: "#F5F5F5" }}>
        <StroopStyles />

        {/* Decorative color circles */}
        <div className="absolute top-8 left-6 w-20 h-20 rounded-full opacity-15" style={{ background: "#EF4444" }} />
        <div className="absolute top-16 right-8 w-16 h-16 rounded-full opacity-15" style={{ background: "#3B82F6" }} />
        <div className="absolute bottom-24 left-10 w-14 h-14 rounded-full opacity-15" style={{ background: "#EAB308" }} />
        <div className="absolute bottom-12 right-6 w-18 h-18 rounded-full opacity-15" style={{ background: "#22C55E" }} />

        {/* Brain icon */}
        <div style={{ animation: "bounceIn 0.6s ease-out" }} className="mb-4">
          <IconBrain size={90} color="#8B5CF6" />
        </div>

        {/* Title */}
        <h1
          className="text-4xl sm:text-5xl font-black mb-3"
          style={{
            animation: "bounceIn 0.5s ease-out",
            background: "linear-gradient(135deg, #EF4444, #3B82F6, #EAB308, #22C55E)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          ストループテスト
        </h1>

        <p
          className="text-lg font-bold text-gray-700 mb-2"
          style={{ animation: "slideUp 0.6s ease-out 0.2s both" }}
        >
          脳の処理速度を測定しよう
        </p>

        {/* Rule explanation */}
        <div
          className="max-w-sm mx-auto mb-6 p-5 rounded-2xl"
          style={{
            background: "white",
            boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
            animation: "slideUp 0.6s ease-out 0.3s both",
          }}
        >
          {/* Big warning */}
          <div
            className="text-2xl font-black mb-3 py-2 px-4 rounded-xl"
            style={{
              background: "linear-gradient(135deg, #7C3AED15, #EC489915)",
              color: "#7C3AED",
            }}
          >
            文字を読むな！色を見ろ！
          </div>

          <div className="text-gray-600 text-sm leading-relaxed mb-4">
            色の名前が<span className="font-bold">違う色</span>で表示されます。
            <br />
            文字の<span className="font-black text-gray-900">「色」</span>を選んでください。
          </div>

          {/* Example */}
          <div className="flex items-center justify-center gap-3 py-3 px-4 rounded-xl mb-3"
            style={{ background: "#F8F8F8" }}>
            <span className="text-3xl font-black" style={{ color: "#3B82F6" }}>
              あか
            </span>
            <svg width="24" height="24" viewBox="0 0 100 100">
              <polygon points="85,50 55,25 55,42 15,42 15,58 55,58 55,75" fill="#9CA3AF" />
            </svg>
            <span className="font-bold text-gray-700">正解は「青」</span>
          </div>

          <div className="text-xs text-gray-400">
            30秒間でできるだけ多く正解しよう！
          </div>
        </div>

        {/* Start button */}
        <button
          onClick={handleStart}
          className="px-12 py-5 text-white text-2xl font-black rounded-full transition-transform active:scale-95"
          style={{
            background: "linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)",
            boxShadow: "0 4px 15px rgba(139,92,246,0.4), 0 6px 0 #5B21B6",
            animation: "slideUp 0.6s ease-out 0.5s both, pulse 2s ease-in-out infinite",
          }}
        >
          スタート！
        </button>

        <Link
          href="/"
          className="mt-8 text-gray-400 hover:text-indigo-500 text-sm transition-colors font-bold"
          style={{ animation: "slideUp 0.6s ease-out 0.6s both" }}
        >
          &larr; トップへ
        </Link>
      </div>
    );
  }

  /* ─── PLAYING ─── */
  if (phase === "playing" && question) {
    const progress = timeLeft / GAME_DURATION;
    const isUrgent = timeLeft < 5000;

    return (
      <div
        className="relative flex flex-col min-h-screen overflow-hidden select-none"
        style={{
          background: "#F5F5F5",
          animation: shaking ? "shakeScreen 0.3s ease-in-out" : undefined,
          touchAction: "manipulation",
        }}
      >
        <StroopStyles />
        <ConfettiParticles particles={particles} />

        {/* Timer bar */}
        <div className="w-full h-3" style={{ background: "#E5E7EB" }}>
          <div
            className="h-full transition-all"
            style={{
              width: `${progress * 100}%`,
              background: isUrgent
                ? "#EF4444"
                : "linear-gradient(90deg, #8B5CF6, #3B82F6)",
              animation: isUrgent ? "timerPulse 0.5s ease-in-out infinite" : undefined,
              transition: "width 0.05s linear",
            }}
          />
        </div>

        {/* Score display */}
        <div className="flex justify-between items-center px-4 py-3">
          <div className="flex items-center gap-4">
            <span className="text-sm font-bold text-gray-500">
              正解:{" "}
              <span className="text-lg font-black text-green-600">{correct}</span>
            </span>
            <span className="text-sm font-bold text-gray-500">
              ミス:{" "}
              <span className="text-lg font-black text-red-500">{miss}</span>
            </span>
          </div>
          <div
            className="text-lg font-black px-3 py-1 rounded-full"
            style={{
              color: isUrgent ? "#EF4444" : "#6B7280",
              background: isUrgent ? "#FEE2E2" : "#F3F4F6",
              animation: isUrgent ? "timerPulse 0.5s ease-in-out infinite" : undefined,
            }}
          >
            {Math.ceil(timeLeft / 1000)}s
          </div>
        </div>

        {/* Main question area */}
        <div className="flex-1 flex flex-col items-center justify-center px-4">
          {/* Feedback icon */}
          <div className="h-14 flex items-center justify-center">
            {feedback === "correct" && (
              <div style={{ animation: "feedbackIn 0.2s ease-out" }}>
                <IconCheck size={48} />
              </div>
            )}
            {feedback === "wrong" && (
              <div style={{ animation: "feedbackIn 0.2s ease-out" }}>
                <IconCross size={48} />
              </div>
            )}
          </div>

          {/* The stroop word */}
          <div
            className="font-black select-none"
            style={{
              fontSize: "clamp(60px, 15vw, 100px)",
              color: question.displayColor,
              textShadow: "2px 2px 0 rgba(0,0,0,0.08)",
              animation: "textPop 0.2s ease-out",
              lineHeight: 1.2,
            }}
            key={`${question.textName}-${question.displayColor}-${correct}-${miss}`}
          >
            {question.textName}
          </div>
        </div>

        {/* Answer buttons */}
        <div className="px-4 pb-8 pt-4">
          <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto">
            {(question?.shuffledOrder || [0,1,2,3]).map((ci) => {
              const c = COLORS[ci];
              return (
              <button
                key={c.name}
                onPointerDown={() => handleAnswer(ci)}
                className="relative flex items-center justify-center rounded-2xl font-black text-lg py-5 transition-transform active:scale-90"
                style={{
                  background: "#FFFFFF",
                  border: "2px solid #E5E7EB",
                  color: "#374151",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                  minHeight: "64px",
                  animation:
                    bouncingButton === ci
                      ? "bounceButton 0.3s ease-out"
                      : undefined,
                }}
              >
                {c.name}
              </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  /* ─── RESULT ─── */
  if (phase === "result" && rank) {
    const accuracy = correct + miss > 0 ? Math.round((correct / (correct + miss)) * 100) : 0;

    return (
      <div
        className="relative flex flex-col items-center justify-center min-h-screen px-4 py-8 overflow-hidden"
        style={{ background: "#F5F5F5" }}
      >
        <StroopStyles />

        {/* Decorative circles */}
        <div
          className="absolute top-10 left-8 w-32 h-32 rounded-full opacity-10"
          style={{ background: rank.color }}
        />
        <div
          className="absolute bottom-16 right-6 w-24 h-24 rounded-full opacity-10"
          style={{ background: rank.color }}
        />

        <div
          className="text-sm font-bold text-gray-400 mb-4"
          style={{ animation: "slideUp 0.4s ease-out" }}
        >
          結果発表
        </div>

        {/* Rank icon */}
        <div
          className="mb-2"
          style={{
            animation: "rankReveal 0.7s ease-out",
            filter: `drop-shadow(0 0 20px ${rank.color}60)`,
          }}
        >
          <RankIcon rankLetter={rank.rank} color={rank.color} size={80} />
        </div>

        {/* Rank letter */}
        <div
          className="text-7xl sm:text-8xl font-black mb-1"
          style={{
            color: rank.color,
            animation: "rankReveal 0.7s ease-out 0.1s both",
            textShadow: `3px 3px 0 rgba(0,0,0,0.1), 0 0 20px ${rank.color}40`,
          }}
        >
          {rank.rank}
        </div>

        <div
          className="text-2xl font-black text-gray-800 mb-1"
          style={{ animation: "slideUp 0.5s ease-out 0.3s both" }}
        >
          {rank.title}
        </div>
        <div
          className="text-gray-500 text-sm mb-6"
          style={{ animation: "slideUp 0.5s ease-out 0.4s both" }}
        >
          {rank.description}
        </div>

        {/* Score card */}
        <div
          className="w-full max-w-xs rounded-2xl p-5 mb-6"
          style={{
            background: "white",
            boxShadow: `0 4px 20px rgba(0,0,0,0.08), 0 0 0 2px ${rank.color}20`,
            animation: "bounceIn 0.5s ease-out 0.5s both",
          }}
        >
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-xs font-bold text-gray-400 mb-1">正解</div>
              <div className="text-3xl font-black text-green-600">{correct}</div>
            </div>
            <div>
              <div className="text-xs font-bold text-gray-400 mb-1">ミス</div>
              <div className="text-3xl font-black text-red-500">{miss}</div>
            </div>
            <div>
              <div className="text-xs font-bold text-gray-400 mb-1">正解率</div>
              <div className="text-3xl font-black" style={{ color: rank.color }}>
                {accuracy}
                <span className="text-sm">%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Share & actions */}
        <div
          className="flex flex-col gap-3 w-full max-w-xs"
          style={{ animation: "slideUp 0.5s ease-out 0.7s both" }}
        >
          {typeof navigator !== "undefined" && typeof navigator.share === "function" && (
            <button
              onClick={handleNativeShare}
              className="w-full py-4 text-lg font-black text-white rounded-full transition-transform active:scale-95"
              style={{
                background: rank.color,
                boxShadow: `0 4px 15px ${rank.color}40, 0 4px 0 rgba(0,0,0,0.15)`,
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
              className="flex-1 py-3 text-white font-black text-center text-sm rounded-full transition-transform active:scale-95"
              style={{
                background: "#000",
                boxShadow: "0 4px 0 #000",
              }}
            >
              X share
            </a>
            <a
              href={`https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(shareUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-3 text-white font-black text-center text-sm rounded-full transition-transform active:scale-95"
              style={{
                background: "#06C755",
                boxShadow: "0 4px 0 #04a043",
              }}
            >
              LINE
            </a>
          </div>

          <button
            onClick={handleStart}
            className="w-full py-3 font-black rounded-full mt-2 transition-transform active:scale-95"
            style={{
              background: "white",
              color: "#374151",
              border: "2px solid #E5E7EB",
              boxShadow: "0 4px 0 #D1D5DB",
            }}
          >
            もう一回
          </button>

          <Link
            href="/"
            className="text-center text-gray-400 hover:text-indigo-500 text-sm mt-2 transition-colors font-bold"
          >
            &larr; トップへ
          </Link>
        </div>
      </div>
    );
  }

  return null;
}
