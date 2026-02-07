/**
 * @module theomachia/cards/clairvoyance
 * @description 千里眼 — 手札確認＋破壊スキル。
 *
 * - 相手の手札を全て確認する
 * - その中から1枚を選んで捨てさせる
 * - 情報アドバンテージ＋手札破壊の強力なカード
 */

import { SkillCard } from "./base";

export class ClairvoyanceCard extends SkillCard {
  constructor() {
    super({
      id: "clairvoyance",
      name: "千里眼",
      description: "相手の手札を見て1枚捨てさせる。",
      color: "#00CCCC",
    });
  }

  get effect() { return "peep"; }
}
