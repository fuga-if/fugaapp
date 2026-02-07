/**
 * @module theomachia/components/StatusGauge
 * @description ステータスゲージコンポーネント。
 * ソウル（HP）、シールド、行動回数を視覚的に表示する。
 */

"use client";

import Image from "next/image";

/** StatusGauge コンポーネントのプロパティ */
interface StatusGaugeProps {
  /** ゲージの種類 */
  type: "soul" | "shield" | "action";
  /** 現在値 */
  current: number;
  /** 最大値 */
  max: number;
  /** 表示サイズ */
  size?: "sm" | "md";
}

// 色設定
const TYPE_CONFIG = {
  soul: {
    icon: "/theomachia/ui/soul.webp",
    activeColor: { high: "#4FC3F7", mid: "#FFB74D", low: "#EF5350" },
    inactiveColor: "#1a1a2a",
  },
  shield: {
    icon: "/theomachia/ui/shield.webp", 
    activeColor: { high: "#FFD54F", mid: "#FFD54F", low: "#FFD54F" },
    inactiveColor: "#2a2a1a",
  },
  action: {
    icon: "/theomachia/ui/action.webp",
    activeColor: { high: "#FFD700", mid: "#FFD700", low: "#FFD700" },
    inactiveColor: "#2a2a1a",
  },
};

/**
 * ステータスゲージコンポーネント。
 *
 * - **soul**: セグメントバー表示。HP残量に応じて色が変化（青→橙→赤点滅）
 * - **shield**: セグメントバー表示。ゴールド一色
 * - **action**: 丸ドット表示。残りアクション数を目立つように表示
 *
 * @param props - コンポーネントプロパティ
 */
export function StatusGauge({ type, current, max, size = "md" }: StatusGaugeProps) {
  const config = TYPE_CONFIG[type];
  const iconSize = size === "sm" ? 16 : 20;
  
  // 行動回数は丸で横並び（目立つ）
  if (type === "action") {
    return <ActionGauge current={current} max={max} size={size} />;
  }
  
  // HP/シールドはセグメントバー
  const segmentWidth = size === "sm" ? 14 : 20;
  const segmentHeight = size === "sm" ? 6 : 8;
  const gap = 2;
  
  const getSegmentColor = (isActive: boolean) => {
    if (!isActive) return { bg: config.inactiveColor, glow: "none" };
    
    if (type === "soul") {
      const ratio = current / max;
      if (ratio > 0.5) {
        return { bg: `linear-gradient(90deg, ${config.activeColor.high} 0%, #0288D1 100%)`, glow: `0 0 4px rgba(79, 195, 247, 0.5)` };
      } else if (ratio > 0.25) {
        return { bg: `linear-gradient(90deg, ${config.activeColor.mid} 0%, #F57C00 100%)`, glow: `0 0 4px rgba(255, 183, 77, 0.5)` };
      } else {
        return { bg: `linear-gradient(90deg, ${config.activeColor.low} 0%, #C62828 100%)`, glow: `0 0 6px rgba(239, 83, 80, 0.6)`, pulse: true };
      }
    }
    
    const color = config.activeColor.high;
    return { bg: `linear-gradient(90deg, ${color} 0%, ${color}99 100%)`, glow: `0 0 4px ${color}80` };
  };
  
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 4, height: iconSize + 4 }}>
      <Image
        src={config.icon}
        alt={type}
        width={iconSize}
        height={iconSize}
        style={{ 
          filter: current > 0 ? "none" : "grayscale(1) opacity(0.5)",
          flexShrink: 0,
        }}
      />
      
      <div style={{
        display: "flex",
        gap,
        padding: 2,
        background: "rgba(0,0,0,0.5)",
        borderRadius: 3,
        border: "1px solid #333",
      }}>
        {[...Array(max)].map((_, i) => {
          const isActive = i < current;
          const color = getSegmentColor(isActive);
          
          return (
            <div
              key={i}
              style={{
                width: segmentWidth,
                height: segmentHeight,
                background: color.bg,
                borderRadius: 2,
                boxShadow: color.glow,
                transition: "all 0.3s ease",
                animation: (color as any).pulse ? "hpPulse 0.8s ease-in-out infinite" : "none",
              }}
            />
          );
        })}
      </div>
      
      <style>{`
        @keyframes hpPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }
      `}</style>
    </div>
  );
}

/**
 * 行動回数ゲージ（丸ドット表示）。
 * 残りアクション数を大きめの丸で目立たせて表示する。
 */
function ActionGauge({ current, max, size }: { current: number; max: number; size: "sm" | "md" }) {
  const dotSize = size === "sm" ? 14 : 18;
  const iconSize = size === "sm" ? 16 : 20;
  
  return (
    <div style={{ 
      display: "flex", 
      alignItems: "center", 
      gap: 6,
      padding: "4px 8px",
      background: "rgba(201,162,39,0.15)",
      borderRadius: 8,
      border: "1px solid rgba(201,162,39,0.3)",
    }}>
      <Image
        src="/theomachia/ui/action.webp"
        alt="action"
        width={iconSize}
        height={iconSize}
        style={{ filter: current > 0 ? "none" : "grayscale(1) opacity(0.5)" }}
      />
      <div style={{ display: "flex", gap: 6 }}>
        {[...Array(max)].map((_, i) => (
          <div
            key={i}
            style={{
              width: dotSize,
              height: dotSize,
              borderRadius: "50%",
              background: i < current 
                ? "linear-gradient(135deg, #FFD700 0%, #FFA500 100%)" 
                : "rgba(50,50,50,0.8)",
              border: i < current ? "2px solid #FFD700" : "2px solid #444",
              boxShadow: i < current ? "0 0 10px rgba(255,215,0,0.6)" : "none",
              transition: "all 0.2s ease",
            }}
          />
        ))}
      </div>
    </div>
  );
}
