/**
 * @module theomachia/cards/keraunos
 * @description 雷霆（ケラウノス） — 直接ダメージスキル。
 *
 * - 相手に2ダメージ
 * - メデューサがいる場合は反射される
 * - 打ち消し可能
 */

import { SkillCard } from "./base";

export class KeraunosCard extends SkillCard {
  constructor() {
    super({
      id: "keraunos",
      name: "雷霆",
      description: "相手に2ダメージ。",
      color: "#FFFF00",
    });
  }

  get effect() { return "damage"; }
  get value() { return 2; }
}
