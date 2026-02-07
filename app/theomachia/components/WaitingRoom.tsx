/**
 * @module theomachia/components/WaitingRoom
 * @description ゲーム待機画面。プレイヤーの参加、READY、ルーム設定を行う。
 */

"use client";

import { useState } from "react";
import type { CardId } from "@/lib/theomachia/cards";
import { CARDS, BASE_DECK, OPTIONAL_CARDS } from "@/lib/theomachia/cards";
import type { GameState, Player } from "@/lib/theomachia/types";
import { Card } from "./Card";

interface WaitingRoomProps {
  /** ゲーム状態 */
  gameState: GameState;
  /** 自分のプレイヤー情報（未参加の場合はundefined） */
  me: Player | undefined;
  /** ルーム作成者かどうか */
  isCreator: boolean;
  /** ルームID */
  roomId: string;
  /** READY操作 */
  onReady: () => void;
  /** 共有操作 */
  onShare: () => void;
  /** 先攻/後攻変更 */
  onUpdateTurnChoice: (choice: "first" | "second" | "random") => void;
  /** オプションカードのトグル */
  onToggleOptionalCard: (cardId: CardId) => void;
}

/**
 * 待機画面コンポーネント。
 * プレイヤー一覧、ルーム設定、READY ボタンを表示する。
 */
