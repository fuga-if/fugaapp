/**
 * @module theomachia/cards/piercing-arrow
 * @description 貫通の矢 — 打ち消し不可のダメージスキル。
 *
 * - GUARDで防げない確実な1ダメージ
 * - 打ち消し判定を完全にスキップする
 * - 少ダメージだが確実性が強み
 *
 * @remarks オプションカード
 */

import { SkillCard } from "./base";

export class PiercingArrowCard extends SkillCard {
  constructor() {
    super({
      id: "piercingArrow",
      name: "貫通の矢",
      description: "打ち消し不可。相手に1ダメージ。",
      color: "#FF4444",
      optional: true,
      unblockable: true,
    });
  }

  get effect() { return "damage"; }
  get value() { return 1; }
}
