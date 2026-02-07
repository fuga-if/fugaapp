/**
 * @module theomachia/cards/zeus
 * @description ゼウス — 最高神。ゲーム中最強の召喚獣。
 *
 * - ターン開始時に4ダメージ（実質即死）
 * - 「降臨」カードでのみ召喚可能（直接プレイ不可）
 * - メデューサの反射を無視する
 * - GUARDでしか防げない
 */

import { SummonCard } from "./base";
import type { GameEffects } from "./base";

export class ZeusCard extends SummonCard {
  readonly damage = 4;
  readonly summonOnly = true;

  constructor() {
    super({
      id: "zeus",
      name: "ゼウス",
      description: "最高神。ターン開始時に4ダメージ。儀式でのみ召喚可能。",
      color: "#FFD700",
    });
  }

  /** ゼウスは降臨カード経由でのみ召喚可能 */
  get canDirectPlay(): boolean {
    return false;
  }

  /**
   * ゼウスは直接プレイ不可。降臨カード経由でのみ召喚される。
   */
  canExecute(): boolean {
    return false;
  }

  /**
   * 場に召喚する。
   */
  protected onExecute(effects: GameEffects): void {
    effects.summonToField("zeus");
  }
}
