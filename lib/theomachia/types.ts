/**
 * @module theomachia/types
 * @description テオマキアのクライアント・サーバー間で共有される型定義。
 * WebSocket通信のメッセージ型、ゲーム状態、プレイヤー情報などを定義する。
 */

import type { CardId } from "./cards";

// 定数のre-export
export {
  INITIAL_SOULS,
  MAX_SOULS,
  INITIAL_SHIELDS,
  MAX_SHIELDS,
  INITIAL_SHIELD_STOCK,
  INITIAL_HAND_SIZE,
  BASE_PLAYS_PER_TURN,
  FIRST_TURN_PLAYS,
  COUNTER_SHIELD_COST,
  MAX_OPTIONAL_CARDS,
} from "./constants";

// ===========================================
// プレイヤー
// ===========================================

/**
 * プレイヤーの状態を表すインターフェース。
 * 相手プレイヤーの場合、`hand` は `"hidden"[]` に置換される。
 */
export interface Player {
  /** プレイヤーの一意識別子（WebSocket接続ID） */
  id: string;
  /** プレイヤーの表示名 */
  name: string;
  /** 手札のカードID配列。相手から見た場合は `"hidden"[]` */
  hand: CardId[] | "hidden"[];
  /** 場に出ているカードID配列（召喚獣） */
  field: CardId[];
  /** ソウル（HP）。0以下で敗北 */
  souls: number;
  /** シールド数。相手のカードを打ち消すために使用 */
  shields: number;
  /** 準備完了フラグ。待機画面で両者がREADYでゲーム開始 */
  ready: boolean;
  /** 加護状態。次に受ける1回のダメージを無効化（ゼウスの即死は除く） */
  protected?: boolean;
}

// ===========================================
// ゲーム状態
// ===========================================

/**
 * ゲームのフェーズを表す型。
 * - `"waiting"` — 待機中（プレイヤー参加・READY待ち）
 * - `"playing"` — ゲーム進行中
 * - `"ended"` — ゲーム終了（勝敗決定）
 */
export type GamePhase = "waiting" | "playing" | "ended";

/**
 * ゲーム全体の状態を表すインターフェース。
 * サーバーからクライアントへ `state` メッセージとして送信される。
 *
 * @remarks
 * クライアントに送信される際、`deck` は枚数（number）に変換され、
 * 相手プレイヤーの手札は `"hidden"[]` に置換される。
 */
export interface GameState {
  /** ゲームのフェーズ */
  phase: GamePhase;
  /** プレイヤーID → プレイヤー状態のマップ */
  players: Record<string, Player>;
  /** 山札の残り枚数（クライアント側ではnumber） */
  deck: number;
  /** 捨て札（公開情報） */
  discard: CardId[];
  /** 現在のターンのプレイヤーID。ゲーム開始前は null */
  currentTurn: string | null;
  /** 現在のターン番号（1始まり） */
  turnNumber: number;
  /** 残りプレイ回数 */
  playsRemaining: number;
  /** 勝者のプレイヤーID。ゲーム終了前は null */
  winner: string | null;
  /** シールドストック（共有リソース） */
  shieldStock: number;
  /** 直前のアクション説明文 */
  lastAction: string | null;
  /** アクションログの配列 */
  actionLog: string[];
  /** 打ち消し待機中の情報 */
  pendingShield: { by: string; cardId: CardId } | null;
  /** 打ち消し返し待機中の情報 */
  pendingCounter: { by: string; cardId: CardId; shieldedBy: string } | null;

  // --- ルーム設定 ---
  /** ルーム作成者のプレイヤーID */
  creatorId: string | null;
  /** ルーム作成者の先攻/後攻選択 */
  creatorTurnChoice: "first" | "second" | "random";
  /** 追加オプションカードのID配列（最大4枚） */
  optionalCards: CardId[];

  // --- 戦績 ---
  /** プレイヤーID → 勝利数のマップ */
  wins: Record<string, number>;
  /** 累計対戦数 */
  matchCount: number;
}

// ===========================================
// クライアント → サーバーのメッセージ
// ===========================================

/**
 * クライアントからサーバーへ送信されるメッセージの型。
 *
 * @example
 * ```typescript
 * const msg: MessageToServer = { type: "play", cardId: "keraunos" };
 * socket.send(JSON.stringify(msg));
 * ```
 */
export type MessageToServer =
  | { type: "join"; name: string; turnChoice?: "first" | "second" | "random"; optionalCards?: CardId[] }
  | { type: "updateSettings"; turnChoice?: "first" | "second" | "random"; optionalCards?: CardId[] }
  | { type: "ready" }
  | { type: "play"; cardId: CardId; target?: string }
  | { type: "shield" }
  | { type: "shieldCounter" }
  | { type: "passCounter" }
  | { type: "pass" }
  | { type: "passShield" }
  | { type: "discard"; cardIds: CardId[] }
  | { type: "selectCard"; cardId: CardId }
  | { type: "selectTarget"; target: CardId }
  | { type: "guessCard"; cardId: CardId }
  | { type: "endTurn" }
  | { type: "rematch" };

// ===========================================
// サーバー → クライアントのメッセージ
// ===========================================

/**
 * サーバーからクライアントへ送信されるメッセージの型。
 */
export type MessageFromServer =
  | { type: "state"; state: GameState }
  | { type: "joined"; playerId: string }
  | { type: "rejoined"; playerId: string }
  | { type: "error"; message: string }
  | { type: "showOpponentHand"; hand: CardId[] }
  | { type: "showDeck"; deck: CardId[] }
  | { type: "requestDiscard"; count: number }
  | { type: "requestTarget"; targetType: "summon" | "field" | "discard" }
  | { type: "requestGuess" }
  | { type: "peekHand"; hand: CardId[]; message: string }
  | { type: "attack"; card: CardId; damage: number; isReflect?: boolean };
