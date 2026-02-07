/**
 * @module theomachia/GameClient
 * @description テオマキア メインゲームクライアント。
 * PartyKit WebSocket経由でサーバーと通信し、対戦ゲームのUIを提供する。
 *
 * 3つのフェーズで構成:
 * 1. **待機画面** (WaitingRoom) — プレイヤー参加・READY・設定
 * 2. **ゲーム画面** (GamePlay) — カードプレイ・打ち消し・ターン管理
 * 3. **結果画面** (GameResult) — 勝敗表示・リマッチ
 */

"use client";

import { useState, useEffect, useRef, CSSProperties } from "react";
import { Card, CardDetail, CardListModal, DiscardPileModal } from "./components/Card";
import { StatusGauge } from "./components/StatusGauge";
import { AttackCutin } from "./components/AttackCutin";
import { WaitingRoom } from "./components/WaitingRoom";
import { GameResult } from "./components/GameResult";
import { TurnTimer, ShieldTimer, ProcessingIndicator } from "./components/TurnTimer";
import { useGameConnection } from "./hooks/useGameConnection";
import { useGameActions } from "./hooks/useGameActions";
import { CARDS, BASE_DECK, type CardId } from "@/lib/theomachia/cards";
import type { Player } from "@/lib/theomachia/types";

/** GameClient のプロパティ */
interface GameClientProps {
  /** ルームID */
  roomId: string;
  /** プレイヤー名 */
  playerName: string;
  /** 先攻/後攻選択（ルーム作成者のみ） */
  turnChoice?: "first" | "second" | "random";
  /** 追加カード（ルーム作成者のみ） */
  optionalCards?: CardId[];
}

/**
 * テオマキアのメインゲームクライアントコンポーネント。
 *
 * @param props - コンポーネントプロパティ
 * @returns ゲームUI
 */
