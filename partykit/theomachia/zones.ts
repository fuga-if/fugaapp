/**
 * @module theomachia/server/zones
 * @description カードゾーンのクラス階層。
 * 山札・手札・場・墓地を型安全に管理する。
 */

import type { CardId } from "./types";

// ===========================================
// 基底クラス
// ===========================================

/**
 * カードゾーンの基底クラス。カードの配列管理と基本操作を提供。
 */
export class CardZone {
  protected _cards: CardId[] = [];

  /** カード一覧（読み取り専用） */
  get cards(): readonly CardId[] {
    return this._cards;
  }

  /** カード枚数 */
  get count(): number {
    return this._cards.length;
  }

  /** 空かどうか */
  get isEmpty(): boolean {
    return this._cards.length === 0;
  }

  /** カードを追加 */
  add(cardId: CardId): void {
    this._cards.push(cardId);
  }

  /** カードを除去（見つからなければfalse） */
  remove(cardId: CardId): boolean {
    const idx = this._cards.indexOf(cardId);
    if (idx === -1) return false;
    this._cards.splice(idx, 1);
    return true;
  }

  /** カードが含まれるか */
  has(cardId: CardId): boolean {
    return this._cards.includes(cardId);
  }

  /** 全カード除去 */
  clear(): void {
    this._cards = [];
  }

  /** 一括設定 */
  setCards(cards: CardId[]): void {
    this._cards = [...cards];
  }

  /** 別ゾーンへカードを移動 */
  transferTo(cardId: CardId, target: CardZone): boolean {
    if (!this.remove(cardId)) return false;
    target.add(cardId);
    return true;
  }

  /** 配列のコピーを返す（シリアライズ用） */
  toArray(): CardId[] {
    return [...this._cards];
  }

  /** カードを別のカードに置き換える */
  replace(from: CardId, to: CardId): void {
    for (let i = 0; i < this._cards.length; i++) {
      if (this._cards[i] === from) this._cards[i] = to;
    }
  }
}

// ===========================================
// 山札
// ===========================================

/**
 * 山札。ドロー、シャッフル、初期化。
 */
export class Deck extends CardZone {
  /** 上からN枚引く */
  draw(count: number): CardId[] {
    return this._cards.splice(0, count);
  }

  /** 末尾から1枚引く（drawCardsのpop互換） */
  pop(): CardId | undefined {
    return this._cards.pop();
  }

  /** シャッフル（in-place） */
  shuffle(): void {
    for (let i = this._cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this._cards[i], this._cards[j]] = [this._cards[j], this._cards[i]];
    }
  }

  /** 一番上を覗く */
  peek(): CardId | undefined {
    return this._cards[0];
  }

  /** 初期化（デッキをセットしてシャッフル） */
  init(cards: CardId[]): void {
    this._cards = [...cards];
    this.shuffle();
  }
}

// ===========================================
// 手札
// ===========================================

/**
 * 手札。
 */
export class Hand extends CardZone {
  /** カードを別のカードに置き換える（変身の秘術用） */
  // replace は基底クラスから継承
}

// ===========================================
// 場（フィールド）
// ===========================================

/**
 * 場（フィールド）。
 */
export class Field extends CardZone {
  /** カードを別のカードに置き換える（変身の秘術用） */
  // replace は基底クラスから継承
}

// ===========================================
// 墓地
// ===========================================

/**
 * 墓地（捨て札）。
 */
export class Graveyard extends CardZone {
  /** 指定タイプのカードをフィルター */
  filterByType(type: string, cardData: Record<string, { type: string }>): CardId[] {
    return this._cards.filter((id) => cardData[id]?.type === type);
  }
}
