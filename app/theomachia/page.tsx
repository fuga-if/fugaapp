"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import Image from "next/image";
import { CARDS, OPTIONAL_CARDS, BASE_DECK, CardId } from "@/lib/theomachia/cards";

const GameClient = dynamic(() => import("./GameClient"), { ssr: false });
const SoloGameClient = dynamic(() => import("./SoloGameClient"), { ssr: false });
const PracticeClient = dynamic(() => import("./PracticeClient"), { ssr: false });

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
  const practiceMode = searchParams.get("practice") === "1";
  
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

  if (practiceMode) {
    return <PracticeClient />;
  }

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

      {/* プラクティスボタン */}
      <div style={{ marginBottom: 16, width: "100%", maxWidth: 320 }}>
        <button
          onClick={() => (window.location.href = "/theomachia?practice=1")}
          style={styles.secondaryButton}
        >
          プラクティス
        </button>
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
                ランダム
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
                デッキ一覧
                {selectedOptionalCards.length > 0 && (
                  <span style={styles.badge}>+{selectedOptionalCards.length}</span>
                )}
              </button>
              <button 
                onClick={() => setShowRulesModal(true)} 
                style={styles.infoButton}
              >
                ルール
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
              <h2 style={styles.modalTitle}>デッキ一覧</h2>
              <button onClick={() => setShowDeckModal(false)} style={styles.closeButton}>X</button>
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
                          {isSelected && <span style={{ color: "#C9A227", marginRight: 4 }}>[+]</span>}{card.name}
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
              <h2 style={styles.modalTitle}>ルール</h2>
              <button onClick={() => setShowRulesModal(false)} style={styles.closeButton}>X</button>
            </div>
            <div style={styles.modalContent}>
              <div style={styles.rulesSection}>
                <h3 style={styles.rulesSectionTitle}>勝利条件</h3>
                <p style={styles.rulesText}>
                  相手の<span style={styles.keywordGold}>ソウル</span>（HP）を<span style={styles.keywordRed}>0</span>にする
                </p>
              </div>
              <div style={styles.rulesDivider} />
              <div style={styles.rulesSection}>
                <h3 style={styles.rulesSectionTitle}>ターンの流れ</h3>
                <ul style={styles.rulesList}>
                  <li>毎ターン、カードを<span style={styles.keywordGold}>2枚まで</span>プレイ可能</li>
                  <li>2ターン目以降、ターン開始時に<span style={styles.keywordGold}>1枚ドロー</span></li>
                  <li>場の<span style={styles.keywordSummon}>召喚獣</span>がターン開始時に自動で攻撃</li>
                </ul>
              </div>
              <div style={styles.rulesDivider} />
              <div style={styles.rulesSection}>
                <h3 style={styles.rulesSectionTitle}>GUARD</h3>
                <ul style={styles.rulesList}>
                  <li>相手のカードを<span style={styles.keywordGold}>打ち消せる</span>防御手段</li>
                  <li>使用した<span style={styles.keywordGold}>GUARD</span>はストックに戻る</li>
                  <li>「<span style={styles.keywordSkill}>神盾</span>」でストックからGUARDを獲得</li>
                </ul>
              </div>
              <div style={styles.rulesDivider} />
              <div style={styles.rulesSection}>
                <h3 style={styles.rulesSectionTitle}>カードタイプ</h3>
                <ul style={styles.rulesList}>
                  <li><span style={styles.keywordSummon}>召喚獣</span> -- 場に出て毎ターン攻撃する</li>
                  <li><span style={styles.keywordSpell}>儀式</span> -- 召喚・蘇生に関する効果</li>
                  <li><span style={styles.keywordSkill}>スキル</span> -- 補助・情報・妨害効果</li>
                </ul>
              </div>
              <div style={styles.rulesDivider} />
              <div style={styles.rulesSection}>
                <h3 style={styles.rulesSectionTitle}>ゼウス</h3>
                <p style={styles.rulesText}>
                  最強の<span style={styles.keywordSummon}>召喚獣</span>。<span style={styles.keywordSpell}>儀式</span>でのみ召喚可能。<br/>
                  <span style={styles.keywordGold}>GUARD</span>でしか防げない<span style={styles.keywordRed}>即死攻撃</span>！
                </p>
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
    background: "linear-gradient(180deg, #050508 0%, #0a0a1a 30%, #12122a 60%, #0a0a0f 100%)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "32px 20px",
    fontFamily: "'Cinzel', 'Noto Serif JP', serif",
    position: "relative",
    overflow: "hidden",
  },
  bgPattern: {
    position: "absolute",
    inset: 0,
    backgroundImage: `radial-gradient(ellipse 600px 400px at 50% 30%, rgba(201, 162, 39, 0.04) 0%, transparent 70%), radial-gradient(circle at 20% 80%, rgba(100, 80, 200, 0.03) 0%, transparent 50%)`,
    pointerEvents: "none",
  },
  logoArea: {
    textAlign: "center",
    marginBottom: 40,
  },
  logoImage: {
    width: "100%",
    maxWidth: 340,
    height: "auto",
    display: "block",
    margin: "0 auto",
    filter: "drop-shadow(0 0 30px rgba(201, 162, 39, 0.4)) drop-shadow(0 0 60px rgba(201, 162, 39, 0.15))",
  },
  subtitle: {
    fontSize: 13,
    color: "rgba(201, 162, 39, 0.5)",
    letterSpacing: 16,
    marginTop: 12,
    fontWeight: 400,
    textTransform: "uppercase" as const,
  },
  content: {
    width: "100%",
    maxWidth: 340,
    display: "flex",
    flexDirection: "column",
    gap: 16,
    background: "rgba(10, 10, 20, 0.6)",
    border: "1px solid rgba(201, 162, 39, 0.15)",
    borderRadius: 12,
    padding: "28px 24px",
    backdropFilter: "blur(10px)",
    boxShadow: "0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(201, 162, 39, 0.1)",
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: 6,
  },
  label: {
    fontSize: 11,
    color: "rgba(201, 162, 39, 0.6)",
    letterSpacing: 3,
    textTransform: "uppercase" as const,
    fontWeight: 600,
  },
  input: {
    width: "100%",
    padding: "14px 16px",
    fontSize: 16,
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(201, 162, 39, 0.2)",
    borderRadius: 6,
    color: "#e0e0e0",
    outline: "none",
    fontFamily: "inherit",
    transition: "border-color 0.2s, box-shadow 0.2s",
  },
  turnChoice: {
    display: "flex",
    gap: 0,
    marginTop: 4,
    borderRadius: 6,
    overflow: "hidden",
    border: "1px solid rgba(201, 162, 39, 0.25)",
  },
  turnButton: {
    flex: 1,
    padding: "12px 8px",
    fontSize: 13,
    fontWeight: 600,
    background: "rgba(255,255,255,0.03)",
    color: "#555",
    border: "none",
    borderRight: "1px solid rgba(201, 162, 39, 0.15)",
    cursor: "pointer",
    transition: "all 0.2s",
  },
  turnButtonActive: {
    flex: 1,
    padding: "12px 8px",
    fontSize: 13,
    fontWeight: 700,
    background: "rgba(201, 162, 39, 0.2)",
    color: "#C9A227",
    border: "none",
    borderRight: "1px solid rgba(201, 162, 39, 0.15)",
    cursor: "pointer",
    boxShadow: "inset 0 -2px 0 #C9A227",
    transition: "all 0.2s",
  },
  primaryButton: {
    width: "100%",
    padding: "16px 24px",
    fontSize: 15,
    fontWeight: 700,
    letterSpacing: 4,
    background: "linear-gradient(180deg, #C9A227 0%, #9B7B1A 100%)",
    color: "#000",
    border: "1px solid rgba(255, 215, 0, 0.4)",
    borderRadius: 6,
    cursor: "pointer",
    marginTop: 4,
    boxShadow: "0 4px 16px rgba(201, 162, 39, 0.25), inset 0 1px 0 rgba(255,255,255,0.2)",
    transition: "all 0.2s",
  },
  divider: {
    display: "flex",
    alignItems: "center",
    gap: 16,
    margin: "4px 0",
  },
  dividerLine: {
    flex: 1,
    height: 1,
    background: "linear-gradient(90deg, transparent, rgba(201, 162, 39, 0.2), transparent)",
  },
  dividerText: {
    fontSize: 11,
    color: "#444",
    letterSpacing: 2,
  },
  secondaryButton: {
    width: "100%",
    padding: "14px 24px",
    fontSize: 13,
    fontWeight: 600,
    letterSpacing: 2,
    background: "transparent",
    color: "#777",
    border: "1px solid rgba(201, 162, 39, 0.2)",
    borderRadius: 6,
    cursor: "pointer",
    transition: "all 0.2s",
  },
  infoButtons: {
    display: "flex",
    gap: 8,
    marginTop: 4,
  },
  infoButton: {
    flex: 1,
    padding: "10px 12px",
    fontSize: 12,
    fontWeight: 600,
    background: "rgba(201, 162, 39, 0.05)",
    color: "#999",
    border: "1px solid rgba(201, 162, 39, 0.15)",
    borderRadius: 6,
    cursor: "pointer",
    position: "relative" as const,
    transition: "all 0.2s",
    letterSpacing: 1,
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
    backgroundColor: "rgba(0,0,0,0.9)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
    padding: 16,
  },
  modal: {
    backgroundColor: "#111122",
    borderRadius: 12,
    width: "100%",
    maxWidth: 480,
    maxHeight: "85vh",
    display: "flex",
    flexDirection: "column" as const,
    border: "1px solid rgba(201, 162, 39, 0.25)",
    boxShadow: "0 16px 48px rgba(0,0,0,0.6), 0 0 80px rgba(201, 162, 39, 0.05)",
  },
  modalHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px 20px",
    borderBottom: "1px solid rgba(201, 162, 39, 0.15)",
  },
  modalTitle: {
    margin: 0,
    fontSize: 18,
    color: "#C9A227",
    fontWeight: 700,
    letterSpacing: 2,
  },
  closeButton: {
    background: "none",
    border: "1px solid rgba(255,255,255,0.15)",
    color: "#666",
    fontSize: 14,
    cursor: "pointer",
    padding: "4px 10px",
    borderRadius: 4,
    fontWeight: 600,
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
    marginBottom: 4,
  },
  rulesSectionTitle: {
    fontSize: 15,
    color: "#C9A227",
    margin: "0 0 8px 0",
    fontWeight: 700,
    letterSpacing: 1,
  },
  rulesText: {
    color: "#ccc",
    fontSize: 13,
    lineHeight: 1.7,
    margin: 0,
  },
  rulesDivider: {
    height: 1,
    background: "linear-gradient(90deg, transparent, rgba(201, 162, 39, 0.2), transparent)",
    margin: "12px 0",
  },
  rulesList: {
    margin: "4px 0 0 0",
    paddingLeft: 18,
    color: "#ccc",
    fontSize: 13,
    lineHeight: 1.8,
  },
  keywordGold: {
    color: "#C9A227",
    fontWeight: 700,
  },
  keywordRed: {
    color: "#FF6B6B",
    fontWeight: 700,
  },
  keywordSummon: {
    color: "#FF4444",
    fontWeight: 700,
  },
  keywordSpell: {
    color: "#9944FF",
    fontWeight: 700,
  },
  keywordSkill: {
    color: "#00BFFF",
    fontWeight: 700,
  },
};
