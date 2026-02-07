"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import {
  getRank,
  kanjiQuestions,
  type KanjiQuestion,
  type KanjiYomiRank,
} from "@/lib/kanji-yomi/ranks";
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

function pickQuestions(count: number): KanjiQuestion[] {
  return shuffle(kanjiQuestions).slice(0, count);
}

/* ═══════════════════════════════════════
   SVG Components
   ═══════════════════════════════════════ */

function StarIcon({
  filled,
  size = 16,
}: {
  filled: boolean;
  size?: number;
}) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24">
      <path
        d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
        fill={filled ? "#C41E3A" : "none"}
        stroke={filled ? "#C41E3A" : "#C4A882"}
        strokeWidth="1.5"
      />
    </svg>
  );
}

function DifficultyStars({ level }: { level: number }) {
  return (
    <div className="flex gap-0.5 justify-center">
      {Array.from({ length: 5 }).map((_, i) => (
        <StarIcon key={i} filled={i < level} size={14} />
      ))}
    </div>
  );
}

function MaruIcon({ size = 80 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      <circle
        cx="50"
        cy="50"
        r="40"
        fill="none"
        stroke="#C41E3A"
        strokeWidth="8"
        strokeLinecap="round"
        opacity="0.9"
      />
    </svg>
  );
}

function BatsuIcon({ size = 80 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      <line
        x1="20"
        y1="20"
        x2="80"
        y2="80"
        stroke="#2C1810"
        strokeWidth="8"
        strokeLinecap="round"
      />
      <line
        x1="80"
        y1="20"
        x2="20"
        y2="80"
        stroke="#2C1810"
        strokeWidth="8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function HankoStamp({
  text,
  color = "#C41E3A",
  size = 80,
}: {
  text: string;
  color?: string;
  size?: number;
}) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ transform: "rotate(-8deg)" }}>
      <rect
        x="8"
        y="8"
        width="84"
        height="84"
        rx="8"
        fill="none"
        stroke={color}
        strokeWidth="5"
        opacity="0.85"
      />
      <text
        x="50"
        y="62"
        textAnchor="middle"
        fontFamily="serif"
        fontSize={text.length <= 2 ? "42" : "30"}
        fontWeight="bold"
        fill={color}
        opacity="0.85"
      >
        {text}
      </text>
    </svg>
  );
}

/* ═══════════════════════════════════════
   Styles
   ═══════════════════════════════════════ */

