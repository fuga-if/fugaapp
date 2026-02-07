/**
 * @module theomachia/cards/keraunos
 * @description 雷霆（ケラウノス） — 直接ダメージスキル。
 *
 * - 相手に2ダメージ
 * - メデューサがいる場合は反射される
 * - 打ち消し可能
 */

import { SkillCard } from "./base";
import type { GameEffects } from "./base";

export class KeraunosCard extends SkillCard {
  constructor() {
    super({
      id: "keraunos",
      name: "雷霆",
      description: "相手に2ダメージ。",
      color: "#FFFF00",
    });
  }

  /**
   * 相手に2ダメージを与える。メデューサで反射される可能性あり。
   */
  protected onExecute(effects: GameEffects): void {
    const result = effects.dealDamage(2);
    if (result.reflected) {
      effects.log("雷霆がメデューサに反射された！");
    }
  }
}
