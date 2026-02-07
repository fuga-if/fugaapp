"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { getRank, cardSymbols, type MemoryMatchRank } from "@/lib/memory-match/ranks";
import Link from "next/link";

type Phase = "idle" | "playing" | "result";

interface Card {
  id: number;
  symbolIndex: number;
  isFlipped: boolean;
  isMatched: boolean;
}

/* ═══════════════════════════════════════
   CSS Styles - Casino Theme
   ═══════════════════════════════════════ */
function CasinoStyles() {
  return (
    <style jsx global>{`
      @keyframes cardFlip {
        0% { transform: rotateY(0deg); }
        100% { transform: rotateY(180deg); }
      }
      @keyframes cardUnflip {
        0% { transform: rotateY(180deg); }
        100% { transform: rotateY(0deg); }
      }
      @keyframes sparkle {
        0%, 100% { opacity: 0; transform: scale(0) rotate(0deg); }
        50% { opacity: 1; transform: scale(1) rotate(180deg); }
      }
      @keyframes matchGlow {
        0% { box-shadow: 0 0 5px #22C55E40; }
        50% { box-shadow: 0 0 20px #22C55E80, 0 0 30px #22C55E40; }
        100% { box-shadow: 0 0 5px #22C55E40; }
      }
      @keyframes fadeIn {
        0% { opacity: 0; }
        100% { opacity: 1; }
      }
      @keyframes slideUp {
        0% { transform: translateY(20px); opacity: 0; }
        100% { transform: translateY(0); opacity: 1; }
      }
      @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.05); }
      }
      @keyframes shimmer {
        0% { background-position: -200% center; }
        100% { background-position: 200% center; }
      }
      .card-container {
        perspective: 1000px;
      }
      .card-inner {
        position: relative;
        width: 100%;
        height: 100%;
        transition: transform 0.5s;
        transform-style: preserve-3d;
      }
      .card-inner.flipped {
        transform: rotateY(180deg);
      }
      .card-face {
        position: absolute;
        width: 100%;
        height: 100%;
        backface-visibility: hidden;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .card-back {
        background: linear-gradient(135deg, #1e3a5f 0%, #0f2744 100%);
        border: 2px solid #2563eb;
        box-shadow: inset 0 0 20px rgba(37, 99, 235, 0.3);
      }
      .card-back-pattern {
        position: absolute;
        inset: 4px;
        border: 1px solid #3b82f680;
        border-radius: 4px;
        background: 
          repeating-linear-gradient(
            45deg,
            transparent,
            transparent 4px,
            #3b82f620 4px,
            #3b82f620 8px
          );
      }
      .card-front {
        background: linear-gradient(135deg, #ffffff 0%, #f3f4f6 100%);
        border: 2px solid #d1d5db;
        transform: rotateY(180deg);
      }
      .card-matched {
        opacity: 0.7;
        border-color: #22C55E !important;
        animation: matchGlow 1s ease-out;
      }
      .casino-bg {
        background: radial-gradient(ellipse at center, #1f5c3d 0%, #1a472a 50%, #0f2818 100%);
      }
      .felt-texture {
        background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E");
      }
      .gold-text {
        color: #FFD700;
        text-shadow: 0 0 10px #FFD70060, 0 2px 4px rgba(0,0,0,0.5);
      }
      .casino-font {
        font-family: 'Georgia', 'Times New Roman', serif;
      }
      .sparkle-container {
        position: absolute;
        inset: 0;
        pointer-events: none;
        overflow: hidden;
      }
      .sparkle {
        position: absolute;
        width: 8px;
        height: 8px;
        animation: sparkle 0.8s ease-out forwards;
      }
    `}</style>
  );
}

/* ═══════════════════════════════════════
   SVG Components
   ═══════════════════════════════════════ */
