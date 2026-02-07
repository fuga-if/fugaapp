/**
 * @module theomachia/cards/hermes-letter
 * @description 冥府の手紙 — 墓地回収スキル。
 *
 * - 捨て札から1枚を手札に加える
 * - 全カードタイプが対象（召喚獣に限らない）
 * - 墓地が空の場合は効果なし
 */

import { SkillCard } from "./base";
import type { GameEffects } from "./base";

export class HermesLetterCard extends SkillCard {
  constructor() {
    super({
      id: "hermesLetter",
      name: "冥府の手紙",
      description: "捨て札から1枚手札に加える。",
      color: "#996633",
    });
  }

  /**
   * 墓地にカードがあれば "discard"、なければ "none" を返す。
   */
  getTargetType(effects: GameEffects): "summon" | "field" | "discard" | "none" {
    return effects.state.discard.length > 0 ? "discard" : "none";
  }

  /**
   * 墓地からカードを手札に回収する。
   */
  protected onExecute(effects: GameEffects, target?: string): void {
    if (target) {
      if (effects.retrieveFromDiscard(target)) {
        effects.log(`→ 「${target}」を回収`);
      }
    } else {
      effects.log("→ 墓地が空のため効果なし");
    }
  }
}
