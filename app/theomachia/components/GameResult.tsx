/**
 * @module theomachia/components/GameResult
 * @description ゲーム結果画面。勝敗表示、戦績、ログ確認、リマッチ機能を提供。
 */

"use client";

import { useState, useRef } from "react";
import type { CardId } from "@/lib/theomachia/cards";
import { CARDS, BASE_DECK } from "@/lib/theomachia/cards";
import type { GameState } from "@/lib/theomachia/types";
import { Card, CardDetail } from "./Card";

interface GameResultProps {
  /** ゲーム状態 */
  gameState: GameState;
  /** 自分のプレイヤーID */
  myId: string;
  /** リマッチを送信する */
  onRematch: () => void;
}

/**
 * ゲーム結果画面コンポーネント。
 * 勝敗表示、累計戦績、アクションログ閲覧、カード一覧確認を提供する。
 */
export function GameResult({ gameState, myId, onRematch }: GameResultProps) {
  const [showLog, setShowLog] = useState(false);
  const [showAllCards, setShowAllCards] = useState(false);
  const [showCardDetail, setShowCardDetail] = useState<CardId | null>(null);
  const logContainerRef = useRef<HTMLDivElement>(null);

  const isWinner = gameState.winner === myId;

  return (
    <div style={styles.container}>
      <div style={styles.resultScreen}>
        <h1 style={{ ...styles.resultTitle, color: isWinner ? "#C9A227" : "#8B0000" }}>
          {isWinner ? "勝利" : "敗北"}
        </h1>
        <p style={styles.resultText}>
          {isWinner ? "神々の戦いを制した" : "神々の戦いに敗れた"}
        </p>

        {/* 戦績 */}
        {gameState.matchCount > 0 && (
          <div style={styles.scoreBoard}>
            {Object.values(gameState.players).map((p) => (
              <div key={p.id} style={styles.scoreItem}>
                <span style={{ color: p.id === myId ? "#C9A227" : "#888" }}>{p.name}</span>
                <span style={styles.scoreNumber}>{gameState.wins[p.id] || 0}勝</span>
              </div>
            ))}
            <div style={styles.matchCount}>全{gameState.matchCount}戦</div>
          </div>
        )}

        <div style={{ display: "flex", gap: 16, marginTop: 24 }}>
          <button onClick={() => setShowLog(true)} style={styles.secondaryButton}>
            LOG
          </button>
          <button onClick={() => setShowAllCards(true)} style={styles.secondaryButton}>
            CARDS
          </button>
        </div>
        <button onClick={onRematch} style={{ ...styles.retryButton, marginTop: 16 }}>
          REMATCH
        </button>
        <button
          onClick={() => (window.location.href = "/theomachia")}
          style={{ ...styles.backButton, marginTop: 8 }}
        >
          タイトルに戻る
        </button>
      </div>

      {/* 操作ログモーダル */}
      {showLog && (
        <div
          style={styles.modalOverlay}
          onClick={() => setShowLog(false)}
        >
          <div
            ref={logContainerRef}
            style={styles.logModal}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={styles.logTitle}>操作ログ</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {(gameState.actionLog || []).map((log, i) => (
                <div key={i} style={styles.logEntry}>
                  {log}
                </div>
              ))}
            </div>
            <button onClick={() => setShowLog(false)} style={styles.closeButton}>
              閉じる
            </button>
          </div>
        </div>
      )}

      {/* カード一覧 */}
      {showAllCards && (
        <div style={styles.modalOverlay} onClick={() => setShowAllCards(false)}>
          <div style={styles.allCardsModal} onClick={(e) => e.stopPropagation()}>
            <h2 style={styles.modalTitle}>ALL CARDS</h2>
            <div style={styles.cardGrid}>
              {[...BASE_DECK, ...(gameState.optionalCards || [])].map((cardId) => (
                <div key={cardId} onClick={() => setShowCardDetail(cardId)} style={{ cursor: "pointer" }}>
                  <Card cardId={cardId} size="sm" />
                </div>
              ))}
            </div>
            <button onClick={() => setShowAllCards(false)} style={styles.closeButton}>
              CLOSE
            </button>
          </div>
        </div>
      )}

      {/* カード詳細 */}
      {showCardDetail && <CardDetail cardId={showCardDetail} onClose={() => setShowCardDetail(null)} />}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    height: "100dvh",
    maxHeight: "100dvh",
    background: "linear-gradient(180deg, #0a0a0f 0%, #1a1a2e 50%, #0a0a0f 100%)",
    color: "#e0e0e0",
    fontFamily: "'Cinzel', 'Noto Serif JP', serif",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  },
  resultScreen: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 24,
    padding: 24,
  },
  resultTitle: {
    fontSize: 48,
    fontWeight: 700,
    letterSpacing: 8,
    textShadow: "0 0 30px currentColor",
    margin: 0,
  },
  resultText: { fontSize: 16, color: "#888" },
  scoreBoard: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 8,
    marginTop: 24,
    padding: 16,
    background: "rgba(255,255,255,0.05)",
    borderRadius: 8,
    minWidth: 200,
  },
  scoreItem: { display: "flex", justifyContent: "space-between", width: "100%", fontSize: 14 },
  scoreNumber: { fontWeight: 700, color: "#C9A227" },
  matchCount: { fontSize: 12, color: "#666", marginTop: 8 },
  secondaryButton: {
    padding: "12px 24px",
    fontSize: 12,
    fontWeight: 600,
    letterSpacing: 2,
    background: "rgba(255,255,255,0.1)",
    color: "#888",
    border: "1px solid #444",
    borderRadius: 4,
    cursor: "pointer",
  },
  retryButton: {
    padding: "16px 48px",
    fontSize: 14,
    fontWeight: 700,
    letterSpacing: 4,
    background: "transparent",
    color: "#C9A227",
    border: "2px solid #C9A227",
    borderRadius: 4,
    cursor: "pointer",
  },
  backButton: {
    padding: "10px 20px",
    fontSize: 12,
    fontWeight: 500,
    letterSpacing: 1,
    background: "transparent",
    color: "#555",
    border: "1px solid #333",
    borderRadius: 4,
    cursor: "pointer",
  },
  modalOverlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.9)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
    padding: 20,
  },
  logModal: {
    background: "rgba(20,20,40,0.95)",
    borderRadius: 12,
    padding: 20,
    maxWidth: 500,
    maxHeight: "80vh",
    overflow: "auto",
    width: "100%",
  },
  logTitle: { color: "#fff", marginTop: 0, marginBottom: 16, textAlign: "center" },
  logEntry: { fontSize: 12, color: "#ccc", padding: "4px 0", borderBottom: "1px solid #333" },
  closeButton: {
    marginTop: 16,
    padding: "8px 24px",
    background: "#C9A227",
    color: "#000",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
    width: "100%",
  },
  allCardsModal: {
    background: "linear-gradient(180deg, #1a1a2e 0%, #0a0a0f 100%)",
    border: "1px solid #333",
    borderRadius: 8,
    padding: 24,
    maxWidth: "90vw",
    maxHeight: "80vh",
    overflow: "auto",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 700,
    color: "#C9A227",
    textAlign: "center",
    letterSpacing: 4,
    marginBottom: 16,
  },
  cardGrid: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, marginBottom: 16 },
};
