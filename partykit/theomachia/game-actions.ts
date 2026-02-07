/**
 * @module theomachia/server/game-actions
 * @description ゲームの基本操作を提供するクラス。
 * 山札・手札・場・墓地の操作、ダメージ計算、シールド管理など、
 * カード効果から呼び出される低レベルなゲームアクションを集約する。
 */

import { CARD_DATA } from "./cards";
import type { CardId, CardType, GameState } from "./types";
import type { Player } from "./player";

/**
 * ゲームの基本アクションを提供するクラス。
 *
 * カード効果（CardEffects）から呼び出され、ゲーム状態を変更する。
 * 直接UIやWebSocketには依存せず、コールバックを通じて通信を行う。
 */
export class GameActions {
  constructor(
    private state: GameState,
    private broadcast: () => void,
    private sendToPlayer: (playerId: string, message: object) => void,
    public logAction: (message: string) => void
  ) {}

  // ===========================================
  // 山札操作
  // ===========================================

  /**
   * 山札からカードを引く。
   * 山札が空の場合、墓地をシャッフルして山札にリサイクルする。
   *
   * @param player - ドロー対象のプレイヤー
   * @param count - 引く枚数
   * @returns 引いたカードIDの配列
   */
  drawCards(player: Player, count: number): CardId[] {
    const drawn: CardId[] = [];
    for (let i = 0; i < count; i++) {
      if (this.state.deck.isEmpty) {
        // 墓地をシャッフルして山札にリサイクル
        this.state.deck.setCards(this.state.graveyard.toArray());
        this.state.deck.shuffle();
        this.state.graveyard.clear();
      }
      const card = this.state.deck.pop();
      if (card) {
        player.hand.add(card);
        drawn.push(card);
      }
    }
    return drawn;
  }

  /**
   * 山札を公開してカード選択を要求する（神託用）。
   */
  /** 山札をプレイヤーに公開する（閲覧のみ） */
  showDeck(playerId: string): void {
    this.sendToPlayer(playerId, { type: "showDeck", deck: this.state.deck.toArray() });
  }

  /** 山札からの選択待ちpendingActionを設定する */
  requestSelectFromDeck(playerId: string): void {
    this.state.pendingAction = { type: "selectFromDeck", playerId };
  }

  /**
   * 山札から1枚選択して手札に加える（神託の解決）。
   * 選択後、山札をシャッフルする。
   */
  selectFromDeck(playerId: string, cardId: CardId): boolean {
    if (this.state.pendingAction?.type !== "selectFromDeck") return false;
    if (this.state.pendingAction.playerId !== playerId) return false;

    if (!this.state.deck.remove(cardId)) return false;

    const player = this.state.players[playerId];
    player.hand.add(cardId);
    this.state.deck.shuffle();
    this.state.pendingAction = null;
    return true;
  }

  // ===========================================
  // 手札操作
  // ===========================================

  /**
   * 相手の手札を公開し、1枚捨てさせる選択を要求する（千里眼用）。
   */
  /** 相手の手札をプレイヤーに公開する（閲覧のみ） */
  showOpponentHand(playerId: string, opponentId: string): void {
    const opponent = this.state.players[opponentId];
    if (!opponent) return;
    const handNames = opponent.hand.cards.map((id) => CARD_DATA[id].name).join(", ");
    this.logAction(`→ ${opponent.name}の手札: ${handNames}`);
    this.sendToPlayer(playerId, { type: "showOpponentHand", hand: opponent.hand.toArray() });
  }

  /** 相手手札からの捨てカード選択待ちpendingActionを設定する */
  requestDiscardFromOpponent(playerId: string): void {
    this.state.pendingAction = { type: "selectFromHand", playerId };
  }

  /**
   * 相手の手札から1枚を墓地にする（千里眼の解決）。
   */
  discardFromOpponentHand(playerId: string, opponentId: string, cardId: CardId): boolean {
    if (this.state.pendingAction?.type !== "selectFromHand") return false;
    if (this.state.pendingAction.playerId !== playerId) return false;

    const opponent = this.state.players[opponentId];
    if (!opponent.hand.remove(cardId)) return false;

    this.state.graveyard.add(cardId);
    this.state.pendingAction = null;
    return true;
  }

