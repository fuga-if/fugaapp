/**
 * @module theomachia/cards/ascension
 * @description 降臨 — 手札の召喚獣を場に出す儀式。
 *
 * - ゼウスを場に出す唯一の手段
 * - 手札に召喚獣がない場合は効果なし
 * - ターゲット選択が必要（手札の召喚獣を選ぶ）
 */

import { SpellCard } from "./base";

export class AscensionCard extends SpellCard {
  constructor() {
    super({
      id: "ascension",
      name: "降臨",
      description: "手札のまものを場に出す。",
      color: "#66CCFF",
    });
  }

  get effect() { return "summon"; }
}
