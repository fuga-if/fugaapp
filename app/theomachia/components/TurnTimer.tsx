/**
 * @module theomachia/components/TurnTimer
 * @description ターンタイマーと打ち消しタイマーの表示コンポーネント。
 * サーバーから受信した残り時間をクライアント側でカウントダウンする。
 */

"use client";

import { useState, useEffect, useRef, CSSProperties } from "react";
import type { TimerState } from "../hooks/useGameConnection";

const TURN_TIME_LIMIT = 120000; // 2分

interface TurnTimerProps {
  /** タイマー状態（サーバーから受信） */
  timerState: TimerState | null;
  /** 自分のターンかどうか */
  isMyTurn: boolean;
}

/**
 * ターンタイマー表示コンポーネント。
 * ゲージバーで残り時間を表示する（数字なし）。
 */
export function TurnTimer({ timerState, isMyTurn }: TurnTimerProps) {
  const [displayTime, setDisplayTime] = useState(TURN_TIME_LIMIT);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (!timerState) {
      setDisplayTime(TURN_TIME_LIMIT);
      return;
    }

    const { turnTimeRemaining, turnPaused, receivedAt } = timerState;

    if (turnPaused) {
      setDisplayTime(turnTimeRemaining);
      return;
    }

    const updateTimer = () => {
      const elapsed = Date.now() - receivedAt;
      const remaining = Math.max(0, turnTimeRemaining - elapsed);
      setDisplayTime(remaining);
      if (remaining <= 0 && intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };

    updateTimer();
    intervalRef.current = setInterval(updateTimer, 100);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [timerState]);

  const progress = displayTime / TURN_TIME_LIMIT;
  const seconds = Math.ceil(displayTime / 1000);

  // 色: 残量で変化
  let barColor: string;
  if (progress > 0.5) {
    barColor = "#4CAF50"; // 緑（50%以上）
  } else if (progress > 0.15) {
    barColor = "#FFC107"; // 黄色（15-50%）
  } else {
    barColor = "#F44336"; // 赤（15%以下 = 18秒以下）
  }

  const isUrgent = seconds <= 15 && seconds > 0;

  return (
    <div style={styles.container}>
      <div style={styles.barBackground}>
        <div
          style={{
            ...styles.barFill,
            width: `${progress * 100}%`,
            background: barColor,
            transition: "width 0.1s linear",
            animation: isUrgent ? "timerBlink 0.5s ease-in-out infinite" : "none",
          }}
        />
      </div>
      <style>{`
        @keyframes timerBlink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
}

interface ShieldTimerProps {
  /** タイマー状態 */
  timerState: TimerState | null;
}

/**
 * 打ち消しタイマー表示コンポーネント。
 * 打ち消し判定中にゲージで表示する。
 */
export function ShieldTimer({ timerState }: ShieldTimerProps) {
  const [displayTime, setDisplayTime] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (!timerState || !timerState.shieldActive) {
      setDisplayTime(0);
      return;
    }

    const { shieldTimeLimit, receivedAt } = timerState;

    const updateTimer = () => {
      const elapsed = Date.now() - receivedAt;
      const remaining = Math.max(0, shieldTimeLimit - elapsed);
      setDisplayTime(remaining);
      if (remaining <= 0 && intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };

    updateTimer();
    intervalRef.current = setInterval(updateTimer, 100);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [timerState]);

  if (!timerState?.shieldActive || displayTime <= 0) return null;

  const progress = displayTime / (timerState.shieldTimeLimit || 15000);

  return (
    <div style={styles.shieldContainer}>
      <span style={styles.shieldIcon}>🛡️</span>
      <div style={styles.shieldBarBg}>
        <div
          style={{
            ...styles.shieldBarFill,
            width: `${progress * 100}%`,
            transition: "width 0.1s linear",
          }}
        />
      </div>
    </div>
  );
}

/**
 * 処理中インジケーターコンポーネント。
 * pendingAction中に画面右下にスピナーを表示する。
 */
export function ProcessingIndicator({ visible }: { visible: boolean }) {
  if (!visible) return null;

  return (
    <div style={styles.processingContainer}>
      <div style={styles.spinner} />
      <span style={styles.processingText}>処理中...</span>
      <style>{`
        @keyframes processingSpinAnim {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  container: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    minWidth: 80,
  },
  barBackground: {
    flex: 1,
    height: 4,
    background: "rgba(255,255,255,0.1)",
    borderRadius: 2,
    overflow: "hidden",
  },
  barFill: {
    height: "100%",
    borderRadius: 2,
  },
  shieldContainer: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    padding: "2px 8px",
    background: "rgba(201, 162, 39, 0.15)",
    borderRadius: 4,
    border: "1px solid rgba(201, 162, 39, 0.3)",
  },
  shieldIcon: {
    fontSize: 12,
  },
  shieldBarBg: {
    width: 60,
    height: 3,
    background: "rgba(201, 162, 39, 0.2)",
    borderRadius: 2,
    overflow: "hidden",
  },
  shieldBarFill: {
    height: "100%",
    background: "#C9A227",
    borderRadius: 2,
  },
  processingContainer: {
    position: "fixed" as const,
    bottom: 16,
    right: 16,
    background: "rgba(26, 26, 46, 0.9)",
    borderRadius: 8,
    padding: "8px 14px",
    display: "flex",
    alignItems: "center",
    gap: 8,
    zIndex: 50,
    border: "1px solid rgba(201, 162, 39, 0.3)",
    boxShadow: "0 2px 8px rgba(0,0,0,0.5)",
  },
  spinner: {
    width: 16,
    height: 16,
    border: "2px solid rgba(201, 162, 39, 0.3)",
    borderTop: "2px solid #C9A227",
    borderRadius: "50%",
    animation: "processingSpinAnim 1s linear infinite",
  },
  processingText: {
    fontSize: 12,
    color: "#888",
    letterSpacing: 1,
  },
};
