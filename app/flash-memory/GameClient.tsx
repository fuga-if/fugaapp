"use client";

import { useState, useCallback, useEffect, useRef, useMemo } from "react";
import { getRank, type FlashMemoryRank } from "@/lib/flash-memory/ranks";
import Link from "next/link";

/* ═══════════════════════════════════════
   Types & Constants
   ═══════════════════════════════════════ */

type Phase = "idle" | "memorize" | "recall" | "correct" | "wrong" | "result";

interface Bubble {
  id: number;
  value: number;
  x: number; // percent
  y: number; // percent
}

interface LevelConfig {
  count: number;
  displayTime: number; // ms
}

const MAX_MISSES = 2;
const BUBBLE_SIZE = 56; // px
const BUBBLE_MIN_DIST = 72; // px minimum distance between centers
const FIELD_PADDING = 10; // percent padding from edges

function getLevelConfig(level: number): LevelConfig {
  const configs: Record<number, LevelConfig> = {
    1:  { count: 3, displayTime: 3000 },
    2:  { count: 3, displayTime: 2000 },
    3:  { count: 4, displayTime: 2500 },
    4:  { count: 4, displayTime: 2000 },
    5:  { count: 5, displayTime: 2000 },
    6:  { count: 5, displayTime: 1500 },
    7:  { count: 6, displayTime: 2000 },
    8:  { count: 6, displayTime: 1500 },
    9:  { count: 7, displayTime: 1500 },
    10: { count: 7, displayTime: 1000 },
    11: { count: 8, displayTime: 1500 },
  };
  if (level >= 12) return { count: 9, displayTime: 1000 };
  return configs[level] || { count: 3, displayTime: 3000 };
}

/* ═══════════════════════════════════════
   SVG Icons (no emoji!)
   ═══════════════════════════════════════ */

function IconBrain({ size = 80, color = "#4ECDC4" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ filter: `drop-shadow(0 0 12px ${color}60)` }}>
      <path d="M50 10 C30 10 18 25 18 40 C18 48 22 55 28 59 C26 64 27 70 32 74 C34 78 40 82 46 83 L46 90 L54 90 L54 83 C60 82 66 78 68 74 C73 70 74 64 72 59 C78 55 82 48 82 40 C82 25 70 10 50 10Z"
        fill="none" stroke={color} strokeWidth="3" />
      <path d="M50 20 L50 80" stroke={color} strokeWidth="2" opacity="0.4" />
      <path d="M35 30 C30 35 30 45 35 50" stroke={color} strokeWidth="2" opacity="0.5" fill="none" />
      <path d="M65 30 C70 35 70 45 65 50" stroke={color} strokeWidth="2" opacity="0.5" fill="none" />
      <path d="M38 55 C35 60 36 68 40 72" stroke={color} strokeWidth="2" opacity="0.5" fill="none" />
      <path d="M62 55 C65 60 64 68 60 72" stroke={color} strokeWidth="2" opacity="0.5" fill="none" />
      <circle cx="35" cy="38" r="3" fill={color} opacity="0.6" />
      <circle cx="65" cy="38" r="3" fill={color} opacity="0.6" />
      <circle cx="42" cy="60" r="2.5" fill={color} opacity="0.5" />
      <circle cx="58" cy="60" r="2.5" fill={color} opacity="0.5" />
    </svg>
  );
}

function IconNeuron({ size = 80, color = "#00D4FF" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ filter: `drop-shadow(0 0 10px ${color}50)` }}>
      <circle cx="50" cy="50" r="12" fill={color} opacity="0.8" />
      <circle cx="50" cy="50" r="6" fill="#fff" opacity="0.4" />
      <line x1="50" y1="38" x2="50" y2="12" stroke={color} strokeWidth="2.5" opacity="0.6" />
      <line x1="50" y1="62" x2="50" y2="88" stroke={color} strokeWidth="2.5" opacity="0.6" />
      <line x1="38" y1="44" x2="18" y2="25" stroke={color} strokeWidth="2.5" opacity="0.6" />
      <line x1="62" y1="44" x2="82" y2="25" stroke={color} strokeWidth="2.5" opacity="0.6" />
      <line x1="38" y1="56" x2="18" y2="75" stroke={color} strokeWidth="2.5" opacity="0.6" />
      <line x1="62" y1="56" x2="82" y2="75" stroke={color} strokeWidth="2.5" opacity="0.6" />
      <circle cx="50" cy="12" r="4" fill={color} opacity="0.5" />
      <circle cx="50" cy="88" r="4" fill={color} opacity="0.5" />
      <circle cx="18" cy="25" r="4" fill={color} opacity="0.5" />
      <circle cx="82" cy="25" r="4" fill={color} opacity="0.5" />
      <circle cx="18" cy="75" r="4" fill={color} opacity="0.5" />
      <circle cx="82" cy="75" r="4" fill={color} opacity="0.5" />
    </svg>
  );
}

