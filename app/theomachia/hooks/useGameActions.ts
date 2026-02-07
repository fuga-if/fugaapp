/**
 * @module theomachia/hooks/useGameActions
 * @description ゲームアクション（カードプレイ、ターン終了、設定変更など）を
 * 提供するカスタムフック。WebSocket送信をラップし、UIロジックを含む。
 */

"use client";

import { useState, useCallback } from "react";
import { CARDS, OPTIONAL_CARDS, type CardId } from "@/lib/theomachia/cards";
import type { GameState, MessageToServer } from "@/lib/theomachia/types";

/**
 * useGameActions の返り値。
 */
export interface UseGameActionsReturn {
  /** 選択中のカード */
  selectedCard: CardId | null;
  /** 捨てカード選択のリスト */
  discardSelection: CardId[];
  /** カードをタップした時のハンドラ */
  handleCardTap: (cardId: CardId) => void;
  /** カードプレイを確定する */
  handleConfirmPlay: () => void;
  /** 打ち消しを実行する */
  handleShield: () => void;
  /** カード名宣言の結果を送信する */
  handleGuessCard: (cardId: CardId) => void;
  /** 山札からカードを選択する */
  handleSelectFromDeck: (cardId: CardId) => void;
  /** 相手の手札からカードを選択する */
  handleSelectFromOpponentHand: (cardId: CardId) => void;
  /** 捨てカード選択のトグル */
  handleDiscardSelect: (cardId: CardId) => void;
  /** 捨てカード選択を確定する */
  handleConfirmDiscard: () => void;
  /** ターンを終了する */
  handleEndTurn: () => void;
  /** READY状態にする */
  handleReady: () => void;
  /** 共有URLを生成する */
  handleShare: (roomId: string) => Promise<void>;
  /** 先攻/後攻設定を更新する */
  updateTurnChoice: (choice: "first" | "second" | "random") => void;
  /** オプションカードをトグルする */
  toggleOptionalCardInRoom: (cardId: CardId) => void;
  /** 選択中カードをクリアする */
  clearSelectedCard: () => void;
  /** 選択中カードを設定する */
  setSelectedCard: React.Dispatch<React.SetStateAction<CardId | null>>;
}

/**
 * ゲームアクションを提供するカスタムフック。
 *
 * @param send - WebSocketメッセージ送信関数
 * @param gameState - 現在のゲーム状態
 * @param myId - 自分のプレイヤーID
 * @param waitingForTarget - ターゲット選択待ちの種類
 * @param pendingDiscard - 捨てカード要求の枚数
 * @param setGameState - ゲーム状態の楽観的更新用setter
 * @param setWaitingForTarget - ターゲット選択状態のsetter
 * @param clearShowCardList - カード名宣言表示のクリア
 * @param clearDeck - 山札表示のクリア
 * @param clearOpponentHand - 相手の手札表示のクリア
 * @param clearPendingDiscard - 捨てカード要求のクリア
 */
