/**
 * @module theomachia/cards/asclepius
 * @description アスクレピオス — 医術の神。回復型召喚獣。
 *
 * - ダメージは与えない（damage = 0）
 * - 毎ターン開始時にソウルを1回復（上限4）
 * - 場に出し続けることで継続的な回復効果
 *
 * @remarks オプションカード
 */

import { SummonCard } from "./base";
import type { GameEffects } from "./base";

export class AsclepiusCard extends SummonCard {
  readonly damage = 0;
  readonly optional = true;

  constructor() {
    super({
      id: "asclepius",
      name: "アスクレピオス",
      description: "医術の神。毎ターン開始時、ソウルを1回復。",
      color: "#88DDAA",
      optional: true,
    });
  }

  /**
   * アスクレピオスを場に出す。回復効果はターン処理で自動実行される。
   */
  protected onExecute(effects: GameEffects): void {
    effects.summonToField("asclepius");
  }
}