  /**
   * 手札を相手に公開する（神盾使用時の代償）。見るだけで捨てない。
   */
  peekHand(viewerId: string, targetId: string, message: string): void {
    const target = this.state.players[targetId];
    if (!target) return;
    const handNames = target.hand.cards.map((id) => CARD_DATA[id].name).join(", ");
    this.logAction(`→ ${target.name}の手札公開: ${handNames}`);
    this.sendToPlayer(viewerId, { type: "peekHand", hand: target.hand.toArray(), message });
  }

  // ===========================================
  // 墓地操作
  // ===========================================

  /**
   * カードを墓地に送る。
   */
  sendToDiscard(cardId: CardId): void {
    this.state.graveyard.add(cardId);
  }

  /**
   * 墓地を表示し、カード選択を要求する。
   */
  showDiscard(playerId: string, filter?: CardType): void {
    this.state.pendingAction = { type: "selectFromDiscard", playerId, filter };
    const cards = filter
      ? this.state.graveyard.cards.filter((id) => CARD_DATA[id].type === filter)
      : this.state.graveyard.toArray();
    this.sendToPlayer(playerId, { type: "showDiscard", discard: cards, filter });
  }

  /**
   * 墓地から1枚を手札に回収する（冥府の手紙の解決）。
   */
  retrieveFromDiscard(playerId: string, cardId: CardId, direct: boolean = false): boolean {
    if (!direct) {
      if (this.state.pendingAction?.type !== "selectFromDiscard") return false;
      if (this.state.pendingAction.playerId !== playerId) return false;
    }

    if (!this.state.graveyard.remove(cardId)) return false;

    const player = this.state.players[playerId];
    player.hand.add(cardId);
    if (!direct) this.state.pendingAction = null;
    return true;
  }

  /**
   * 墓地から召喚獣を復活させ、場に出す（冥界の門の解決）。
   */
  reviveFromDiscard(playerId: string, cardId: CardId, direct: boolean = false): boolean {
    if (!direct) {
      if (this.state.pendingAction?.type !== "selectFromDiscard") return false;
      if (this.state.pendingAction.playerId !== playerId) return false;
    }

    const card = CARD_DATA[cardId];
    if (card.type !== "summon") return false;

    if (!this.state.graveyard.remove(cardId)) return false;

    const player = this.state.players[playerId];
    player.field.add(cardId);
    if (!direct) this.state.pendingAction = null;
    return true;
  }

  // ===========================================
  // 場操作
  // ===========================================

  /**
   * 召喚獣を場に出す。
   */
  summonToField(player: Player, cardId: CardId): void {
    player.field.add(cardId);
  }

  /**
   * 場からカードを除去し、墓地に送る（奈落送り等）。
   * 全プレイヤーの場を検索する。
   */
  removeFromField(cardId: CardId): Player | null {
    for (const player of Object.values(this.state.players)) {
      if (player.field.remove(cardId)) {
        this.state.graveyard.add(cardId);
        return player;
      }
    }
    return null;
  }

  // ===========================================
  // ダメージ処理
  // ===========================================

  /**
   * 対象にダメージを与える。
   *
   * ダメージ処理の順序:
   * 1. ゼウスの即死判定（HP即0、加護でも防げない）
   * 2. 加護チェック（1回のダメージを無効化）
   * 3. メデューサの反射チェック
   * 4. 通常ダメージ適用
   */
  dealDamage(
    target: Player,
    source: Player | null,
    amount: number,
    fromZeus: boolean = false
  ): { reflected: boolean; actualTarget: Player; blocked: boolean } {
    // ゼウスの即死判定（打ち消しでしか防げない）
    if (fromZeus) {
      target.killInstantly();
      return { reflected: false, actualTarget: target, blocked: false };
    }

    // 加護チェック
    if (target.isProtected) {
      target.consumeProtection();
      this.logAction(`${target.name}の加護がダメージを無効化！`);
      return { reflected: false, actualTarget: target, blocked: true };
    }

    // メデューサの反射チェック
    if (source && target.field.has("medusa" as CardId) && !source.field.has("zeus" as CardId)) {
      source.takeDamage(amount);
      return { reflected: true, actualTarget: source, blocked: false };
    }

    target.takeDamage(amount);
    return { reflected: false, actualTarget: target, blocked: false };
  }

