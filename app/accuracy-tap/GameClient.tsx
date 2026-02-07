"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { getRank, type AccuracyTapRank } from "@/lib/accuracy-tap/ranks";
import Link from "next/link";

type Phase = "idle" | "playing" | "result";

interface TargetPosition {
  x: number;
  y: number;
}

const MAX_LIVES = 3;

// Level -> target diameter in pixels
const getTargetSize = (level: number) => Math.max(15, 100 - (level - 1) * 4);

/* ═══════════════════════════════════════
   Shooting Gallery Styles
   ═══════════════════════════════════════ */

function ShootingStyles() {
  return (
    <style jsx global>{`
      @keyframes targetAppear {
        0% { transform: scale(0); opacity: 0; }
        70% { transform: scale(1.1); }
        100% { transform: scale(1); opacity: 1; }
      }
      @keyframes hitFlash {
        0% { transform: scale(1); filter: brightness(1); }
        30% { transform: scale(1.3); filter: brightness(2); }
        100% { transform: scale(0); opacity: 0; }
      }
      @keyframes missShake {
        0%, 100% { transform: translateX(0); }
        20% { transform: translateX(-8px); }
        40% { transform: translateX(8px); }
        60% { transform: translateX(-6px); }
        80% { transform: translateX(6px); }
      }
      @keyframes missX {
        0% { opacity: 0; transform: scale(0.5); }
        30% { opacity: 1; transform: scale(1.2); }
        100% { opacity: 0; transform: scale(1); }
      }
      @keyframes fadeIn {
        0% { opacity: 0; transform: translateY(10px); }
        100% { opacity: 1; transform: translateY(0); }
      }
      @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.6; }
      }
      @keyframes crosshairPulse {
        0%, 100% { opacity: 0.3; }
        50% { opacity: 0.6; }
      }

      .shooting-bg {
        background: #1a1a2e;
      }
      .target-ring {
        position: absolute;
        border-radius: 50%;
        pointer-events: none;
      }
    `}</style>
  );
}

/* ═══════════════════════════════════════
   SVG Icons
   ═══════════════════════════════════════ */

