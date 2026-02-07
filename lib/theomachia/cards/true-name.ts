/**
 * @module theomachia/cards/true-name
 * @description 真名看破 — カード名宣言スキル。
 *
 * - カード名を1つ宣言する
 * - 相手の手札にそのカードがあれば自分の手札に加える
 * - 外れた場合のペナルティはなし
 * - ハイリターン・ノーリスクの情報戦カード
 */

import { SkillCard } from "./base";
import type { GameEffects } from "./base";

export class TrueNameCard extends SkillCard {
  constructor() {
    super({
      id: "trueName",
      name: "真名看破",
      description: "カード名を宣言。当たれば奪う。",
      color: "#FF6600",
    });
  }

  /**
   * カード名宣言を要求する。
   */
  protected onExecute(effects: GameEffects): void {
    effects.requestGuess();
  }
}