  /**
   * 自傷ダメージを与える（簒奪・血の契約のコスト）。
   * 加護で防ぐことが可能。
   */
  selfDamage(player: Player, amount: number): boolean {
    if (player.isProtected) {
      player.consumeProtection();
      this.logAction(`${player.name}の加護が自傷ダメージを無効化！`);
      return false;
    }
    player.takeDamage(amount);
    return true;
  }

  // ===========================================
  // シールド操作
  // ===========================================

  /** シールドストックから1つ獲得する */
  gainShield(player: Player): boolean {
    if (this.state.shieldStock <= 0) return false;
    player.gainShield(1);
    this.state.shieldStock -= 1;
    return true;
  }

  /** シールドを使用し、ストックに戻す */
  useShield(player: Player, count: number): boolean {
    if (!player.useShield(count)) return false;
    this.state.shieldStock += count;
    return true;
  }

  // ===========================================
  // プレイ回数操作
  // ===========================================

  /** 追加のプレイ回数を付与する（神速・神酒） */
  addExtraPlays(count: number): void {
    this.state.playsRemaining += count;
  }

  // ===========================================
  // カード名宣言（真名看破）
  // ===========================================

  /** カード名宣言の選択を要求する */
  requestGuess(playerId: string): void {
    this.state.pendingAction = { type: "guess", playerId };
    this.sendToPlayer(playerId, { type: "requestGuess" });
  }

  /** カード名宣言の結果を処理する */
  guessCard(playerId: string, opponentId: string, cardId: CardId): boolean {
    if (this.state.pendingAction?.type !== "guess") return false;
    if (this.state.pendingAction.playerId !== playerId) return false;

    const player = this.state.players[playerId];
    const opponent = this.state.players[opponentId];

    const found = opponent.hand.remove(cardId);
    this.state.pendingAction = null;

    if (found) {
      player.hand.add(cardId);
      return true;
    }
    return false;
  }

  // ===========================================
  // 捨てカード選択
  // ===========================================

  /** 手札から指定枚数を捨てる選択を要求する（神々の糧・神酒） */
  requestDiscard(playerId: string, count: number): void {
    this.state.pendingAction = { type: "discard", playerId, count };
    this.sendToPlayer(playerId, { type: "requestDiscard", count });
  }

  /** 選択されたカードを手札から捨てる */
  discardCards(playerId: string, cardIds: CardId[]): boolean {
    if (this.state.pendingAction?.type !== "discard") return false;
    if (this.state.pendingAction.playerId !== playerId) return false;

    const player = this.state.players[playerId];
    for (const cardId of cardIds) {
      if (player.hand.remove(cardId)) {
        this.state.graveyard.add(cardId);
      }
    }
    this.state.pendingAction = null;
    return true;
  }

  // ===========================================
  // 特殊効果
  // ===========================================

  /**
   * ゼウスとエリスを全ての場所で入れ替える（変身の秘術）。
   * 山札・墓地・全プレイヤーの手札と場が対象。
   */
  swapZeusAndEris(): void {
    const swapInZone = (zone: { replace(from: CardId, to: CardId): void }) => {
      zone.replace("zeus" as CardId, "__tmp_swap__" as CardId);
      zone.replace("eris" as CardId, "zeus" as CardId);
      zone.replace("__tmp_swap__" as CardId, "eris" as CardId);
    };
    swapInZone(this.state.deck);
    swapInZone(this.state.graveyard);
    for (const player of Object.values(this.state.players)) {
      swapInZone(player.hand);
      swapInZone(player.field);
    }
  }
}
