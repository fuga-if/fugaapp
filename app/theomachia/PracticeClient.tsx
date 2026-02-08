"use client";

import { useState, useCallback } from "react";
import { CARDS, type CardId } from "@/lib/theomachia/cards";
import { Card } from "./components/Card";

// ===========================================
// チュートリアルステップ定義
// ===========================================

interface TutorialStep {
  title: string;
  message: string;
  /** プレイヤーの手札 */
  playerHand: CardId[];
  /** プレイヤーの場 */
  playerField: CardId[];
  /** 相手の手札(非表示) */
  enemyHand: CardId[];
  /** 相手の場 */
  enemyField: CardId[];
  /** プレイヤーのソウル */
  playerSouls: number;
  /** 相手のソウル */
  enemySouls: number;
  /** プレイヤーのシールド */
  playerShields: number;
  /** 相手のシールド */
  enemyShields: number;
  /** このステップで期待するアクション */
  expectedAction: "play" | "guard" | "next";
  /** 期待するカードID (playアクション時) */
  expectedCardId?: CardId;
  /** ハイライトするカードID */
  highlightCardId?: CardId;
  /** 打ち消し待ちフェーズか */
  isGuardPhase?: boolean;
  /** 相手がプレイしたカード(GUARD時) */
  pendingEnemyCard?: CardId;
}

const STEPS: TutorialStep[] = [
  {
    title: "第一幕: カードをプレイせよ",
    message: "汝の手札を見よ。エリスを場に召喚するのだ。手札のカードをタップしてプレイせよ。",
    playerHand: ["eris" as CardId, "keraunos" as CardId, "aegis" as CardId],
    playerField: [],
    enemyHand: ["medusa" as CardId],
    enemyField: [],
    playerSouls: 8,
    enemySouls: 8,
    playerShields: 1,
    enemyShields: 1,
    expectedAction: "play",
    expectedCardId: "eris" as CardId,
    highlightCardId: "eris" as CardId,
  },
  {
    title: "第二幕: スキルを放て",
    message: "良い。次は雷霆を放ち、相手の魂を削るのだ。雷霆をプレイせよ。",
    playerHand: ["keraunos" as CardId, "aegis" as CardId],
    playerField: ["eris" as CardId],
    enemyHand: ["medusa" as CardId],
    enemyField: [],
    playerSouls: 8,
    enemySouls: 8,
    playerShields: 1,
    enemyShields: 1,
    expectedAction: "play",
    expectedCardId: "keraunos" as CardId,
    highlightCardId: "keraunos" as CardId,
  },
  {
    title: "第三幕: GUARDで打ち消せ",
    message: "相手がメデューサを召喚しようとしている! GUARDで打ち消すのだ!",
    playerHand: ["aegis" as CardId],
    playerField: ["eris" as CardId],
    enemyHand: [],
    enemyField: [],
    playerSouls: 8,
    enemySouls: 6,
    playerShields: 1,
    enemyShields: 1,
    expectedAction: "guard",
    isGuardPhase: true,
    pendingEnemyCard: "medusa" as CardId,
  },
  {
    title: "第四幕: コンボを決めよ",
    message: "降臨の儀式を用い、最強の神ゼウスを召喚せよ! 降臨をプレイするのだ。",
    playerHand: ["ascension" as CardId, "zeus" as CardId],
    playerField: ["eris" as CardId],
    enemyHand: [],
    enemyField: [],
    playerSouls: 8,
    enemySouls: 6,
    playerShields: 0,
    enemyShields: 0,
    expectedAction: "play",
    expectedCardId: "ascension" as CardId,
    highlightCardId: "ascension" as CardId,
  },
  {
    title: "最終幕: 勝利",
    message: "見事だ! ゼウスの雷がすべてを焼き尽くした。汝、テオマキアの基本を修めたり。",
    playerHand: [],
    playerField: ["eris" as CardId, "zeus" as CardId],
    enemyHand: [],
    enemyField: [],
    playerSouls: 8,
    enemySouls: 0,
    playerShields: 0,
    enemyShields: 0,
    expectedAction: "next",
  },
];

// ===========================================
// コンポーネント
// ===========================================