function CardIcon({ size = 80 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.3))" }}>
      {/* Card stack effect */}
      <rect x="22" y="12" width="56" height="76" rx="6" fill="#1e3a5f" stroke="#2563eb" strokeWidth="2" opacity="0.5" />
      <rect x="18" y="8" width="56" height="76" rx="6" fill="#1e3a5f" stroke="#2563eb" strokeWidth="2" opacity="0.7" />
      {/* Main card */}
      <rect x="14" y="4" width="56" height="76" rx="6" fill="url(#cardGrad)" stroke="#2563eb" strokeWidth="2" />
      {/* Question mark */}
      <text x="42" y="52" textAnchor="middle" fontFamily="Georgia, serif" fontSize="32" fontWeight="bold" fill="#FFD700"
        style={{ textShadow: "0 0 10px #FFD70060" }}>
        ?
      </text>
      <defs>
        <linearGradient id="cardGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1e3a5f" />
          <stop offset="100%" stopColor="#0f2744" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function SparkleEffect({ show }: { show: boolean }) {
  if (!show) return null;
  
  const sparkles = Array.from({ length: 8 }, (_, i) => ({
    id: i,
    x: 20 + Math.random() * 60,
    y: 20 + Math.random() * 60,
    delay: Math.random() * 0.3,
  }));

  return (
    <div className="sparkle-container">
      {sparkles.map((s) => (
        <svg
          key={s.id}
          className="sparkle"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            animationDelay: `${s.delay}s`,
          }}
          viewBox="0 0 24 24"
        >
          <path
            d="M12 0L14 10L24 12L14 14L12 24L10 14L0 12L10 10L12 0Z"
            fill="#FFD700"
          />
        </svg>
      ))}
    </div>
  );
}

function RankBadge({ rank, size = 80 }: { rank: MemoryMatchRank; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ filter: `drop-shadow(0 4px 12px ${rank.color}40)` }}>
      {/* Outer ring */}
      <circle cx="50" cy="50" r="45" fill="none" stroke={rank.color} strokeWidth="3" opacity="0.3" />
      <circle cx="50" cy="50" r="38" fill="none" stroke={rank.color} strokeWidth="2" opacity="0.5" />
      {/* Inner fill */}
      <circle cx="50" cy="50" r="32" fill={`${rank.color}20`} stroke={rank.color} strokeWidth="2" />
      {/* Rank letter */}
      <text
        x="50"
        y="58"
        textAnchor="middle"
        fontFamily="Georgia, serif"
        fontWeight="bold"
        fontSize="36"
        fill={rank.color}
      >
        {rank.rank}
      </text>
      {/* Decorative dots */}
      <circle cx="50" cy="12" r="3" fill={rank.color} opacity="0.6" />
      <circle cx="50" cy="88" r="3" fill={rank.color} opacity="0.6" />
      <circle cx="12" cy="50" r="3" fill={rank.color} opacity="0.6" />
      <circle cx="88" cy="50" r="3" fill={rank.color} opacity="0.6" />
    </svg>
  );
}

/* ═══════════════════════════════════════
   Game Logic Helpers
   ═══════════════════════════════════════ */
function createDeck(): Card[] {
  const cards: Card[] = [];
  
  // 8種類のシンボル、各2枚 = 16枚
  for (let symbolIndex = 0; symbolIndex < 8; symbolIndex++) {
    cards.push({
      id: symbolIndex * 2,
      symbolIndex,
      isFlipped: false,
      isMatched: false,
    });
    cards.push({
      id: symbolIndex * 2 + 1,
      symbolIndex,
      isFlipped: false,
      isMatched: false,
    });
  }
  
  // Fisher-Yates shuffle
  for (let i = cards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cards[i], cards[j]] = [cards[j], cards[i]];
  }
  
  return cards;
}

/* ═══════════════════════════════════════
   Main Game Component
   ═══════════════════════════════════════ */
