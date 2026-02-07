"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { getRank, type MathSpeedRank } from "@/lib/math-speed/ranks";
import Link from "next/link";

/* ═══════════════════════════════════════
   Constants
   ═══════════════════════════════════════ */

const GAME_DURATION = 30_000; // 30 seconds
const TIMER_TICK = 50; // progress bar update interval
const COUNTDOWN_SECONDS = 3;

type Phase = "idle" | "countdown" | "playing" | "result";
type Operator = "+" | "-" | "x" | "/";

interface Question {
  a: number;
  b: number;
  operator: Operator;
  answer: number;
  choices: number[];
}

/* ═══════════════════════════════════════
   Question Generator
   ═══════════════════════════════════════ */

function generateQuestion(streak: number): Question {
  // Difficulty increases with streak
  const difficulty = Math.min(Math.floor(streak / 5), 3);
  
  const operators: Operator[] = ["+", "-", "x", "/"];
  const operator = operators[Math.floor(Math.random() * operators.length)];
  
  let a: number, b: number, answer: number;
  
  switch (operator) {
    case "+": {
      // Addition: a + b (range increases with difficulty)
      const maxA = 20 + difficulty * 10;
      const maxB = 20 + difficulty * 5;
      a = Math.floor(Math.random() * maxA) + 1;
      b = Math.floor(Math.random() * maxB) + 1;
      answer = a + b;
      break;
    }
    case "-": {
      // Subtraction: a - b (ensure positive result)
      const maxVal = 20 + difficulty * 10;
      a = Math.floor(Math.random() * maxVal) + 2;
      b = Math.floor(Math.random() * (a - 1)) + 1;
      answer = a - b;
      break;
    }
    case "x": {
      // Multiplication: a x b (times tables level)
      const maxA = 9 + difficulty;
      const maxB = 9 + difficulty;
      a = Math.floor(Math.random() * (maxA - 1)) + 2;
      b = Math.floor(Math.random() * (maxB - 1)) + 2;
      answer = a * b;
      break;
    }
    case "/": {
      // Division: a / b (ensure whole number result)
      const maxB = 9 + difficulty;
      b = Math.floor(Math.random() * (maxB - 1)) + 2;
      const quotient = Math.floor(Math.random() * (10 + difficulty)) + 1;
      a = b * quotient;
      answer = quotient;
      break;
    }
    default:
      a = 1;
      b = 1;
      answer = 2;
  }
  
  // Generate 4 choices: correct answer + 3 decoys
  const choices = generateChoices(answer);
  
  return { a, b, operator, answer, choices };
}

function generateChoices(correctAnswer: number): number[] {
  const choices = new Set<number>();
  choices.add(correctAnswer);
  
  // Generate decoys that are close to the correct answer
  const offsets = [-3, -2, -1, 1, 2, 3];
  
  while (choices.size < 4) {
    const offset = offsets[Math.floor(Math.random() * offsets.length)];
    const decoy = correctAnswer + offset;
    
    // Ensure decoy is positive and not already in choices
    if (decoy > 0 && !choices.has(decoy)) {
      choices.add(decoy);
    }
    
    // Fallback: add random nearby numbers
    if (choices.size < 4) {
      const fallback = Math.max(1, correctAnswer + Math.floor(Math.random() * 10) - 5);
      if (!choices.has(fallback)) {
        choices.add(fallback);
      }
    }
  }
  
  // Shuffle the choices
  const arr = Array.from(choices);
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  
  return arr;
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

function IconCalculator({ size = 80, color = "#6366F1" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ filter: `drop-shadow(0 0 12px ${color}60)` }}>
      <rect x="20" y="10" width="60" height="80" rx="8" fill={color} />
      <rect x="28" y="18" width="44" height="20" rx="4" fill="#E0E7FF" />
      {/* Buttons */}
      <rect x="28" y="46" width="12" height="10" rx="2" fill="#A5B4FC" />
      <rect x="44" y="46" width="12" height="10" rx="2" fill="#A5B4FC" />
      <rect x="60" y="46" width="12" height="10" rx="2" fill="#A5B4FC" />
      <rect x="28" y="60" width="12" height="10" rx="2" fill="#A5B4FC" />
      <rect x="44" y="60" width="12" height="10" rx="2" fill="#A5B4FC" />
      <rect x="60" y="60" width="12" height="10" rx="2" fill="#A5B4FC" />
      <rect x="28" y="74" width="12" height="10" rx="2" fill="#A5B4FC" />
      <rect x="44" y="74" width="28" height="10" rx="2" fill="#818CF8" />
    </svg>
  );
}

