"use client";

import { useState } from "react";
import { CARDS, type CardId } from "@/lib/theomachia/cards";
import { Card } from "../components/Card";

// デバッグ用：全カードの効果を確認できるページ
export default function DebugPage() {
  const [selectedCard, setSelectedCard] = useState<CardId | null>(null);
  const [log, setLog] = useState<string[]>([]);
  
  // モックのゲーム状態
  const [p1Hand, setP1Hand] = useState<CardId[]>(["zeus", "eris", "medusa", "keraunos", "ascension"]);
  const [p2Hand, setP2Hand] = useState<CardId[]>(["necromancy", "metamorphose", "tartarus", "ambrosia", "nectar"]);
  const [p1Field, setP1Field] = useState<CardId[]>([]);
  const [p2Field, setP2Field] = useState<CardId[]>([]);
  const [discard, setDiscard] = useState<CardId[]>([]);
  const [deck, setDeck] = useState<CardId[]>(["oracle", "hermesLetter", "clairvoyance", "trueName", "aegis", "godspeed"]);
  const [p1Souls, setP1Souls] = useState(4);
  const [p2Souls, setP2Souls] = useState(4);
  const [p1Shields, setP1Shields] = useState(2);
  const [p2Shields, setP2Shields] = useState(2);
  const [shieldStock, setShieldStock] = useState(2);
  const [currentPlayer, setCurrentPlayer] = useState<1 | 2>(1);

  const addLog = (msg: string) => {
    setLog(prev => [...prev.slice(-19), msg]);
  };

  const simulateCard = (cardId: CardId) => {
    const card = CARDS[cardId];
    addLog(`--- ${card.name} を使用 ---`);

    // 手札から除去
    if (currentPlayer === 1) {
      setP1Hand(prev => prev.filter((c, i) => i !== prev.indexOf(cardId)));
    } else {
      setP2Hand(prev => prev.filter((c, i) => i !== prev.indexOf(cardId)));
    }

    const myHand = currentPlayer === 1 ? p1Hand : p2Hand;
    const oppHand = currentPlayer === 1 ? p2Hand : p1Hand;
    const myField = currentPlayer === 1 ? p1Field : p2Field;
    const oppField = currentPlayer === 1 ? p2Field : p1Field;
    const setMyField = currentPlayer === 1 ? setP1Field : setP2Field;
    const setOppField = currentPlayer === 1 ? setP2Field : setP1Field;
    const setMySouls = currentPlayer === 1 ? setP1Souls : setP2Souls;
    const setOppSouls = currentPlayer === 1 ? setP2Souls : setP1Souls;
    const setMyShields = currentPlayer === 1 ? setP1Shields : setP2Shields;
    const mySouls = currentPlayer === 1 ? p1Souls : p2Souls;
    const oppSouls = currentPlayer === 1 ? p2Souls : p1Souls;
    const myShields = currentPlayer === 1 ? p1Shields : p2Shields;

    if (card.type === "summon") {
      // 召喚獣を場に出す（直接使用不可のはず）
      if ("summonOnly" in card && card.summonOnly) {
        addLog("→ ゼウスは儀式でのみ召喚可能！");
        return;
      }
      setMyField(prev => [...prev, cardId]);
      addLog(`→ ${card.name}を場に召喚`);
    } else if (card.type === "spell") {
      switch (card.effect) {
        case "summon":
          // 降臨：手札の召喚獣を場に
          const summons = myHand.filter(c => CARDS[c].type === "summon");
          if (summons.length > 0) {
            const target = summons[0];
            if (currentPlayer === 1) {
              setP1Hand(prev => prev.filter(c => c !== target));
            } else {
              setP2Hand(prev => prev.filter(c => c !== target));
            }
            setMyField(prev => [...prev, target]);
            addLog(`→ ${CARDS[target].name}を降臨させた`);
          } else {
            addLog("→ 召喚獣がない！");
          }
          break;
        case "revive":
          // 冥界の門：墓地から復活
          const discardSummons = discard.filter(c => CARDS[c].type === "summon");
          if (discardSummons.length > 0) {
            const target = discardSummons[0];
            setDiscard(prev => prev.filter(c => c !== target));
            setMyField(prev => [...prev, target]);
            addLog(`→ ${CARDS[target].name}を復活`);
          } else {
            addLog("→ 墓地に召喚獣がない！");
          }
          break;
        case "swap":
          // 変身の秘術
          addLog("→ ゼウスとエリスを入れ替え（全ての場所で）");
          break;
        case "remove":
          // 奈落送り
          if (oppField.length > 0) {
            const target = oppField[0];
            setOppField(prev => prev.filter(c => c !== target));
            setDiscard(prev => [...prev, target]);
            addLog(`→ ${CARDS[target].name}を奈落に送った`);
          } else {
            addLog("→ 除去対象がない！");
          }
          break;
      }
    } else if (card.type === "skill") {
      switch (card.effect) {
        case "damage":
          // 雷霆・貫通の矢
          setOppSouls(prev => prev - (card.value || 0));
          addLog(`→ 相手に${card.value}ダメージ`);
          break;
        case "draw3discard2":
          // 神々の糧：3枚引いて2枚捨て
          const drawn1 = deck.slice(0, 3);
          setDeck(prev => prev.slice(3));
          if (currentPlayer === 1) {
            setP1Hand(prev => [...prev, ...drawn1]);
          } else {
            setP2Hand(prev => [...prev, ...drawn1]);
          }
          addLog(`→ 3枚ドロー（${drawn1.map(c => CARDS[c].name).join(", ")}）、2枚捨てる`);
          break;
        case "draw2discard2play1":
          // 神酒
          const drawn2 = deck.slice(0, 2);
          setDeck(prev => prev.slice(2));
          if (currentPlayer === 1) {
            setP1Hand(prev => [...prev, ...drawn2]);
          } else {
            setP2Hand(prev => [...prev, ...drawn2]);
          }
          addLog(`→ 2枚ドロー（${drawn2.map(c => CARDS[c].name).join(", ")}）、2枚捨て、追加1プレイ`);
          break;
        case "search":
          // 神託
          addLog(`→ 山札を見る（${deck.length}枚）: ${deck.map(c => CARDS[c].name).join(", ")}`);
          if (deck.length > 0) {
            const target = deck[0];
            setDeck(prev => prev.slice(1));
            if (currentPlayer === 1) {
              setP1Hand(prev => [...prev, target]);
            } else {
              setP2Hand(prev => [...prev, target]);
            }
            addLog(`→ ${CARDS[target].name}を手札に加えた`);
          }
          break;
        case "retrieve":
          // 冥府の手紙
          if (discard.length > 0) {
            const target = discard[0];
            setDiscard(prev => prev.filter(c => c !== target));
            if (currentPlayer === 1) {
              setP1Hand(prev => [...prev, target]);
            } else {
              setP2Hand(prev => [...prev, target]);
            }
            addLog(`→ ${CARDS[target].name}を回収`);
          } else {
            addLog("→ 墓地が空！");
          }
          break;
        case "peep":
          // 千里眼
          addLog(`→ 相手の手札を見る: ${oppHand.map(c => CARDS[c].name).join(", ")}`);
          if (oppHand.length > 0) {
            const target = oppHand[0];
            if (currentPlayer === 1) {
              setP2Hand(prev => prev.filter(c => c !== target));
            } else {
              setP1Hand(prev => prev.filter(c => c !== target));
            }
            setDiscard(prev => [...prev, target]);
            addLog(`→ ${CARDS[target].name}を捨てさせた`);
          }
          break;
        case "guess":
          // 真名看破
          const guessTarget = "zeus";
          addLog(`→ 「${CARDS[guessTarget].name}」と宣言`);
          if (oppHand.includes(guessTarget)) {
            if (currentPlayer === 1) {
              setP2Hand(prev => prev.filter(c => c !== guessTarget));
              setP1Hand(prev => [...prev, guessTarget]);
            } else {
              setP1Hand(prev => prev.filter(c => c !== guessTarget));
              setP2Hand(prev => [...prev, guessTarget]);
            }
            addLog(`→ 当たり！${CARDS[guessTarget].name}を奪った`);
          } else {
            addLog("→ 外れ...");
          }
          break;
        case "shield":
          // 神盾
          if (shieldStock > 0) {
            setMyShields(prev => prev + 1);
            setShieldStock(prev => prev - 1);
            addLog(`→ GUARD+1（手札を公開: ${myHand.map(c => CARDS[c].name).join(", ")}）`);
          } else {
            addLog("→ ストックが空！");
          }
          break;
        case "extraPlays":
          // 神速
          addLog("→ このターン追加で2回プレイ可能");
          break;
      }
    }

    setDiscard(prev => [...prev, cardId]);
  };

  const resetGame = () => {
    setP1Hand(["zeus", "eris", "medusa", "keraunos", "ascension"]);
    setP2Hand(["necromancy", "metamorphose", "tartarus", "ambrosia", "nectar"]);
    setP1Field([]);
    setP2Field([]);
    setDiscard([]);
    setDeck(["oracle", "hermesLetter", "clairvoyance", "trueName", "aegis", "godspeed"]);
    setP1Souls(4);
    setP2Souls(4);
    setP1Shields(2);
    setP2Shields(2);
    setShieldStock(2);
    setCurrentPlayer(1);
    setLog([]);
    addLog("ゲームリセット");
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>DEBUG MODE</h1>
      
      <div style={styles.controls}>
        <button onClick={resetGame} style={styles.btn}>リセット</button>
        <button onClick={() => setCurrentPlayer(currentPlayer === 1 ? 2 : 1)} style={styles.btn}>
          ターン切替 (現在: P{currentPlayer})
        </button>
      </div>

      <div style={styles.gameArea}>
        {/* P1エリア */}
        <div style={styles.playerArea}>
          <div style={styles.playerHeader}>
            P1 - 魂:{p1Souls} 盾:{p1Shields} {currentPlayer === 1 && "◀ターン"}
          </div>
          <div style={styles.field}>
            場: {p1Field.map(c => CARDS[c].name).join(", ") || "なし"}
          </div>
          <div style={styles.hand}>
            {p1Hand.map((cardId, i) => (
              <div key={i} data-card={cardId} onClick={() => currentPlayer === 1 && simulateCard(cardId)} style={styles.cardWrapper}>
                <Card cardId={cardId} size="sm" />
              </div>
            ))}
          </div>
        </div>

        {/* P2エリア */}
        <div style={styles.playerArea}>
          <div style={styles.playerHeader}>
            P2 - 魂:{p2Souls} 盾:{p2Shields} {currentPlayer === 2 && "◀ターン"}
          </div>
          <div style={styles.field}>
            場: {p2Field.map(c => CARDS[c].name).join(", ") || "なし"}
          </div>
          <div style={styles.hand}>
            {p2Hand.map((cardId, i) => (
              <div key={i} data-card={cardId} onClick={() => currentPlayer === 2 && simulateCard(cardId)} style={styles.cardWrapper}>
                <Card cardId={cardId} size="sm" />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={styles.info}>
        <div>山札: {deck.length}枚 ({deck.map(c => CARDS[c].name).join(", ")})</div>
        <div>墓地: {discard.length}枚 ({discard.map(c => CARDS[c].name).join(", ")})</div>
        <div>GUARDストック: {shieldStock}</div>
      </div>

      {/* 全カード一覧 */}
      <div style={styles.allCards}>
        <h3>全カード一覧</h3>
        <div style={styles.cardGrid}>
          {Object.values(CARDS).map(card => (
            <div key={card.id} style={styles.cardInfo}>
              <Card cardId={card.id as CardId} size="sm" />
              <div style={styles.cardDetail}>
                <strong>{card.name}</strong>
                <div style={styles.cardType}>{card.type}</div>
                <div style={styles.cardDesc}>{card.description}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ログ */}
      <div style={styles.logArea}>
        <h3>ログ</h3>
        {log.map((l, i) => (
          <div key={i} style={styles.logEntry}>{l}</div>
        ))}
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: "100vh",
    background: "#0a0a0f",
    color: "#e0e0e0",
    padding: 20,
    fontFamily: "sans-serif",
  },
  title: {
    color: "#C9A227",
    textAlign: "center",
    marginBottom: 20,
  },
  controls: {
    display: "flex",
    gap: 10,
    justifyContent: "center",
    marginBottom: 20,
  },
  btn: {
    padding: "8px 16px",
    background: "#333",
    color: "#fff",
    border: "1px solid #666",
    borderRadius: 4,
    cursor: "pointer",
  },
  gameArea: {
    display: "flex",
    gap: 20,
    justifyContent: "center",
    flexWrap: "wrap",
    marginBottom: 20,
  },
  playerArea: {
    background: "rgba(255,255,255,0.05)",
    padding: 15,
    borderRadius: 8,
    minWidth: 300,
  },
  playerHeader: {
    fontWeight: 700,
    marginBottom: 10,
    color: "#C9A227",
  },
  field: {
    padding: 10,
    background: "rgba(0,0,0,0.3)",
    borderRadius: 4,
    marginBottom: 10,
    minHeight: 40,
  },
  hand: {
    display: "flex",
    gap: 5,
    flexWrap: "wrap",
  },
  cardWrapper: {
    cursor: "pointer",
    position: "relative",
    zIndex: 1,
  },
  info: {
    textAlign: "center",
    marginBottom: 20,
    padding: 10,
    background: "rgba(255,255,255,0.05)",
    borderRadius: 8,
  },
  allCards: {
    marginBottom: 20,
  },
  cardGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
    gap: 10,
  },
  cardInfo: {
    display: "flex",
    gap: 10,
    padding: 10,
    background: "rgba(255,255,255,0.03)",
    borderRadius: 4,
  },
  cardDetail: {
    flex: 1,
  },
  cardType: {
    fontSize: 11,
    color: "#888",
    marginBottom: 5,
  },
  cardDesc: {
    fontSize: 12,
    color: "#aaa",
  },
  logArea: {
    background: "rgba(255,255,255,0.03)",
    padding: 15,
    borderRadius: 8,
    maxHeight: 200,
    overflow: "auto",
  },
  logEntry: {
    fontSize: 12,
    padding: "2px 0",
    borderBottom: "1px solid rgba(255,255,255,0.05)",
  },
};
