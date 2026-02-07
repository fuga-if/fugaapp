/**
 * @module theomachia/cards/metamorphose
 * @description 変身の秘術 — ゼウスとエリスを全域で入れ替える儀式。
 *
 * - 山札・手札・場・捨て札すべてが対象
 * - エリスがゼウスに、ゼウスがエリスになる
 * - 位置関係を活用した戦略的カード
 */

import { SpellCard } from "./base";
import type { GameEffects } from "./base";

export class MetamorphoseCard extends SpellCard {
  constructor() {
    super({
      id: "metamorphose",
      name: "変身の秘術",
      description: "ゼウスとエリスをどこにあっても入れ替える。",
      color: "#FF66FF",
    });
  }

  /**
   * ゼウスとエリスを全ての場所で入れ替える。
   */
  protected onExecute(effects: GameEffects): void {
    effects.swapZeusAndEris();
  }
}