export default function GameClient() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [turns, setTurns] = useState(0);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [isChecking, setIsChecking] = useState(false);
  const [rank, setRank] = useState<MemoryMatchRank | null>(null);
  const [showMatchEffect, setShowMatchEffect] = useState<number[]>([]);
  
  const checkTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (checkTimeoutRef.current) {
        clearTimeout(checkTimeoutRef.current);
      }
    };
  }, []);

  const startGame = useCallback(() => {
    setCards(createDeck());
    setFlippedIndices([]);
    setTurns(0);
    setMatchedPairs(0);
    setIsChecking(false);
    setRank(null);
    setShowMatchEffect([]);
    setPhase("playing");
  }, []);

  const handleCardClick = useCallback((index: number) => {
    if (phase !== "playing") return;
    if (isChecking) return; // 連打防止
    if (flippedIndices.includes(index)) return; // 同じカードは無視
    if (cards[index].isMatched) return; // マッチ済みは無視
    if (cards[index].isFlipped) return; // 既にめくられている
    
    const newCards = [...cards];
    newCards[index] = { ...newCards[index], isFlipped: true };
    setCards(newCards);
    
    const newFlipped = [...flippedIndices, index];
    setFlippedIndices(newFlipped);
    
    // 2枚めくったら判定
    if (newFlipped.length === 2) {
      setIsChecking(true);
      const newTurns = turns + 1;
      setTurns(newTurns);
      
      const [first, second] = newFlipped;
      const isMatch = newCards[first].symbolIndex === newCards[second].symbolIndex;
      
      if (isMatch) {
        // マッチ！
        setShowMatchEffect([first, second]);
        checkTimeoutRef.current = setTimeout(() => {
          setCards((prev) => prev.map((card, i) => 
            i === first || i === second 
              ? { ...card, isMatched: true }
              : card
          ));
          setShowMatchEffect([]);
          setFlippedIndices([]);
          setIsChecking(false);
          
          const newMatchedPairs = matchedPairs + 1;
          setMatchedPairs(newMatchedPairs);
          
          // 全ペア揃ったらクリア
          if (newMatchedPairs === 8) {
            setRank(getRank(newTurns));
            setPhase("result");
          }
        }, 600);
      } else {
        // 不一致 - 裏に戻す
        checkTimeoutRef.current = setTimeout(() => {
          setCards((prev) => prev.map((card, i) =>
            i === first || i === second
              ? { ...card, isFlipped: false }
              : card
          ));
          setFlippedIndices([]);
          setIsChecking(false);
        }, 1000);
      }
    }
  }, [phase, isChecking, flippedIndices, cards, turns, matchedPairs]);

  // Share
  const shareUrl = typeof window !== "undefined" && rank
    ? `${window.location.origin}/memory-match?turns=${turns}`
    : "";

  const shareText = rank
    ? `Memory Matchを${turns}ターンでクリア！\nランク: ${rank.rank} ${rank.title}\n#神経衰弱 #fugaapp\n`
    : "";

  const twitterUrl = rank
    ? `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`
    : "";

  const handleNativeShare = useCallback(async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: "Memory Match", text: shareText, url: shareUrl });
      } catch {
        /* cancelled */
      }
    }
  }, [shareText, shareUrl]);

  // ===== IDLE =====
  if (phase === "idle") {
    return (
      <div className="relative flex flex-col items-center justify-center min-h-screen px-4 text-center overflow-hidden casino-bg felt-texture">
        <CasinoStyles />
        
        {/* Decorative border */}
        <div className="absolute inset-4 border-2 border-dashed rounded-lg pointer-events-none"
          style={{ borderColor: "#FFD70030" }} />

        {/* Card icon */}
        <div className="relative z-10 mb-6" style={{ animation: "fadeIn 0.8s ease-out" }}>
          <CardIcon size={100} />
        </div>

        {/* Title */}
        <h1 className="relative z-10 casino-font gold-text text-4xl sm:text-5xl font-bold tracking-wide mb-2"
          style={{ animation: "fadeIn 0.6s ease-out 0.2s both" }}>
          MEMORY MATCH
        </h1>

        <div className="relative z-10 casino-font text-sm mb-2"
          style={{ color: "#a7c4a0", animation: "fadeIn 0.6s ease-out 0.3s both" }}>
          - 神経衰弱 -
        </div>

        <p className="relative z-10 casino-font text-sm mb-2"
          style={{ color: "#d4e4d1", animation: "slideUp 0.6s ease-out 0.4s both" }}>
          16枚のカードから8ペアを見つけよう
        </p>
        <p className="relative z-10 casino-font text-xs max-w-xs mb-8"
          style={{ color: "#a7c4a080", animation: "slideUp 0.6s ease-out 0.5s both" }}>
          少ないターン数でクリアするほど高ランク！
        </p>

        {/* Start button */}
        <button
          onClick={startGame}
          className="relative z-10 casino-font px-10 py-4 text-lg font-bold tracking-wider transition-all active:scale-95"
          style={{
            background: "linear-gradient(135deg, #FFD700 0%, #FFA500 100%)",
            color: "#1a472a",
            border: "none",
            borderRadius: "8px",
            boxShadow: "0 4px 15px #FFD70040, inset 0 1px 0 #FFF8",
            animation: "pulse 2s ease-in-out infinite, slideUp 0.6s ease-out 0.6s both",
          }}
        >
          GAME START
        </button>

        <Link href="/"
          className="relative z-10 mt-6 casino-font text-sm transition-colors"
          style={{ color: "#5c7a58", animation: "slideUp 0.6s ease-out 0.7s both" }}>
          {"<"} Back
        </Link>
      </div>
    );
  }

  // ===== RESULT =====
  if (phase === "result" && rank) {
    return (
      <div className="relative flex flex-col items-center justify-center min-h-screen px-4 py-8 overflow-hidden casino-bg felt-texture">
        <CasinoStyles />
        
        {/* Decorative border */}
        <div className="absolute inset-4 border-2 border-dashed rounded-lg pointer-events-none"
          style={{ borderColor: "#FFD70030" }} />

        {/* Result header */}
        <div className="relative z-10 mb-4 casino-font text-sm"
          style={{ color: "#a7c4a0", animation: "fadeIn 0.5s ease-out" }}>
          - GAME CLEAR -
        </div>

        {/* Rank badge */}
        <div className="relative z-10 mb-4" style={{ animation: "fadeIn 0.8s ease-out 0.2s both" }}>
          <RankBadge rank={rank} size={100} />
        </div>

        {/* Rank title */}
        <div className="relative z-10 casino-font text-2xl font-bold mb-1"
          style={{ color: rank.color, animation: "fadeIn 0.6s ease-out 0.4s both" }}>
          {rank.title}
        </div>
        <div className="relative z-10 casino-font text-sm mb-6"
          style={{ color: "#d4e4d1", animation: "fadeIn 0.6s ease-out 0.5s both" }}>
          {rank.description}
        </div>

        {/* Score */}
        <div className="relative z-10 mb-6 px-8 py-4 text-center rounded-lg"
          style={{
            background: "#0f281880",
            border: `2px solid ${rank.color}40`,
            animation: "fadeIn 0.6s ease-out 0.6s both",
          }}>
          <div className="casino-font text-xs mb-1" style={{ color: "#a7c4a080" }}>TOTAL TURNS</div>
          <div className="casino-font text-5xl font-bold gold-text">
            {turns}
          </div>
        </div>

        {/* Stats */}
        <div className="relative z-10 mb-6 grid grid-cols-2 gap-4 text-center"
          style={{ animation: "fadeIn 0.6s ease-out 0.7s both" }}>
          <div className="px-4 py-2 rounded" style={{ background: "#0f281860" }}>
            <div className="casino-font text-xs" style={{ color: "#a7c4a060" }}>PAIRS</div>
            <div className="casino-font text-xl" style={{ color: "#d4e4d1" }}>8/8</div>
          </div>
          <div className="px-4 py-2 rounded" style={{ background: "#0f281860" }}>
            <div className="casino-font text-xs" style={{ color: "#a7c4a060" }}>TOP {rank.percentile}%</div>
            <div className="casino-font text-xl" style={{ color: rank.color }}>{rank.rank}</div>
          </div>
        </div>

        {/* Share & actions */}
        <div className="relative z-10 flex flex-col gap-3 w-full max-w-xs"
          style={{ animation: "slideUp 0.5s ease-out 0.8s both" }}>

          {typeof navigator !== "undefined" && typeof navigator.share === "function" && (
            <button
              onClick={handleNativeShare}
              className="w-full py-4 casino-font text-base font-bold tracking-wider transition-all active:scale-95 rounded-lg"
              style={{
                background: `linear-gradient(135deg, ${rank.color} 0%, ${rank.color}cc 100%)`,
                color: "#1a472a",
                boxShadow: `0 4px 15px ${rank.color}40`,
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
              className="flex-1 py-3 casino-font font-bold text-center text-sm tracking-wider transition-all rounded"
              style={{
                background: "#000",
                color: "#fff",
                border: "1px solid #333",
              }}
            >
              X POST
            </a>
            <a
              href={`https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(shareUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-3 casino-font font-bold text-center text-sm tracking-wider transition-all rounded"
              style={{
                background: "#06C755",
                color: "#fff",
              }}
            >
              LINE
            </a>
          </div>

          <button
            onClick={startGame}
            className="w-full py-3 casino-font font-bold tracking-wider transition-all active:scale-95 rounded mt-1"
            style={{
              background: "#1f5c3d",
              color: "#FFD700",
              border: "1px solid #FFD70040",
            }}
          >
            PLAY AGAIN
          </button>
          <Link href="/"
            className="text-center casino-font text-sm mt-1 transition-colors"
            style={{ color: "#5c7a58" }}>
            {"<"} Back
          </Link>
        </div>
      </div>
    );
  }

  // ===== PLAYING =====
  return (
    <div
      className="relative flex flex-col items-center min-h-screen px-3 py-4 select-none overflow-hidden casino-bg felt-texture"
      style={{
        touchAction: "manipulation",
        WebkitUserSelect: "none",
        userSelect: "none",
      }}
    >
      <CasinoStyles />
      
      {/* Decorative border */}
      <div className="absolute inset-2 border border-dashed rounded-lg pointer-events-none"
        style={{ borderColor: "#FFD70015" }} />

      {/* Header */}
      <div className="relative z-10 w-full max-w-sm flex justify-between items-center mb-4 px-2">
        <div className="casino-font text-sm" style={{ color: "#a7c4a0" }}>
          PAIRS: <span style={{ color: "#FFD700" }}>{matchedPairs}/8</span>
        </div>
        <div className="casino-font text-xl font-bold gold-text">
          TURNS: {turns}
        </div>
      </div>

      {/* Card Grid */}
      <div
        className="relative z-10 grid mx-auto"
        style={{
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "8px",
          width: "min(340px, calc(100vw - 32px))",
          maxWidth: "340px",
        }}
      >
        {cards.map((card, index) => {
          const symbol = cardSymbols[card.symbolIndex];
          const isShowingMatch = showMatchEffect.includes(index);
          
          return (
            <div
              key={card.id}
              className="card-container aspect-[3/4]"
              style={{ animation: "fadeIn 0.3s ease-out" }}
            >
              <div
                className={`card-inner cursor-pointer ${card.isFlipped || card.isMatched ? "flipped" : ""}`}
                onClick={() => handleCardClick(index)}
              >
                {/* Card Back */}
                <div className="card-face card-back">
                  <div className="card-back-pattern" />
                  <span className="casino-font text-2xl font-bold" style={{ color: "#FFD70080" }}>
                    ?
                  </span>
                </div>
                
                {/* Card Front */}
                <div className={`card-face card-front ${card.isMatched ? "card-matched" : ""}`}>
                  <span
                    className="text-4xl sm:text-5xl"
                    style={{ 
                      color: symbol.color,
                      textShadow: `0 2px 4px ${symbol.color}40`,
                    }}
                  >
                    {symbol.shape}
                  </span>
                  <SparkleEffect show={isShowingMatch} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Progress indicator */}
      <div className="relative z-10 mt-6 flex gap-1.5">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="w-3 h-3 rounded-full transition-all duration-300"
            style={{
              background: i < matchedPairs ? "#FFD700" : "#1f5c3d",
              boxShadow: i < matchedPairs ? "0 0 8px #FFD70060" : "inset 0 1px 2px #00000040",
              border: "1px solid #FFD70040",
            }}
          />
        ))}
      </div>

      {/* Hint text */}
      <div className="relative z-10 mt-4 casino-font text-xs" style={{ color: "#a7c4a060" }}>
        {isChecking ? "Checking..." : "Tap a card to flip"}
      </div>
    </div>
  );
}
