/**
 * @module theomachia/cards/equilibrium
 * @description 均衡 — 場の全カード除去儀式。
 *
 * - お互いの場のカードを全て墓地へ送る
 * - リセットボタン的な効果
 * - 場にカードがない場合は効果なし
 *
 * @remarks オプションカード
 */

import { SpellCard } from "./base";
import type { GameEffects } from "./base";

export class EquilibriumCard extends SpellCard {
  constructor() {
    super({
      id: "equilibrium",
      name: "均衡",
      description: "お互いの場のカードを全て墓地へ送る。",
      color: "#AAAAAA",
      optional: true,
    });
  }

  /**
   * お互いの場のカードを全て墓地へ送る。
   */
  protected onExecute(effects: GameEffects): void {
    const playerField = [...effects.player.field];
    const opponentField = [...effects.opponent.field];
    const hasCards = playerField.length > 0 || opponentField.length > 0;

    if (hasCards) {
      for (const cardId of playerField) {
        effects.removeFromField(cardId);
      }
      for (const cardId of opponentField) {
        effects.removeFromField(cardId);
      }
    } else {
      effects.log("→ 場にカードがないため効果なし");
    }
  }
}