export default function GameClient({ roomId, playerName, turnChoice, optionalCards }: GameClientProps) {
  // --- WebSocket接続 & メッセージハンドリング ---
  const connection = useGameConnection({ roomId, playerName, turnChoice, optionalCards });
  const {
    gameState, myId, isConnected, error,
    showOpponentHand, showDeck, pendingDiscard,
    waitingForTarget, showCardList, cutin, timerState,
    send, clearOpponentHand, clearDeck, clearPendingDiscard,
    clearWaitingForTarget, clearShowCardList, clearCutin,
    setGameState, setWaitingForTarget,
  } = connection;

  // --- ゲームアクション ---
  const actions = useGameActions({
    send, gameState, myId, waitingForTarget, pendingDiscard,
    setGameState, setWaitingForTarget,
    clearShowCardList, clearDeck, clearOpponentHand, clearPendingDiscard,
  });
  const {
    selectedCard, discardSelection,
    handleCardTap, handleConfirmPlay, handleShield,
    handleGuessCard, handleSelectFromDeck, handleSelectFromOpponentHand,
    handleDiscardSelect, handleConfirmDiscard, handleEndTurn,
    handleReady, handleShare,
    updateTurnChoice, toggleOptionalCardInRoom,
    clearSelectedCard, setSelectedCard,
  } = actions;

  // --- UI状態 ---
  const [showDiscard, setShowDiscard] = useState(false);
  const [showLog, setShowLog] = useState(false);
  const [showCardDetail, setShowCardDetail] = useState<CardId | null>(null);
  const [showRules, setShowRules] = useState(false);
  const [showAllCards, setShowAllCards] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const inlineLogRef = useRef<HTMLDivElement>(null);

  // ゲーム中の画面離脱確認
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (gameState?.phase === "playing") {
        e.preventDefault();
        return "ゲーム中です。本当に離れますか？";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [gameState?.phase]);

  // ログの自動スクロール
  useEffect(() => {
    if (inlineLogRef.current) {
      inlineLogRef.current.scrollTop = inlineLogRef.current.scrollHeight;
    }
  }, [gameState?.actionLog]);

  // --- ローディング ---
  if (!gameState) {
    return (
      <div style={styles.container}>
        <div style={styles.loading}>
          <div style={styles.loadingSpinner} />
          <p style={styles.loadingText}>接続中...</p>
        </div>
      </div>
    );
  }

  const players = Object.values(gameState.players);
  const me = players.find((p) => p.id === myId);
  const opponent = players.find((p) => p.id !== myId);
  const isMyTurn = gameState.currentTurn === myId;
  const isDiscardMode = pendingDiscard > 0;
  const isCreator = gameState.creatorId === myId;

  // --- 待機画面 ---
  if (gameState.phase === "waiting") {
    return (
      <WaitingRoom
        gameState={gameState}
        me={me}
        isCreator={isCreator}
        roomId={roomId}
        onReady={handleReady}
        onShare={() => handleShare(roomId)}
        onUpdateTurnChoice={updateTurnChoice}
        onToggleOptionalCard={toggleOptionalCardInRoom}
      />
    );
  }

  // --- 結果画面 ---
  if (gameState.phase === "ended") {
    return (
      <GameResult
        gameState={gameState}
        myId={myId!}
        onRematch={() => send({ type: "rematch" })}
      />
    );
  }

  // ===========================================
  // ゲーム画面
  // ===========================================
  return (
    <div style={styles.container}>
      {/* エラー表示 */}
      {error && <div style={styles.error}>{error}</div>}

      {/* 切断警告 */}
      {!isConnected && (
        <div style={styles.disconnectWarning}>接続が切れました。再接続中...</div>
      )}

      {/* 上部バー: ターン表示 + 相手ステータス + 設定 */}
      <div style={styles.topBar}>
        <div style={styles.turnArea}>
          <div
            style={{
              ...styles.turnBanner,
              background: isMyTurn
                ? "linear-gradient(90deg, rgba(201,162,39,0.9) 0%, rgba(201,162,39,0.6) 100%)"
                : "linear-gradient(90deg, rgba(80,80,80,0.8) 0%, rgba(60,60,60,0.6) 100%)",
              boxShadow: isMyTurn ? "0 0 15px rgba(201,162,39,0.5)" : "none",
            }}
          >
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: 2,
                color: isMyTurn ? "#fff" : "#888",
              }}
            >
              {isMyTurn ? "YOUR TURN" : "ENEMY TURN"}
            </span>
          </div>
          {isMyTurn && (
            <StatusGauge type="action" current={gameState.playsRemaining} max={2} size="sm" />
          )}
          <TurnTimer timerState={timerState} isMyTurn={isMyTurn} />
        </div>

        <div style={styles.topRight}>
          <div style={styles.opponentStatus}>
            <span style={styles.opponentName}>
              {opponent?.name || "???"}{opponent?.protected && " GUARD"}
            </span>
            <StatusGauge type="soul" current={opponent?.souls || 0} max={4} size="sm" />
            <StatusGauge type="shield" current={opponent?.shields || 0} max={3} size="sm" />
          </div>
          <button onClick={() => setShowSettings(true)} style={styles.settingsButton}>
            <img
              src="/theomachia/ui/settings.png"
              alt="設定"
              style={{ width: 20, height: 20, filter: "invert(1)" }}
            />
          </button>
        </div>
      </div>

      {/* 相手エリア */}
      <div style={styles.opponentArea}>
        <div style={styles.handRow}>
          {opponent?.hand.map((_, i) => (
            <div key={i} style={styles.cardBack} />
          ))}
        </div>
        <div style={styles.fieldRow}>
          {opponent?.field.map((cardId, i) => (
            <Card
              key={i}
              cardId={cardId}
              size="sm"
              onClick={
                waitingForTarget === "remove"
                  ? () => {
                      send({ type: "play", cardId: selectedCard!, target: cardId });
                      clearWaitingForTarget();
                      clearSelectedCard();
                    }
                  : undefined
              }
              selected={waitingForTarget === "remove"}
            />
          ))}
          {(!opponent?.field || opponent.field.length === 0) && (
            <div style={styles.emptyField}>神なし</div>
          )}
        </div>
      </div>

      {/* 中央: 山札・捨て札・ストック */}
      <div style={styles.centerArea}>
        <div style={styles.pileRow}>
          <div style={styles.pile}>
            <div style={styles.pileCount}>{gameState.deck}</div>
            <span style={styles.pileLabel}>山札</span>
          </div>
          <button onClick={() => setShowDiscard(true)} style={styles.pile}>
            <div style={styles.pileCount}>{gameState.discard.length}</div>
            <span style={styles.pileLabel}>墓地</span>
          </button>
          <div style={styles.pile}>
            <div style={styles.pileCount}>{gameState.shieldStock}</div>
          </div>
        </div>
        {gameState.lastAction && <div style={styles.lastAction}>{gameState.lastAction}</div>}
      </div>

      {/* 打ち消し判定 */}
      {gameState.pendingShield && gameState.pendingShield.by !== myId && (
        <div style={styles.shieldOverlay}>
          <div style={styles.shieldBoxLarge}>
            <div style={styles.shieldCardPreview}>
              <Card cardId={gameState.pendingShield.cardId} size="lg" />
              <p style={styles.cardEffect}>
                {CARDS[gameState.pendingShield.cardId].description}
              </p>
            </div>
            <ShieldTimer timerState={timerState} />
            <p style={styles.shieldQuestion}>打ち消しますか？</p>
            <div style={styles.shieldHandPreview}>
              <p style={styles.handLabel}>あなたの手札:</p>
              <div style={styles.miniHandRow}>
                {me?.hand.map((cardId, i) => (
                  <Card key={i} cardId={cardId as CardId} size="sm" />
                ))}
              </div>
            </div>
            <div style={styles.shieldButtons}>
              <button onClick={() => send({ type: "passShield" })} style={styles.passButton}>
                通す
              </button>
              {me && me.shields > 0 && (
                <button onClick={handleShield} style={styles.counterButton}>
                  打ち消し ({me.shields})
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 打ち消し待機中表示 */}
      {gameState.pendingShield && gameState.pendingShield.by === myId && (
        <div style={styles.waitingOverlay}>
          <p style={styles.waitingCard}>{CARDS[gameState.pendingShield.cardId].name}</p>
          <p style={styles.waitingMessage}>相手の判定を待っています</p>
        </div>
      )}

      {/* 打ち消し返し判定 */}
      {gameState.pendingCounter && gameState.pendingCounter.by === myId && (
        <div style={styles.shieldOverlay}>
          <div style={styles.shieldBox}>
            <p style={styles.shieldCardName}>
              {CARDS[gameState.pendingCounter.cardId].name}
            </p>
            <ShieldTimer timerState={timerState} />
            <p style={styles.shieldQuestion}>打ち消されました！打ち消し返しますか？</p>
            <div style={styles.shieldButtons}>
              <button onClick={() => send({ type: "passCounter" })} style={styles.passButton}>
                通す
              </button>
              {me && me.shields >= 2 && (
                <button onClick={() => send({ type: "shieldCounter" })} style={styles.counterButton}>
                  打ち消し返し ({me.shields})
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 打ち消し返し待ち */}
      {gameState.pendingCounter && gameState.pendingCounter.shieldedBy === myId && (
        <div style={styles.waitingOverlay}>
          <p style={styles.waitingCard}>{CARDS[gameState.pendingCounter.cardId].name}を打ち消し！</p>
          <p style={styles.waitingMessage}>相手の判定を待っています</p>
        </div>
      )}

      {/* 自分の場 */}
      <div style={styles.myFieldArea}>
        <div style={styles.fieldRow}>
          {me?.field.map((cardId, i) => (
            <Card key={i} cardId={cardId} size="sm" />
          ))}
          {(!me?.field || me.field.length === 0) && (
            <div style={styles.emptyField}>神なし</div>
          )}
        </div>
      </div>

      {/* 下部バー: 自分ステータス + END TURN */}
      <div style={styles.bottomBar}>
        <div style={styles.myStatus}>
          <span style={styles.myName}>
            {me?.name || "???"}{me?.protected && " GUARD"}
          </span>
          <StatusGauge type="soul" current={me?.souls || 0} max={4} size="md" />
          <StatusGauge type="shield" current={me?.shields || 0} max={3} size="md" />
        </div>
        {isMyTurn && (
          <button onClick={handleEndTurn} style={styles.endTurnButton}>
            END TURN
          </button>
        )}
      </div>

      {/* 自分の手札 */}
      <div style={styles.myHandArea}>
        {isDiscardMode && (
          <div style={styles.discardPrompt}>
            <span>捨てるカードを選択: {discardSelection.length}/{pendingDiscard}</span>
            <span style={styles.discardHint}>（タップで選択、長押しで詳細）</span>
            <button
              onClick={handleConfirmDiscard}
              disabled={discardSelection.length !== pendingDiscard}
              style={{
                ...styles.confirmButton,
                opacity: discardSelection.length === pendingDiscard ? 1 : 0.5,
              }}
            >
              CONFIRM
            </button>
          </div>
        )}
        <div style={styles.handRow}>
          {(me?.hand as CardId[] || []).map((cardId, i) => {
            const isSelected = discardSelection.includes(cardId) || selectedCard === cardId;
            return (
              <div key={i} style={{ position: "relative" }}>
                <Card
                  cardId={cardId}
                  size="md"
                  onClick={
                    isDiscardMode
                      ? () => handleDiscardSelect(cardId)
                      : isMyTurn && gameState.playsRemaining > 0
                        ? () => handleCardTap(cardId)
                        : () => setShowCardDetail(cardId)
                  }
                  selected={isSelected}
                  disabled={false}
                />
                {isDiscardMode && (
                  <button
                    style={styles.cardInfoBtn}
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowCardDetail(cardId);
                    }}
                  >
                    ?
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ===== モーダル類 ===== */}

      {/* カード名宣言（真名看破） */}
      {showCardList && (
        <CardListModal
          title="カード名を宣言"
          cards={[...BASE_DECK, ...(gameState.optionalCards || [])]}
          onSelect={handleGuessCard}
          onClose={() => {
            clearShowCardList();
            clearSelectedCard();
          }}
        />
      )}

      {/* 捨て札閲覧 */}
      {showDiscard && !waitingForTarget && (
        <DiscardPileModal discard={gameState.discard} onClose={() => setShowDiscard(false)} />
      )}

      {/* 墓地からの選択（復活 / 回収） */}
      {(waitingForTarget === "revive" || waitingForTarget === "retrieve") && (
        <DiscardPileModal
          discard={gameState.discard}
          onClose={() => {
            clearWaitingForTarget();
            clearSelectedCard();
          }}
          onSelect={(cardId) => {
            send({ type: "play", cardId: selectedCard!, target: cardId });
            clearWaitingForTarget();
            clearSelectedCard();
          }}
          filterType={waitingForTarget === "revive" ? "summon" : "all"}
          title={waitingForTarget === "revive" ? "蘇生する神を選ぶ" : "回収するカードを選ぶ"}
        />
      )}

      {/* 山札からの選択（神託） */}
      {showDeck && (
        <CardListModal
          title={`山札から1枚選ぶ（${showDeck.length}枚）`}
          cards={showDeck}
          onSelect={handleSelectFromDeck}
          onClose={clearDeck}
        />
      )}

      {/* 相手の手札からの選択（千里眼） */}
      {showOpponentHand && (
        <CardListModal
          title={`相手の手札から1枚捨てさせる（${showOpponentHand.length}枚）`}
          cards={showOpponentHand}
          onSelect={handleSelectFromOpponentHand}
          onClose={clearOpponentHand}
        />
      )}

      {/* ターゲット選択プロンプト */}
      {waitingForTarget && waitingForTarget !== "revive" && waitingForTarget !== "retrieve" && (
        <div style={styles.targetPrompt}>
          {waitingForTarget === "summon" && "手札の神を選択"}
          {waitingForTarget === "remove" && "除去する敵の神を選択"}
          <button
            onClick={() => {
              clearWaitingForTarget();
              clearSelectedCard();
            }}
            style={styles.cancelButton}
          >
            CANCEL
          </button>
        </div>
      )}

      {/* カード使用確認 */}
      {selectedCard && !waitingForTarget && !showCardList && (
        <div style={styles.cardConfirmOverlay} onClick={clearSelectedCard}>
          <div style={styles.cardConfirmBox} onClick={(e) => e.stopPropagation()}>
            <Card cardId={selectedCard} size="lg" />
            <p style={styles.cardConfirmDesc}>{CARDS[selectedCard].description}</p>
            <div style={styles.cardConfirmButtons}>
              <button onClick={clearSelectedCard} style={styles.cancelButton}>
                CANCEL
              </button>
              <button onClick={handleConfirmPlay} style={styles.playButton}>
                PLAY
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ルールモーダル */}
      {showRules && (
        <div style={styles.modalOverlay} onClick={() => setShowRules(false)}>
          <div style={styles.rulesModal} onClick={(e) => e.stopPropagation()}>
            <h2 style={styles.rulesTitle}>ルール</h2>
            <div style={styles.rulesContent}>
              <h3>勝利条件</h3>
              <p>相手のSOULを0にする</p>
              <h3>ターンの流れ</h3>
              <p>1. 場の神が攻撃</p>
              <p>2. ドロー（1枚）</p>
              <p>3. カードを2枚までプレイ</p>
              <h3>カードタイプ</h3>
              <p>SUMMON: 場に残り毎ターン攻撃</p>
              <p>SPELL: 召喚に関する儀式（降臨・復活など）</p>
              <p>SKILL: その他の技（ドロー・サーチなど）</p>
              <h3>打ち消し</h3>
              <p>GUARDを1消費して相手のカードを無効化</p>
              <p>打ち消された側はGUARD2消費で打ち消し返し可能</p>
            </div>
            <button onClick={() => setShowRules(false)} style={styles.closeButton}>
              CLOSE
            </button>
          </div>
        </div>
      )}

      {/* カード一覧 */}
      {showAllCards && (
        <div style={styles.modalOverlay} onClick={() => setShowAllCards(false)}>
          <div style={styles.allCardsModal} onClick={(e) => e.stopPropagation()}>
            <h2 style={styles.rulesTitle}>ALL CARDS</h2>
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
      {showCardDetail && (
        <CardDetail cardId={showCardDetail} onClose={() => setShowCardDetail(null)} />
      )}

      {/* 処理中インジケーター */}
      <ProcessingIndicator visible={!!(timerState?.turnPaused)} />

      {/* 攻撃カットイン */}
      {cutin && (
        <AttackCutin
          attackerCard={cutin.card}
          damage={cutin.damage}
          isReflect={cutin.isReflect}
          onComplete={clearCutin}
        />
      )}

      {/* 設定メニュー */}
      {showSettings && (
        <div style={styles.modalOverlay} onClick={() => setShowSettings(false)}>
          <div style={styles.settingsModal} onClick={(e) => e.stopPropagation()}>
            <h3 style={styles.settingsTitle}>MENU</h3>
            <div style={styles.settingsButtons}>
              <button
                onClick={() => { setShowSettings(false); setShowRules(true); }}
                style={styles.settingsItem}
              >
                ルール
              </button>
              <button
                onClick={() => { setShowSettings(false); setShowAllCards(true); }}
                style={styles.settingsItem}
              >
                カード一覧
              </button>
              <button
                onClick={() => { setShowSettings(false); setShowLog(true); }}
                style={styles.settingsItem}
              >
                ログ
              </button>
            </div>
            <button onClick={() => setShowSettings(false)} style={styles.closeButton}>
              CLOSE
            </button>
          </div>
        </div>
      )}

      {/* ログモーダル */}
      {showLog && (
        <div style={styles.modalOverlay} onClick={() => setShowLog(false)}>
          <div style={styles.logModal} onClick={(e) => e.stopPropagation()}>
            <h3 style={styles.modalTitle}>ACTION LOG</h3>
            <div style={styles.logContent}>
              {gameState.actionLog.slice(-20).map((log, i) => (
                <div key={i} style={styles.logEntry}>{log}</div>
              ))}
            </div>
            <button onClick={() => setShowLog(false)} style={styles.closeButton}>
              CLOSE
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ===========================================
// スタイル定義
// ===========================================

const styles: Record<string, CSSProperties> = {
  container: {
    height: "100dvh",
    minHeight: "100dvh",
    background: "linear-gradient(180deg, #0a0a0f 0%, #1a1a2e 50%, #0a0a0f 100%)",
    color: "#e0e0e0",
    fontFamily: "'Cinzel', 'Noto Serif JP', serif",
    display: "flex",
    flexDirection: "column",
    overflowY: "auto",
  },
  loading: { flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16 },
  loadingSpinner: { width: 40, height: 40, border: "3px solid #333", borderTop: "3px solid #C9A227", borderRadius: "50%", animation: "spin 1s linear infinite" },
  loadingText: { color: "#666", letterSpacing: 2 },
  error: { position: "fixed", top: 16, left: "50%", transform: "translateX(-50%)", padding: "12px 24px", background: "rgba(139, 0, 0, 0.9)", color: "#fff", borderRadius: 4, zIndex: 1000, fontSize: 14 },
  disconnectWarning: { position: "fixed", top: 16, left: "50%", transform: "translateX(-50%)", padding: "12px 24px", background: "rgba(200, 150, 0, 0.9)", color: "#fff", borderRadius: 4, zIndex: 1000, fontSize: 14, fontWeight: 700 },
  topBar: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 12px", borderBottom: "1px solid rgba(201, 162, 39, 0.2)", flexShrink: 0, background: "rgba(0,0,0,0.3)" },
  turnArea: { display: "flex", alignItems: "center", gap: 8 },
  turnBanner: { padding: "6px 16px", borderRadius: 4 },
  topRight: { display: "flex", alignItems: "center", gap: 12 },
  opponentStatus: { display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 2 },
  opponentName: { fontSize: 12, fontWeight: 600, color: "#888" },
  settingsButton: { width: 36, height: 36, borderRadius: 8, border: "1px solid #444", background: "rgba(0,0,0,0.5)", fontSize: 18, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" },
  bottomBar: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 12px", borderTop: "1px solid rgba(201, 162, 39, 0.2)", flexShrink: 0, background: "rgba(0,0,0,0.3)", position: "relative", zIndex: 10 },
  myStatus: { display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 2 },
  myName: { fontSize: 12, fontWeight: 600, color: "#C9A227" },
  opponentArea: { padding: "4px 12px", borderBottom: "1px solid rgba(255,255,255,0.05)", flexShrink: 0 },
  handRow: { display: "flex", gap: 6, padding: "4px 12px", overflowX: "auto", WebkitOverflowScrolling: "touch", scrollbarWidth: "none", msOverflowStyle: "none", flexShrink: 0 },
  cardBack: { width: 32, height: 45, background: "linear-gradient(135deg, #1a1a2e 0%, #2a2a4e 100%)", border: "1px solid #333", borderRadius: 3, flexShrink: 0 },
  fieldRow: { display: "flex", justifyContent: "center", gap: 6, minHeight: 60, alignItems: "center" },
  emptyField: { fontSize: 12, color: "#444", letterSpacing: 2 },
  centerArea: { padding: "6px 12px", display: "flex", flexDirection: "column", gap: 4, flexShrink: 0 },
  pileRow: { display: "flex", justifyContent: "center", gap: 16 },
  pile: { display: "flex", flexDirection: "column", alignItems: "center", gap: 2, padding: "4px 12px", background: "transparent", border: "1px solid #333", borderRadius: 4, cursor: "pointer", color: "#e0e0e0" },
  pileCount: { fontSize: 16, fontWeight: 700, color: "#888" },
  pileLabel: { fontSize: 9, color: "#555", letterSpacing: 1 },
  lastAction: { textAlign: "center", fontSize: 11, color: "#C9A227", padding: "4px 8px", background: "rgba(201, 162, 39, 0.1)", borderRadius: 4 },
  shieldOverlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: 16 },
  shieldBox: { background: "linear-gradient(180deg, #1a1a2e 0%, #0a0a0f 100%)", border: "2px solid #C9A227", borderRadius: 8, padding: 24, textAlign: "center", maxWidth: 300 },
  shieldBoxLarge: { background: "linear-gradient(180deg, #1a1a2e 0%, #0a0a0f 100%)", border: "2px solid #C9A227", borderRadius: 8, padding: 24, textAlign: "center", maxWidth: 400 },
  shieldCardPreview: { display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 16 },
  cardEffect: { fontSize: 12, color: "#aaa", marginTop: 8, maxWidth: 200, lineHeight: 1.4 },
  shieldHandPreview: { marginBottom: 16, padding: 12, background: "rgba(0,0,0,0.3)", borderRadius: 4 },
  handLabel: { fontSize: 11, color: "#666", marginBottom: 8 },
  miniHandRow: { display: "flex", gap: 4, justifyContent: "center", flexWrap: "wrap" },
  shieldCardName: { fontSize: 20, fontWeight: 700, color: "#C9A227", marginBottom: 8 },
  shieldQuestion: { fontSize: 14, color: "#888", marginBottom: 16 },
  shieldButtons: { display: "flex", gap: 12 },
  passButton: { flex: 1, padding: "12px", fontSize: 14, fontWeight: 700, letterSpacing: 2, background: "#222", color: "#aaa", border: "1px solid #555", borderRadius: 4, cursor: "pointer" },
  counterButton: { flex: 1, padding: "12px", fontSize: 14, fontWeight: 700, letterSpacing: 1, background: "linear-gradient(180deg, #8B0000 0%, #5a0000 100%)", color: "#fff", border: "none", borderRadius: 4, cursor: "pointer" },
  waitingOverlay: { background: "rgba(201, 162, 39, 0.1)", padding: 12, textAlign: "center" },
  waitingCard: { fontSize: 16, fontWeight: 600, color: "#C9A227", margin: "0 0 4px 0" },
  waitingMessage: { fontSize: 12, color: "#666", margin: 0 },
  myFieldArea: { padding: "4px 12px", flexShrink: 0 },
  myHandArea: { padding: "4px 0", display: "flex", flexDirection: "column", gap: 4, flexShrink: 0, minHeight: 0 },
  discardPrompt: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 12px", background: "rgba(139, 0, 0, 0.2)", border: "1px solid rgba(139, 0, 0, 0.5)", borderRadius: 4, fontSize: 13, flexWrap: "wrap", gap: 8 },
  discardHint: { fontSize: 10, color: "#888", width: "100%", textAlign: "center" },
  cardInfoBtn: { position: "absolute", top: 2, right: 2, width: 16, height: 16, borderRadius: "50%", background: "rgba(0,0,0,0.7)", color: "#fff", border: "1px solid #666", fontSize: 10, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 5 },
  confirmButton: { padding: "6px 16px", fontSize: 12, fontWeight: 700, background: "#8B0000", color: "#fff", border: "none", borderRadius: 4, cursor: "pointer" },
  endTurnButton: { padding: "6px 16px", fontSize: 11, fontWeight: 700, letterSpacing: 2, background: "linear-gradient(180deg, #C9A227 0%, #8B6914 100%)", color: "#000", border: "none", borderRadius: 4, cursor: "pointer" },
  targetPrompt: { position: "fixed", bottom: 80, left: 16, right: 16, padding: 16, background: "rgba(26, 26, 46, 0.95)", border: "1px solid #C9A227", borderRadius: 8, textAlign: "center", fontSize: 14, display: "flex", justifyContent: "space-between", alignItems: "center" },
  cancelButton: { padding: "8px 20px", fontSize: 12, fontWeight: 600, background: "transparent", color: "#666", border: "1px solid #444", borderRadius: 4, cursor: "pointer" },
  cardConfirmOverlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: 16 },
  cardConfirmBox: { display: "flex", flexDirection: "column", alignItems: "center", gap: 16, maxWidth: 280 },
  cardConfirmDesc: { fontSize: 13, color: "#888", textAlign: "center", lineHeight: 1.6 },
  cardConfirmButtons: { display: "flex", gap: 12, width: "100%" },
  playButton: { flex: 1, padding: "14px", fontSize: 14, fontWeight: 700, letterSpacing: 2, background: "linear-gradient(180deg, #C9A227 0%, #8B6914 100%)", color: "#000", border: "none", borderRadius: 4, cursor: "pointer" },
  modalOverlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.9)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200, padding: 16 },
  rulesModal: { background: "linear-gradient(180deg, #1a1a2e 0%, #0a0a0f 100%)", border: "1px solid #333", borderRadius: 8, padding: 24, maxWidth: 320, maxHeight: "80vh", overflow: "auto" },
  rulesTitle: { fontSize: 18, fontWeight: 700, color: "#C9A227", textAlign: "center", letterSpacing: 4, marginBottom: 16 },
  rulesContent: { fontSize: 13, lineHeight: 1.8, color: "#aaa" },
  allCardsModal: { background: "linear-gradient(180deg, #1a1a2e 0%, #0a0a0f 100%)", border: "1px solid #333", borderRadius: 8, padding: 24, maxWidth: "90vw", maxHeight: "80vh", overflow: "auto" },
  cardGrid: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, marginBottom: 16 },
  closeButton: { padding: "12px 32px", fontSize: 12, fontWeight: 600, letterSpacing: 2, background: "transparent", color: "#666", border: "1px solid #444", borderRadius: 4, cursor: "pointer", marginTop: 8 },
  settingsModal: { background: "linear-gradient(180deg, #1a1a2e 0%, #0a0a0f 100%)", border: "1px solid #C9A227", borderRadius: 12, padding: 24, width: "80%", maxWidth: 300, display: "flex", flexDirection: "column", gap: 16 },
  settingsTitle: { fontSize: 18, fontWeight: 700, color: "#C9A227", textAlign: "center" as const, margin: 0 },
  settingsButtons: { display: "flex", flexDirection: "column", gap: 8 },
  settingsItem: { padding: "12px 16px", background: "rgba(201,162,39,0.1)", border: "1px solid rgba(201,162,39,0.3)", borderRadius: 8, color: "#e0e0e0", fontSize: 14, fontWeight: 600, cursor: "pointer", textAlign: "left" as const },
  logModal: { background: "linear-gradient(180deg, #1a1a2e 0%, #0a0a0f 100%)", border: "1px solid #C9A227", borderRadius: 12, padding: 16, width: "90%", maxWidth: 400, maxHeight: "70vh", display: "flex", flexDirection: "column", gap: 12 },
  modalTitle: { margin: 0, fontSize: 16, color: "#C9A227", fontWeight: 700 },
  logContent: { flex: 1, overflowY: "auto" as const, display: "flex", flexDirection: "column", gap: 4, padding: 8, background: "rgba(0,0,0,0.3)", borderRadius: 8 },
  logEntry: { fontSize: 12, color: "#aaa", padding: "4px 0", borderBottom: "1px solid rgba(255,255,255,0.05)" },
};
