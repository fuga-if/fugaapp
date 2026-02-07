/**
 * @module theomachia/cards/nectar
 * @description 神酒（ネクター） — ドロー＋追加プレイスキル。
 *
 * - 2枚ドロー → 2枚捨てる → 追加で1枚プレイ可能
 * - ドローしつつ追加アクションを得るコンボカード
 */

import { SkillCard } from "./base";

export class NectarCard extends SkillCard {
  constructor() {
    super({
      id: "nectar",
      name: "神酒",
      description: "2枚引いて2枚捨てる。追加で1枚プレイ可能。",
      color: "#FF9999",
    });
  }

  get effect() { return "draw2discard2play1"; }
}
