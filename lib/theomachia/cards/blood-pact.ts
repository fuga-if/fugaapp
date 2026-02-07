/**
 * @module theomachia/cards/blood-pact
 * @description 血の契約 — 自傷＋大量ドロースキル。
 *
 * - 自分のソウルを1減らす（コスト）
 * - カードを3枚ドロー
 * - 加護で自傷ダメージを防いだ場合でもドローは実行される
 * - ソウル1未満の場合はプレイ不可
 *
 * @remarks オプションカード
 */

import { SkillCard } from "./base";

export class BloodPactCard extends SkillCard {
  constructor() {
    super({
      id: "bloodPact",
      name: "血の契約",
      description: "自分のソウルを1減らす。カードを3枚引く。",
      color: "#880000",
      optional: true,
    });
  }

  get effect() { return "bloodPact"; }
}
