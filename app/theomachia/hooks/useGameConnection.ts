/**
 * @module theomachia/hooks/useGameConnection
 * @description PartyKit WebSocket接続とメッセージハンドリングを管理するカスタムフック。
 * ゲーム状態の受信、メッセージの送信、接続状態の管理を行う。
 */

"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import usePartySocket from "partysocket/react";
import type { CardId } from "@/lib/theomachia/cards";
import type { GameState, MessageToServer, MessageFromServer } from "@/lib/theomachia/types";

const PARTYKIT_HOST = process.env.NEXT_PUBLIC_PARTYKIT_HOST || "127.0.0.1:1999";

/** エラー表示の自動消去までの時間（ms） */
const ERROR_DISPLAY_DURATION = 3000;

/**
 * useGameConnection の返り値。
 */
export interface UseGameConnectionReturn {
  /** 現在のゲーム状態 */
  gameState: GameState | null;
  /** 自分のプレイヤーID */
  myId: string | null;
  /** WebSocket接続状態 */
  isConnected: boolean;
  /** エラーメッセージ（null = エラーなし） */
  error: string | null;
  /** 相手の手札表示データ（千里眼用） */
  showOpponentHand: CardId[] | null;
  /** 山札表示データ（神託用） */
  showDeck: CardId[] | null;
  /** 捨てカード選択の要求枚数（0 = 要求なし） */
  pendingDiscard: number;
  /** ターゲット選択待ちの種類 */
  waitingForTarget: string | null;
  /** カード名宣言要求中 */
  showCardList: boolean;
  /** 攻撃カットインデータ */
  cutin: { card: CardId; damage: number; isReflect?: boolean } | null;
  /** サーバーにメッセージを送信する */
  send: (msg: MessageToServer) => void;
  /** 相手の手札表示をクリア */
  clearOpponentHand: () => void;
  /** 山札表示をクリア */
  clearDeck: () => void;
  /** 捨てカード要求をクリア */
  clearPendingDiscard: () => void;
  /** ターゲット選択をクリア */
  clearWaitingForTarget: () => void;
  /** カード名宣言表示をクリア */
  clearShowCardList: () => void;
  /** カットインをクリア */
  clearCutin: () => void;
  /** エラーをクリア */
  clearError: () => void;
  /** ゲーム状態を楽観的に更新する */
  setGameState: React.Dispatch<React.SetStateAction<GameState | null>>;
  /** ターゲット選択状態を設定する */
  setWaitingForTarget: React.Dispatch<React.SetStateAction<string | null>>;
}

/**
 * PartyKit WebSocket接続を管理するカスタムフック。
 *
 * @param roomId - ルームID
 * @param playerName - プレイヤー名
 * @param turnChoice - 先攻/後攻選択（ルーム作成者のみ）
 * @param optionalCards - 追加カード（ルーム作成者のみ）
 * @returns ゲーム接続の状態と操作関数
 *
 * @example
 * ```tsx
 * const { gameState, myId, send, isConnected } = useGameConnection({
 *   roomId: "ABC123",
 *   playerName: "プレイヤー1",
 * });
 * ```
 */
export function useGameConnection({
  roomId,
  playerName,
  turnChoice,
  optionalCards,
}: {
  roomId: string;
  playerName: string;
  turnChoice?: "first" | "second" | "random";
  optionalCards?: CardId[];
}): UseGameConnectionReturn {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [myId, setMyId] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showOpponentHand, setShowOpponentHand] = useState<CardId[] | null>(null);
  const [showDeck, setShowDeck] = useState<CardId[] | null>(null);
  const [pendingDiscard, setPendingDiscard] = useState(0);
  const [waitingForTarget, setWaitingForTarget] = useState<string | null>(null);
  const [showCardList, setShowCardList] = useState(false);
  const [cutin, setCutin] = useState<{ card: CardId; damage: number; isReflect?: boolean } | null>(null);

  const hasJoinedRef = useRef(false);

  const socket = usePartySocket({
    host: PARTYKIT_HOST,
    room: roomId,
    onOpen() {
      setIsConnected(true);
      if (playerName && myId) {
        socket.send(JSON.stringify({ type: "join", name: playerName }));
      }
    },
    onClose() {
      setIsConnected(false);
    },
    onError() {
      setIsConnected(false);
    },
    onMessage(event) {
      const data = JSON.parse(event.data) as MessageFromServer;

      switch (data.type) {
        case "state":
          setGameState(data.state);
          break;
        case "joined":
          setMyId(data.playerId);
          break;
        case "error":
          setError(data.message);
          setTimeout(() => setError(null), ERROR_DISPLAY_DURATION);
          break;
        case "showOpponentHand":
          setShowOpponentHand(data.hand);
          break;
        case "showDeck":
          setShowDeck(data.deck);
          break;
        case "requestDiscard":
          setPendingDiscard(data.count);
          break;
        case "requestTarget":
          setWaitingForTarget(data.targetType);
          break;
        case "requestGuess":
          setShowCardList(true);
          break;
        case "attack":
          setCutin({ card: data.card, damage: data.damage, isReflect: data.isReflect });
          break;
      }
    },
  });

  // 初回参加
  useEffect(() => {
    if (socket && playerName && !hasJoinedRef.current) {
      hasJoinedRef.current = true;
      const msg: MessageToServer = { type: "join", name: playerName, turnChoice, optionalCards };
      socket.send(JSON.stringify(msg));
    }
  }, [socket, playerName, turnChoice, optionalCards]);

  const send = useCallback(
    (msg: MessageToServer) => {
      if (socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify(msg));
      } else {
        setError("接続が切れました。再接続中...");
        setTimeout(() => setError(null), ERROR_DISPLAY_DURATION);
      }
    },
    [socket]
  );

  return {
    gameState,
    myId,
    isConnected,
    error,
    showOpponentHand,
    showDeck,
    pendingDiscard,
    waitingForTarget,
    showCardList,
    cutin,
    send,
    clearOpponentHand: () => setShowOpponentHand(null),
    clearDeck: () => setShowDeck(null),
    clearPendingDiscard: () => setPendingDiscard(0),
    clearWaitingForTarget: () => setWaitingForTarget(null),
    clearShowCardList: () => setShowCardList(false),
    clearCutin: () => setCutin(null),
    clearError: () => setError(null),
    setGameState,
    setWaitingForTarget,
  };
}
