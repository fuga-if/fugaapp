/**
 * @module theomachia/server/card-effects
 * @description カード効果の実行ブリッジ。
 *
 * カードクラス（lib/theomachia/cards/）の `execute` メソッドを
 * サーバー側の `GameActions` と接続する。
 *
 * `GameEffectsImpl` が `GameEffects` インターフェースを実装し、
 * カードの execute に注入される。
 */

import { CardRegistry } from "../../lib/theomachia/cards";
import type { GameEffects, DamageResult } from "../../lib/theomachia/cards";
import { CARD_DATA } from "./cards";
import type { GameActions } from "./game-actions";
import type { CardId, GameState } from "./types";
import type { Player } from "./player";

// ===========================================
// カード効果インターフェース（サーバー互換）
// ===========================================

/**
 * サーバー側で使用するカード効果インターフェース。
 * カードクラスの execute/canExecute/getTargetType をラップする。
 */
export interface CardEffect {
  canPlay(player: Player, state: GameState): boolean;
  play(player: Player, opponent: Player, actions: GameActions, target?: string): void;
  needsTarget(player?: Player, state?: GameState): "summon" | "field" | "discard" | "none";
}

// ===========================================
// GameEffects 実装
// ===========================================

/**
 * カードの execute メソッドに注入される GameEffects の具体実装。
 * サーバー側の GameActions をラップし、プレイヤー/相手/状態のコンテキストを提供する。
 */
class GameEffectsImpl implements GameEffects {
  readonly player: GameEffects["player"];
  readonly opponent: GameEffects["opponent"];
  readonly state: GameEffects["state"];

  constructor(
    private readonly _player: Player,
    private readonly _opponent: Player,
    private readonly _actions: GameActions,
    private readonly _state: GameState
  ) {
    // コンテキスト情報をプロキシとして公開（リアルタイムに参照）
    this.player = {
      get hand() { return _player.hand.cards; },
      get field() { return _player.field.cards; },
      get souls() { return _player.souls; },
      get isProtected() { return _player.isProtected; },
      get name() { return _player.name; },
    };
    this.opponent = {
      get hand() { return _opponent.hand.cards; },
      get field() { return _opponent.field.cards; },
      get souls() { return _opponent.souls; },
      get name() { return _opponent.name; },
    };
    this.state = {
      get deck() { return _state.deck.cards; },
      get discard() { return _state.graveyard.cards; },
    };
  }

  draw(count: number): void {
    this._actions.drawCards(this._player, count);
  }

  discard(count: number): void {
    this._actions.requestDiscard(this._player.id, count);
  }

  dealDamage(amount: number): DamageResult {
    const result = this._actions.dealDamage(this._opponent, this._player, amount);
    return { reflected: result.reflected, blocked: result.blocked };
  }

  selfDamage(amount: number): boolean {
    return this._actions.selfDamage(this._player, amount);
  }

  heal(amount: number): void {
    const healed = this._player.heal(amount);
    if (healed > 0) {
      this._actions.logAction(`${this._player.name}のソウルが${healed}回復`);
    } else {
      this._actions.logAction(`${this._player.name}のソウルは既に最大`);
    }
  }

  summonToField(cardId: string): void {
    this._actions.summonToField(this._player, cardId as CardId);
  }

  removeFromField(cardId: string): void {
    const removed = this._actions.removeFromField(cardId as CardId);
    if (removed) {
      this._actions.logAction(`→ ${CARD_DATA[cardId]?.name ?? cardId}が墓地へ`);
    }
  }

  gainShield(): boolean {
    return this._actions.gainShield(this._player);
  }

  addExtraPlays(count: number): void {
    this._actions.addExtraPlays(count);
  }

  showDeck(): void {
    this._actions.showDeck(this._player.id);
  }

  requestSelectFromDeck(): void {
    this._actions.requestSelectFromDeck(this._player.id);
  }

  showOpponentHand(): void {
    this._actions.showOpponentHand(this._player.id, this._opponent.id);
  }

  requestDiscardFromOpponent(): void {
    this._actions.requestDiscardFromOpponent(this._player.id);
  }

  requestGuess(): void {
    this._actions.requestGuess(this._player.id);
  }

  reviveFromDiscard(cardId: string): boolean {
    return this._actions.reviveFromDiscard(this._player.id, cardId as CardId, true);
  }

  retrieveFromDiscard(cardId: string): boolean {
    return this._actions.retrieveFromDiscard(this._player.id, cardId as CardId, true);
  }

  swapZeusAndEris(): void {
    this._actions.swapZeusAndEris();
  }

  peekHand(message: string): void {
    this._actions.peekHand(this._opponent.id, this._player.id, message);
  }

  sendToDiscard(cardId: string): void {
    this._actions.sendToDiscard(cardId as any);
  }

  log(message: string): void {
    this._actions.logAction(message);
  }
}

// ===========================================
// カード効果ブリッジ
// ===========================================

/**
 * カードクラスの execute/canExecute/getTargetType を
 * サーバー互換の CardEffect インターフェースにブリッジする。
 *
 * @param cardId - カードID
 * @returns CardEffect オブジェクト
 */
function createCardEffect(cardId: string): CardEffect {
  const card = CardRegistry.getOrThrow(cardId);

  return {
    canPlay(player: Player, state: GameState): boolean {
      // ダミーのGameEffectsを作成（canExecuteはコンテキスト参照のみ）
      const opponent = Object.values(state.players).find((p) => p.id !== player.id);
      if (!opponent) return false;
      const effects = new GameEffectsImpl(player, opponent, null as any, state);
      return card.canExecute(effects);
    },

    play(player: Player, opponent: Player, actions: GameActions, target?: string): void {
      const state: GameState = (actions as any).state;
      const effects = new GameEffectsImpl(player, opponent, actions, state);

      // 特殊処理: 降臨カードは手札からカードを除去してから召喚
      if (cardId === "ascension" && target) {
        if (CARD_DATA[target]?.type === "summon") {
          player.hand.remove(target as CardId);
        }
      }

      // 特殊処理: 簒奪は場からカードを奪って手札に加える
      if (cardId === "usurp" && target && opponent.field.has(target as CardId)) {
        const damaged = actions.selfDamage(player, 2);
        if (damaged) {
          actions.logAction(`${player.name}が2ダメージを受けた（簒奪のコスト）`);
        }
        if (opponent.field.remove(target as CardId)) {
          player.hand.add(target as CardId);
          actions.logAction(`→ 「${CARD_DATA[target as CardId].name}」を奪取！`);
        }
        return;
      }

      // 特殊処理: 加護はprotectedフラグを直接設定
      if (cardId === "protection") {
        player.grantProtection();
      }

      card.execute(effects, target);
    },

    needsTarget(player?: Player, state?: GameState): "summon" | "field" | "discard" | "none" {
      if (!player || !state) return "none";
      const opponent = Object.values(state.players).find((p) => p.id !== player.id);
      if (!opponent) return "none";
      const effects = new GameEffectsImpl(player, opponent, null as any, state);
      return card.getTargetType(effects);
    },
  };
}

// ===========================================
// カード効果マップの生成
// ===========================================

/**
 * 全カードの効果マップ。
 * カードIDをキーにして、各カードの振る舞いを定義する。
 * カードクラスの execute メソッドを経由して実行される。
 */
export const CardEffects: Record<string, CardEffect> = (() => {
  const effects: Record<string, CardEffect> = {};
  for (const card of CardRegistry.getAll()) {
    effects[card.id] = createCardEffect(card.id);
  }
  return effects;
})();
