/**
 * @module theomachia/cards/usurp
 * @description 簒奪 — 相手の場のカード奪取スキル。
 *
 * - 自分のソウルを2減らす（コスト）
 * - 相手の場のカード1枚を自分の手札に加える
 * - ハイリスク・ハイリターン
 * - 相手の場にカードがなくてもコストは発生する
 *
 * @remarks オプションカード
 */

import { SkillCard } from "./base";

export class UsurpCard extends SkillCard {
  constructor() {
    super({
      id: "usurp",
      name: "簒奪",
      description: "自分のソウルを2減らす。相手の場のカード1枚を自分の手札に加える。",
      color: "#AA00AA",
      optional: true,
    });
  }

  get effect() { return "usurp"; }
}
