"use client";

import { useState, useCallback, useRef } from "react";
import { kanjiStrokes, kanjiList } from "@/lib/kanji-order/strokes";
import { getRank } from "@/lib/kanji-order/ranks";
import Link from "next/link";

const TOTAL_QUESTIONS = 15;

type Phase = "idle" | "playing" | "feedback" | "result";

interface Question {
  kanji: string;
  askStroke: number; // 0-indexed
}

function generateQuestions(): Question[] {
  const shuffled = [...kanjiList].sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, TOTAL_QUESTIONS);
  return selected.map((kanji) => {
    const data = kanjiStrokes[kanji];
    const askStroke = Math.floor(Math.random() * data.strokeCount);
    return { kanji, askStroke };
  });
}

/* ═══════════════════════════════════════
   SVG Icons (no emoji)
   ═══════════════════════════════════════ */

function IconBrush({ size = 64, color = "#FFD700" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ filter: `drop-shadow(0 0 8px ${color}60)` }}>
      <rect x="44" y="10" width="12" height="55" rx="3" fill={color} />
      <rect x="40" y="60" width="20" height="12" rx="2" fill="#8B6914" />
      <path d="M42 72 Q50 95 58 72" fill={color} opacity="0.8" />
      <rect x="42" y="10" width="16" height="8" rx="2" fill="#8B6914" opacity="0.5" />
    </svg>
  );
}

function IconCheck({ size = 40, color = "#22C55E" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      <circle cx="50" cy="50" r="45" fill={color} opacity="0.15" />
      <polyline points="25,52 42,70 75,32" fill="none" stroke={color} strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconX({ size = 40, color = "#EF4444" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      <circle cx="50" cy="50" r="45" fill={color} opacity="0.15" />
      <line x1="30" y1="30" x2="70" y2="70" stroke={color} strokeWidth="10" strokeLinecap="round" />
      <line x1="70" y1="30" x2="30" y2="70" stroke={color} strokeWidth="10" strokeLinecap="round" />
    </svg>
  );
}

function IconStar({ size = 64, color = "#FFD700" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ filter: `drop-shadow(0 0 10px ${color}80)` }}>
      <polygon
        points="50,8 61,38 93,38 67,58 77,90 50,70 23,90 33,58 7,38 39,38"
        fill={color}
        stroke="rgba(0,0,0,0.15)"
        strokeWidth="2"
      />
    </svg>
  );
}

/* ═══════════════════════════════════════
   Rank icon by rank letter
   ═══════════════════════════════════════ */
function RankIcon({ rank, size = 64 }: { rank: string; size?: number }) {
  switch (rank) {
    case "S": return <IconStar size={size} color="#FFD700" />;
    case "A": return <IconBrush size={size} color="#FF6B35" />;
    case "B": return <IconBrush size={size} color="#4ECDC4" />;
    case "C": return <IconBrush size={size} color="#45B7D1" />;
    case "D": return <IconBrush size={size} color="#96CEB4" />;
    default: return <IconBrush size={size} color="#A8A8A8" />;
  }
}

/* ═══════════════════════════════════════
   Main Component
   ═══════════════════════════════════════ */
