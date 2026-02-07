/**
 * @module theomachia/cards/hermes-letter
 * @description 冥府の手紙 — 墓地回収スキル。
 *
 * - 捨て札から1枚を手札に加える
 * - 全カードタイプが対象（召喚獣に限らない）
 * - 墓地が空の場合は効果なし
 */

import { SkillCard } from "./base";

export class HermesLetterCard extends SkillCard {
  constructor() {
    super({
      id: "hermesLetter",
      name: "冥府の手紙",
      description: "捨て札から1枚手札に加える。",
      color: "#996633",
    });
  }

  get effect() { return "retrieve"; }
}