function IconCross({ size = 20, color = "#FF3366" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      <line x1="20" y1="20" x2="80" y2="80" stroke={color} strokeWidth="12" strokeLinecap="round" />
      <line x1="80" y1="20" x2="20" y2="80" stroke={color} strokeWidth="12" strokeLinecap="round" />
    </svg>
  );
}

function IconCheck({ size = 20, color = "#39FF14" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      <polyline points="20,55 40,75 80,25" fill="none" stroke={color} strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ─── Keyframes ─── */
function NeuroStyles() {
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
      @keyframes fadeIn {
        0% { opacity: 0; }
        100% { opacity: 1; }
      }
      @keyframes pulse-glow {
        0%, 100% { box-shadow: 0 0 20px rgba(0,212,255,0.3), 0 6px 0 #0a4f6d; }
        50% { box-shadow: 0 0 40px rgba(0,212,255,0.6), 0 6px 0 #0a4f6d; }
      }
      @keyframes shake {
        0%, 100% { transform: translateX(0); }
        20% { transform: translateX(-6px); }
        40% { transform: translateX(6px); }
        60% { transform: translateX(-4px); }
        80% { transform: translateX(4px); }
      }
      @keyframes bubbleGlow {
        0%, 100% { box-shadow: 0 2px 12px rgba(0,212,255,0.3); }
        50% { box-shadow: 0 2px 24px rgba(0,212,255,0.6); }
      }
      @keyframes countdown {
        0% { transform: scale(1.3); opacity: 1; }
        100% { transform: scale(1); opacity: 0.7; }
      }
      @keyframes rankReveal {
        0% { transform: scale(0) rotate(-30deg); opacity: 0; }
        50% { transform: scale(1.4) rotate(10deg); }
        70% { transform: scale(0.85) rotate(-3deg); }
        100% { transform: scale(1) rotate(-3deg); opacity: 1; }
      }
      @keyframes correctPop {
        0% { transform: scale(1); }
        50% { transform: scale(1.15); }
        100% { transform: scale(1); }
      }
      @keyframes neuronFloat {
        0%, 100% { opacity: 0.06; transform: translateY(0); }
        50% { opacity: 0.1; transform: translateY(-8px); }
      }
      @keyframes timerBar {
        0% { width: 100%; }
        100% { width: 0%; }
      }
      .neuro-text {
        font-weight: 900;
        letter-spacing: 0.05em;
        text-shadow: 0 0 20px rgba(0,212,255,0.4), 2px 2px 0 rgba(0,0,0,0.4);
      }
      .neuro-text-sm {
        font-weight: 700;
        letter-spacing: 0.03em;
        text-shadow: 0 0 10px rgba(0,212,255,0.3);
      }
      .neuro-bg {
        background: linear-gradient(180deg, #0a1628 0%, #0d1f3c 50%, #0a1628 100%);
      }
      .neuro-btn {
        border-radius: 12px;
        transition: transform 0.15s ease, box-shadow 0.15s ease;
      }
      .neuro-btn:hover {
        transform: translateY(-2px);
      }
      .neuro-btn:active {
        transform: translateY(1px);
      }
    `}</style>
  );
}

/* ─── Background neurons decoration ─── */
function NeuronBg() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Decorative circles */}
      {[
        { cx: "10%", cy: "15%", r: 80, delay: 0 },
        { cx: "85%", cy: "20%", r: 60, delay: 1.5 },
        { cx: "20%", cy: "75%", r: 70, delay: 0.8 },
        { cx: "90%", cy: "80%", r: 50, delay: 2 },
        { cx: "50%", cy: "10%", r: 40, delay: 1 },
      ].map((c, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            left: c.cx,
            top: c.cy,
            width: c.r,
            height: c.r,
            border: "1px solid rgba(0,212,255,0.08)",
            animation: `neuronFloat 4s ease-in-out ${c.delay}s infinite`,
          }}
        />
      ))}
      {/* Decorative lines */}
      <svg className="absolute inset-0 w-full h-full" style={{ opacity: 0.04 }}>
        <line x1="10%" y1="15%" x2="50%" y2="10%" stroke="#00D4FF" strokeWidth="1" />
        <line x1="50%" y1="10%" x2="85%" y2="20%" stroke="#00D4FF" strokeWidth="1" />
        <line x1="10%" y1="15%" x2="20%" y2="75%" stroke="#00D4FF" strokeWidth="1" />
        <line x1="85%" y1="20%" x2="90%" y2="80%" stroke="#00D4FF" strokeWidth="1" />
        <line x1="20%" y1="75%" x2="90%" y2="80%" stroke="#00D4FF" strokeWidth="1" />
      </svg>
    </div>
  );
}

/* ─── Life display ─── */
function LifeDisplay({ misses, max }: { misses: number; max: number }) {
  return (
    <div className="flex gap-2 items-center">
      {Array.from({ length: max }).map((_, i) => (
        <div key={i} style={{ opacity: i < misses ? 0.3 : 1 }}>
          {i < misses ? (
            <IconCross size={22} color="#FF3366" />
          ) : (
            <svg width={22} height={22} viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="35" fill="none" stroke="#39FF14" strokeWidth="8" opacity="0.7" />
            </svg>
          )}
        </div>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════
   Bubble generation
   ═══════════════════════════════════════ */

function generateBubbles(count: number, fieldWidth: number, fieldHeight: number): Bubble[] {
  const digits = Array.from({ length: 9 }, (_, i) => i + 1); // 1-9
  // Shuffle and pick
  for (let i = digits.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [digits[i], digits[j]] = [digits[j], digits[i]];
  }
  const selected = digits.slice(0, count);

  const bubbles: Bubble[] = [];
  const maxAttempts = 200;

  // Calculate usable area in pixels, then convert to percent
  const minX = FIELD_PADDING;
  const maxX = 100 - FIELD_PADDING;
  const minY = FIELD_PADDING;
  const maxY = 100 - FIELD_PADDING;

  for (let i = 0; i < count; i++) {
    let placed = false;
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      const x = minX + Math.random() * (maxX - minX);
      const y = minY + Math.random() * (maxY - minY);

      // Check distance from all placed bubbles (convert % to px for distance check)
      const px = (x / 100) * fieldWidth;
      const py = (y / 100) * fieldHeight;
      let tooClose = false;
      for (const b of bubbles) {
        const bx = (b.x / 100) * fieldWidth;
        const by = (b.y / 100) * fieldHeight;
        const dist = Math.sqrt((px - bx) ** 2 + (py - by) ** 2);
        if (dist < BUBBLE_MIN_DIST) {
          tooClose = true;
          break;
        }
      }

      if (!tooClose) {
        bubbles.push({ id: i, value: selected[i], x, y });
        placed = true;
        break;
      }
    }
    // Fallback: place anyway if can't find non-overlapping position
    if (!placed) {
      const x = minX + Math.random() * (maxX - minX);
      const y = minY + Math.random() * (maxY - minY);
      bubbles.push({ id: i, value: selected[i], x, y });
    }
  }

  return bubbles;
}

/* ═══════════════════════════════════════
   Main Component
   ═══════════════════════════════════════ */

export default function GameClient() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [level, setLevel] = useState(1);
  const [misses, setMisses] = useState(0);
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [revealedIds, setRevealedIds] = useState<Set<number>>(new Set());
  const [nextExpected, setNextExpected] = useState(0); // index in sorted order
  const [wrongId, setWrongId] = useState<number | null>(null);
  const [correctId, setCorrectId] = useState<number | null>(null);
  const [rank, setRank] = useState<FlashMemoryRank | null>(null);
  const [displayTime, setDisplayTime] = useState(3000);

  const fieldRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sorted order of bubble values
  const sortedBubbles = useMemo(
    () => [...bubbles].sort((a, b) => a.value - b.value),
    [bubbles]
  );

  // Cleanup timers
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const startLevel = useCallback((lvl: number) => {
    const config = getLevelConfig(lvl);
    const field = fieldRef.current;
    const w = field?.offsetWidth || 350;
    const h = field?.offsetHeight || 400;
    const newBubbles = generateBubbles(config.count, w, h);
    setBubbles(newBubbles);
    setRevealedIds(new Set());
    setNextExpected(0);
    setWrongId(null);
    setCorrectId(null);
    setDisplayTime(config.displayTime);
    setPhase("memorize");

    // After display time, hide numbers
    timerRef.current = setTimeout(() => {
      setPhase("recall");
    }, config.displayTime);
  }, []);

  const handleStart = useCallback(() => {
    setLevel(1);
    setMisses(0);
    setRank(null);
    startLevel(1);
  }, [startLevel]);

  const handleBubbleTap = useCallback(
    (bubbleId: number) => {
      if (phase !== "recall") return;
      if (revealedIds.has(bubbleId)) return; // already tapped

      const expected = sortedBubbles[nextExpected];
      const tapped = bubbles.find((b) => b.id === bubbleId);
      if (!tapped || !expected) return;

      if (tapped.value === expected.value) {
        // Correct!
        setCorrectId(bubbleId);
        const newRevealed = new Set(revealedIds);
        newRevealed.add(bubbleId);
        setRevealedIds(newRevealed);
        const newNext = nextExpected + 1;
        setNextExpected(newNext);

        // All correct -> next level
        if (newNext >= bubbles.length) {
          timerRef.current = setTimeout(() => {
            setCorrectId(null);
            const nextLvl = level + 1;
            setLevel(nextLvl);
            startLevel(nextLvl);
          }, 500);
        } else {
          setTimeout(() => setCorrectId(null), 300);
        }
      } else {
        // Wrong!
        setWrongId(bubbleId);
        const newMisses = misses + 1;
        setMisses(newMisses);
        setPhase("wrong");

        // Show correct answer briefly, then check if game over
        timerRef.current = setTimeout(() => {
          setWrongId(null);
          if (newMisses >= MAX_MISSES) {
            // Game over
            setRank(getRank(level));
            setPhase("result");
          } else {
            // Next problem at same level
            startLevel(level);
          }
        }, 1500);
      }
    },
    [phase, revealedIds, sortedBubbles, nextExpected, bubbles, level, misses, startLevel]
  );

  // Share
  const shareUrl =
    typeof window !== "undefined" && rank
      ? `${window.location.origin}/flash-memory?level=${level}&rank=${rank.rank}&title=${encodeURIComponent(rank.title)}`
      : "";

  const shareText = rank
    ? `瞬間記憶テストでLevel ${level}に到達！\nランク: ${rank.rank} ${rank.title}\n#瞬間記憶テスト\n`
    : "";

  const twitterUrl = rank
    ? `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`
    : "";

  const handleNativeShare = useCallback(async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: "瞬間記憶テスト", text: shareText, url: shareUrl });
      } catch { /* cancelled */ }
    }
  }, [shareText, shareUrl]);

  /* ═══════════════════════════════════════
     IDLE Screen
     ═══════════════════════════════════════ */
  if (phase === "idle") {
    return (
      <div className="relative flex flex-col items-center justify-center min-h-screen px-4 text-center overflow-hidden neuro-bg">
        <NeuroStyles />
        <NeuronBg />

        <div style={{ animation: "bounceIn 0.6s ease-out" }} className="mb-4">
          <IconBrain size={100} color="#00D4FF" />
        </div>

        <h1
          className="neuro-text text-4xl sm:text-5xl text-white mb-3"
          style={{ animation: "bounceIn 0.5s ease-out" }}
        >
          瞬間記憶テスト
        </h1>

        <p
          className="neuro-text-sm text-lg text-cyan-300 mb-2"
          style={{ animation: "slideUp 0.6s ease-out 0.2s both" }}
        >
          Flash Memory Test
        </p>

        <p
          className="text-gray-400 mb-8 text-sm max-w-xs leading-relaxed"
          style={{ animation: "slideUp 0.6s ease-out 0.3s both" }}
        >
          数字が一瞬だけ表示される。
          <br />
          消えたら、
          <span className="text-cyan-400 font-bold">小さい順</span>にタップ！
          <br />
          <span className="text-pink-400 font-bold">
            <IconCross size={12} color="#FF3366" /> 2回ミスでゲームオーバー
          </span>
        </p>

        <button
          onClick={handleStart}
          className="neuro-btn px-12 py-5 text-white text-2xl font-black tracking-wider"
          style={{
            background: "linear-gradient(135deg, #00D4FF 0%, #0099cc 100%)",
            border: "3px solid #0a4f6d",
            boxShadow: "0 0 20px rgba(0,212,255,0.3), 0 6px 0 #0a4f6d",
            animation: "pulse-glow 2s ease-in-out infinite, slideUp 0.6s ease-out 0.5s both",
          }}
        >
          START
        </button>

        <Link
          href="/"
          className="mt-8 text-gray-500 hover:text-cyan-400 text-sm transition-colors font-bold"
          style={{ animation: "slideUp 0.6s ease-out 0.6s both" }}
        >
          ← TOP
        </Link>
      </div>
    );
  }

  /* ═══════════════════════════════════════
     PLAYING (memorize / recall / wrong)
     ═══════════════════════════════════════ */
  if (phase === "memorize" || phase === "recall" || phase === "wrong") {
    const isMemorize = phase === "memorize";
    const isWrong = phase === "wrong";

    return (
      <div className="relative flex flex-col min-h-screen overflow-hidden neuro-bg select-none">
        <NeuroStyles />
        <NeuronBg />

        {/* Header */}
        <div className="flex items-center justify-between px-4 pt-4 pb-2 relative z-10">
          <div className="neuro-text text-xl text-cyan-400">
            LEVEL {level}
          </div>
          <LifeDisplay misses={misses} max={MAX_MISSES} />
        </div>

        {/* Status bar */}
        <div className="px-4 pb-2 relative z-10">
          {isMemorize && (
            <div className="flex items-center gap-2">
              <span className="text-cyan-300 text-sm font-bold" style={{ animation: "fadeIn 0.3s ease-out" }}>
                覚えて！
              </span>
              <div className="flex-1 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{
                    background: "linear-gradient(90deg, #00D4FF, #39FF14)",
                    animation: `timerBar ${displayTime}ms linear forwards`,
                  }}
                />
              </div>
            </div>
          )}
          {phase === "recall" && (
            <div className="text-cyan-300 text-sm font-bold" style={{ animation: "fadeIn 0.3s ease-out" }}>
              小さい順にタップ！ (次: {nextExpected + 1}番目)
            </div>
          )}
          {isWrong && (
            <div
              className="text-pink-400 text-sm font-bold"
              style={{ animation: "shake 0.5s ease-in-out" }}
            >
              不正解... 正解を確認
            </div>
          )}
        </div>

        {/* Bubble field */}
        <div
          ref={fieldRef}
          className="relative flex-1 mx-4 mb-4 rounded-2xl"
          style={{
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(0,212,255,0.1)",
            minHeight: "400px",
          }}
        >
          {bubbles.map((bubble) => {
            const isRevealed = revealedIds.has(bubble.id);
            const isWrongBubble = wrongId === bubble.id;
            const isCorrectBubble = correctId === bubble.id;
            const showNumber = isMemorize || isRevealed || isWrong;

            let bgColor = "rgba(30,40,60,0.9)";
            let borderColor = "rgba(0,212,255,0.2)";
            let textColor = "#667";
            let extraStyle = "";

            if (isMemorize) {
              bgColor = "rgba(255,255,255,0.95)";
              borderColor = "rgba(0,212,255,0.5)";
              textColor = "#0a1628";
              extraStyle = "bubbleGlow";
            } else if (isRevealed) {
              bgColor = "rgba(57,255,20,0.15)";
              borderColor = "rgba(57,255,20,0.5)";
              textColor = "#39FF14";
            } else if (isWrongBubble) {
              bgColor = "rgba(255,51,102,0.2)";
              borderColor = "#FF3366";
              textColor = "#FF3366";
            } else if (isWrong && !isRevealed) {
              // During wrong phase, show all numbers faintly
              bgColor = "rgba(255,255,255,0.08)";
              borderColor = "rgba(255,255,255,0.15)";
              textColor = "rgba(255,255,255,0.5)";
            }

            // Highlight the correct next one during wrong phase
            const expectedBubble = sortedBubbles[nextExpected];
            const isExpectedNext = isWrong && expectedBubble && bubble.value === expectedBubble.value && !isRevealed;
            if (isExpectedNext) {
              bgColor = "rgba(0,212,255,0.2)";
              borderColor = "#00D4FF";
              textColor = "#00D4FF";
            }

            return (
              <button
                key={bubble.id}
                onClick={() => handleBubbleTap(bubble.id)}
                disabled={phase !== "recall" || isRevealed}
                className="absolute flex items-center justify-center rounded-full font-black text-xl transition-colors"
                style={{
                  width: `${BUBBLE_SIZE}px`,
                  height: `${BUBBLE_SIZE}px`,
                  left: `calc(${bubble.x}% - ${BUBBLE_SIZE / 2}px)`,
                  top: `calc(${bubble.y}% - ${BUBBLE_SIZE / 2}px)`,
                  background: bgColor,
                  border: `2.5px solid ${borderColor}`,
                  color: textColor,
                  fontSize: "22px",
                  cursor: phase === "recall" && !isRevealed ? "pointer" : "default",
                  animation: isMemorize
                    ? `bounceIn 0.4s ease-out ${bubble.id * 0.08}s both`
                    : isWrongBubble
                    ? "shake 0.5s ease-in-out"
                    : isCorrectBubble
                    ? "correctPop 0.3s ease-out"
                    : undefined,
                  boxShadow:
                    isMemorize
                      ? "0 2px 16px rgba(0,212,255,0.3)"
                      : isRevealed
                      ? "0 2px 12px rgba(57,255,20,0.2)"
                      : isWrongBubble
                      ? "0 2px 12px rgba(255,51,102,0.3)"
                      : "0 2px 8px rgba(0,0,0,0.3)",
                  touchAction: "manipulation",
                  WebkitTapHighlightColor: "transparent",
                }}
              >
                {showNumber ? bubble.value : "?"}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  /* ═══════════════════════════════════════
     RESULT Screen
     ═══════════════════════════════════════ */
  if (phase === "result" && rank) {
    return (
      <div className="relative flex flex-col items-center justify-center min-h-screen px-4 py-8 overflow-hidden neuro-bg">
        <NeuroStyles />
        <NeuronBg />

        <div
          className="text-gray-400 text-sm mb-4 font-bold neuro-text-sm"
          style={{ animation: "slideUp 0.4s ease-out" }}
        >
          結果発表
        </div>

        {/* Rank icon */}
        <div
          className="mb-2"
          style={{
            animation: "rankReveal 0.7s ease-out",
            filter: `drop-shadow(0 0 25px ${rank.color}80)`,
          }}
        >
          <IconNeuron size={90} color={rank.color} />
        </div>

        {/* Rank letter */}
        <div
          className="neuro-text text-7xl sm:text-8xl mb-1"
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
          className="neuro-text-sm text-2xl text-white mb-1"
          style={{ animation: "slideUp 0.5s ease-out 0.3s both" }}
        >
          {rank.title}
        </div>
        <div
          className="text-gray-400 text-sm mb-6 text-center max-w-xs"
          style={{ animation: "slideUp 0.5s ease-out 0.4s both" }}
        >
          {rank.description}
        </div>

        {/* Level box */}
        <div
          className="relative px-10 py-5 mb-6 text-center"
          style={{
            background: "rgba(255,255,255,0.05)",
            border: `3px solid ${rank.color}44`,
            borderRadius: "16px",
            boxShadow: `0 0 20px ${rank.color}20, inset 0 0 30px rgba(0,0,0,0.2)`,
            animation: "bounceIn 0.5s ease-out 0.5s both",
          }}
        >
          <div className="text-gray-400 text-xs mb-1 font-bold">到達レベル</div>
          <div className="neuro-text text-6xl" style={{ color: rank.color }}>
            {level}
          </div>
        </div>

        {/* Miss count */}
        <div
          className="flex items-center gap-2 mb-8 text-sm font-bold"
          style={{
            color: "#FF3366",
            animation: "slideUp 0.4s ease-out 0.6s both",
          }}
        >
          <IconCross size={16} color="#FF3366" />
          <span>ミス {misses}回</span>
        </div>

        {/* Share & actions */}
        <div
          className="flex flex-col gap-3 w-full max-w-xs"
          style={{ animation: "slideUp 0.5s ease-out 0.7s both" }}
        >
          {typeof navigator !== "undefined" && typeof navigator.share === "function" && (
            <button
              onClick={handleNativeShare}
              className="neuro-btn w-full py-4 text-lg font-black"
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
              className="neuro-btn flex-1 py-3 text-white font-black text-center text-sm"
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
              className="neuro-btn flex-1 py-3 text-white font-black text-center text-sm"
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
            className="neuro-btn w-full py-3 font-black mt-2"
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
            ← TOP
          </Link>
        </div>
      </div>
    );
  }

  return null;
}
