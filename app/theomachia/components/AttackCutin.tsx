/**
 * @module theomachia/components/AttackCutin
 * @description 攻撃カットインアニメーション。
 * 召喚獣の攻撃時やメデューサの反射時にフルスクリーンで表示される。
 */

"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { CARDS, type CardId } from "@/lib/theomachia/cards";

const CARD_IMAGES: Record<string, string> = {
  zeus: "zeus",
  eris: "eris", 
  medusa: "medusa",
};

/** AttackCutin コンポーネントのプロパティ */
interface AttackCutinProps {
  /** 攻撃したカードのID（nullの場合は表示しない） */
  attackerCard: CardId | null;
  /** ダメージ量 */
  damage: number;
  /** メデューサによる反射かどうか */
  isReflect?: boolean;
  /** アニメーション完了時のコールバック */
  onComplete: () => void;
}

/**
 * 攻撃カットインアニメーションコンポーネント。
 *
 * フェーズ遷移:
 * 1. `attack-enter` → カードが画面外からスライドイン
 * 2. `attack-show` → ダメージ表示
 * 3. `reflect-enter` → 反射カットインがスライドイン（反射時のみ）
 * 4. `reflect-show` → 反射ダメージ表示（反射時のみ）
 * 5. `exit` → スライドアウト
 * 6. `done` → 非表示、onComplete呼び出し
 *
 * @param props - コンポーネントプロパティ
 */
export function AttackCutin({ attackerCard, damage, isReflect, onComplete }: AttackCutinProps) {
  const [phase, setPhase] = useState<"attack-enter" | "attack-show" | "reflect-enter" | "reflect-show" | "exit" | "done">("attack-enter");
  
  useEffect(() => {
    if (!attackerCard) return;
    
    if (isReflect) {
      // 反射あり: 攻撃 → 反射の2段階
      const timers = [
        setTimeout(() => setPhase("attack-show"), 200),
        setTimeout(() => setPhase("reflect-enter"), 800),  // 攻撃表示後、反射カットイン
        setTimeout(() => setPhase("reflect-show"), 1000),
        setTimeout(() => setPhase("exit"), 1800),
        setTimeout(() => {
          setPhase("done");
          onComplete();
        }, 2200),
      ];
      return () => timers.forEach(clearTimeout);
    } else {
      // 通常攻撃のみ
      const timers = [
        setTimeout(() => setPhase("attack-show"), 200),
        setTimeout(() => setPhase("exit"), 1200),
        setTimeout(() => {
          setPhase("done");
          onComplete();
        }, 1600),
      ];
      return () => timers.forEach(clearTimeout);
    }
  }, [attackerCard, isReflect, onComplete]);
  
  if (!attackerCard || phase === "done") return null;
  
  const card = CARDS[attackerCard];
  const imageName = CARD_IMAGES[attackerCard] || attackerCard;
  
  const isShowingReflect = phase === "reflect-enter" || phase === "reflect-show";
  const showAttack = !isShowingReflect && phase !== "exit";
  const showReflect = isShowingReflect || (phase === "exit" && !!isReflect);
  
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        pointerEvents: "none",
        overflow: "hidden",
      }}
    >
      {/* 背景オーバーレイ */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(0,0,0,0.7)",
          opacity: phase === "attack-enter" ? 0 : 1,
          transition: "opacity 0.2s ease",
        }}
      />
      
      {/* 攻撃カットイン */}
      <CutinSlide
        show={showAttack}
        entering={phase === "attack-enter"}
        exiting={phase === "exit" && !isReflect}
        color="attack"
        cardName={card.name}
        imageName={imageName}
        damage={damage}
        label="ATTACK!"
      />
      
      {/* 反射カットイン（上書き） */}
      {isReflect && (
        <CutinSlide
          show={showReflect}
          entering={phase === "reflect-enter"}
          exiting={phase === "exit"}
          color="reflect"
          cardName="メデューサ"
          imageName="medusa"
          damage={damage}
          label="REFLECT!"
          fromRight
        />
      )}
      
      {/* スピードライン効果 */}
      {(phase === "attack-show" || phase === "reflect-show") && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `repeating-linear-gradient(
              ${showReflect ? "135deg" : "-45deg"},
              transparent,
              transparent 10px,
              rgba(255,255,255,0.03) 10px,
              rgba(255,255,255,0.03) 20px
            )`,
            animation: "speedLines 0.5s linear infinite",
          }}
        />
      )}
      
      <style>{`
        @keyframes speedLines {
          0% { transform: translateX(0); }
          100% { transform: translateX(40px); }
        }
      `}</style>
    </div>
  );
}

