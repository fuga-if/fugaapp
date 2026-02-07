/**
 * @module theomachia/server/player
 * @description プレイヤーの状態と操作を管理するクラス。
 * 手札・場はゾーンクラス（Hand, Field）に委譲する。
 */

import type { CardId } from "./types";
import { MAX_SOULS } from "./types";
import { Hand, Field } from "./zones";

/**
 * サーバー側のプレイヤー状態を管理するクラス。
 *
 * 手札・場はゾーンクラスで管理し、ソウル・シールド・加護などの状態を持つ。
 *
 * @example
 * ```typescript
 * const player = new Player("conn-123", "プレイヤー1", 4, 2);
 * player.hand.add("ares");
 * player.takeDamage(1);
 * player.grantProtection();
 * ```
 */
export class Player {
  readonly id: string;
  name: string;
  readonly hand = new Hand();
  readonly field = new Field();
  private _souls: number;
  private _shields: number;
  private _ready: boolean = false;
  private _protected: boolean = false;

  constructor(id: string, name: string, initialSouls: number, initialShields: number) {
    this.id = id;
    this.name = name;
    this._souls = initialSouls;
    this._shields = initialShields;
  }

  // ===========================================
  // 読み取り
  // ===========================================

  /** ソウル（HP） */
  get souls(): number { return this._souls; }

  /** シールド数 */
  get shields(): number { return this._shields; }

  /** 準備完了か */
  get isReady(): boolean { return this._ready; }

  /** 加護状態か */
  get isProtected(): boolean { return this._protected; }

  /** 手札枚数 */
  get handSize(): number { return this.hand.count; }

  // ===========================================
  // ソウル操作
  // ===========================================

  /** ダメージを受ける（ソウルを減らす） */
  takeDamage(amount: number): void {
    this._souls -= amount;
  }

  /** ソウルを0に設定する（ゼウスの即死攻撃） */
  killInstantly(): void {
    this._souls = 0;
  }

  /**
   * ソウルを回復する（上限: MAX_SOULS）。
   * @returns 実際に回復した量
   */
  heal(amount: number): number {
    if (this._souls >= MAX_SOULS) return 0;
    const healed = Math.min(amount, MAX_SOULS - this._souls);
    this._souls += healed;
    return healed;
  }

  /** ソウルを直接設定する（ゲーム初期化時に使用） */
  setSouls(amount: number): void {
    this._souls = amount;
  }

  /** 生存判定 */
  isAlive(): boolean {
    return this._souls > 0;
  }

  // ===========================================
  // シールド操作
  // ===========================================

  /** シールドを獲得 */
  gainShield(amount: number = 1): void {
    this._shields += amount;
  }

  /** シールドを使用 */
  useShield(amount: number = 1): boolean {
    if (this._shields < amount) return false;
    this._shields -= amount;
    return true;
  }

  /** シールド数を直接設定する（ゲーム初期化時） */
  setShields(amount: number): void {
    this._shields = amount;
  }

  // ===========================================
  // 状態操作
  // ===========================================

  /** 加護を付与 */
  grantProtection(): void {
    this._protected = true;
  }

  /** 加護を消費 */
  consumeProtection(): void {
    this._protected = false;
  }

  /** 準備完了にする */
  setReady(): void {
    this._ready = true;
  }

  /** 準備解除 */
  resetReady(): void {
    this._ready = false;
  }

  // ===========================================
  // シリアライズ（クライアント送信用）
  // ===========================================

  /**
   * 公開情報（相手から見える情報）。
   * 手札は "hidden" で隠蔽される。
   */
  toPublicState(): object {
    return {
      id: this.id,
      name: this.name,
      hand: this.hand.cards.map(() => "hidden"),
      field: this.field.toArray(),
      souls: this._souls,
      shields: this._shields,
      ready: this._ready,
      protected: this._protected,
    };
  }

  /**
   * 完全情報（自分用）。
   * 手札も含めた全情報を返す。
   */
  toPrivateState(): object {
    return {
      id: this.id,
      name: this.name,
      hand: this.hand.toArray(),
      field: this.field.toArray(),
      souls: this._souls,
      shields: this._shields,
      ready: this._ready,
      protected: this._protected,
    };
  }
}
