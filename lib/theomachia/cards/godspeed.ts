/**
 * @module theomachia/cards/godspeed
 * @description 神速 — 追加プレイスキル。
 *
 * - このターンの追加プレイ回数を+2する
 * - コンボの起点となるカード
 * - 実質このカード自体のプレイで-1、追加で+2 = 差し引き+1
 */

import { SkillCard } from "./base";
import type { GameEffects } from "./base";

export class GodspeedCard extends SkillCard {
  constructor() {
    super({
      id: "godspeed",
      name: "神速",
      description: "このターン、追加で2枚までプレイ可能。",
      color: "#66FF66",
    });
  }

  /**
   * 追加で2枚プレイ可能にする。
   */
  protected onExecute(effects: GameEffects): void {
    effects.addExtraPlays(2);
  }
}