export default function GameClient() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [strokeStates, setStrokeStates] = useState<Record<number, "correct" | "wrong" | "reveal">>({});
  const [lastCorrect, setLastCorrect] = useState<boolean | null>(null);
  const [hoveredStroke, setHoveredStroke] = useState<number | null>(null);
  const lockedRef = useRef(false);

  const startGame = useCallback(() => {
    const qs = generateQuestions();
    setQuestions(qs);
    setCurrentQ(0);
    setCorrect(0);
    setStrokeStates({});
    setLastCorrect(null);
    setHoveredStroke(null);
    lockedRef.current = false;
    setPhase("playing");
  }, []);

  const handleStrokeTap = useCallback(
    (strokeIndex: number) => {
      if (phase !== "playing" || lockedRef.current) return;
      lockedRef.current = true;

      const q = questions[currentQ];
      const isCorrect = strokeIndex === q.askStroke;

      if (isCorrect) {
        setCorrect((c) => c + 1);
        setStrokeStates({ [strokeIndex]: "correct" });
        setLastCorrect(true);
      } else {
        setStrokeStates({
          [strokeIndex]: "wrong",
          [q.askStroke]: "reveal",
        });
        setLastCorrect(false);
      }

      setPhase("feedback");
      const delay = isCorrect ? 700 : 1000;

      setTimeout(() => {
        const next = currentQ + 1;
        if (next >= TOTAL_QUESTIONS) {
          setPhase("result");
        } else {
          setCurrentQ(next);
          setStrokeStates({});
          setLastCorrect(null);
          setHoveredStroke(null);
          lockedRef.current = false;
          setPhase("playing");
        }
      }, delay);
    },
    [phase, questions, currentQ]
  );

  const getStrokeColor = useCallback(
    (index: number): string => {
      const state = strokeStates[index];
      if (state === "correct") return "#22C55E";
      if (state === "wrong") return "#EF4444";
      if (state === "reveal") return "#22C55E";
      if (hoveredStroke === index) return "#CCC";
      return "#999";
    },
    [strokeStates, hoveredStroke]
  );

  const getStrokeFilter = useCallback(
    (index: number): string => {
      const state = strokeStates[index];
      if (state === "correct" || state === "reveal") return "drop-shadow(0 0 6px #22C55E)";
      if (state === "wrong") return "drop-shadow(0 0 6px #EF4444)";
      return "none";
    },
    [strokeStates]
  );

  const getStrokeAnimation = useCallback(
    (index: number): string | undefined => {
      const state = strokeStates[index];
      if (state === "wrong") return "shake 0.3s ease-in-out";
      if (state === "reveal") return "pulse-green 0.6s ease-in-out infinite";
      return undefined;
    },
    [strokeStates]
  );

  // Share
  const handleShare = useCallback(() => {
    const rankData = getRank(correct);
    const url = `${window.location.origin}/kanji-order?score=${correct}&rank=${rankData.rank}&title=${encodeURIComponent(rankData.title)}`;
    const text = `書き順テスト: ${correct}/${TOTAL_QUESTIONS}問正解！\nランク: ${rankData.rank}「${rankData.title}」\n${rankData.description}\n\n`;

    if (navigator.share) {
      navigator.share({ title: "書き順テスト", text, url }).catch(() => {});
    } else {
      navigator.clipboard.writeText(text + url).catch(() => {});
    }
  }, [correct]);

  const handleTweet = useCallback(() => {
    const rankData = getRank(correct);
    const url = `${window.location.origin}/kanji-order?score=${correct}&rank=${rankData.rank}&title=${encodeURIComponent(rankData.title)}`;
    const text = `書き順テスト: ${correct}/${TOTAL_QUESTIONS}問正解！\nランク: ${rankData.rank}「${rankData.title}」\n${rankData.description}`;
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      "_blank"
    );
  }, [correct]);

  /* ═══════════════════════════════════════
     RENDER
     ═══════════════════════════════════════ */

  return (
    <div
      style={{
        minHeight: "100dvh",
        background: "linear-gradient(145deg, #1E3A2F 0%, #2D4A3E 40%, #1E3A2F 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "16px",
        fontFamily: "'Rounded Mplus 1c', 'Hiragino Kaku Gothic ProN', sans-serif",
        touchAction: "manipulation",
        userSelect: "none",
        WebkitUserSelect: "none",
      }}
    >
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-4px); }
          40% { transform: translateX(4px); }
          60% { transform: translateX(-3px); }
          80% { transform: translateX(3px); }
        }
        @keyframes pulse-green {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes popIn {
          0% { transform: scale(0.8); opacity: 0; }
          60% { transform: scale(1.05); }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* Header */}
      <div style={{ width: "100%", maxWidth: 480, marginBottom: 8 }}>
        <Link
          href="/"
          style={{
            color: "rgba(255,255,255,0.5)",
            textDecoration: "none",
            fontSize: 13,
          }}
        >
          ← トップ
        </Link>
      </div>

      <h1
        style={{
          color: "#E8DCC8",
          fontSize: "clamp(20px, 5vw, 28px)",
          fontWeight: 700,
          margin: "0 0 4px",
          textShadow: "1px 1px 3px rgba(0,0,0,0.4)",
          letterSpacing: 2,
        }}
      >
        書き順テスト
      </h1>
      <p
        style={{
          color: "rgba(232,220,200,0.6)",
          fontSize: 12,
          margin: "0 0 16px",
        }}
      >
        何画目はどれ？
      </p>

      {/* Main Card */}
      <div
        style={{
          width: "100%",
          maxWidth: 420,
          background: "linear-gradient(180deg, #1A332B 0%, #162A23 100%)",
          borderRadius: 16,
          border: "3px solid #8B7355",
          boxShadow: "0 0 0 6px #6B5740, 0 8px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)",
          overflow: "hidden",
        }}
      >
        {/* ─── IDLE ─── */}
        {phase === "idle" && (
          <div
            style={{
              padding: "48px 24px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 24,
              animation: "fadeIn 0.4s ease-out",
            }}
          >
            <IconBrush size={80} color="#E8DCC8" />
            <div style={{ textAlign: "center" }}>
              <p
                style={{
                  color: "#E8DCC8",
                  fontSize: 18,
                  fontWeight: 600,
                  margin: "0 0 8px",
                }}
              >
                漢字の書き順クイズ
              </p>
              <p
                style={{
                  color: "rgba(232,220,200,0.6)",
                  fontSize: 14,
                  margin: 0,
                  lineHeight: 1.6,
                }}
              >
                漢字の書き順クイズ！<br />
                「N画目はどれ？」と聞かれたら<br />
                正しい画をタップしてね。
              </p>
            </div>
            <div
              style={{
                background: "rgba(232,220,200,0.08)",
                borderRadius: 12,
                padding: "12px 20px",
                textAlign: "center",
              }}
            >
              <p style={{ color: "rgba(232,220,200,0.5)", fontSize: 12, margin: "0 0 4px" }}>
                出題数
              </p>
              <p style={{ color: "#E8DCC8", fontSize: 28, fontWeight: 700, margin: 0 }}>
                {TOTAL_QUESTIONS}問
              </p>
            </div>
            <button
              onClick={startGame}
              style={{
                background: "linear-gradient(135deg, #22C55E, #16A34A)",
                color: "#fff",
                border: "none",
                borderRadius: 12,
                padding: "16px 48px",
                fontSize: 18,
                fontWeight: 700,
                cursor: "pointer",
                boxShadow: "0 4px 16px rgba(34,197,94,0.3)",
                transition: "transform 0.1s, box-shadow 0.1s",
                touchAction: "manipulation",
              }}
              onPointerDown={(e) => {
                (e.currentTarget as HTMLButtonElement).style.transform = "scale(0.96)";
              }}
              onPointerUp={(e) => {
                (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)";
              }}
            >
              スタート
            </button>
          </div>
        )}

        {/* ─── PLAYING / FEEDBACK ─── */}
        {(phase === "playing" || phase === "feedback") && questions.length > 0 && (
          <div style={{ padding: "16px 16px 24px" }}>
            {/* Progress bar */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 12,
              }}
            >
              <span
                style={{
                  color: "#E8DCC8",
                  fontSize: 14,
                  fontWeight: 700,
                  letterSpacing: 1,
                }}
              >
                Q.{currentQ + 1} / {TOTAL_QUESTIONS}
              </span>
              <span style={{ color: "rgba(232,220,200,0.5)", fontSize: 13 }}>
                正解: {correct}
              </span>
            </div>
            <div
              style={{
                height: 4,
                background: "rgba(232,220,200,0.1)",
                borderRadius: 2,
                marginBottom: 16,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${((currentQ + (phase === "feedback" ? 1 : 0)) / TOTAL_QUESTIONS) * 100}%`,
                  background: "linear-gradient(90deg, #22C55E, #16A34A)",
                  borderRadius: 2,
                  transition: "width 0.3s ease",
                }}
              />
            </div>

            {/* Question */}
            <div
              style={{
                textAlign: "center",
                marginBottom: 16,
              }}
            >
              <span
                style={{
                  color: "#E8DCC8",
                  fontSize: 16,
                  fontWeight: 600,
                  display: "inline-block",
                  padding: "6px 16px",
                  background: "rgba(232,220,200,0.08)",
                  borderRadius: 20,
                }}
              >
                「{questions[currentQ].kanji}」の
                <span style={{ color: "#FFD700", fontWeight: 800, fontSize: 20 }}>
                  {questions[currentQ].askStroke + 1}
                </span>
                画目はどれ？
              </span>
            </div>

            {/* SVG Kanji */}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginBottom: 16,
              }}
            >
              <div
                style={{
                  background: "rgba(0,0,0,0.3)",
                  borderRadius: 12,
                  padding: 16,
                  border: "1px solid rgba(232,220,200,0.1)",
                  animation: phase === "playing" ? "popIn 0.3s ease-out" : undefined,
                }}
              >
                <svg
                  viewBox="0 0 109 109"
                  width={280}
                  height={280}
                  style={{ display: "block", maxWidth: "70vw", height: "auto" }}
                >
                  {kanjiStrokes[questions[currentQ].kanji].strokes.map((d, i) => (
                    <g key={`${currentQ}-${i}`}>
                      {/* Invisible fat hit area */}
                      <path
                        d={d}
                        fill="none"
                        stroke="transparent"
                        strokeWidth={18}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        onClick={() => handleStrokeTap(i)}
                        onPointerEnter={() => {
                          if (phase === "playing" && !lockedRef.current) setHoveredStroke(i);
                        }}
                        onPointerLeave={() => setHoveredStroke(null)}
                        style={{
                          cursor: phase === "playing" && !lockedRef.current ? "pointer" : "default",
                          touchAction: "manipulation",
                        }}
                      />
                      {/* Visible stroke */}
                      <path
                        d={d}
                        fill="none"
                        stroke={getStrokeColor(i)}
                        strokeWidth={4}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        style={{
                          filter: getStrokeFilter(i),
                          animation: getStrokeAnimation(i),
                          transition: "stroke 0.15s ease",
                          pointerEvents: "none",
                        }}
                      />
                    </g>
                  ))}
                </svg>
              </div>
            </div>

            {/* Feedback indicator */}
            <div style={{ minHeight: 48, display: "flex", justifyContent: "center", alignItems: "center" }}>
              {phase === "feedback" && lastCorrect === true && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    animation: "popIn 0.3s ease-out",
                  }}
                >
                  <IconCheck size={32} />
                  <span style={{ color: "#22C55E", fontSize: 18, fontWeight: 700 }}>
                    正解！
                  </span>
                </div>
              )}
              {phase === "feedback" && lastCorrect === false && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    animation: "popIn 0.3s ease-out",
                  }}
                >
                  <IconX size={32} />
                  <span style={{ color: "#EF4444", fontSize: 18, fontWeight: 700 }}>
                    不正解... {questions[currentQ].askStroke + 1}画目は緑の画
                  </span>
                </div>
              )}
              {phase === "playing" && (
                <p style={{ color: "rgba(232,220,200,0.4)", fontSize: 13, margin: 0 }}>
                  画をタップしてください
                </p>
              )}
            </div>
          </div>
        )}

        {/* ─── RESULT ─── */}
        {phase === "result" && (() => {
          const rankData = getRank(correct);
          return (
            <div
              style={{
                padding: "36px 24px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 20,
                animation: "fadeIn 0.5s ease-out",
              }}
            >
              <RankIcon rank={rankData.rank} size={72} />

              <div style={{ textAlign: "center" }}>
                <p style={{ color: "rgba(232,220,200,0.5)", fontSize: 13, margin: "0 0 4px" }}>
                  あなたのランク
                </p>
                <p
                  style={{
                    color: rankData.color,
                    fontSize: 48,
                    fontWeight: 900,
                    margin: "0 0 4px",
                    textShadow: `0 0 20px ${rankData.color}60`,
                  }}
                >
                  {rankData.rank}
                </p>
                <p style={{ color: "#E8DCC8", fontSize: 20, fontWeight: 700, margin: "0 0 4px" }}>
                  {rankData.title}
                </p>
                <p style={{ color: "rgba(232,220,200,0.6)", fontSize: 14, margin: 0 }}>
                  {rankData.description}
                </p>
              </div>

              {/* Score */}
              <div
                style={{
                  background: "rgba(232,220,200,0.08)",
                  borderRadius: 12,
                  padding: "16px 32px",
                  textAlign: "center",
                }}
              >
                <p style={{ color: "rgba(232,220,200,0.5)", fontSize: 12, margin: "0 0 4px" }}>
                  正解数
                </p>
                <p style={{ color: "#E8DCC8", fontSize: 36, fontWeight: 800, margin: 0 }}>
                  {correct}
                  <span style={{ fontSize: 16, fontWeight: 400, opacity: 0.6 }}>
                    {" "}/ {TOTAL_QUESTIONS}
                  </span>
                </p>
              </div>

              {/* Buttons */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                  width: "100%",
                  maxWidth: 280,
                }}
              >
                <button
                  onClick={startGame}
                  style={{
                    background: "linear-gradient(135deg, #22C55E, #16A34A)",
                    color: "#fff",
                    border: "none",
                    borderRadius: 12,
                    padding: "14px 0",
                    fontSize: 16,
                    fontWeight: 700,
                    cursor: "pointer",
                    boxShadow: "0 4px 16px rgba(34,197,94,0.3)",
                    touchAction: "manipulation",
                  }}
                >
                  もう一度
                </button>
                <button
                  onClick={handleTweet}
                  style={{
                    background: "linear-gradient(135deg, #1DA1F2, #0D8BD9)",
                    color: "#fff",
                    border: "none",
                    borderRadius: 12,
                    padding: "14px 0",
                    fontSize: 16,
                    fontWeight: 700,
                    cursor: "pointer",
                    boxShadow: "0 4px 16px rgba(29,161,242,0.3)",
                    touchAction: "manipulation",
                  }}
                >
                  Xでシェア
                </button>
                <button
                  onClick={handleShare}
                  style={{
                    background: "rgba(232,220,200,0.1)",
                    color: "#E8DCC8",
                    border: "1px solid rgba(232,220,200,0.2)",
                    borderRadius: 12,
                    padding: "14px 0",
                    fontSize: 16,
                    fontWeight: 700,
                    cursor: "pointer",
                    touchAction: "manipulation",
                  }}
                >
                  結果をシェア
                </button>
              </div>

              {/* Nav */}
              <Link
                href="/"
                style={{
                  color: "rgba(232,220,200,0.4)",
                  fontSize: 13,
                  textDecoration: "none",
                  marginTop: 8,
                }}
              >
                ← トップへ戻る
              </Link>
            </div>
          );
        })()}
      </div>

      {/* Footer */}
      <p
        style={{
          color: "rgba(232,220,200,0.3)",
          fontSize: 11,
          marginTop: 24,
          textAlign: "center",
        }}
      >
        Stroke data: KanjiVG (CC BY-SA 3.0)
      </p>
    </div>
  );
}
