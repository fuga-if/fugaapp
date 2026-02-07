/**
 * @module theomachia/cards/eris
 * @description エリス — 争いの女神。基本的な攻撃型召喚獣。
 *
 * - ターン開始時に1ダメージ
 * - 手札から直接プレイ可能（降臨不要）
 * - 「変身の秘術」でゼウスと入れ替えられる
 */

import { SummonCard } from "./base";

export class ErisCard extends SummonCard {
  readonly damage = 1;

  constructor() {
    super({
      id: "eris",
      name: "エリス",
      description: "争いの女神。ターン開始時に1ダメージ。",
      color: "#9966FF",
    });
  }
}
