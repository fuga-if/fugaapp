"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import Image from "next/image";
import { CARDS, OPTIONAL_CARDS, BASE_DECK, CardId } from "@/lib/theomachia/cards";

const GameClient = dynamic(() => import("./GameClient"), { ssr: false });
const SoloGameClient = dynamic(() => import("./SoloGameClient"), { ssr: false });

// ギリシャ神話風のランダム名
const RANDOM_NAMES = [
  "神託者", "巫女", "預言者", "守護者", "探求者",
  "放浪者", "賢者", "戦士", "詩人", "英雄",
  "星詠み", "風読み", "炎使い", "水守り", "雷鳴",
];

function TheoContent() {
  const searchParams = useSearchParams();
  const roomFromUrl = searchParams.get("room");
  const soloMode = searchParams.get("solo") === "1";
  
  const [playerName, setPlayerName] = useState("");
  const [roomId, setRoomId] = useState(roomFromUrl || "");
  const [isJoined, setIsJoined] = useState(false);
  const [turnChoice, setTurnChoice] = useState<"first" | "second" | "random">("random");
  const [isCreator, setIsCreator] = useState(false);
  const [selectedOptionalCards, setSelectedOptionalCards] = useState<CardId[]>([]);
  const [showDeckModal, setShowDeckModal] = useState(false);
  const [showRulesModal, setShowRulesModal] = useState(false);

  // 名前をlocalStorageから復元、なければランダム
  useEffect(() => {
    const savedName = localStorage.getItem("theomachia_playerName");
    if (savedName) {
      setPlayerName(savedName);
    } else {
      const randomName = RANDOM_NAMES[Math.floor(Math.random() * RANDOM_NAMES.length)];
      setPlayerName(randomName);
    }
  }, []);
  
  // 名前変更時にlocalStorageに保存
  const handleNameChange = (name: string) => {
    setPlayerName(name);
    localStorage.setItem("theomachia_playerName", name);
  };

  const generateRoomId = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let result = "";
    for (let i = 0; i < 6; i++) {
      result += chars[Math.floor(Math.random() * chars.length)];
    }
    return result;
  };

  const handleCreateRoom = () => {
    if (!playerName.trim()) {
      setPlayerName(RANDOM_NAMES[0]);
    }
    // 合言葉が入力されていたらそれを使う、なければランダム生成
    const newRoomId = roomId.trim() ? roomId.trim().toUpperCase() : generateRoomId();
    setRoomId(newRoomId);
    setIsCreator(true);
    setIsJoined(true);
  };

  const handleJoinRoom = () => {
    if (!playerName.trim()) {
      setPlayerName(RANDOM_NAMES[0]);
    }
    if (!roomId.trim()) {
      alert("ルームIDを入力してください");
      return;
    }
    setIsCreator(false);
    setIsJoined(true);
  };

  const toggleOptionalCard = (cardId: CardId) => {
    setSelectedOptionalCards(prev => {
      if (prev.includes(cardId)) {
        return prev.filter(id => id !== cardId);
      } else if (prev.length < 4) {
        return [...prev, cardId];
      }
      return prev; // 4枚選択済みなら追加しない
    });
  };

  if (isJoined) {
    if (soloMode) {
      return <SoloGameClient roomId={roomId} />;
    }
    return <GameClient roomId={roomId} playerName={playerName} turnChoice={isCreator ? turnChoice : undefined} optionalCards={isCreator ? selectedOptionalCards : undefined} />;
  }

  return (
    <div style={styles.container}>
      {/* 背景装飾 */}
      <div style={styles.bgPattern} />
      
      {/* ロゴ & タイトル */}
      <div style={styles.logoArea}>
        <Image
          src="/theomachia/logo.png"
          alt="THEOMACHIA"
          width={733}
          height={400}
          style={styles.logoImage}
          priority
        />
        <p style={styles.subtitle}>神々の戦い</p>
      </div>

      {/* メインコンテンツ */}
      <div style={styles.content}>
        {/* 名前入力 */}
        <div style={styles.inputGroup}>
          <label style={styles.label}>名前</label>
          <input
            type="text"
            value={playerName}
            onChange={(e) => handleNameChange(e.target.value)}
            placeholder="名前を入力"
            maxLength={12}
            style={styles.input}
          />
        </div>

        {/* ルーム作成（IDが空のときのみ表示） */}
        {!roomId.trim() && (
          <>
            {/* 先攻/後攻/ランダム選択 */}
            <div style={styles.turnChoice}>
              <button
                onClick={() => setTurnChoice("first")}
                style={turnChoice === "first" ? styles.turnButtonActive : styles.turnButton}
              >
                先攻
              </button>
              <button
                onClick={() => setTurnChoice("random")}
                style={turnChoice === "random" ? styles.turnButtonActive : styles.turnButton}
              >
                🎲
              </button>
              <button
                onClick={() => setTurnChoice("second")}
                style={turnChoice === "second" ? styles.turnButtonActive : styles.turnButton}
              >
                後攻
              </button>
            </div>

            {/* デッキ一覧 & ルールボタン */}
            <div style={styles.infoButtons}>
              <button 
                onClick={() => setShowDeckModal(true)} 
                style={styles.infoButton}
              >
                📜 デッキ一覧
                {selectedOptionalCards.length > 0 && (
                  <span style={styles.badge}>+{selectedOptionalCards.length}</span>
                )}
              </button>
              <button 
                onClick={() => setShowRulesModal(true)} 
                style={styles.infoButton}
              >
                📖 ルール
              </button>
            </div>

            <button 
              onClick={handleCreateRoom} 
              style={styles.primaryButton}
            >
              ルームを作成
            </button>

            {/* 区切り */}
            <div style={styles.divider}>
              <span style={styles.dividerLine} />
              <span style={styles.dividerText}>または</span>
              <span style={styles.dividerLine} />
            </div>
          </>
        )}

        {/* ルーム参加 */}
        <div style={styles.inputGroup}>
          <label style={styles.label}>ルームID</label>
          <input
            type="text"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value.toUpperCase())}
            placeholder="XXXXXX"
            maxLength={6}
            style={{...styles.input, textAlign: "center", letterSpacing: 4, fontFamily: "monospace"}}
          />
        </div>
        <button 
          onClick={handleJoinRoom} 
          style={roomId.trim() ? styles.primaryButton : styles.secondaryButton}
        >
          ルームに参加
        </button>
      </div>

      {/* デッキ一覧モーダル */}
      {showDeckModal && (
        <div style={styles.modalOverlay} onClick={() => setShowDeckModal(false)}>
          <div style={styles.modal} onClick={e => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>📜 デッキ一覧</h2>
              <button onClick={() => setShowDeckModal(false)} style={styles.closeButton}>✕</button>
            </div>
            <div style={styles.modalContent}>
              {/* 基本カード */}
              <h3 style={styles.sectionTitle}>基本カード（16枚）</h3>
              <div style={styles.cardGrid}>
                {BASE_DECK.map(cardId => {
                  const card = CARDS[cardId];
                  return (
                    <div key={cardId} style={{...styles.cardItem, borderColor: card.color}}>
                      <div style={styles.cardHeader}>
                        <span style={{...styles.cardType, backgroundColor: card.color}}>
                          {card.type === "summon" ? "召喚" : card.type === "spell" ? "儀式" : "スキル"}
                        </span>
                        <span style={styles.cardName}>{card.name}</span>
                      </div>
                      <p style={styles.cardDesc}>{card.description}</p>
                    </div>
                  );
                })}
              </div>

              {/* 追加カード */}
              <h3 style={styles.sectionTitle}>
                追加カード（{selectedOptionalCards.length}/4枚選択可能）
              </h3>
              <p style={styles.sectionHint}>タップで追加/削除</p>
              <div style={styles.cardGrid}>
                {OPTIONAL_CARDS.map(cardId => {
                  const card = CARDS[cardId];
                  const isSelected = selectedOptionalCards.includes(cardId);
                  return (
                    <div 
                      key={cardId} 
                      style={{
                        ...styles.cardItem, 
                        borderColor: isSelected ? card.color : "#444",
                        backgroundColor: isSelected ? "rgba(201, 162, 39, 0.1)" : "transparent",
                        cursor: "pointer",
                        opacity: !isSelected && selectedOptionalCards.length >= 4 ? 0.5 : 1,
                      }}
                      onClick={() => toggleOptionalCard(cardId)}
                    >
                      <div style={styles.cardHeader}>
                        <span style={{...styles.cardType, backgroundColor: card.color}}>
                          {card.type === "summon" ? "召喚" : card.type === "spell" ? "儀式" : "スキル"}
                        </span>
                        <span style={styles.cardName}>
                          {isSelected && "✓ "}{card.name}
                        </span>
                      </div>
                      <p style={styles.cardDesc}>{card.description}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ルールモーダル */}
      {showRulesModal && (
        <div style={styles.modalOverlay} onClick={() => setShowRulesModal(false)}>
          <div style={styles.modal} onClick={e => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>📖 ルール</h2>
              <button onClick={() => setShowRulesModal(false)} style={styles.closeButton}>✕</button>
            </div>
            <div style={styles.modalContent}>
              <div style={styles.rulesSection}>
                <h3>🎯 勝利条件</h3>
                <p>相手のソウル（HP）を0にする</p>
              </div>
              <div style={styles.rulesSection}>
                <h3>⚡ ターンの流れ</h3>
                <ul style={styles.rulesList}>
                  <li>毎ターン、カードを2枚までプレイ可能</li>
                  <li>2ターン目以降、ターン開始時に1枚ドロー</li>
                  <li>場の召喚獣がターン開始時に自動で攻撃</li>
                </ul>
              </div>
              <div style={styles.rulesSection}>
                <h3>🛡️ GUARD（シールド）</h3>
                <ul style={styles.rulesList}>
                  <li>相手のカードを打ち消せる</li>
                  <li>使用したGUARDはストックに戻る</li>
                  <li>「神盾」でストックからGUARDを獲得</li>
                </ul>
              </div>
              <div style={styles.rulesSection}>
                <h3>⚔️ カードタイプ</h3>
                <ul style={styles.rulesList}>
                  <li><b>召喚獣</b>：場に出て毎ターン攻撃</li>
                  <li><b>儀式</b>：召喚に関する効果</li>
                  <li><b>スキル</b>：補助効果</li>
                </ul>
              </div>
              <div style={styles.rulesSection}>
                <h3>⚡ ゼウス</h3>
                <p>最強の召喚獣。儀式でのみ召喚可能。<br/>
                GUARDでしか防げない即死攻撃！</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function TheoPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100dvh", background: "#0a0a0f" }} />}>
      <TheoContent />
    </Suspense>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: "100dvh",
    background: "linear-gradient(180deg, #0a0a0f 0%, #1a1a2e 50%, #0a0a0f 100%)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    fontFamily: "'Cinzel', 'Noto Serif JP', serif",
    position: "relative",
    overflow: "hidden",
  },
  bgPattern: {
    position: "absolute",
    inset: 0,
    backgroundImage: `radial-gradient(circle at 50% 50%, rgba(201, 162, 39, 0.03) 0%, transparent 50%)`,
    pointerEvents: "none",
  },
  logoArea: {
    textAlign: "center",
    marginBottom: 32,
  },
  logoImage: {
    width: "100%",
    maxWidth: 360,
    height: "auto",
    display: "block",
    margin: "0 auto",
    filter: "drop-shadow(0 0 20px rgba(201, 162, 39, 0.3))",
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    letterSpacing: 12,
    marginTop: 8,
  },
  content: {
    width: "100%",
    maxWidth: 320,
    display: "flex",
    flexDirection: "column",
    gap: 16,
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },
  label: {
    fontSize: 12,
    color: "#888",
    letterSpacing: 2,
  },
  input: {
    width: "100%",
    padding: 16,
    fontSize: 16,
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(201, 162, 39, 0.2)",
    borderRadius: 4,
    color: "#e0e0e0",
    outline: "none",
    fontFamily: "inherit",
  },
  turnChoice: {
    display: "flex",
    gap: 8,
    marginTop: 8,
  },
  turnButton: {
    flex: 1,
    padding: 12,
    fontSize: 14,
    fontWeight: 600,
    background: "rgba(255,255,255,0.05)",
    color: "#666",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 4,
    cursor: "pointer",
  },
  turnButtonActive: {
    flex: 1,
    padding: 12,
    fontSize: 14,
    fontWeight: 600,
    background: "rgba(201, 162, 39, 0.2)",
    color: "#C9A227",
    border: "1px solid #C9A227",
    borderRadius: 4,
    cursor: "pointer",
  },
  primaryButton: {
    width: "100%",
    padding: 18,
    fontSize: 16,
    fontWeight: 700,
    letterSpacing: 4,
    background: "linear-gradient(180deg, #C9A227 0%, #8B6914 100%)",
    color: "#000",
    border: "none",
    borderRadius: 4,
    cursor: "pointer",
    marginTop: 8,
  },
  divider: {
    display: "flex",
    alignItems: "center",
    gap: 16,
    margin: "8px 0",
  },
  dividerLine: {
    flex: 1,
    height: 1,
    background: "rgba(255,255,255,0.1)",
  },
  dividerText: {
    fontSize: 12,
    color: "#555",
  },
  secondaryButton: {
    width: "100%",
    padding: 16,
    fontSize: 14,
    fontWeight: 600,
    letterSpacing: 2,
    background: "transparent",
    color: "#888",
    border: "1px solid rgba(255,255,255,0.2)",
    borderRadius: 4,
    cursor: "pointer",
  },
  infoButtons: {
    display: "flex",
    gap: 8,
    marginTop: 8,
  },
  infoButton: {
    flex: 1,
    padding: 12,
    fontSize: 13,
    fontWeight: 600,
    background: "rgba(255,255,255,0.05)",
    color: "#aaa",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 4,
    cursor: "pointer",
    position: "relative" as const,
  },
  badge: {
    marginLeft: 6,
    padding: "2px 6px",
    fontSize: 10,
    backgroundColor: "#C9A227",
    color: "#000",
    borderRadius: 8,
    fontWeight: 700,
  },
  // モーダル
  modalOverlay: {
    position: "fixed" as const,
    inset: 0,
    backgroundColor: "rgba(0,0,0,0.85)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
    padding: 16,
  },
  modal: {
    backgroundColor: "#1a1a2e",
    borderRadius: 8,
    width: "100%",
    maxWidth: 480,
    maxHeight: "85vh",
    display: "flex",
    flexDirection: "column" as const,
    border: "1px solid rgba(201, 162, 39, 0.3)",
  },
  modalHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px 20px",
    borderBottom: "1px solid rgba(255,255,255,0.1)",
  },
  modalTitle: {
    margin: 0,
    fontSize: 18,
    color: "#C9A227",
    fontWeight: 700,
  },
  closeButton: {
    background: "none",
    border: "none",
    color: "#666",
    fontSize: 20,
    cursor: "pointer",
    padding: 4,
  },
  modalContent: {
    padding: 20,
    overflowY: "auto" as const,
    flex: 1,
  },
  sectionTitle: {
    fontSize: 14,
    color: "#C9A227",
    marginTop: 16,
    marginBottom: 8,
    fontWeight: 600,
  },
  sectionHint: {
    fontSize: 11,
    color: "#666",
    marginBottom: 8,
  },
  cardGrid: {
    display: "flex",
    flexDirection: "column" as const,
    gap: 8,
  },
  cardItem: {
    padding: 12,
    borderRadius: 6,
    border: "1px solid #444",
    backgroundColor: "rgba(0,0,0,0.2)",
  },
  cardHeader: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    marginBottom: 4,
  },
  cardType: {
    fontSize: 10,
    padding: "2px 6px",
    borderRadius: 4,
    color: "#000",
    fontWeight: 600,
  },
  cardName: {
    fontSize: 14,
    fontWeight: 600,
    color: "#fff",
  },
  cardDesc: {
    fontSize: 12,
    color: "#aaa",
    margin: 0,
    lineHeight: 1.4,
  },
  rulesSection: {
    marginBottom: 16,
  },
  rulesList: {
    margin: "8px 0 0 0",
    paddingLeft: 20,
    color: "#ccc",
    fontSize: 13,
    lineHeight: 1.6,
  },
};
