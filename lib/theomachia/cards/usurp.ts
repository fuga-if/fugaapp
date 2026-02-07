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
import type { GameEffects } from "./base";

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

  /**
   * ソウル2以上必要。
   */
  canExecute(effects: GameEffects): boolean {
    return effects.player.souls >= 2;
  }

  /**
   * 相手の場にカードがあれば "field"、なければ "none" を返す。
   */
  getTargetType(effects: GameEffects): "summon" | "field" | "discard" | "none" {
    return effects.opponent.field.length > 0 ? "field" : "none";
  }

  /**
   * 自傷2ダメージをコストとして支払い、ターゲットの場のカードを奪う。
   * ターゲットがなくてもコストは発生する。
   */
  protected onExecute(effects: GameEffects, target?: string): void {
    const damaged = effects.selfDamage(2);
    if (damaged) {
      effects.log(`${effects.player.name}が2ダメージを受けた（簒奪のコスト）`);
    }

    if (target && effects.opponent.field.includes(target)) {
      // サーバー側で実際の手札移動を処理
      effects.removeFromField(target);
      effects.log(`→ 「${target}」を奪取！`);
    } else {
      effects.log("→ 相手の場にカードがないため効果なし");
    }
  }
}
