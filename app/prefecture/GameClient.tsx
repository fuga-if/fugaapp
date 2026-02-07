"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import {
  getRank,
  prefectureQuestions,
  type PrefectureQuestion,
  type PrefectureRank,
  type QuestionType,
} from "@/lib/prefecture/ranks";
import Link from "next/link";

const TOTAL_QUESTIONS = 20;

type Phase = "idle" | "playing" | "result";
type AnswerState = "none" | "correct" | "wrong";

/* ═══════════════════════════════════════
   Helper functions
   ═══════════════════════════════════════ */

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pickQuestions(count: number): PrefectureQuestion[] {
  return shuffle(prefectureQuestions).slice(0, count);
}

const typeLabels: Record<QuestionType, string> = {
  capital: "県庁所在地",
  famous: "名物/特産",
  region: "地域",
  neighbor: "隣接/地理",
};

/* ═══════════════════════════════════════
   SVG Components
   ═══════════════════════════════════════ */

function JapanMapSilhouette({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 300"
      className={className}
      fill="currentColor"
      opacity="0.06"
    >
      {/* Simplified Japan map silhouette */}
      <path d="M140 20 Q150 25, 148 35 Q145 45, 140 50 Q135 55, 130 52 Q125 48, 128 40 Q132 30, 140 20Z" />
      <path d="M120 55 Q130 58, 135 70 Q138 85, 132 95 Q125 105, 118 100 Q110 95, 112 82 Q115 68, 120 55Z" />
      <path d="M100 95 Q115 100, 120 115 Q125 130, 118 145 Q110 160, 95 155 Q80 150, 82 135 Q85 115, 100 95Z" />
      <path d="M85 155 Q100 160, 105 175 Q110 190, 100 205 Q88 220, 72 212 Q58 205, 62 188 Q68 170, 85 155Z" />
      <path d="M70 215 Q85 220, 90 235 Q95 250, 82 262 Q68 275, 55 268 Q42 260, 48 245 Q55 228, 70 215Z" />
      <path d="M50 265 Q62 270, 58 280 Q55 290, 45 288 Q35 285, 38 275 Q42 265, 50 265Z" />
      {/* Okinawa */}
      <path d="M35 285 Q42 288, 40 295 Q38 300, 32 298 Q26 295, 30 290 Q33 286, 35 285Z" />
    </svg>
  );
}

function MapPinIcon({ color = "#E53E3E", size = 24 }: { color?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path
        d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
        fill={color}
      />
      <circle cx="12" cy="9" r="2.5" fill="white" />
    </svg>
  );
}

