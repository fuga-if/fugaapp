/**
 * @module theomachia/cards/tartarus
 * @description 奈落送り — 場のカードを除去する儀式。
 *
 * - 場にある召喚獣1体を選んで捨て札にする
 * - 自分の場のカードも対象にできる
 * - 場にカードがない場合は効果なし
 */

import { SpellCard } from "./base";

export class TartarusCard extends SpellCard {
  constructor() {
    super({
      id: "tartarus",
      name: "奈落送り",
      description: "場のまもの1体を捨て札にする。",
      color: "#333333",
    });
  }

  get effect() { return "remove"; }
}
