/**
 * @module theomachia/cards/ambrosia
 * @description 神々の糧（アンブロシア） — ドロー＋ディスカードスキル。
 *
 * - 3枚ドロー → 2枚捨てる
 * - 手札の質を向上させるカード
 * - プレイ後に捨てカード選択UIが表示される
 */

import { SkillCard } from "./base";
import type { GameEffects } from "./base";

export class AmbrosiaCard extends SkillCard {
  constructor() {
    super({
      id: "ambrosia",
      name: "神々の糧",
      description: "3枚引いて2枚捨てる。",
      color: "#FFCC66",
    });
  }

  /**
   * 3枚ドロー → 2枚捨てる選択を要求。
   */
  protected onExecute(effects: GameEffects): void {
    effects.draw(3);
    effects.discard(2);
  }
}
