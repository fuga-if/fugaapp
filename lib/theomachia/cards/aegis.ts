/**
 * @module theomachia/cards/aegis
 * @description 神盾（アイギス） — シールド獲得スキル。
 *
 * - シールドストックから1つGUARDを獲得
 * - 代償として自分の手札が相手に公開される
 * - ストックが空の場合は効果なし
 */

import { SkillCard } from "./base";
import type { GameEffects } from "./base";

export class AegisCard extends SkillCard {
  constructor() {
    super({
      id: "aegis",
      name: "神盾",
      description: "ストックからGUARDを1つ得る。自分の手札を相手に公開する。",
      color: "#CCCCCC",
    });
  }

  /**
   * GUARDを獲得し、代償として手札を相手に公開する。
   */
  protected onExecute(effects: GameEffects): void {
    if (effects.gainShield()) {
      effects.peekHand(`${effects.player.name}の手札が公開された`);
    } else {
      effects.log("→ ストックが空のため効果なし");
    }
  }
}
