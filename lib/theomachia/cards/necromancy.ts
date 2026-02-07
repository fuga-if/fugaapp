/**
 * @module theomachia/cards/necromancy
 * @description 冥界の門 — 捨て札から召喚獣を復活させる儀式。
 *
 * - 墓地の召喚獣を直接場に出す
 * - 墓地に召喚獣がない場合は効果なし
 * - ターゲット選択が必要（墓地の召喚獣を選ぶ）
 */

import { SpellCard } from "./base";

export class NecromancyCard extends SpellCard {
  constructor() {
    super({
      id: "necromancy",
      name: "冥界の門",
      description: "捨て札からまものを復活させる。",
      color: "#660066",
    });
  }

  get effect() { return "revive"; }
}
