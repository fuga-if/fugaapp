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
}