export function useGameActions({
  send,
  gameState,
  myId,
  waitingForTarget,
  pendingDiscard,
  setGameState,
  setWaitingForTarget,
  clearShowCardList,
  clearDeck,
  clearOpponentHand,
  clearPendingDiscard,
}: {
  send: (msg: MessageToServer) => void;
  gameState: GameState | null;
  myId: string | null;
  waitingForTarget: string | null;
  pendingDiscard: number;
  setGameState: React.Dispatch<React.SetStateAction<GameState | null>>;
  setWaitingForTarget: React.Dispatch<React.SetStateAction<string | null>>;
  clearShowCardList: () => void;
  clearDeck: () => void;
  clearOpponentHand: () => void;
  clearPendingDiscard: () => void;
}): UseGameActionsReturn {
  const [selectedCard, setSelectedCard] = useState<CardId | null>(null);
  const [discardSelection, setDiscardSelection] = useState<CardId[]>([]);

  const handleReady = useCallback(() => send({ type: "ready" }), [send]);

  const handleCardTap = useCallback(
    (cardId: CardId) => {
      if (waitingForTarget) {
        send({ type: "play", cardId: selectedCard!, target: cardId });
        setWaitingForTarget(null);
        setSelectedCard(null);
      } else {
        setSelectedCard(cardId);
      }
    },
    [waitingForTarget, selectedCard, send, setWaitingForTarget]
  );

  const handleConfirmPlay = useCallback(() => {
    if (!selectedCard) return;
    const cardId = selectedCard;
    const card = CARDS[cardId];

    if (cardId === "zeus") {
      // エラーはUIレベルで表示（send経由でサーバーに送らない）
      setSelectedCard(null);
      return;
    }

    const effect = "effect" in card ? card.effect : null;
    if (effect === "summon" || effect === "revive" || effect === "remove" || effect === "retrieve") {
      setWaitingForTarget(effect);
    } else {
      send({ type: "play", cardId });
      setSelectedCard(null);
    }
  }, [selectedCard, send, setWaitingForTarget]);

  const handleShield = useCallback(() => send({ type: "shield" }), [send]);

  const handleGuessCard = useCallback(
    (cardId: CardId) => {
      send({ type: "guessCard", cardId });
      clearShowCardList();
      setSelectedCard(null);
    },
    [send, clearShowCardList]
  );

  const handleSelectFromDeck = useCallback(
    (cardId: CardId) => {
      send({ type: "selectCard", cardId });
      clearDeck();
    },
    [send, clearDeck]
  );

  const handleSelectFromOpponentHand = useCallback(
    (cardId: CardId) => {
      send({ type: "selectCard", cardId });
      clearOpponentHand();
    },
    [send, clearOpponentHand]
  );

  const handleDiscardSelect = useCallback(
    (cardId: CardId) => {
      setDiscardSelection((prev) => {
        if (prev.includes(cardId)) {
          return prev.filter((c) => c !== cardId);
        } else if (prev.length < pendingDiscard) {
          return [...prev, cardId];
        }
        return prev;
      });
    },
    [pendingDiscard]
  );

  const handleConfirmDiscard = useCallback(() => {
    send({ type: "discard", cardIds: discardSelection });
    clearPendingDiscard();
    setDiscardSelection([]);
  }, [send, discardSelection, clearPendingDiscard]);

  const handleEndTurn = useCallback(() => send({ type: "endTurn" }), [send]);

  const handleShare = useCallback(async (roomId: string) => {
    const url = `${window.location.origin}/theomachia?room=${roomId}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: "テオマキア", text: "一緒に対戦しよう！", url });
      } catch {
        // cancelled
      }
    } else {
      await navigator.clipboard.writeText(url);
      alert("URLをコピーしました");
    }
  }, []);

  const updateTurnChoice = useCallback(
    (choice: "first" | "second" | "random") => {
      if (!gameState || gameState.creatorId !== myId) return;
      setGameState((prev) => (prev ? { ...prev, creatorTurnChoice: choice } : prev));
      send({ type: "updateSettings", turnChoice: choice } as MessageToServer);
    },
    [gameState, myId, send, setGameState]
  );

  const toggleOptionalCardInRoom = useCallback(
    (cardId: CardId) => {
      if (!gameState || gameState.creatorId !== myId) return;
      const current = gameState.optionalCards || [];
      let newCards: CardId[];
      if (current.includes(cardId)) {
        newCards = current.filter((id) => id !== cardId);
      } else if (current.length < 4) {
        newCards = [...current, cardId];
      } else {
        return;
      }
      setGameState((prev) => (prev ? { ...prev, optionalCards: newCards } : prev));
      send({ type: "updateSettings", optionalCards: newCards } as MessageToServer);
    },
    [gameState, myId, send, setGameState]
  );

  return {
    selectedCard,
    discardSelection,
    handleCardTap,
    handleConfirmPlay,
    handleShield,
    handleGuessCard,
    handleSelectFromDeck,
    handleSelectFromOpponentHand,
    handleDiscardSelect,
    handleConfirmDiscard,
    handleEndTurn,
    handleReady,
    handleShare,
    updateTurnChoice,
    toggleOptionalCardInRoom,
    clearSelectedCard: () => setSelectedCard(null),
    setSelectedCard,
  };
}