function CheckIcon({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="11" fill="#48BB78" />
      <path
        d="M7 12.5l3 3 7-7"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CrossIcon({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="11" fill="#E53E3E" />
      <path
        d="M8 8l8 8M16 8l-8 8"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function Confetti() {
  const colors = ["#FFD700", "#48BB78", "#4299E1", "#ED8936", "#E53E3E"];
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {Array.from({ length: 30 }).map((_, i) => (
        <div
          key={i}
          className="absolute w-2 h-2 rounded-full"
          style={{
            backgroundColor: colors[i % colors.length],
            left: `${Math.random() * 100}%`,
            top: `-10px`,
            animation: `confettiFall ${1 + Math.random() * 1}s ease-out forwards`,
            animationDelay: `${Math.random() * 0.3}s`,
          }}
        />
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════
   Styles
   ═══════════════════════════════════════ */

function TravelStyles() {
  return (
    <style jsx global>{`
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }
      @keyframes fadeInUp {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
      }
      @keyframes scaleIn {
        from { opacity: 0; transform: scale(0.8); }
        to { opacity: 1; transform: scale(1); }
      }
      @keyframes flashGreen {
        0% { background-color: rgba(72, 187, 120, 0.3); }
        100% { background-color: transparent; }
      }
      @keyframes flashRed {
        0% { background-color: rgba(229, 62, 62, 0.2); }
        100% { background-color: transparent; }
      }
      @keyframes confettiFall {
        0% { transform: translateY(0) rotate(0deg); opacity: 1; }
        100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
      }
      @keyframes bounceIn {
        0% { transform: scale(0); }
        50% { transform: scale(1.2); }
        100% { transform: scale(1); }
      }
      @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.05); }
      }
      @keyframes slideUp {
        from { opacity: 0; transform: translateY(30px); }
        to { opacity: 1; transform: translateY(0); }
      }
      @keyframes pinDrop {
        0% { transform: translateY(-50px); opacity: 0; }
        60% { transform: translateY(5px); }
        100% { transform: translateY(0); opacity: 1; }
      }
      .sky-gradient {
        background: linear-gradient(180deg, #E8F4FD 0%, #D1E9FA 50%, #C5E3F8 100%);
      }
      .card-shadow {
        box-shadow: 0 4px 15px rgba(66, 153, 225, 0.15), 0 2px 6px rgba(0, 0, 0, 0.08);
      }
      .choice-btn {
        transition: all 0.2s ease;
      }
      .choice-btn:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(66, 153, 225, 0.2);
      }
      .choice-btn:active:not(:disabled) {
        transform: scale(0.98);
      }
    `}</style>
  );
}

/* ═══════════════════════════════════════
   Main Component
   ═══════════════════════════════════════ */

export default function GameClient() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [questions, setQuestions] = useState<PrefectureQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [shuffledChoices, setShuffledChoices] = useState<string[]>([]);
  const [correctCount, setCorrectCount] = useState(0);
  const [answerState, setAnswerState] = useState<AnswerState>("none");
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [rank, setRank] = useState<PrefectureRank | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [typeStats, setTypeStats] = useState<
    Record<QuestionType, { total: number; correct: number }>
  >({} as Record<QuestionType, { total: number; correct: number }>);

  const statsRef = useRef<Record<QuestionType, { total: number; correct: number }>>(
    {} as Record<QuestionType, { total: number; correct: number }>
  );
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const setupQuestion = useCallback((qs: PrefectureQuestion[], index: number) => {
    if (index < qs.length) {
      setShuffledChoices(shuffle(qs[index].choices));
    }
  }, []);

  const handleStart = useCallback(() => {
    const picked = pickQuestions(TOTAL_QUESTIONS);
    setQuestions(picked);
    setCurrentIndex(0);
    setCorrectCount(0);
    setAnswerState("none");
    setSelectedAnswer(null);
    setRank(null);
    setShowConfetti(false);
    statsRef.current = {} as Record<QuestionType, { total: number; correct: number }>;
    setTypeStats({} as Record<QuestionType, { total: number; correct: number }>);
    setPhase("playing");
    setupQuestion(picked, 0);
  }, [setupQuestion]);

  const goToNext = useCallback(
    (qs: PrefectureQuestion[], idx: number, correct: number) => {
      const nextIdx = idx + 1;
      if (nextIdx >= qs.length) {
        setRank(getRank(correct));
        setTypeStats({ ...statsRef.current });
        setPhase("result");
      } else {
        setCurrentIndex(nextIdx);
        setAnswerState("none");
        setSelectedAnswer(null);
        setShowConfetti(false);
        setupQuestion(qs, nextIdx);
      }
    },
    [setupQuestion]
  );

  const handleAnswer = useCallback(
    (choice: string) => {
      if (answerState !== "none") return;

      const q = questions[currentIndex];
      const isCorrect = choice === q.answer;
      const newCorrect = isCorrect ? correctCount + 1 : correctCount;

      setSelectedAnswer(choice);
      setCorrectCount(newCorrect);

      // Update type stats
      const t = q.type;
      if (!statsRef.current[t]) {
        statsRef.current[t] = { total: 0, correct: 0 };
      }
      statsRef.current[t].total += 1;
      if (isCorrect) {
        statsRef.current[t].correct += 1;
      }

      if (isCorrect) {
        setAnswerState("correct");
        setShowConfetti(true);
        timerRef.current = setTimeout(() => {
          goToNext(questions, currentIndex, newCorrect);
        }, 700);
      } else {
        setAnswerState("wrong");
        timerRef.current = setTimeout(() => {
          goToNext(questions, currentIndex, newCorrect);
        }, 1200);
      }
    },
    [answerState, questions, currentIndex, correctCount, goToNext]
  );

  // Share
  const shareUrl =
    typeof window !== "undefined" && rank
      ? `${window.location.origin}/prefecture?score=${correctCount}&rank=${rank.rank}&title=${encodeURIComponent(rank.title)}`
      : "";

  const shareText = rank
    ? `都道府県クイズで${correctCount}/20正解！\nランク: ${rank.rank} ${rank.title}\n#都道府県クイズ\n`
    : "";

  const twitterUrl = rank
    ? `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`
    : "";

  const handleNativeShare = useCallback(async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "都道府県クイズ",
          text: shareText,
          url: shareUrl,
        });
      } catch {
        // user cancelled
      }
    }
  }, [shareText, shareUrl]);

  /* ═══════ IDLE ═══════ */
  if (phase === "idle") {
    return (
      <div className="relative flex flex-col items-center justify-center min-h-screen px-4 text-center overflow-hidden sky-gradient">
        <TravelStyles />

        {/* Japan map decoration */}
        <JapanMapSilhouette className="absolute right-0 top-0 w-48 h-72 text-blue-400" />
        <JapanMapSilhouette className="absolute left-0 bottom-0 w-40 h-60 text-blue-400 transform rotate-180" />

        {/* Pin icon */}
        <div style={{ animation: "pinDrop 0.6s ease-out" }} className="mb-4">
          <MapPinIcon color="#E53E3E" size={64} />
        </div>

        {/* Title */}
        <h1
          className="text-3xl sm:text-4xl font-bold mb-3 text-gray-800"
          style={{ animation: "fadeIn 0.5s ease-out" }}
        >
          都道府県クイズ
        </h1>

        <p
          className="text-base mb-2 text-blue-600 font-medium"
          style={{ animation: "fadeIn 0.6s ease-out 0.1s both" }}
        >
          日本地理の知識を試そう
        </p>

        <p
          className="text-sm max-w-xs leading-relaxed mb-8 text-gray-500"
          style={{ animation: "fadeIn 0.6s ease-out 0.2s both" }}
        >
          県庁所在地、名物、地域、隣接県など
          <br />
          全{TOTAL_QUESTIONS}問の4択クイズ
        </p>

        {/* Start button */}
        <button
          onClick={handleStart}
          className="px-12 py-4 text-xl font-bold rounded-xl text-white"
          style={{
            background: "linear-gradient(135deg, #4299E1 0%, #3182CE 100%)",
            boxShadow: "0 4px 15px rgba(66, 153, 225, 0.4)",
            animation: "fadeInUp 0.5s ease-out 0.3s both",
            transition: "transform 0.15s ease, box-shadow 0.15s ease",
          }}
          onMouseDown={(e) => {
            e.currentTarget.style.transform = "scale(0.97)";
          }}
          onMouseUp={(e) => {
            e.currentTarget.style.transform = "scale(1)";
          }}
        >
          スタート
        </button>

        <Link
          href="/"
          className="mt-8 text-sm text-gray-400 font-medium"
          style={{ animation: "fadeIn 0.5s ease-out 0.4s both" }}
        >
          ← トップへ
        </Link>
      </div>
    );
  }

  /* ═══════ PLAYING ═══════ */
  if (phase === "playing" && questions.length > 0) {
    const q = questions[currentIndex];

    return (
      <div
        className="relative flex flex-col items-center min-h-screen px-4 overflow-hidden sky-gradient"
        style={{
          animation:
            answerState === "correct"
              ? "flashGreen 0.5s ease-out"
              : answerState === "wrong"
                ? "flashRed 0.5s ease-out"
                : undefined,
        }}
      >
        <TravelStyles />

        {/* Confetti on correct */}
        {showConfetti && <Confetti />}

        {/* Background map */}
        <JapanMapSilhouette className="absolute right-0 top-20 w-32 h-48 text-blue-300" />

        {/* Progress bar */}
        <div className="w-full max-w-md mt-4 mb-2">
          <div className="h-2 rounded-full overflow-hidden bg-blue-100">
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{
                width: `${((currentIndex + 1) / TOTAL_QUESTIONS) * 100}%`,
                background: "linear-gradient(90deg, #4299E1, #63B3ED)",
              }}
            />
          </div>
        </div>

        {/* Question info */}
        <div className="flex items-center gap-3 mb-2">
          <span className="text-sm font-bold text-gray-600">
            Q.{currentIndex + 1} / {TOTAL_QUESTIONS}
          </span>
          <span
            className="text-xs px-2 py-1 rounded-full font-medium"
            style={{
              background: "rgba(66, 153, 225, 0.15)",
              color: "#3182CE",
            }}
          >
            {typeLabels[q.type]}
          </span>
        </div>

        {/* Question card */}
        <div
          className="w-full max-w-md bg-white rounded-2xl p-6 card-shadow my-4"
          style={{ animation: "scaleIn 0.3s ease-out" }}
        >
          <div className="flex items-start gap-3">
            <MapPinIcon color="#E53E3E" size={28} />
            <p className="text-lg font-bold text-gray-800 leading-relaxed flex-1">
              {q.question}
            </p>
          </div>
        </div>

        {/* Answer feedback */}
        {answerState !== "none" && (
          <div
            className="flex items-center gap-2 mb-2"
            style={{ animation: "bounceIn 0.3s ease-out" }}
          >
            {answerState === "correct" ? (
              <>
                <CheckIcon size={28} />
                <span className="font-bold text-green-600">正解!</span>
              </>
            ) : (
              <>
                <CrossIcon size={28} />
                <span className="font-bold text-red-500">不正解...</span>
              </>
            )}
          </div>
        )}

        {/* Correct answer display when wrong */}
        {answerState === "wrong" && (
          <div
            className="text-center mb-3 px-4 py-2 rounded-lg bg-red-50 border border-red-200"
            style={{ animation: "fadeIn 0.3s ease-out" }}
          >
            <span className="text-red-600 font-medium">正解: {q.answer}</span>
          </div>
        )}

        {/* Choices */}
        <div className="w-full max-w-md grid grid-cols-1 gap-3 pb-8">
          {shuffledChoices.map((choice, i) => {
            let btnBg = "white";
            let btnBorder = "1px solid #E2E8F0";
            let btnColor = "#2D3748";

            if (answerState !== "none") {
              if (choice === q.answer) {
                btnBg = "linear-gradient(135deg, #C6F6D5 0%, #9AE6B4 100%)";
                btnBorder = "2px solid #48BB78";
                btnColor = "#276749";
              } else if (choice === selectedAnswer && answerState === "wrong") {
                btnBg = "linear-gradient(135deg, #FED7D7 0%, #FEB2B2 100%)";
                btnBorder = "2px solid #E53E3E";
                btnColor = "#C53030";
              }
            }

            return (
              <button
                key={choice}
                onClick={() => handleAnswer(choice)}
                disabled={answerState !== "none"}
                className="choice-btn w-full py-4 px-5 rounded-xl text-left font-medium card-shadow"
                style={{
                  background: btnBg,
                  border: btnBorder,
                  color: btnColor,
                  animation: `slideUp 0.3s ease-out ${i * 0.05}s both`,
                  cursor: answerState !== "none" ? "default" : "pointer",
                  opacity:
                    answerState !== "none" &&
                    choice !== q.answer &&
                    choice !== selectedAnswer
                      ? 0.5
                      : 1,
                }}
              >
                <div className="flex items-center gap-3">
                  <span
                    className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
                    style={{
                      background:
                        answerState !== "none" && choice === q.answer
                          ? "#48BB78"
                          : answerState !== "none" &&
                              choice === selectedAnswer &&
                              answerState === "wrong"
                            ? "#E53E3E"
                            : "rgba(66, 153, 225, 0.15)",
                      color:
                        answerState !== "none" &&
                        (choice === q.answer ||
                          (choice === selectedAnswer && answerState === "wrong"))
                          ? "white"
                          : "#3182CE",
                    }}
                  >
                    {String.fromCharCode(65 + i)}
                  </span>
                  <span>{choice}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Score display */}
        <div className="text-xs text-gray-400 pb-4">
          現在の正解数: {correctCount}
        </div>
      </div>
    );
  }

  /* ═══════ RESULT ═══════ */
  if (phase === "result" && rank) {
    return (
      <div className="relative flex flex-col items-center min-h-screen px-4 py-8 overflow-hidden sky-gradient">
        <TravelStyles />

        {/* Background decoration */}
        <JapanMapSilhouette className="absolute left-0 top-10 w-40 h-60 text-blue-300" />
        <JapanMapSilhouette className="absolute right-0 bottom-20 w-32 h-48 text-blue-300" />

        {/* Result header */}
        <div
          className="text-sm font-bold mt-4 mb-6 text-gray-500"
          style={{ animation: "fadeIn 0.4s ease-out" }}
        >
          -- 結果発表 --
        </div>

        {/* Rank display */}
        <div
          className="w-24 h-24 rounded-full flex items-center justify-center mb-4"
          style={{
            background: `linear-gradient(135deg, ${rank.color}20 0%, ${rank.color}40 100%)`,
            border: `3px solid ${rank.color}`,
            animation: "bounceIn 0.6s ease-out",
          }}
        >
          <span
            className="text-4xl font-bold"
            style={{ color: rank.color }}
          >
            {rank.rank}
          </span>
        </div>

        {/* Rank title */}
        <div
          className="text-2xl font-bold mb-1"
          style={{
            color: rank.color,
            animation: "scaleIn 0.5s ease-out 0.2s both",
          }}
        >
          {rank.title}
        </div>

        <div
          className="text-sm mb-6 text-gray-500"
          style={{ animation: "fadeIn 0.5s ease-out 0.3s both" }}
        >
          {rank.description}
        </div>

        {/* Score card */}
        <div
          className="bg-white rounded-2xl px-8 py-6 mb-6 text-center card-shadow"
          style={{ animation: "fadeInUp 0.5s ease-out 0.4s both" }}
        >
          <div className="text-sm mb-2 text-gray-500">正解数</div>
          <div className="text-5xl font-bold" style={{ color: rank.color }}>
            {correctCount}
            <span className="text-xl ml-1 text-gray-400">/ {TOTAL_QUESTIONS}</span>
          </div>
        </div>

        {/* Type breakdown */}
        <div
          className="bg-white rounded-2xl px-6 py-5 mb-8 w-full max-w-sm card-shadow"
          style={{ animation: "fadeInUp 0.5s ease-out 0.5s both" }}
        >
          <div className="text-sm font-bold mb-4 text-center text-gray-600">
            カテゴリ別 正解率
          </div>
          {(["capital", "famous", "region", "neighbor"] as QuestionType[]).map((t) => {
            const stat = typeStats[t];
            if (!stat || stat.total === 0) return null;
            const pct = Math.round((stat.correct / stat.total) * 100);
            return (
              <div
                key={t}
                className="flex items-center gap-3 py-2"
                style={{
                  borderBottom:
                    t !== "neighbor" ? "1px solid rgba(0,0,0,0.05)" : "none",
                }}
              >
                <div className="text-xs font-medium w-20 text-gray-600">
                  {typeLabels[t]}
                </div>
                <div className="flex-1 h-2 rounded-full overflow-hidden bg-gray-100">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${pct}%`,
                      background:
                        pct >= 80
                          ? "#48BB78"
                          : pct >= 50
                            ? "#ED8936"
                            : "#E53E3E",
                    }}
                  />
                </div>
                <div className="text-xs font-bold w-20 text-right text-gray-600">
                  {stat.correct}/{stat.total} ({pct}%)
                </div>
              </div>
            );
          })}
        </div>

        {/* Share & actions */}
        <div
          className="flex flex-col gap-3 w-full max-w-xs"
          style={{ animation: "fadeInUp 0.5s ease-out 0.6s both" }}
        >
          {typeof navigator !== "undefined" &&
            typeof navigator.share === "function" && (
              <button
                onClick={handleNativeShare}
                className="w-full py-4 text-lg font-bold rounded-xl text-white"
                style={{
                  background: `linear-gradient(135deg, ${rank.color} 0%, ${rank.color}CC 100%)`,
                  boxShadow: `0 4px 15px ${rank.color}40`,
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
              className="flex-1 py-3 font-bold text-center text-sm rounded-xl text-white"
              style={{ background: "#1DA1F2" }}
            >
              X share
            </a>
            <a
              href={`https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(shareUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-3 font-bold text-center text-sm rounded-xl text-white"
              style={{ background: "#06C755" }}
            >
              LINE
            </a>
          </div>

          <button
            onClick={handleStart}
            className="w-full py-3 font-bold rounded-xl mt-1 text-gray-600"
            style={{
              background: "transparent",
              border: "2px solid rgba(66, 153, 225, 0.3)",
            }}
          >
            もう一回
          </button>

          <Link
            href="/"
            className="text-center text-sm mt-2 text-gray-400 font-medium"
          >
            ← トップへ
          </Link>
        </div>

        <div className="h-8" />
      </div>
    );
  }

  return null;
}