function IconHeart({ filled = true, size = 24 }: { filled?: boolean; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? "#FF4757" : "none"} stroke={filled ? "#FF4757" : "#555"} strokeWidth="2">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

function IconCrosshair({ size = 200 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', pointerEvents: 'none', animation: 'crosshairPulse 2s ease-in-out infinite' }}>
      <circle cx="100" cy="100" r="60" fill="none" stroke="#ffffff10" strokeWidth="1" />
      <circle cx="100" cy="100" r="40" fill="none" stroke="#ffffff10" strokeWidth="1" />
      <line x1="100" y1="20" x2="100" y2="80" stroke="#ffffff15" strokeWidth="1" />
      <line x1="100" y1="120" x2="100" y2="180" stroke="#ffffff15" strokeWidth="1" />
      <line x1="20" y1="100" x2="80" y2="100" stroke="#ffffff15" strokeWidth="1" />
      <line x1="120" y1="100" x2="180" y2="100" stroke="#ffffff15" strokeWidth="1" />
    </svg>
  );
}

function IconTarget({ size = 48 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48">
      <circle cx="24" cy="24" r="22" fill="none" stroke="#FF4757" strokeWidth="2" />
      <circle cx="24" cy="24" r="15" fill="none" stroke="#FFFFFF" strokeWidth="2" />
      <circle cx="24" cy="24" r="8" fill="none" stroke="#FF4757" strokeWidth="2" />
      <circle cx="24" cy="24" r="3" fill="#FF4757" />
    </svg>
  );
}

function IconArrowLeft({ size = 16, color = "#888" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
      <path d="M15 18l-6-6 6-6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconShare({ size = 16, color = "#888" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
      <path d="M4 12v7a2 2 0 002 2h12a2 2 0 002-2v-7M16 6l-4-4-4 4M12 2v13" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconRepeat({ size = 16, color = "#888" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
      <path d="M1 4v6h6M23 20v-6h-6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M20.49 9A9 9 0 005.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 013.51 15" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ═══════════════════════════════════════
   Target Component
   ═══════════════════════════════════════ */

function Target({ x, y, size, hit }: { x: number; y: number; size: number; hit: boolean }) {
  const radius = size / 2;
  
  return (
    <div
      style={{
        position: 'absolute',
        left: x - radius,
        top: y - radius,
        width: size,
        height: size,
        animation: hit ? 'hitFlash 0.3s ease-out forwards' : 'targetAppear 0.2s ease-out',
        pointerEvents: 'none',
      }}
    >
      {/* Outer red ring */}
      <div
        className="target-ring"
        style={{
          inset: 0,
          background: hit ? '#4ADE80' : '#FF4757',
          boxShadow: hit 
            ? '0 0 30px #4ADE80, 0 0 60px #4ADE8080' 
            : '0 0 20px #FF475780',
        }}
      />
      {/* White ring */}
      <div
        className="target-ring"
        style={{
          inset: `${size * 0.15}px`,
          background: '#FFFFFF',
        }}
      />
      {/* Inner red ring */}
      <div
        className="target-ring"
        style={{
          inset: `${size * 0.3}px`,
          background: hit ? '#4ADE80' : '#FF4757',
        }}
      />
      {/* Center dot */}
      <div
        className="target-ring"
        style={{
          inset: `${size * 0.42}px`,
          background: '#FFFFFF',
        }}
      />
    </div>
  );
}

/* ═══════════════════════════════════════
   Miss X Effect
   ═══════════════════════════════════════ */

function MissEffect({ x, y }: { x: number; y: number }) {
  return (
    <div
      style={{
        position: 'absolute',
        left: x - 30,
        top: y - 30,
        width: 60,
        height: 60,
        animation: 'missX 0.5s ease-out forwards',
        pointerEvents: 'none',
      }}
    >
      <svg width="60" height="60" viewBox="0 0 60 60">
        <line x1="10" y1="10" x2="50" y2="50" stroke="#FF4757" strokeWidth="6" strokeLinecap="round" />
        <line x1="50" y1="10" x2="10" y2="50" stroke="#FF4757" strokeWidth="6" strokeLinecap="round" />
      </svg>
    </div>
  );
}

/* ═══════════════════════════════════════
   Rank Display Component
   ═══════════════════════════════════════ */

function RankBadge({ rank, color, size = 80 }: { rank: string; color: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80">
      <circle cx="40" cy="40" r="35" fill="none" stroke={color} strokeWidth="3" />
      <circle cx="40" cy="40" r="28" fill="none" stroke={color} strokeWidth="1" opacity="0.5" />
      <text x="40" y="48" textAnchor="middle" fill={color} fontSize="32" fontWeight="bold" fontFamily="system-ui">{rank}</text>
    </svg>
  );
}

/* ═══════════════════════════════════════
   Main Component
   ═══════════════════════════════════════ */

export default function AccuracyTapGameClient() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [level, setLevel] = useState(1);
  const [lives, setLives] = useState(MAX_LIVES);
  const [target, setTarget] = useState<TargetPosition | null>(null);
  const [hit, setHit] = useState(false);
  const [missPos, setMissPos] = useState<{ x: number; y: number } | null>(null);
  const [shake, setShake] = useState(false);
  const [rank, setRank] = useState<AccuracyTapRank | null>(null);
  
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const targetSize = getTargetSize(level);

  const generateTarget = useCallback((lvl: number) => {
    if (!gameAreaRef.current) return;
    
    const rect = gameAreaRef.current.getBoundingClientRect();
    const size = getTargetSize(lvl);
    const padding = size / 2 + 20; // Extra padding from edges
    
    const x = padding + Math.random() * (rect.width - padding * 2);
    const y = padding + Math.random() * (rect.height - padding * 2);
    
    setTarget({ x, y });
    setHit(false);
    setMissPos(null);
  }, []);

  const startGame = useCallback(() => {
    setLevel(1);
    setLives(MAX_LIVES);
    setRank(null);
    setPhase("playing");
    setHit(false);
    setMissPos(null);
    setShake(false);
    setTimeout(() => generateTarget(1), 100);
  }, [generateTarget]);

  const handleTap = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (phase !== "playing" || !target || hit) return;
    
    const rect = gameAreaRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const tapX = e.clientX - rect.left;
    const tapY = e.clientY - rect.top;
    
    // Calculate distance from target center
    const distance = Math.sqrt(
      Math.pow(tapX - target.x, 2) + Math.pow(tapY - target.y, 2)
    );
    
    const radius = targetSize / 2;
    
    if (distance <= radius) {
      // HIT!
      setHit(true);
      const nextLevel = level + 1;
      
      setTimeout(() => {
        setLevel(nextLevel);
        generateTarget(nextLevel);
      }, 300);
    } else {
      // MISS!
      setMissPos({ x: tapX, y: tapY });
      setShake(true);
      
      const newLives = lives - 1;
      setLives(newLives);
      
      setTimeout(() => {
        setShake(false);
        setMissPos(null);
        
        if (newLives <= 0) {
          // Game Over
          setRank(getRank(level));
          setPhase("result");
        }
      }, 500);
    }
  }, [phase, target, hit, level, lives, targetSize, generateTarget]);

  // Reset shake animation
  useEffect(() => {
    if (shake) {
      const timer = setTimeout(() => setShake(false), 500);
      return () => clearTimeout(timer);
    }
  }, [shake]);

  // Share URLs
  const finalScore = phase === "result" ? level : 0;
  const shareUrl =
    typeof window !== "undefined" && rank
      ? `${window.location.origin}/accuracy-tap?score=${finalScore}&rank=${rank.rank}&title=${encodeURIComponent(rank.title)}`
      : "";

  const shareText = rank
    ? `正確タップテストでレベル${finalScore}に到達！ランク: ${rank.rank}「${rank.title}」\n#正確タップテスト\n`
    : "";

  const twitterUrl = rank
    ? `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`
    : "";

  const handleNativeShare = useCallback(async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Accuracy Tap Test",
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
      <div className="shooting-bg flex flex-col items-center justify-center min-h-screen px-6 text-center">
        <ShootingStyles />
        
        <div style={{ animation: 'fadeIn 0.6s ease-out' }}>
          <IconTarget size={72} />
        </div>
        
        <h1 
          className="text-3xl sm:text-4xl font-bold mt-6 mb-3"
          style={{ 
            color: '#FFFFFF', 
            animation: 'fadeIn 0.6s ease-out 0.1s both',
            letterSpacing: '0.02em'
          }}
        >
          Accuracy Tap Test
        </h1>
        
        <p 
          className="text-sm mb-1"
          style={{ 
            color: '#888',
            animation: 'fadeIn 0.6s ease-out 0.2s both'
          }}
        >
          正確タップテスト
        </p>
        
        <div 
          className="text-xs max-w-xs leading-relaxed mt-4 mb-8"
          style={{ 
            color: '#666',
            animation: 'fadeIn 0.6s ease-out 0.3s both'
          }}
        >
          <p>ターゲットをタップして撃ち抜け！</p>
          <p className="mt-1">レベルが上がるとターゲットは小さくなる</p>
          <p className="mt-2" style={{ color: '#FF4757' }}>ミス3回でゲームオーバー</p>
        </div>
        
        <button
          onClick={startGame}
          className="text-lg px-10 py-3 font-bold transition-all active:scale-95"
          style={{
            color: '#FFFFFF',
            background: '#FF4757',
            border: 'none',
            borderRadius: '8px',
            animation: 'fadeIn 0.6s ease-out 0.4s both',
            boxShadow: '0 0 20px #FF475760',
          }}
        >
          START
        </button>
        
        <Link
          href="/"
          className="mt-10 text-xs transition-colors"
          style={{ 
            color: '#555',
            animation: 'fadeIn 0.6s ease-out 0.5s both'
          }}
        >
          <IconArrowLeft size={12} color="#555" /> Back
        </Link>
      </div>
    );
  }

  // ===== PLAYING =====
  if (phase === "playing") {
    return (
      <div 
        className="shooting-bg flex flex-col min-h-screen"
        style={{ 
          touchAction: 'manipulation',
          animation: shake ? 'missShake 0.4s ease-out' : 'none'
        }}
      >
        <ShootingStyles />
        
        {/* HUD */}
        <div className="flex justify-between items-center px-4 py-3 z-10">
          {/* Level */}
          <div 
            className="text-2xl font-bold"
            style={{ color: '#FFFFFF' }}
          >
            Lv.{level}
          </div>
          
          {/* Target size indicator */}
          <div 
            className="text-xs"
            style={{ color: '#666' }}
          >
            {targetSize}px
          </div>
          
          {/* Lives */}
          <div className="flex gap-1">
            {Array.from({ length: MAX_LIVES }).map((_, i) => (
              <IconHeart key={i} filled={i < lives} size={24} />
            ))}
          </div>
        </div>
        
        {/* Game Area */}
        <div 
          ref={gameAreaRef}
          className="flex-1 relative overflow-hidden"
          onPointerDown={handleTap}
          style={{ 
            cursor: 'crosshair',
            touchAction: 'manipulation',
            WebkitTapHighlightColor: 'transparent',
          }}
        >
          {/* Background crosshair decoration */}
          <IconCrosshair size={300} />
          
          {/* Target */}
          {target && (
            <Target x={target.x} y={target.y} size={targetSize} hit={hit} />
          )}
          
          {/* Miss effect */}
          {missPos && (
            <MissEffect x={missPos.x} y={missPos.y} />
          )}
        </div>
      </div>
    );
  }

  // ===== RESULT =====
  if (phase === "result" && rank) {
    return (
      <div 
        className="shooting-bg flex flex-col items-center justify-center min-h-screen px-6 py-10"
        style={{ touchAction: 'manipulation' }}
      >
        <ShootingStyles />
        
        {/* Game Over text */}
        <div 
          className="text-sm tracking-widest mb-6"
          style={{ 
            color: '#FF4757',
            animation: 'fadeIn 0.6s ease-out',
            letterSpacing: '0.3em'
          }}
        >
          GAME OVER
        </div>
        
        {/* Rank badge */}
        <div style={{ animation: 'fadeIn 0.6s ease-out 0.1s both' }}>
          <RankBadge rank={rank.rank} color={rank.color} size={100} />
        </div>
        
        {/* Score */}
        <div 
          className="text-6xl font-bold mt-4 mb-1"
          style={{ 
            color: '#FFFFFF',
            animation: 'fadeIn 0.6s ease-out 0.2s both'
          }}
        >
          Lv.{finalScore}
        </div>
        
        <div 
          className="text-sm mb-4"
          style={{ 
            color: '#888',
            animation: 'fadeIn 0.6s ease-out 0.25s both'
          }}
        >
          Final target size: {getTargetSize(finalScore)}px
        </div>
        
        {/* Rank info */}
        <div 
          className="text-lg font-bold mb-1"
          style={{ 
            color: rank.color,
            animation: 'fadeIn 0.6s ease-out 0.3s both'
          }}
        >
          {rank.title}
        </div>
        
        <div 
          className="text-xs max-w-xs text-center mb-4"
          style={{ 
            color: '#888',
            animation: 'fadeIn 0.6s ease-out 0.35s both',
            lineHeight: '1.6'
          }}
        >
          {rank.description}
        </div>
        
        {/* Percentile */}
        <div 
          className="text-sm px-4 py-1.5 mb-8"
          style={{ 
            color: rank.color,
            border: `1px solid ${rank.color}40`,
            borderRadius: '4px',
            animation: 'fadeIn 0.6s ease-out 0.4s both'
          }}
        >
          Top {rank.percentile}%
        </div>
        
        {/* Divider */}
        <div 
          className="w-16 mb-8"
          style={{ 
            height: '1px',
            background: 'linear-gradient(90deg, transparent, #444, transparent)'
          }}
        />
        
        {/* Actions */}
        <div 
          className="flex flex-col gap-3 w-full max-w-xs"
          style={{ animation: 'fadeIn 0.6s ease-out 0.5s both' }}
        >
          {typeof navigator !== "undefined" && typeof navigator.share === "function" && (
            <button
              onClick={handleNativeShare}
              className="w-full py-3 text-sm font-bold tracking-widest transition-all active:scale-95"
              style={{
                color: '#FFFFFF',
                background: '#FF4757',
                border: 'none',
                borderRadius: '8px',
              }}
            >
              <IconShare size={14} color="#FFFFFF" /> Share
            </button>
          )}
          
          <div className="flex gap-3">
            <a
              href={twitterUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-2.5 text-center text-xs font-bold tracking-wider transition-colors"
              style={{
                color: '#FFFFFF',
                border: '1px solid #444',
                borderRadius: '6px',
                background: 'transparent',
              }}
            >
              Post on X
            </a>
            <a
              href={`https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(shareUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-2.5 text-center text-xs font-bold tracking-wider transition-colors"
              style={{
                color: '#06C755',
                border: '1px solid #06C75540',
                borderRadius: '6px',
                background: 'transparent',
              }}
            >
              LINE
            </a>
          </div>
          
          <button
            onClick={startGame}
            className="w-full py-2.5 text-xs font-bold tracking-widest mt-2 transition-all active:scale-95"
            style={{
              color: '#FFFFFF',
              background: 'transparent',
              border: '1px solid #444',
              borderRadius: '6px',
            }}
          >
            <IconRepeat size={13} color="#FFFFFF" /> Try Again
          </button>
          
          <Link
            href="/"
            className="text-center text-xs mt-3 transition-colors"
            style={{ color: '#555' }}
          >
            <IconArrowLeft size={12} color="#555" /> Back
          </Link>
        </div>
      </div>
    );
  }

  return null;
}