function WafuStyles() {
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
      @keyframes stampIn {
        0% { transform: scale(2) rotate(-20deg); opacity: 0; }
        60% { transform: scale(0.9) rotate(-5deg); opacity: 1; }
        100% { transform: scale(1) rotate(-8deg); opacity: 1; }
      }
      @keyframes flashGreen {
        0% { background-color: rgba(76, 175, 80, 0.25); }
        100% { background-color: transparent; }
      }
      @keyframes flashRed {
        0% { background-color: rgba(196, 30, 58, 0.2); }
        100% { background-color: transparent; }
      }
      @keyframes inkSpread {
        0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(44,24,16,0.15); }
        50% { transform: scale(1.02); box-shadow: 0 0 12px 4px rgba(44,24,16,0.1); }
        100% { transform: scale(1); box-shadow: 0 2px 8px rgba(44,24,16,0.08); }
      }
      @keyframes kanjiAppear {
        0% { opacity: 0; transform: scale(0.8); }
        100% { opacity: 1; transform: scale(1); }
      }
      @keyframes resultReveal {
        0% { transform: scale(0) rotate(-15deg); opacity: 0; }
        50% { transform: scale(1.1) rotate(3deg); }
        100% { transform: scale(1) rotate(0deg); opacity: 1; }
      }
      @keyframes slideUp {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
      }
      .washi-texture {
        background-image:
          radial-gradient(ellipse at 20% 50%, rgba(200,180,150,0.08) 0%, transparent 50%),
          radial-gradient(ellipse at 80% 20%, rgba(180,160,130,0.06) 0%, transparent 50%),
          radial-gradient(ellipse at 50% 80%, rgba(190,170,140,0.05) 0%, transparent 50%);
      }
      .washi-card {
        background: linear-gradient(135deg, #FAF6F0 0%, #F0EAE0 100%);
        border: 1px solid rgba(44,24,16,0.12);
        box-shadow: 0 2px 8px rgba(44,24,16,0.08);
      }
      .choice-btn {
        transition: all 0.15s ease;
      }
      .choice-btn:active {
        transform: scale(0.97);
      }
    `}</style>
  );
}

/* ═══════════════════════════════════════
   Main Component
   ═══════════════════════════════════════ */

export default function GameClient() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [questions, setQuestions] = useState<KanjiQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [shuffledChoices, setShuffledChoices] = useState<string[]>([]);
  const [correctCount, setCorrectCount] = useState(0);
  const [answerState, setAnswerState] = useState<AnswerState>("none");
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [rank, setRank] = useState<KanjiYomiRank | null>(null);
  const [difficultyStats, setDifficultyStats] = useState<
    Record<number, { total: number; correct: number }>
  >({});

  const statsRef = useRef<Record<number, { total: number; correct: number }>>({});
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const setupQuestion = useCallback((qs: KanjiQuestion[], index: number) => {
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
    statsRef.current = {};
    setDifficultyStats({});
    setPhase("playing");
    setupQuestion(picked, 0);
  }, [setupQuestion]);

  const goToNext = useCallback(
    (qs: KanjiQuestion[], idx: number, correct: number) => {
      const nextIdx = idx + 1;
      if (nextIdx >= qs.length) {
        setRank(getRank(correct));
        setDifficultyStats({ ...statsRef.current });
        setPhase("result");
      } else {
        setCurrentIndex(nextIdx);
        setAnswerState("none");
        setSelectedAnswer(null);
        setupQuestion(qs, nextIdx);
      }
    },
    [setupQuestion]
  );

  const handleAnswer = useCallback(
    (choice: string) => {
      if (answerState !== "none") return;

      const q = questions[currentIndex];
      const isCorrect = choice === q.correct;
      const newCorrect = isCorrect ? correctCount + 1 : correctCount;

      setSelectedAnswer(choice);
      setCorrectCount(newCorrect);

      // Update difficulty stats
      const d = q.difficulty;
      if (!statsRef.current[d]) {
        statsRef.current[d] = { total: 0, correct: 0 };
      }
      statsRef.current[d].total += 1;
      if (isCorrect) {
        statsRef.current[d].correct += 1;
      }

      if (isCorrect) {
        setAnswerState("correct");
        timerRef.current = setTimeout(() => {
          goToNext(questions, currentIndex, newCorrect);
        }, 500);
      } else {
        setAnswerState("wrong");
        timerRef.current = setTimeout(() => {
          goToNext(questions, currentIndex, newCorrect);
        }, 1000);
      }
    },
    [answerState, questions, currentIndex, correctCount, goToNext]
  );

  // Share
  const shareUrl =
    typeof window !== "undefined" && rank
      ? `${window.location.origin}/kanji-yomi?score=${correctCount}&rank=${rank.rank}&title=${encodeURIComponent(rank.title)}`
      : "";

  const shareText = rank
    ? `漢字読みテストで${correctCount}/20正解！\nランク: ${rank.rank} ${rank.title}\n#漢字読みテスト\n`
    : "";

  const twitterUrl = rank
    ? `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`
    : "";

  const handleNativeShare = useCallback(async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "漢字読みテスト",
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
      <div
        className="relative flex flex-col items-center justify-center min-h-screen px-4 text-center overflow-hidden washi-texture"
        style={{ background: "#F5F0E8" }}
      >
        <WafuStyles />

        {/* Decorative lines */}
        <div
          className="absolute top-0 left-0 w-full h-1"
          style={{ background: "linear-gradient(90deg, transparent, #C41E3A, transparent)" }}
        />
        <div
          className="absolute bottom-0 left-0 w-full h-1"
          style={{ background: "linear-gradient(90deg, transparent, #C41E3A, transparent)" }}
        />

        {/* Hanko */}
        <div style={{ animation: "stampIn 0.6s ease-out" }} className="mb-4">
          <HankoStamp text="漢字" size={90} />
        </div>

        {/* Title */}
        <h1
          className="text-4xl sm:text-5xl font-bold mb-3"
          style={{
            fontFamily: "serif",
            color: "#2C1810",
            animation: "fadeIn 0.5s ease-out",
            letterSpacing: "0.1em",
          }}
        >
          漢字読みテスト
        </h1>

        <p
          className="text-base mb-2"
          style={{
            color: "#6B5744",
            fontFamily: "serif",
            animation: "fadeIn 0.6s ease-out 0.1s both",
          }}
        >
          あなたの漢字力を試す
        </p>

        <p
          className="text-sm max-w-xs leading-relaxed mb-8"
          style={{
            color: "#8B7B6B",
            animation: "fadeIn 0.6s ease-out 0.2s both",
          }}
        >
          漢字の読み方を四択から選んでください
          <br />
          全{TOTAL_QUESTIONS}問 -- 難易度はランダム
        </p>

        {/* Start button */}
        <button
          onClick={handleStart}
          className="px-12 py-4 text-xl font-bold rounded-lg"
          style={{
            fontFamily: "serif",
            background: "#C41E3A",
            color: "#FAF6F0",
            border: "2px solid #A01830",
            boxShadow: "0 4px 12px rgba(196,30,58,0.3)",
            animation: "fadeInUp 0.5s ease-out 0.3s both",
            transition: "transform 0.15s ease, box-shadow 0.15s ease",
            letterSpacing: "0.15em",
          }}
          onMouseDown={(e) =>
            ((e.currentTarget.style.transform = "scale(0.97)"),
            (e.currentTarget.style.boxShadow =
              "0 2px 6px rgba(196,30,58,0.3)"))
          }
          onMouseUp={(e) =>
            ((e.currentTarget.style.transform = "scale(1)"),
            (e.currentTarget.style.boxShadow =
              "0 4px 12px rgba(196,30,58,0.3)"))
          }
        >
          始める
        </button>

        <Link
          href="/"
          className="mt-8 text-sm transition-colors font-bold"
          style={{
            color: "#A09080",
            animation: "fadeIn 0.5s ease-out 0.4s both",
          }}
        >
          ← トップへ
        </Link>
      </div>
    );
  }

  /* ═══════ PLAYING ═══════ */
  if (phase === "playing" && questions.length > 0) {
    const q = questions[currentIndex];
    const flashClass =
      answerState === "correct"
        ? "flash-green"
        : answerState === "wrong"
          ? "flash-red"
          : "";

    return (
      <div
        className="relative flex flex-col items-center min-h-screen px-4 overflow-hidden washi-texture"
        style={{
          background: "#F5F0E8",
          animation:
            answerState === "correct"
              ? "flashGreen 0.4s ease-out"
              : answerState === "wrong"
                ? "flashRed 0.5s ease-out"
                : undefined,
        }}
      >
        <WafuStyles />

        {/* Progress bar */}
        <div className="w-full max-w-md mt-4 mb-2">
          <div
            className="h-1.5 rounded-full overflow-hidden"
            style={{ background: "rgba(44,24,16,0.08)" }}
          >
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{
                width: `${((currentIndex + 1) / TOTAL_QUESTIONS) * 100}%`,
                background: "linear-gradient(90deg, #C41E3A, #E8524A)",
              }}
            />
          </div>
        </div>

        {/* Question number */}
        <div
          className="text-sm font-bold mb-1"
          style={{ color: "#8B7B6B", fontFamily: "serif" }}
        >
          Q.{currentIndex + 1} / {TOTAL_QUESTIONS}
        </div>

        {/* Difficulty stars */}
        <DifficultyStars level={q.difficulty} />

        {/* Kanji display */}
        <div
          className="flex items-center justify-center my-6 sm:my-10"
          style={{ minHeight: "140px" }}
        >
          <div
            className={flashClass}
            style={{
              fontFamily: "serif",
              fontSize: q.kanji.length <= 2 ? "5rem" : q.kanji.length <= 3 ? "4rem" : "3rem",
              color: "#2C1810",
              fontWeight: "bold",
              lineHeight: 1.2,
              animation: "kanjiAppear 0.3s ease-out",
              letterSpacing: "0.05em",
            }}
          >
            {q.kanji}
          </div>
        </div>

        {/* Answer feedback overlay */}
        {answerState !== "none" && (
          <div
            className="absolute top-1/3 left-1/2 pointer-events-none"
            style={{
              transform: "translate(-50%, -50%)",
              animation: "resultReveal 0.3s ease-out",
              zIndex: 10,
            }}
          >
            {answerState === "correct" ? (
              <MaruIcon size={100} />
            ) : (
              <BatsuIcon size={100} />
            )}
          </div>
        )}

        {/* Correct answer display when wrong */}
        {answerState === "wrong" && (
          <div
            className="text-center mb-4 px-4 py-2 rounded-lg"
            style={{
              background: "rgba(196,30,58,0.08)",
              border: "1px solid rgba(196,30,58,0.2)",
              animation: "fadeIn 0.3s ease-out",
              fontFamily: "serif",
              color: "#C41E3A",
              fontSize: "0.95rem",
            }}
          >
            正解: {q.correct}
          </div>
        )}

        {/* Choices */}
        <div className="w-full max-w-md grid grid-cols-1 gap-3 pb-8">
          {shuffledChoices.map((choice) => {
            let btnBg = "linear-gradient(135deg, #FAF6F0 0%, #F0EAE0 100%)";
            let btnBorder = "1px solid rgba(44,24,16,0.12)";
            let btnColor = "#2C1810";

            if (answerState !== "none") {
              if (choice === q.correct) {
                btnBg = "linear-gradient(135deg, #E8F5E9 0%, #C8E6C9 100%)";
                btnBorder = "2px solid #4CAF50";
                btnColor = "#2E7D32";
              } else if (choice === selectedAnswer && answerState === "wrong") {
                btnBg = "linear-gradient(135deg, #FFEBEE 0%, #FFCDD2 100%)";
                btnBorder = "2px solid #C41E3A";
                btnColor = "#C41E3A";
              }
            }

            return (
              <button
                key={choice}
                onClick={() => handleAnswer(choice)}
                disabled={answerState !== "none"}
                className="choice-btn w-full py-4 px-6 rounded-lg text-lg font-bold text-center"
                style={{
                  fontFamily: "serif",
                  background: btnBg,
                  border: btnBorder,
                  color: btnColor,
                  boxShadow: "0 2px 8px rgba(44,24,16,0.08)",
                  animation: `inkSpread 0.3s ease-out`,
                  cursor: answerState !== "none" ? "default" : "pointer",
                  opacity: answerState !== "none" && choice !== q.correct && choice !== selectedAnswer ? 0.5 : 1,
                  letterSpacing: "0.1em",
                }}
              >
                {choice}
              </button>
            );
          })}
        </div>

        {/* Score display */}
        <div
          className="text-xs pb-4"
          style={{ color: "#A09080", fontFamily: "serif" }}
        >
          現在の正解数: {correctCount}
        </div>
      </div>
    );
  }

  /* ═══════ RESULT ═══════ */
  if (phase === "result" && rank) {
    const difficultyLabels: Record<number, string> = {
      1: "初級",
      2: "中級",
      3: "上級",
      4: "難読",
      5: "超難読",
    };

    return (
      <div
        className="relative flex flex-col items-center min-h-screen px-4 py-8 overflow-hidden washi-texture"
        style={{ background: "#F5F0E8" }}
      >
        <WafuStyles />

        {/* Top line */}
        <div
          className="absolute top-0 left-0 w-full h-1"
          style={{
            background: `linear-gradient(90deg, transparent, ${rank.color}, transparent)`,
          }}
        />

        {/* Result header */}
        <div
          className="text-sm font-bold mt-4 mb-6"
          style={{
            color: "#8B7B6B",
            fontFamily: "serif",
            animation: "fadeIn 0.4s ease-out",
            letterSpacing: "0.15em",
          }}
        >
          -- 結果発表 --
        </div>

        {/* Hanko stamp with rank */}
        <div
          className="mb-4"
          style={{ animation: "stampIn 0.7s ease-out" }}
        >
          <HankoStamp text={rank.rank} color={rank.color} size={100} />
        </div>

        {/* Rank title */}
        <div
          className="text-3xl font-bold mb-1"
          style={{
            fontFamily: "serif",
            color: rank.color,
            animation: "resultReveal 0.6s ease-out 0.2s both",
            letterSpacing: "0.1em",
          }}
        >
          {rank.title}
        </div>

        <div
          className="text-sm mb-6"
          style={{
            color: "#8B7B6B",
            fontFamily: "serif",
            animation: "fadeIn 0.5s ease-out 0.3s both",
          }}
        >
          {rank.description}
        </div>

        {/* Score display */}
        <div
          className="washi-card rounded-xl px-8 py-6 mb-6 text-center"
          style={{
            animation: "fadeInUp 0.5s ease-out 0.4s both",
          }}
        >
          <div
            className="text-sm mb-2"
            style={{ color: "#8B7B6B", fontFamily: "serif" }}
          >
            正解数
          </div>
          <div
            className="text-5xl font-bold"
            style={{
              fontFamily: "serif",
              color: rank.color,
            }}
          >
            {correctCount}
            <span
              className="text-xl ml-1"
              style={{ color: "#8B7B6B" }}
            >
              / {TOTAL_QUESTIONS}
            </span>
          </div>
        </div>

        {/* Difficulty breakdown */}
        <div
          className="washi-card rounded-xl px-6 py-5 mb-8 w-full max-w-sm"
          style={{ animation: "fadeInUp 0.5s ease-out 0.5s both" }}
        >
          <div
            className="text-sm font-bold mb-3 text-center"
            style={{ color: "#6B5744", fontFamily: "serif", letterSpacing: "0.1em" }}
          >
            難易度別 正解率
          </div>
          {[1, 2, 3, 4, 5].map((d) => {
            const stat = difficultyStats[d];
            if (!stat || stat.total === 0) return null;
            const pct = Math.round((stat.correct / stat.total) * 100);
            return (
              <div
                key={d}
                className="flex items-center gap-3 py-2"
                style={{
                  borderBottom:
                    d < 5 ? "1px solid rgba(44,24,16,0.06)" : "none",
                }}
              >
                <div
                  className="text-xs font-bold w-14 text-right"
                  style={{ color: "#6B5744", fontFamily: "serif" }}
                >
                  {difficultyLabels[d]}
                </div>
                <div className="flex gap-0.5">
                  {Array.from({ length: d }).map((_, i) => (
                    <StarIcon key={i} filled size={12} />
                  ))}
                </div>
                <div
                  className="flex-1 h-2 rounded-full overflow-hidden"
                  style={{ background: "rgba(44,24,16,0.06)" }}
                >
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${pct}%`,
                      background:
                        pct >= 80
                          ? "#4CAF50"
                          : pct >= 50
                            ? "#FF9800"
                            : "#C41E3A",
                      transition: "width 0.5s ease",
                    }}
                  />
                </div>
                <div
                  className="text-xs font-bold w-16 text-right"
                  style={{ color: "#6B5744", fontFamily: "serif" }}
                >
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
                className="w-full py-4 text-lg font-bold rounded-lg"
                style={{
                  fontFamily: "serif",
                  background: rank.color,
                  color: "#FAF6F0",
                  border: "none",
                  boxShadow: `0 4px 12px ${rank.color}40`,
                  letterSpacing: "0.1em",
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
              className="flex-1 py-3 font-bold text-center text-sm rounded-lg"
              style={{
                fontFamily: "serif",
                background: "#2C1810",
                color: "#FAF6F0",
                border: "1px solid #1a0f08",
              }}
            >
              X share
            </a>
            <a
              href={`https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(shareUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-3 font-bold text-center text-sm rounded-lg"
              style={{
                fontFamily: "serif",
                background: "#06C755",
                color: "#FAF6F0",
                border: "1px solid #04a043",
              }}
            >
              LINE
            </a>
          </div>

          <button
            onClick={handleStart}
            className="w-full py-3 font-bold rounded-lg mt-1"
            style={{
              fontFamily: "serif",
              background: "transparent",
              color: "#6B5744",
              border: "2px solid rgba(44,24,16,0.2)",
              letterSpacing: "0.1em",
            }}
          >
            もう一回
          </button>

          <Link
            href="/"
            className="text-center text-sm mt-2 transition-colors font-bold"
            style={{ color: "#A09080" }}
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
