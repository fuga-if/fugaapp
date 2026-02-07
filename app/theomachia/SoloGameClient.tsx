"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import usePartySocket from "partysocket/react";
import { CARDS, type CardId } from "@/lib/theomachia/cards";
import { Card } from "./components/Card";
import type { GameState, MessageToServer, MessageFromServer } from "@/lib/theomachia/types";

const PARTYKIT_HOST = process.env.NEXT_PUBLIC_PARTYKIT_HOST || "theomachia.fuga-if.partykit.dev";

interface SoloGameClientProps {
  roomId: string;
}

export default function SoloGameClient({ roomId }: SoloGameClientProps) {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [player1Id, setPlayer1Id] = useState<string | null>(null);
  const [player2Id, setPlayer2Id] = useState<string | null>(null);
  const [selectedCard, setSelectedCard] = useState<{ player: 1 | 2; cardId: CardId } | null>(null);
  const [showCardList, setShowCardList] = useState<1 | 2 | null>(null);
  const [showDeck, setShowDeck] = useState<{ player: 1 | 2; cards: CardId[] } | null>(null);
  const [peekHand, setPeekHand] = useState<{ cards: CardId[]; message: string } | null>(null);
  const [showLog, setShowLog] = useState(false);
  const [waitingForTarget, setWaitingForTarget] = useState<{ player: 1 | 2; type: string } | null>(null);
  const hasJoinedRef = useRef<{ p1: boolean; p2: boolean }>({ p1: false, p2: false });

  // Player 1 socket
  const socket1 = usePartySocket({
    host: PARTYKIT_HOST,
    room: roomId,
    id: `solo-p1-${roomId}`,
    onMessage(event) {
      const data = JSON.parse(event.data) as MessageFromServer;
      if (data.type === "state") setGameState(data.state);
      if (data.type === "joined") setPlayer1Id(data.playerId);
      if (data.type === "requestGuess") setShowCardList(1);
      if (data.type === "showDeck") {
        console.log("P1 showDeck received:", data.deck?.length, "cards:", data.deck);
        alert(`神託: 山札${data.deck?.length}枚 - ${data.deck?.join(", ")}`);
        setShowDeck({ player: 1, cards: data.deck });
      }
      if (data.type === "peekHand") setPeekHand({ cards: data.hand, message: data.message });
      if (data.type === "requestTarget") setWaitingForTarget({ player: 1, type: data.targetType });
    },
  });

  // Player 2 socket
  const socket2 = usePartySocket({
    host: PARTYKIT_HOST,
    room: roomId,
    id: `solo-p2-${roomId}`,
    onMessage(event) {
      const data = JSON.parse(event.data) as MessageFromServer;
      if (data.type === "state") setGameState(data.state);
      if (data.type === "joined") setPlayer2Id(data.playerId);
      if (data.type === "requestGuess") setShowCardList(2);
      if (data.type === "showDeck") {
        console.log("P2 showDeck received:", data.deck?.length, "cards");
        setShowDeck({ player: 2, cards: data.deck });
      }
      if (data.type === "peekHand") setPeekHand({ cards: data.hand, message: data.message });
      if (data.type === "requestTarget") setWaitingForTarget({ player: 2, type: data.targetType });
    },
  });

  // Join both players
  useEffect(() => {
    if (socket1.readyState === WebSocket.OPEN && !hasJoinedRef.current.p1) {
      hasJoinedRef.current.p1 = true;
      socket1.send(JSON.stringify({ type: "join", name: "プレイヤー1" }));
    }
  }, [socket1, socket1.readyState]);

  useEffect(() => {
    if (socket2.readyState === WebSocket.OPEN && !hasJoinedRef.current.p2) {
      hasJoinedRef.current.p2 = true;
      socket2.send(JSON.stringify({ type: "join", name: "プレイヤー2" }));
    }
  }, [socket2, socket2.readyState]);

  const send1 = useCallback((msg: MessageToServer) => {
    if (socket1.readyState === WebSocket.OPEN) {
      socket1.send(JSON.stringify(msg));
    }
  }, [socket1]);

  const send2 = useCallback((msg: MessageToServer) => {
    if (socket2.readyState === WebSocket.OPEN) {
      socket2.send(JSON.stringify(msg));
    }
  }, [socket2]);

  const handleReady = (player: 1 | 2) => {
    if (player === 1) send1({ type: "ready" });
    else send2({ type: "ready" });
  };

  const handleCardClick = (player: 1 | 2, cardId: CardId) => {
    setSelectedCard({ player, cardId });
  };

  const handlePlay = () => {
    if (!selectedCard) return;
    const { player, cardId } = selectedCard;
    if (player === 1) send1({ type: "play", cardId });
    else send2({ type: "play", cardId });
    setSelectedCard(null);
  };

  const handleEndTurn = (player: 1 | 2) => {
    if (player === 1) send1({ type: "endTurn" });
    else send2({ type: "endTurn" });
  };

  const handlePassShield = (player: 1 | 2) => {
    if (player === 1) send1({ type: "passShield" });
    else send2({ type: "passShield" });
  };

  const handleShield = (player: 1 | 2) => {
    if (player === 1) send1({ type: "shield" });
    else send2({ type: "shield" });
  };

  const handleGuessCard = (cardId: CardId) => {
    if (showCardList === 1) send1({ type: "guessCard", cardId });
    else if (showCardList === 2) send2({ type: "guessCard", cardId });
    setShowCardList(null);
  };

  const handleSelectFromDeck = (cardId: CardId) => {
    if (showDeck?.player === 1) send1({ type: "selectCard", cardId });
    else if (showDeck?.player === 2) send2({ type: "selectCard", cardId });
    setShowDeck(null);
  };

  const handleSelectTarget = (cardId: CardId) => {
    if (waitingForTarget?.player === 1) send1({ type: "selectTarget", target: cardId });
    else if (waitingForTarget?.player === 2) send2({ type: "selectTarget", target: cardId });
    setWaitingForTarget(null);
  };

  const handlePassCounter = (player: 1 | 2) => {
    if (player === 1) send1({ type: "passCounter" });
    else send2({ type: "passCounter" });
  };

  const handleShieldCounter = (player: 1 | 2) => {
    if (player === 1) send1({ type: "shieldCounter" });
    else send2({ type: "shieldCounter" });
  };

  if (!gameState) {
    return (
      <div style={styles.container}>
        <p style={styles.loading}>接続中...</p>
      </div>
    );
  }

  const p1 = player1Id ? gameState.players[player1Id] : null;
  const p2 = player2Id ? gameState.players[player2Id] : null;

  // 待機画面
  if (gameState.phase === "waiting") {
    return (
      <div style={styles.container}>
        <h1 style={styles.title}>SOLO MODE</h1>
        <p style={styles.roomId}>Room: {roomId}</p>
        
        <div style={styles.playersRow}>
          <div style={styles.playerBox}>
            <h3>プレイヤー1</h3>
            <p>{p1?.ready ? "準備完了 " : "待機中..."}</p>
            {!p1?.ready && (
              <button onClick={() => handleReady(1)} style={styles.readyBtn}>READY</button>
            )}
          </div>
          <div style={styles.playerBox}>
            <h3>プレイヤー2</h3>
            <p>{p2?.ready ? "準備完了 " : "待機中..."}</p>
            {!p2?.ready && (
              <button onClick={() => handleReady(2)} style={styles.readyBtn}>READY</button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // 結果画面
  if (gameState.phase === "ended") {
    const winner = gameState.winner === player1Id ? "プレイヤー1" : "プレイヤー2";
    return (
      <div style={styles.container}>
        <h1 style={styles.title}>{winner} の勝利！</h1>
        <button onClick={() => location.reload()} style={styles.readyBtn}>REMATCH</button>
      </div>
    );
  }

  const isP1Turn = gameState.currentTurn === player1Id;
  const currentPlayer = isP1Turn ? 1 : 2;

  // ゲーム画面
  return (
    <div style={styles.container}>
      {/* ヘッダー */}
      <div style={styles.header}>
        <span style={styles.roomLabel}>Room: {roomId}</span>
        <span style={styles.turnLabel}>
          {isP1Turn ? "プレイヤー1" : "プレイヤー2"} のターン (残り{gameState.playsRemaining}回)
        </span>
      </div>

      {/* 最後のアクション */}
      {gameState.lastAction && (
        <div style={styles.lastAction}>{gameState.lastAction}</div>
      )}

      {/* 打ち消し確認 */}
      {gameState.pendingShield && (
        <div style={styles.shieldOverlay}>
          <div style={styles.shieldBox}>
            <p>{CARDS[gameState.pendingShield.cardId].name}</p>
            <p style={styles.cardDesc}>{CARDS[gameState.pendingShield.cardId].description}</p>
            <p>打ち消しますか？</p>
            <div style={styles.shieldButtons}>
              {gameState.pendingShield.by === player1Id ? (
                // P1がプレイ → P2が判定
                <>
                  <button onClick={() => handlePassShield(2)} style={styles.passBtn}>通す</button>
                  {p2 && p2.shields > 0 && (
                    <button onClick={() => handleShield(2)} style={styles.counterBtn}>
                      打ち消し ({p2.shields})
                    </button>
                  )}
                </>
              ) : (
                // P2がプレイ → P1が判定
                <>
                  <button onClick={() => handlePassShield(1)} style={styles.passBtn}>通す</button>
                  {p1 && p1.shields > 0 && (
                    <button onClick={() => handleShield(1)} style={styles.counterBtn}>
                      打ち消し ({p1.shields})
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 打ち消し返し確認 */}
      {gameState.pendingCounter && (
        <div style={styles.shieldOverlay}>
          <div style={styles.shieldBox}>
            <p>{CARDS[gameState.pendingCounter.cardId].name}が打ち消された！</p>
            <p>打ち消し返しますか？</p>
            <div style={styles.shieldButtons}>
              {gameState.pendingCounter.by === player1Id ? (
                <>
                  <button onClick={() => handlePassCounter(1)} style={styles.passBtn}>通す</button>
                  {p1 && p1.shields >= 2 && (
                    <button onClick={() => handleShieldCounter(1)} style={styles.counterBtn}>
                      打ち消し返し ({p1.shields})
                    </button>
                  )}
                </>
              ) : (
                <>
                  <button onClick={() => handlePassCounter(2)} style={styles.passBtn}>通す</button>
                  {p2 && p2.shields >= 2 && (
                    <button onClick={() => handleShieldCounter(2)} style={styles.counterBtn}>
                      打ち消し返し ({p2.shields})
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* カード名選択 */}
      {showCardList && (
        <div style={styles.shieldOverlay}>
          <div style={styles.cardListBox}>
            <p>カード名を宣言</p>
            <div style={styles.cardGrid}>
              {Object.values(CARDS).map(card => (
                <div 
                  key={card.id}
                  onClick={() => handleGuessCard(card.id as CardId)}
                  style={styles.cardOption}
                >
                  <Card cardId={card.id as CardId} size="sm" />
                  <span style={styles.cardName}>{card.name}</span>
                </div>
              ))}
            </div>
            <button onClick={() => setShowCardList(null)} style={styles.cancelBtn}>キャンセル</button>
          </div>
        </div>
      )}

      {/* 山札からカード選択（神託） */}
      {showDeck && (
        <div style={styles.shieldOverlay}>
          <div style={styles.cardListBox}>
            <p>山札から1枚選ぶ（{showDeck.cards.length}枚）</p>
            <div style={styles.cardGrid}>
              {showDeck.cards.map((cardId, i) => (
                <div 
                  key={i}
                  onClick={() => handleSelectFromDeck(cardId)}
                  style={styles.cardOption}
                >
                  <Card cardId={cardId} size="sm" />
                  <span style={styles.cardName}>{CARDS[cardId].name}</span>
                </div>
              ))}
            </div>
            <button onClick={() => setShowDeck(null)} style={styles.cancelBtn}>キャンセル</button>
          </div>
        </div>
      )}

      {/* 手札公開（見るだけ） */}
      {peekHand && (
        <div style={styles.shieldOverlay}>
          <div style={styles.cardListBox}>
            <p>{peekHand.message}</p>
            <div style={styles.cardGrid}>
              {peekHand.cards.map((cardId, i) => (
                <div key={i} style={styles.cardOption}>
                  <Card cardId={cardId} size="sm" />
                  <span style={styles.cardName}>{CARDS[cardId].name}</span>
                </div>
              ))}
            </div>
            <button onClick={() => setPeekHand(null)} style={styles.cancelBtn}>OK</button>
          </div>
        </div>
      )}

      {/* ターゲット選択 */}
      {waitingForTarget && (
        <div style={styles.shieldOverlay}>
          <div style={styles.cardListBox}>
            <p>
              {waitingForTarget.type === "summon" && "手札から召喚獣を選択"}
              {waitingForTarget.type === "field" && "場の召喚獣を選択"}
              {waitingForTarget.type === "discard" && "墓地から召喚獣を選択"}
            </p>
            <div style={styles.cardGrid}>
              {waitingForTarget.type === "summon" && (
                // 手札の召喚獣を表示
                ((waitingForTarget.player === 1 ? p1?.hand : p2?.hand) as CardId[] || [])
                  .filter(id => CARDS[id]?.type === "summon")
                  .map((cardId, i) => (
                    <div key={i} onClick={() => handleSelectTarget(cardId)} style={styles.cardOption}>
                      <Card cardId={cardId} size="sm" />
                      <span style={styles.cardName}>{CARDS[cardId].name}</span>
                    </div>
                  ))
              )}
              {waitingForTarget.type === "field" && (
                // 両方の場の召喚獣を表示
                [...(p1?.field || []), ...(p2?.field || [])].map((cardId, i) => (
                  <div key={i} onClick={() => handleSelectTarget(cardId)} style={styles.cardOption}>
                    <Card cardId={cardId} size="sm" />
                    <span style={styles.cardName}>{CARDS[cardId].name}</span>
                  </div>
                ))
              )}
              {waitingForTarget.type === "discard" && (
                // 墓地の召喚獣を表示
                (gameState?.discard || [])
                  .filter(id => CARDS[id]?.type === "summon")
                  .map((cardId, i) => (
                    <div key={i} onClick={() => handleSelectTarget(cardId)} style={styles.cardOption}>
                      <Card cardId={cardId} size="sm" />
                      <span style={styles.cardName}>{CARDS[cardId].name}</span>
                    </div>
                  ))
              )}
            </div>
            <button onClick={() => setWaitingForTarget(null)} style={styles.cancelBtn}>キャンセル</button>
          </div>
        </div>
      )}

      {/* 2人のプレイエリア */}
      <div style={styles.playersRow}>
        {/* プレイヤー1 */}
        <div style={{ ...styles.playerArea, opacity: isP1Turn ? 1 : 0.6 }}>
          <div style={styles.playerHeader}>
            <span style={styles.playerName}>プレイヤー1</span>
            <span>魂:{p1?.souls} 盾:{p1?.shields}</span>
          </div>
          
          {/* 場 */}
          <div style={styles.fieldArea}>
            {p1?.field.map((cardId, i) => (
              <Card key={i} cardId={cardId} size="sm" />
            ))}
            {(!p1?.field || p1.field.length === 0) && <span style={styles.emptyField}>召喚獣なし</span>}
          </div>
          
          {/* 手札 */}
          <div style={styles.handArea}>
            {(p1?.hand as CardId[] || []).map((cardId, i) => (
              <Card 
                key={i} 
                cardId={cardId} 
                size="sm"
                onClick={isP1Turn && gameState.playsRemaining > 0 ? () => handleCardClick(1, cardId) : undefined}
                selected={selectedCard?.player === 1 && selectedCard?.cardId === cardId}
              />
            ))}
          </div>
          
          {isP1Turn && (
            <button onClick={() => handleEndTurn(1)} style={styles.endTurnBtn}>END TURN</button>
          )}
        </div>

        {/* プレイヤー2 */}
        <div style={{ ...styles.playerArea, opacity: !isP1Turn ? 1 : 0.6 }}>
          <div style={styles.playerHeader}>
            <span style={styles.playerName}>プレイヤー2</span>
            <span>魂:{p2?.souls} 盾:{p2?.shields}</span>
          </div>
          
          {/* 場 */}
          <div style={styles.fieldArea}>
            {p2?.field.map((cardId, i) => (
              <Card key={i} cardId={cardId} size="sm" />
            ))}
            {(!p2?.field || p2.field.length === 0) && <span style={styles.emptyField}>召喚獣なし</span>}
          </div>
          
          {/* 手札 */}
          <div style={styles.handArea}>
            {(p2?.hand as CardId[] || []).map((cardId, i) => (
              <Card 
                key={i} 
                cardId={cardId} 
                size="sm"
                onClick={!isP1Turn && gameState.playsRemaining > 0 ? () => handleCardClick(2, cardId) : undefined}
                selected={selectedCard?.player === 2 && selectedCard?.cardId === cardId}
              />
            ))}
          </div>
          
          {!isP1Turn && (
            <button onClick={() => handleEndTurn(2)} style={styles.endTurnBtn}>END TURN</button>
          )}
        </div>
      </div>

      {/* カード使用確認 */}
      {selectedCard && (
        <div style={styles.confirmOverlay}>
          <div style={styles.confirmBox}>
            <Card cardId={selectedCard.cardId} size="lg" />
            <p style={styles.cardDesc}>{CARDS[selectedCard.cardId].description}</p>
            <div style={styles.confirmButtons}>
              <button onClick={() => setSelectedCard(null)} style={styles.cancelBtn}>CANCEL</button>
              <button onClick={handlePlay} style={styles.playBtn}>PLAY</button>
            </div>
          </div>
        </div>
      )}

      {/* 共有情報 */}
      <div style={styles.sharedInfo}>
        <span>山札: {gameState.deck}</span>
        <span>捨て札: {gameState.discard.length}</span>
        <span>シールド残: {gameState.shieldStock}</span>
      </div>

      {/* 操作ログボタン */}
      <button 
        onClick={() => setShowLog(!showLog)} 
        style={styles.logToggleBtn}
      >
        {showLog ? "ログを閉じる" : "操作ログ"}
      </button>

      {/* 操作ログ */}
      {showLog && (
        <div style={styles.logArea}>
          <div style={styles.logContent}>
            {(gameState.actionLog || []).slice(-15).reverse().map((log, i) => (
              <div key={i} style={styles.logEntry}>{log}</div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: "100dvh",
    background: "#0a0a0f",
    color: "#e0e0e0",
    padding: 12,
    paddingBottom: 100,
    fontFamily: "sans-serif",
  },
  loading: {
    textAlign: "center",
    color: "#666",
    marginTop: 100,
  },
  title: {
    textAlign: "center",
    color: "#C9A227",
    fontSize: 24,
    marginBottom: 16,
  },
  roomId: {
    textAlign: "center",
    color: "#666",
    marginBottom: 24,
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
    padding: "8px 12px",
    background: "rgba(255,255,255,0.05)",
    borderRadius: 4,
  },
  roomLabel: {
    fontSize: 11,
    color: "#666",
  },
  turnLabel: {
    fontSize: 14,
    color: "#C9A227",
    fontWeight: 700,
  },
  lastAction: {
    textAlign: "center",
    padding: 8,
    background: "rgba(201, 162, 39, 0.1)",
    borderRadius: 4,
    marginBottom: 8,
    fontSize: 13,
    color: "#C9A227",
  },
  playersRow: {
    display: "flex",
    gap: 16,
    justifyContent: "center",
    flexWrap: "wrap",
  },
  playerBox: {
    padding: 24,
    background: "rgba(255,255,255,0.05)",
    borderRadius: 8,
    textAlign: "center",
    minWidth: 200,
  },
  playerArea: {
    flex: 1,
    minWidth: 160,
    maxWidth: 350,
    padding: 8,
    background: "rgba(255,255,255,0.03)",
    borderRadius: 8,
    border: "1px solid rgba(255,255,255,0.1)",
  },
  playerHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
    fontSize: 13,
  },
  playerName: {
    fontWeight: 700,
    color: "#C9A227",
  },
  fieldArea: {
    minHeight: 60,
    padding: 8,
    background: "rgba(0,0,0,0.3)",
    borderRadius: 4,
    marginBottom: 8,
    display: "flex",
    gap: 4,
    flexWrap: "wrap",
    justifyContent: "center",
  },
  emptyField: {
    color: "#444",
    fontSize: 12,
  },
  handArea: {
    display: "flex",
    gap: 4,
    overflowX: "auto",
    paddingBottom: 4,
    marginBottom: 8,
  },
  readyBtn: {
    padding: "12px 24px",
    fontSize: 14,
    fontWeight: 700,
    background: "#C9A227",
    color: "#000",
    border: "none",
    borderRadius: 4,
    cursor: "pointer",
    marginTop: 8,
  },
  endTurnBtn: {
    width: "100%",
    padding: 10,
    fontSize: 12,
    fontWeight: 700,
    background: "#333",
    color: "#C9A227",
    border: "1px solid #C9A227",
    borderRadius: 4,
    cursor: "pointer",
  },
  shieldOverlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.85)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 100,
  },
  shieldBox: {
    background: "#1a1a2e",
    border: "2px solid #C9A227",
    borderRadius: 8,
    padding: 24,
    textAlign: "center",
    maxWidth: 320,
  },
  shieldButtons: {
    display: "flex",
    gap: 12,
    marginTop: 16,
  },
  passBtn: {
    flex: 1,
    padding: 12,
    background: "#333",
    color: "#aaa",
    border: "none",
    borderRadius: 4,
    cursor: "pointer",
  },
  counterBtn: {
    flex: 1,
    padding: 12,
    background: "#8B0000",
    color: "#fff",
    border: "none",
    borderRadius: 4,
    cursor: "pointer",
  },
  cardListBox: {
    background: "#1a1a2e",
    border: "2px solid #C9A227",
    borderRadius: 8,
    padding: 24,
    textAlign: "center",
    maxWidth: 500,
    maxHeight: "80vh",
    overflow: "auto",
  },
  cardGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: 8,
    marginTop: 16,
  },
  cardOption: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 4,
    padding: 8,
    background: "rgba(255,255,255,0.05)",
    borderRadius: 4,
    cursor: "pointer",
  },
  cardName: {
    fontSize: 9,
    color: "#888",
  },
  confirmOverlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.85)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 100,
  },
  confirmBox: {
    background: "#1a1a2e",
    border: "2px solid #C9A227",
    borderRadius: 8,
    padding: 24,
    textAlign: "center",
  },
  cardDesc: {
    fontSize: 12,
    color: "#888",
    marginTop: 8,
    maxWidth: 200,
  },
  confirmButtons: {
    display: "flex",
    gap: 12,
    marginTop: 16,
  },
  cancelBtn: {
    flex: 1,
    padding: 12,
    background: "#333",
    color: "#aaa",
    border: "none",
    borderRadius: 4,
    cursor: "pointer",
  },
  playBtn: {
    flex: 1,
    padding: 12,
    background: "#C9A227",
    color: "#000",
    border: "none",
    borderRadius: 4,
    cursor: "pointer",
    fontWeight: 700,
  },
  sharedInfo: {
    display: "flex",
    justifyContent: "center",
    gap: 24,
    marginTop: 16,
    fontSize: 12,
    color: "#666",
  },
  logToggleBtn: {
    marginTop: 12,
    padding: "6px 12px",
    fontSize: 11,
    background: "rgba(255,255,255,0.05)",
    color: "#888",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 4,
    cursor: "pointer",
  },
  logArea: {
    marginTop: 8,
    padding: 12,
    background: "rgba(255,255,255,0.03)",
    borderRadius: 8,
    border: "1px solid rgba(255,255,255,0.1)",
  },
  logContent: {
    maxHeight: 120,
    overflow: "auto",
  },
  logEntry: {
    fontSize: 11,
    color: "#888",
    padding: "2px 0",
    borderBottom: "1px solid rgba(255,255,255,0.05)",
  },
};
