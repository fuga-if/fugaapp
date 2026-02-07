/**
 * @module theomachia/cards/necromancy
 * @description 冥界の門 — 捨て札から召喚獣を復活させる儀式。
 *
 * - 墓地の召喚獣を直接場に出す
 * - 墓地に召喚獣がない場合は効果なし
 * - ターゲット選択が必要（墓地の召喚獣を選ぶ）
 */

import { SpellCard } from "./base";
import type { GameEffects } from "./base";

export class NecromancyCard extends SpellCard {
  constructor() {
    super({
      id: "necromancy",
      name: "冥界の門",
      description: "捨て札からまものを復活させる。",
      color: "#660066",
    });
  }

  /**
   * 墓地に召喚獣があれば "discard"、なければ "none" を返す。
   */
  getTargetType(effects: GameEffects): "summon" | "field" | "discard" | "none" {
    const summonIds = ["zeus", "eris", "medusa", "asclepius"];
    return effects.state.discard.some((id) => summonIds.includes(id)) ? "discard" : "none";
  }

  /**
   * 墓地から召喚獣を復活させ場に出す。
   */
  protected onExecute(effects: GameEffects, target?: string): void {
    if (target) {
      if (effects.reviveFromDiscard(target)) {
        effects.log(`→ 「${target}」を復活`);
      }
    } else {
      effects.log("→ 墓地に召喚獣がないため効果なし");
    }
  }
}
