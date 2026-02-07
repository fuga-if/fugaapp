/**
 * @module theomachia/cards/ascension
 * @description 降臨 — 手札の召喚獣を場に出す儀式。
 *
 * - ゼウスを場に出す唯一の手段
 * - 手札に召喚獣がない場合は効果なし
 * - ターゲット選択が必要（手札の召喚獣を選ぶ）
 */

import { SpellCard } from "./base";
import type { GameEffects } from "./base";

export class AscensionCard extends SpellCard {
  constructor() {
    super({
      id: "ascension",
      name: "降臨",
      description: "手札のまものを場に出す。",
      color: "#66CCFF",
    });
  }

  /**
   * 手札に召喚獣があれば "summon"、なければ "none" を返す。
   */
  getTargetType(effects: GameEffects): "summon" | "field" | "discard" | "none" {
    // 召喚獣カードID一覧（summonタイプ）
    const summonIds = ["zeus", "eris", "medusa", "asclepius"];
    return effects.player.hand.some((id) => summonIds.includes(id)) ? "summon" : "none";
  }

  /**
   * ターゲットの召喚獣を場に出す。
   * サーバー側で手札からの除去は別途処理される。
   */
  protected onExecute(effects: GameEffects, target?: string): void {
    if (target) {
      effects.summonToField(target);
    } else {
      effects.log("→ 手札に召喚獣がないため効果なし");
    }
  }
}
