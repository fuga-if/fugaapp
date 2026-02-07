/**
 * @module theomachia/cards/prayer
 * @description 祈り — 回復＋ドロースキル。
 *
 * - ソウルを1回復（上限4）
 * - 1枚ドロー
 * - 守備的なカード。ソウルが最大でもドローは実行される
 *
 * @remarks オプションカード
 */

import { SkillCard } from "./base";
import type { GameEffects } from "./base";

export class PrayerCard extends SkillCard {
  constructor() {
    super({
      id: "prayer",
      name: "祈り",
      description: "ソウルを1回復（上限4）し、1枚ドロー。",
      color: "#FFFFAA",
      optional: true,
    });
  }

  /**
   * ソウル1回復 + 1枚ドロー。
   */
  protected onExecute(effects: GameEffects): void {
    effects.heal(1);
    effects.draw(1);
  }
}