export default function PracticeClient() {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedCard, setSelectedCard] = useState<CardId | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [completed, setCompleted] = useState(false);

  const step = STEPS[currentStep];

  const advanceStep = useCallback(() => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep((prev) => prev + 1);
      setSelectedCard(null);
      setShowConfirm(false);
      setFeedback(null);
    } else {
      setCompleted(true);
    }
  }, [currentStep]);

  const handleCardClick = useCallback(
    (cardId: CardId) => {
      if (step.expectedAction !== "play") return;
      setSelectedCard(cardId);
      setShowConfirm(true);
    },
    [step]
  );

  const handlePlay = useCallback(() => {
    if (!selectedCard) return;
    if (selectedCard === step.expectedCardId) {
      setFeedback("正解だ!");
      setShowConfirm(false);
      setTimeout(() => advanceStep(), 800);
    } else {
      setFeedback(
        `そのカードではない。${
          step.highlightCardId ? CARDS[step.highlightCardId].name + "をプレイせよ。" : ""
        }`
      );
      setShowConfirm(false);
      setSelectedCard(null);
      setTimeout(() => setFeedback(null), 1500);
    }
  }, [selectedCard, step, advanceStep]);

  const handleGuard = useCallback(() => {
    if (step.expectedAction === "guard") {
      setFeedback("見事! 打ち消しに成功した。");
      setTimeout(() => advanceStep(), 800);
    }
  }, [step, advanceStep]);

  const handlePass = useCallback(() => {
    if (step.expectedAction === "guard") {
      setFeedback("ここはGUARDを使うのだ! 打ち消しボタンを押せ。");
      setTimeout(() => setFeedback(null), 1500);
    }
  }, [step]);

  // 完了画面
  if (completed) {
    return (
      <div style={styles.container}>
        <div style={styles.completionBox}>
          <h1 style={styles.completionTitle}>修練完了</h1>
          <p style={styles.completionText}>
            汝はテオマキアの基本を修めた。
            <br />
            いざ、神々の戦場へ赴け。
          </p>
          <button
            onClick={() => (window.location.href = "/theomachia")}
            style={styles.primaryButton}
          >
            トップに戻る
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* ガイドオーバーレイ */}
      <div style={styles.guideOverlay}>
        <div style={styles.guideBox}>
          <div style={styles.stepIndicator}>
            {STEPS.map((_, i) => (
              <div
                key={i}
                style={{
                  ...styles.stepDot,
                  background: i <= currentStep ? "#C9A227" : "#333",
                }}
              />
            ))}
          </div>
          <h2 style={styles.guideTitle}>{step.title}</h2>
          <p style={styles.guideMessage}>{step.message}</p>
          {step.expectedAction === "next" && (
            <button onClick={() => advanceStep()} style={styles.nextButton}>
              完了
            </button>
          )}
        </div>
      </div>

      {/* フィードバック */}
      {feedback && (
        <div style={styles.feedbackOverlay}>
          <div style={styles.feedbackBox}>{feedback}</div>
        </div>
      )}

      {/* ゲーム画面 */}
      <div style={styles.gameArea}>
        {/* 相手エリア */}
        <div style={styles.playerArea}>
          <div style={styles.playerHeader}>
            <span style={styles.playerName}>相手</span>
            <span style={styles.stats}>
              魂:{step.enemySouls} 盾:{step.enemyShields}
            </span>
          </div>
          <div style={styles.fieldArea}>
            {step.enemyField.map((cardId, i) => (
              <Card key={i} cardId={cardId} size="sm" />
            ))}
            {step.enemyField.length === 0 && (
              <span style={styles.emptyField}>召喚獣なし</span>
            )}
          </div>
          <div style={styles.handArea}>
            {step.enemyHand.map((_, i) => (
              <Card key={i} cardId={"hidden" as CardId} size="sm" />
            ))}
          </div>
        </div>

        {/* 自分エリア */}
        <div style={{ ...styles.playerArea, borderColor: "#C9A227" }}>
          <div style={styles.playerHeader}>
            <span style={styles.playerName}>汝</span>
            <span style={styles.stats}>
              魂:{step.playerSouls} 盾:{step.playerShields}
            </span>
          </div>
          <div style={styles.fieldArea}>
            {step.playerField.map((cardId, i) => (
              <Card key={i} cardId={cardId} size="sm" />
            ))}
            {step.playerField.length === 0 && (
              <span style={styles.emptyField}>召喚獣なし</span>
            )}
          </div>
          <div style={styles.handArea}>
            {step.playerHand.map((cardId, i) => (
              <div
                key={i}
                style={
                  step.highlightCardId === cardId
                    ? styles.highlightedCard
                    : undefined
                }
              >
                <Card
                  cardId={cardId}
                  size="sm"
                  onClick={
                    step.expectedAction === "play"
                      ? () => handleCardClick(cardId)
                      : undefined
                  }
                  selected={selectedCard === cardId}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* GUARD確認オーバーレイ */}
      {step.isGuardPhase && !feedback && (
        <div style={styles.shieldOverlay}>
          <div style={styles.shieldBox}>
            <p style={styles.shieldTitle}>
              相手が{CARDS[step.pendingEnemyCard!].name}をプレイ!
            </p>
            <p style={styles.shieldDesc}>
              {CARDS[step.pendingEnemyCard!].description}
            </p>
            <p>打ち消しますか?</p>
            <div style={styles.shieldButtons}>
              <button onClick={handlePass} style={styles.passBtn}>
                通す
              </button>
              <button onClick={handleGuard} style={styles.counterBtn}>
                GUARD ({step.playerShields})
              </button>
            </div>
          </div>
        </div>
      )}

      {/* カード使用確認 */}
      {showConfirm && selectedCard && (
        <div style={styles.confirmOverlay}>
          <div style={styles.confirmBox}>
            <Card cardId={selectedCard} size="lg" />
            <p style={styles.cardDesc}>
              {CARDS[selectedCard].description}
            </p>
            <div style={styles.confirmButtons}>
              <button
                onClick={() => {
                  setShowConfirm(false);
                  setSelectedCard(null);
                }}
                style={styles.cancelBtn}
              >
                CANCEL
              </button>
              <button onClick={handlePlay} style={styles.playBtn}>
                PLAY
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ===========================================
// スタイル
// ===========================================

const styles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: "100dvh",
    background: "#0a0a0f",
    color: "#e0e0e0",
    fontFamily: "'Cinzel', 'Noto Serif JP', serif",
    position: "relative",
    paddingBottom: 40,
  },
  // ガイドオーバーレイ
  guideOverlay: {
    position: "sticky",
    top: 0,
    zIndex: 50,
    padding: "0 12px",
  },
  guideBox: {
    background: "rgba(0, 0, 0, 0.85)",
    border: "1px solid #C9A227",
    borderTop: "none",
    borderRadius: "0 0 8px 8px",
    padding: "16px 20px",
    textAlign: "center",
  },
  stepIndicator: {
    display: "flex",
    justifyContent: "center",
    gap: 8,
    marginBottom: 12,
  },
  stepDot: {
    width: 10,
    height: 10,
    borderRadius: "50%",
    transition: "background 0.3s",
  },
  guideTitle: {
    fontSize: 16,
    color: "#C9A227",
    margin: "0 0 8px 0",
    fontWeight: 700,
  },
  guideMessage: {
    fontSize: 13,
    color: "#ccc",
    margin: 0,
    lineHeight: 1.6,
  },
  nextButton: {
    marginTop: 12,
    padding: "10px 32px",
    fontSize: 14,
    fontWeight: 700,
    background: "linear-gradient(180deg, #C9A227 0%, #8B6914 100%)",
    color: "#000",
    border: "none",
    borderRadius: 4,
    cursor: "pointer",
  },
  // フィードバック
  feedbackOverlay: {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    zIndex: 200,
    pointerEvents: "none",
  },
  feedbackBox: {
    background: "rgba(0, 0, 0, 0.9)",
    border: "2px solid #C9A227",
    borderRadius: 8,
    padding: "16px 32px",
    fontSize: 16,
    color: "#C9A227",
    fontWeight: 700,
    textAlign: "center",
    whiteSpace: "nowrap",
  },
  // ゲームエリア
  gameArea: {
    display: "flex",
    flexDirection: "column",
    gap: 16,
    padding: "16px 12px",
    maxWidth: 400,
    margin: "0 auto",
  },
  playerArea: {
    padding: 12,
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
  stats: {
    color: "#888",
    fontSize: 12,
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
    alignSelf: "center",
  },
  handArea: {
    display: "flex",
    gap: 4,
    justifyContent: "center",
    flexWrap: "wrap",
  },
  highlightedCard: {
    animation: "none",
    borderRadius: 6,
    boxShadow: "0 0 12px 4px rgba(201, 162, 39, 0.6)",
  },
  // GUARD
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
  shieldTitle: {
    fontSize: 16,
    fontWeight: 700,
    color: "#e0e0e0",
    margin: "0 0 8px 0",
  },
  shieldDesc: {
    fontSize: 12,
    color: "#888",
    marginBottom: 16,
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
    fontSize: 14,
  },
  counterBtn: {
    flex: 1,
    padding: 12,
    background: "#8B0000",
    color: "#fff",
    border: "none",
    borderRadius: 4,
    cursor: "pointer",
    fontSize: 14,
    fontWeight: 700,
  },
  // 確認
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
  // 完了画面
  completionBox: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100dvh",
    padding: 32,
    textAlign: "center",
  },
  completionTitle: {
    fontSize: 28,
    color: "#C9A227",
    marginBottom: 16,
  },
  completionText: {
    fontSize: 16,
    color: "#ccc",
    lineHeight: 1.8,
    marginBottom: 32,
  },
  primaryButton: {
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
};
