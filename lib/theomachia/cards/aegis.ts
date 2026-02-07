/**
 * @module theomachia/cards/aegis
 * @description 神盾（アイギス） — シールド獲得スキル。
 *
 * - シールドストックから1つGUARDを獲得
 * - 代償として自分の手札が相手に公開される
 * - ストックが空の場合は効果なし
 */

import { SkillCard } from "./base";

export class AegisCard extends SkillCard {
  constructor() {
    super({
      id: "aegis",
      name: "神盾",
      description: "ストックからGUARDを1つ得る。自分の手札を相手に公開する。",
      color: "#CCCCCC",
    });
  }

  get effect() { return "shield"; }
}