export function WaitingRoom({
  gameState,
  me,
  isCreator,
  roomId,
  onReady,
  onShare,
  onUpdateTurnChoice,
  onToggleOptionalCard,
}: WaitingRoomProps) {
  const [showDeckModal, setShowDeckModal] = useState(false);
  const players = Object.values(gameState.players);

  return (
    <div style={styles.container}>
      <div style={styles.waitingRoom}>
        <h1 style={styles.title}>THEOMACHIA</h1>
        <p style={styles.subtitle}>神々の戦い</p>

        <div style={styles.roomBox}>
          <span style={styles.roomLabel}>ROOM</span>
          <span style={styles.roomId}>{roomId}</span>
        </div>

        <div style={styles.playerList}>
          {players.map((p) => (
            <div key={p.id} style={styles.playerItem}>
              <span style={styles.playerNameWait}>{p.name}</span>
              <span style={{ ...styles.readyStatus, color: p.ready ? "#C9A227" : "#666" }}>
                {p.ready ? "READY" : "待機中"}
              </span>
            </div>
          ))}
          {players.length < 2 && (
            <div style={styles.playerItem}>
              <span style={styles.playerNameWait}>???</span>
              <span style={{ ...styles.readyStatus, color: "#444" }}>EMPTY</span>
            </div>
          )}
        </div>

        {/* ルーム設定 */}
        <div style={styles.roomSettings}>
          <div style={styles.settingRow}>
            <span style={styles.settingLabel}>先攻/後攻</span>
            <div style={styles.turnChoiceButtons}>
              {(["first", "second", "random"] as const).map((choice) => (
                <button
                  key={choice}
                  onClick={() => isCreator && onUpdateTurnChoice(choice)}
                  style={{
                    ...styles.turnChoiceBtn,
                    backgroundColor:
                      gameState.creatorTurnChoice === choice ? "#C9A227" : "rgba(255,255,255,0.05)",
                    color: gameState.creatorTurnChoice === choice ? "#000" : "#888",
                    cursor: isCreator ? "pointer" : "default",
                    opacity: isCreator ? 1 : 0.7,
                  }}
                >
                  {choice === "first" ? "先攻" : choice === "second" ? "後攻" : ""}
                </button>
              ))}
            </div>
          </div>
          <div style={styles.settingRow}>
            <span style={styles.settingLabel}>追加カード</span>
            <button onClick={() => setShowDeckModal(true)} style={styles.deckSettingBtn}>
              {(gameState.optionalCards?.length || 0) > 0
                ? `${gameState.optionalCards?.length}枚選択中`
                : "なし"}
              {isCreator && " "}
            </button>
          </div>
        </div>

        <button onClick={onShare} style={styles.shareButton}>
          招待URLをコピー
        </button>

        <button onClick={() => (window.location.href = "/theomachia")} style={styles.backButton}>
          タイトルに戻る
        </button>

        {(!me || !me.ready) && (
          <button onClick={onReady} style={styles.readyButton}>
            準備完了
          </button>
        )}
        {me?.ready && <p style={styles.waitingText}>対戦相手を待っています</p>}
      </div>

      {/* デッキ一覧モーダル */}
      {showDeckModal && (
        <div style={styles.modalOverlay} onClick={() => setShowDeckModal(false)}>
          <div style={styles.waitingDeckModal} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>デッキ一覧</h2>
              <button onClick={() => setShowDeckModal(false)} style={styles.closeBtn}>
                
              </button>
            </div>
            <div style={styles.modalBody}>
              <h3 style={styles.sectionTitle}>基本カード（16枚）</h3>
              <div style={styles.cardList}>
                {BASE_DECK.map((cardId) => {
                  const card = CARDS[cardId];
                  return (
                    <div key={cardId} style={{ ...styles.cardListItem, borderColor: card.color }}>
                      <span style={{ ...styles.cardTypeTag, backgroundColor: card.color }}>
                        {card.type === "summon" ? "召喚" : card.type === "spell" ? "儀式" : "スキル"}
                      </span>
                      <span style={styles.cardListName}>{card.name}</span>
                      <p style={styles.cardListDesc}>{card.description}</p>
                    </div>
                  );
                })}
              </div>

              <h3 style={styles.sectionTitle}>
                追加カード（{gameState.optionalCards?.length || 0}/4枚）
                {isCreator && <span style={styles.editHint}>タップで追加/削除</span>}
              </h3>
              <div style={styles.cardList}>
                {OPTIONAL_CARDS.map((cardId) => {
                  const card = CARDS[cardId];
                  const isSelected = gameState.optionalCards?.includes(cardId);
                  return (
                    <div
                      key={cardId}
                      style={{
                        ...styles.cardListItem,
                        borderColor: isSelected ? card.color : "#444",
                        backgroundColor: isSelected ? "rgba(201, 162, 39, 0.1)" : "transparent",
                        cursor: isCreator ? "pointer" : "default",
                        opacity:
                          !isSelected && (gameState.optionalCards?.length || 0) >= 4 && !isCreator
                            ? 0.5
                            : 1,
                      }}
                      onClick={() => isCreator && onToggleOptionalCard(cardId)}
                    >
                      <span style={{ ...styles.cardTypeTag, backgroundColor: card.color }}>
                        {card.type === "summon" ? "召喚" : card.type === "spell" ? "儀式" : "スキル"}
                      </span>
                      <span style={styles.cardListName}>
                        {isSelected && ""}
                        {card.name}
                      </span>
                      <p style={styles.cardListDesc}>{card.description}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
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
  waitingRoom: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    gap: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 700,
    color: "#C9A227",
    letterSpacing: 4,
    textShadow: "0 0 20px rgba(201, 162, 39, 0.5)",
    margin: 0,
  },
  subtitle: { fontSize: 14, color: "#666", letterSpacing: 8, marginTop: -16 },
  roomBox: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 4,
    padding: "16px 32px",
    background: "rgba(201, 162, 39, 0.1)",
    border: "1px solid rgba(201, 162, 39, 0.3)",
    borderRadius: 8,
  },
  roomLabel: { fontSize: 10, color: "#666", letterSpacing: 2 },
  roomId: { fontSize: 24, fontWeight: 700, color: "#C9A227", letterSpacing: 4 },
  playerList: { width: "100%", maxWidth: 280, display: "flex", flexDirection: "column", gap: 8 },
  playerItem: {
    display: "flex",
    justifyContent: "space-between",
    padding: "12px 16px",
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 4,
  },
  playerNameWait: { fontWeight: 600 },
  readyStatus: { fontSize: 12, letterSpacing: 1 },
  roomSettings: {
    width: "100%",
    marginTop: 16,
    marginBottom: 8,
    padding: 12,
    background: "rgba(0,0,0,0.3)",
    borderRadius: 8,
    border: "1px solid rgba(255,255,255,0.1)",
  },
  settingRow: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
  settingLabel: { fontSize: 12, color: "#888" },
  turnChoiceButtons: { display: "flex", gap: 4 },
  turnChoiceBtn: {
    padding: "6px 12px",
    fontSize: 11,
    fontWeight: 600,
    border: "1px solid rgba(255,255,255,0.2)",
    borderRadius: 4,
  },
  deckSettingBtn: {
    padding: "6px 12px",
    fontSize: 11,
    fontWeight: 600,
    background: "rgba(255,255,255,0.05)",
    color: "#aaa",
    border: "1px solid rgba(255,255,255,0.2)",
    borderRadius: 4,
    cursor: "pointer",
  },
  shareButton: {
    padding: "12px 24px",
    fontSize: 13,
    fontWeight: 600,
    letterSpacing: 1,
    background: "transparent",
    color: "#888",
    border: "1px solid #444",
    borderRadius: 4,
    cursor: "pointer",
    marginBottom: 8,
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
    marginBottom: 16,
  },
  readyButton: {
    padding: "16px 48px",
    fontSize: 16,
    fontWeight: 700,
    letterSpacing: 4,
    background: "linear-gradient(180deg, #C9A227 0%, #8B6914 100%)",
    color: "#000",
    border: "none",
    borderRadius: 4,
    cursor: "pointer",
  },
  waitingText: { color: "#666", fontSize: 14 },
  modalOverlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.9)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 200,
    padding: 16,
  },
  waitingDeckModal: {
    backgroundColor: "#1a1a2e",
    borderRadius: 8,
    width: "100%",
    maxWidth: 420,
    maxHeight: "80vh",
    display: "flex",
    flexDirection: "column",
    border: "1px solid rgba(201, 162, 39, 0.3)",
  },
  modalHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "14px 16px",
    borderBottom: "1px solid rgba(255,255,255,0.1)",
  },
  modalTitle: { margin: 0, fontSize: 16, color: "#C9A227", fontWeight: 700 },
  closeBtn: { background: "none", border: "none", color: "#666", fontSize: 18, cursor: "pointer", padding: 4 },
  modalBody: { padding: 16, overflowY: "auto", flex: 1 },
  sectionTitle: {
    fontSize: 13,
    color: "#C9A227",
    marginTop: 12,
    marginBottom: 8,
    fontWeight: 600,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  editHint: { fontSize: 10, color: "#666", fontWeight: 400 },
  cardList: { display: "flex", flexDirection: "column", gap: 6 },
  cardListItem: { padding: 10, borderRadius: 6, border: "1px solid #444", backgroundColor: "rgba(0,0,0,0.2)" },
  cardTypeTag: {
    fontSize: 9,
    padding: "2px 6px",
    borderRadius: 4,
    color: "#000",
    fontWeight: 600,
    marginRight: 8,
  },
  cardListName: { fontSize: 13, fontWeight: 600, color: "#fff" },
  cardListDesc: { fontSize: 11, color: "#888", margin: "4px 0 0 0", lineHeight: 1.4 },
};
