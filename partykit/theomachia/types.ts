/**
 * @module theomachia/server/types
 * @description サーバー側の型定義。クライアント側の types.ts とは別に、
 * サーバー内部で使用する完全な型情報を持つ。
 */

import { Deck, Graveyard } from "./zones";

// ===========================================
// カード関連の型
// ===========================================

/**
 * カードIDの型。
 * サーバー側では string ベースで管理し、CARD_DATA のキーと一致する。
 */
export type CardId = string;

/** カードタイプ */
export type CardType = "summon" | "spell" | "skill";

/**
 * カード定義インターフェース。
 * サーバー側ではエフェクト処理に必要な情報のみを持つ。
 */
export interface CardDefinition {
  /** カードの一意識別子 */
  id: string;
  /** カードの表示名 */
  name: string;
  /** カードのタイプ */
  type: CardType;
  /** 召喚獣のターン開始時ダメージ */
  damage?: number;
  /** ダメージ反射能力（メデューサ） */
  reflect?: boolean;
  /** 儀式でのみ召喚可能フラグ（ゼウス） */
  summonOnly?: boolean;
  /** オプションカードフラグ */
  optional?: boolean;
  /** 打ち消し不可フラグ（貫通の矢） */
  unblockable?: boolean;
}

// ===========================================
// プレイヤー
// ===========================================

// Player クラスは ./player.ts で定義
import { Player } from "./player";
export { Player };

// ===========================================
// ゲーム状態
// ===========================================

/**
 * 保留中のアクション情報。
 * カード効果で追加の選択が必要な場合に使用される。
 */
export interface PendingAction {
  /** アクションの種類 */
  type: "selectFromDeck" | "selectFromHand" | "selectFromDiscard" | "selectFromField" | "guess" | "discard";
  /** 選択を行うプレイヤーのID */
  playerId: string;
  /** 捨てカード選択時の枚数 */
  count?: number;
  /** カードタイプでのフィルター */
  filter?: CardType;
}

/**
 * サーバー側のゲーム全体状態。
 * クライアントに送信する際、`getPublicState()` で秘匿情報が除去される。
 */
export interface GameState {
  /** ゲームのフェーズ */
  phase: "waiting" | "playing" | "ended";
  /** プレイヤーID → プレイヤー状態のマップ */
  players: Record<string, Player>;
  /** 山札 */
  deck: Deck;
  /** 墓地（捨て札） */
  graveyard: Graveyard;
  /** 現在のターンのプレイヤーID */
  currentTurn: string | null;
  /** 現在のターン番号（1始まり） */
  turnNumber: number;
  /** 残りプレイ回数 */
  playsRemaining: number;
  /** 勝者のプレイヤーID */
  winner: string | null;
  /** シールドストック（共有リソース） */
  shieldStock: number;
  /** 直前のアクション説明文 */
  lastAction: string | null;
  /** アクションログ */
  actionLog: string[];
  /** 打ち消し待機中の情報 */
  pendingShield: { by: string; cardId: CardId; target?: string } | null;
  /** 打ち消し返し待機中の情報 */
  pendingCounter: { by: string; cardId: CardId; target?: string; shieldedBy: string } | null;
  /** 保留中のアクション（追加選択待ち） */
  pendingAction: PendingAction | null;
  /** ルーム作成者のプレイヤーID */
  creatorId: string | null;
  /** 先攻/後攻選択 */
  creatorTurnChoice: "first" | "second" | "random";
  /** 追加オプションカードのID配列 */
  optionalCards: CardId[];
  /** プレイヤーID → 勝利数 */
  wins: Record<string, number>;
  /** 累計対戦数 */
  matchCount: number;
}

// ===========================================
// ゲーム定数
// ===========================================

/** プレイヤーの初期ソウル */
export const INITIAL_SOULS = 4;

/** プレイヤーの最大ソウル */
export const MAX_SOULS = 4;

/** プレイヤーの初期シールド数 */
export const INITIAL_SHIELDS = 2;

/** シールドストックの初期値 */
export const INITIAL_SHIELD_STOCK = 2;

/** 初期手札枚数 */
export const INITIAL_HAND_SIZE = 5;

/** 1ターンの基本プレイ回数 */
export const BASE_PLAYS_PER_TURN = 2;

/** 最初のターンのプレイ回数 */
export const FIRST_TURN_PLAYS = 1;

/** 打ち消し返しに必要なシールド数 */
export const COUNTER_SHIELD_COST = 2;

/** 追加カードの最大選択枚数 */
export const MAX_OPTIONAL_CARDS = 14;

/** ターンタイマー制限時間（ms） */
export const TURN_TIME_LIMIT = 30000;

/** 打ち消しタイマー制限時間（ms） */
export const SHIELD_TIME_LIMIT = 15000;