function RankIcon({ rankLetter, color, size = 80 }: { rankLetter: string; color: string; size?: number }) {
  switch (rankLetter) {
    case "S":
      return <IconCalculator size={size} color={color} />;
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

function MathStyles() {
  return (
    <style jsx global>{`
      @keyframes bounceIn {
        0% { transform: scale(0); opacity: 0; }
        50% { transform: scale(1.15); }
        100% { transform: scale(1); opacity: 1; }
      }
      @keyframes bounceButton {
        0% { transform: scale(1); }
        30% { transform: scale(1.15); }
        60% { transform: scale(0.95); }
        100% { transform: scale(1); }
      }
      @keyframes shakeScreen {
        0%, 100% { transform: translateX(0); }
        10% { transform: translateX(-6px) rotate(-0.5deg); }
        30% { transform: translateX(6px) rotate(0.5deg); }
        50% { transform: translateX(-4px); }
        70% { transform: translateX(4px); }
        90% { transform: translateX(-2px); }
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
        50% { transform: scale(1.03); }
      }
      @keyframes rankReveal {
        0% { transform: scale(0) rotate(-20deg); opacity: 0; }
        50% { transform: scale(1.3) rotate(5deg); }
        70% { transform: scale(0.9) rotate(-2deg); }
        100% { transform: scale(1) rotate(0deg); opacity: 1; }
      }
      @keyframes textPop {
        0% { transform: scale(0.8); opacity: 0; }
        100% { transform: scale(1); opacity: 1; }
      }
      @keyframes timerPulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.6; }
      }
      @keyframes feedbackIn {
        0% { transform: scale(0) rotate(-10deg); opacity: 0; }
        100% { transform: scale(1) rotate(0deg); opacity: 1; }
      }
      @keyframes countdownPop {
        0% { transform: scale(0.5); opacity: 0; }
        50% { transform: scale(1.2); }
        100% { transform: scale(1); opacity: 1; }
      }
      @keyframes pencilLine {
        0% { width: 0; }
        100% { width: 100%; }
      }
    `}</style>
  );
}

/* ═══════════════════════════════════════
   Main Component
   ═══════════════════════════════════════ */

export default function GameClient() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [countdown, setCountdown] = useState(COUNTDOWN_SECONDS);
  const [question, setQuestion] = useState<Question | null>(null);
  const [correct, setCorrect] = useState(0);
  const [miss, setMiss] = useState(0);
  const [streak, setStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [rank, setRank] = useState<MathSpeedRank | null>(null);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [shaking, setShaking] = useState(false);
  const [bouncingButton, setBouncingButton] = useState<number | null>(null);

  const startTimeRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const feedbackTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const correctRef = useRef(0);
  const missRef = useRef(0);
  const streakRef = useRef(0);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (countdownRef.current) clearInterval(countdownRef.current);
      if (feedbackTimerRef.current) clearTimeout(feedbackTimerRef.current);
    };
  }, []);

  const startGame = useCallback(() => {
    setCorrect(0);
    setMiss(0);
    setStreak(0);
    correctRef.current = 0;
    missRef.current = 0;
    streakRef.current = 0;
    setRank(null);
    setFeedback(null);
    setShaking(false);
    setBouncingButton(null);

    const q = generateQuestion(0);
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

  const handleStart = useCallback(() => {
    // Start countdown
    setCountdown(COUNTDOWN_SECONDS);
    setPhase("countdown");

    let count = COUNTDOWN_SECONDS;
    countdownRef.current = setInterval(() => {
      count -= 1;
      if (count <= 0) {
        if (countdownRef.current) clearInterval(countdownRef.current);
        startGame();
      } else {
        setCountdown(count);
      }
    }, 1000);
  }, [startGame]);

  const handleAnswer = useCallback(
    (choice: number) => {
      if (phase !== "playing" || !question) return;

      // Clear previous feedback timer
      if (feedbackTimerRef.current) clearTimeout(feedbackTimerRef.current);

      const isCorrect = choice === question.answer;

      if (isCorrect) {
        correctRef.current += 1;
        streakRef.current += 1;
        setCorrect(correctRef.current);
        setStreak(streakRef.current);
        setFeedback("correct");
        setBouncingButton(choice);
      } else {
        missRef.current += 1;
        streakRef.current = 0;
        setMiss(missRef.current);
        setStreak(0);
        setFeedback("wrong");
        setShaking(true);
      }

      // Next question after brief feedback
      feedbackTimerRef.current = setTimeout(() => {
        setFeedback(null);
        setShaking(false);
        setBouncingButton(null);
        setQuestion(generateQuestion(streakRef.current));
      }, 200);
    },
    [phase, question]
  );

  // Share logic
  const shareUrl =
    typeof window !== "undefined" && rank
      ? `${window.location.origin}/math-speed?correct=${correct}&miss=${miss}&rank=${rank.rank}&title=${encodeURIComponent(rank.title)}`
      : "";

  const shareText = rank
    ? `計算スピードテストで${correct}問正解(ミス${miss}回)！\nランク: ${rank.rank} ${rank.title}\n#計算スピードテスト\n`
    : "";

  const twitterUrl = rank
    ? `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`
    : "";

  const handleNativeShare = useCallback(async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: "計算スピードテスト", text: shareText, url: shareUrl });
      } catch {
        // cancelled
      }
    }
  }, [shareText, shareUrl]);

  // Format operator for display
  const formatOperator = (op: Operator): string => {
    switch (op) {
      case "+": return "+";
      case "-": return "-";
      case "x": return "x";
      case "/": return "/";
      default: return op;
    }
  };

  /* ─── IDLE ─── */
  if (phase === "idle") {
    return (
      <div
        className="relative flex flex-col items-center justify-center min-h-screen px-4 text-center overflow-hidden"
        style={{ background: "#FDF8F3" }}
      >
        <MathStyles />

        {/* Notebook lines decoration */}
        <div className="absolute inset-0 opacity-10">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="w-full border-b border-blue-400"
              style={{ height: "40px" }}
            />
          ))}
        </div>

        {/* Calculator icon */}
        <div style={{ animation: "bounceIn 0.6s ease-out" }} className="mb-4">
          <IconCalculator size={90} color="#6366F1" />
        </div>

        {/* Title */}
        <h1
          className="text-4xl sm:text-5xl font-black mb-3"
          style={{
            animation: "bounceIn 0.5s ease-out",
            color: "#1F2937",
            textShadow: "2px 2px 0 rgba(99,102,241,0.2)",
          }}
        >
          計算スピードテスト
        </h1>

        <p
          className="text-lg font-bold text-gray-600 mb-2"
          style={{ animation: "slideUp 0.6s ease-out 0.2s both" }}
        >
          30秒で何問解ける？
        </p>

        {/* Rule explanation */}
        <div
          className="max-w-sm mx-auto mb-6 p-5 rounded-2xl"
          style={{
            background: "white",
            boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
            border: "2px solid #E5E7EB",
            animation: "slideUp 0.6s ease-out 0.3s both",
          }}
        >
          {/* Example */}
          <div
            className="text-3xl font-black mb-4 py-3 px-4 rounded-xl"
            style={{
              background: "#F3F4F6",
              color: "#1F2937",
              fontFamily: "Georgia, serif",
            }}
          >
            12 + 7 = ?
          </div>

          <div className="text-gray-600 text-sm leading-relaxed mb-3">
            画面に表示される計算問題を
            <br />
            <span className="font-black text-indigo-600">4択</span>から選んで素早く回答！
          </div>

          <div className="grid grid-cols-4 gap-2 text-center text-sm mb-3">
            <div className="py-2 px-1 rounded bg-indigo-50 font-bold text-indigo-700">+</div>
            <div className="py-2 px-1 rounded bg-indigo-50 font-bold text-indigo-700">-</div>
            <div className="py-2 px-1 rounded bg-indigo-50 font-bold text-indigo-700">x</div>
            <div className="py-2 px-1 rounded bg-indigo-50 font-bold text-indigo-700">/</div>
          </div>

          <div className="text-xs text-gray-400">
            連続正解で問題の難易度UP！
          </div>
        </div>

        {/* Start button */}
        <button
          onClick={handleStart}
          className="px-12 py-5 text-white text-2xl font-black rounded-full transition-transform active:scale-95"
          style={{
            background: "linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)",
            boxShadow: "0 4px 15px rgba(99,102,241,0.4), 0 6px 0 #3730A3",
            animation: "slideUp 0.6s ease-out 0.5s both, pulse 2s ease-in-out infinite",
            touchAction: "manipulation",
          }}
        >
          START!
        </button>

        <Link
          href="/"
          className="mt-8 text-gray-400 hover:text-indigo-500 text-sm transition-colors font-bold"
          style={{ animation: "slideUp 0.6s ease-out 0.6s both" }}
        >
          - トップへ -
        </Link>
      </div>
    );
  }

  /* ─── COUNTDOWN ─── */
  if (phase === "countdown") {
    return (
      <div
        className="relative flex flex-col items-center justify-center min-h-screen px-4 text-center overflow-hidden"
        style={{ background: "#FDF8F3" }}
      >
        <MathStyles />

        <div
          key={countdown}
          className="text-9xl font-black"
          style={{
            color: countdown === 0 ? "#22C55E" : "#6366F1",
            animation: "countdownPop 0.5s ease-out",
            textShadow: "4px 4px 0 rgba(0,0,0,0.1)",
          }}
        >
          {countdown === 0 ? "GO!" : countdown}
        </div>
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
          background: "#FDF8F3",
          animation: shaking ? "shakeScreen 0.25s ease-in-out" : undefined,
          touchAction: "manipulation",
        }}
      >
        <MathStyles />

        {/* Timer bar */}
        <div className="w-full h-3" style={{ background: "#E5E7EB" }}>
          <div
            className="h-full transition-all"
            style={{
              width: `${progress * 100}%`,
              background: isUrgent
                ? "#EF4444"
                : "linear-gradient(90deg, #6366F1, #8B5CF6)",
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
              <div style={{ animation: "feedbackIn 0.15s ease-out" }}>
                <IconCheck size={48} />
              </div>
            )}
            {feedback === "wrong" && (
              <div style={{ animation: "feedbackIn 0.15s ease-out" }}>
                <IconCross size={48} />
              </div>
            )}
          </div>

          {/* The question */}
          <div
            className="p-6 rounded-2xl mb-4"
            style={{
              background: "white",
              boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
              border: "2px solid #E5E7EB",
            }}
          >
            <div
              className="font-black select-none text-center"
              style={{
                fontSize: "clamp(36px, 10vw, 56px)",
                color: "#1F2937",
                fontFamily: "Georgia, serif",
                animation: "textPop 0.15s ease-out",
                lineHeight: 1.3,
              }}
              key={`${question.a}-${question.operator}-${question.b}`}
            >
              {question.a} {formatOperator(question.operator)} {question.b} = ?
            </div>
          </div>

          {/* Streak indicator */}
          {streak >= 3 && (
            <div
              className="text-sm font-bold px-3 py-1 rounded-full mb-2"
              style={{
                background: "linear-gradient(135deg, #FEF3C7, #FDE68A)",
                color: "#B45309",
              }}
            >
              {streak}連続正解!
            </div>
          )}
        </div>

        {/* Answer buttons */}
        <div className="px-4 pb-8 pt-4">
          <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto">
            {question.choices.map((choice) => (
              <button
                key={choice}
                onPointerDown={() => handleAnswer(choice)}
                className="relative flex items-center justify-center rounded-xl font-black text-2xl py-5 transition-transform active:scale-90"
                style={{
                  background: "#FFFFFF",
                  border: "2px solid #D1D5DB",
                  color: "#1F2937",
                  boxShadow: "0 4px 0 #9CA3AF",
                  minHeight: "72px",
                  fontFamily: "Georgia, serif",
                  animation:
                    bouncingButton === choice
                      ? "bounceButton 0.3s ease-out"
                      : undefined,
                  touchAction: "manipulation",
                }}
              >
                {choice}
              </button>
            ))}
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
        style={{ background: "#FDF8F3" }}
      >
        <MathStyles />

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
          className="text-gray-500 text-sm mb-6 text-center px-4"
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
            border: "2px solid #E5E7EB",
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
                touchAction: "manipulation",
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
              touchAction: "manipulation",
            }}
          >
            もう一回
          </button>

          <Link
            href="/"
            className="text-center text-gray-400 hover:text-indigo-500 text-sm mt-2 transition-colors font-bold"
          >
            - トップへ -
          </Link>
        </div>
      </div>
    );
  }

  return null;
}