/**
 * カットインスライドの内部コンポーネント。
 * 攻撃カットインと反射カットインの共通UIを提供する。
 */
function CutinSlide({
  show,
  entering,
  exiting,
  color,
  cardName,
  imageName,
  damage,
  label,
  fromRight,
}: {
  show: boolean;
  entering: boolean;
  exiting: boolean;
  color: "attack" | "reflect";
  cardName: string;
  imageName: string;
  damage: number;
  label: string;
  fromRight?: boolean;
}) {
  const colors = {
    attack: {
      bg: "linear-gradient(135deg, #e74c3c 0%, #c0392b 50%, #922b21 100%)",
      glow: "0 0 60px rgba(231,76,60,0.8), inset 0 0 30px rgba(255,255,255,0.2)",
    },
    reflect: {
      bg: "linear-gradient(135deg, #2ecc71 0%, #27ae60 50%, #1e8449 100%)",
      glow: "0 0 60px rgba(46,204,113,0.8), inset 0 0 30px rgba(255,255,255,0.2)",
    },
  };
  
  const c = colors[color];
  
  let left = "0%";
  if (entering) left = fromRight ? "100%" : "-100%";
  if (exiting) left = fromRight ? "-100%" : "100%";
  
  return (
    <div
      style={{
        position: "absolute",
        top: "50%",
        left,
        transform: `translateY(-50%) skewX(${fromRight ? "15deg" : "-15deg"})`,
        width: "120%",
        height: "45%",
        background: c.bg,
        boxShadow: c.glow,
        transition: "left 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 40,
        opacity: show ? 1 : 0,
        pointerEvents: "none",
      }}
    >
      {/* キャラ画像 */}
      <div
        style={{
          position: "relative",
          width: 180,
          height: 250,
          transform: `skewX(${fromRight ? "-15deg" : "15deg"})`,
          borderRadius: 12,
          overflow: "hidden",
          boxShadow: "0 0 30px rgba(0,0,0,0.5)",
          border: "3px solid rgba(255,255,255,0.3)",
        }}
      >
        <Image
          src={`/theomachia/cards/${imageName}.webp`}
          alt={cardName}
          fill
          style={{ objectFit: "cover" }}
        />
      </div>
      
      {/* ダメージ表示 */}
      <div style={{ transform: `skewX(${fromRight ? "-15deg" : "15deg"})`, textAlign: "center" }}>
        <div style={{
          fontSize: 28,
          fontWeight: 900,
          color: "#fff",
          textShadow: "0 2px 4px rgba(0,0,0,0.5)",
          letterSpacing: 2,
          marginBottom: 8,
        }}>
          {cardName}
        </div>
        <div style={{
          fontSize: 18,
          fontWeight: 600,
          color: "rgba(255,255,255,0.8)",
          marginBottom: 12,
        }}>
          {label}
        </div>
        <div style={{
          fontSize: 72,
          fontWeight: 900,
          color: "#FFD700",
          textShadow: "0 0 20px rgba(255,215,0,0.8), 0 4px 8px rgba(0,0,0,0.5)",
          fontFamily: "Impact, sans-serif",
          letterSpacing: 4,
        }}>
          {damage}
          <span style={{ fontSize: 32, marginLeft: 8 }}>DMG</span>
        </div>
      </div>
    </div>
  );
}
