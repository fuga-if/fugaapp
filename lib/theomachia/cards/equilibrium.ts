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

  get effect() { return "destroyAll"; }
}
