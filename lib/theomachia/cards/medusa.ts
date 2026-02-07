/**
 * @module theomachia/cards/medusa
 * @description メデューサ — ダメージ反射能力を持つ守備型召喚獣。
 *
 * - ダメージを与えない（damage = 0）
 * - 相手の召喚獣からのダメージを反射する
 * - ゼウスの攻撃は反射できない
 * - 雷霆などのスキルダメージも反射可能
 */

import { SummonCard } from "./base";

export class MedusaCard extends SummonCard {
  readonly damage = 0;
  readonly reflect = true;

  constructor() {
    super({
      id: "medusa",
      name: "メデューサ",
      description: "ダメージを反射。ただしゼウスの攻撃は防げない。",
      color: "#33CC33",
    });
  }
}
