/**
 * @module theomachia/cards/oracle
 * @description 神託（オラクル） — 山札サーチスキル。
 *
 * - 山札を全て確認し、1枚を手札に加える
 * - 残りの山札はシャッフルされる
 * - 欲しいカードを確実に手に入れられる強力なサーチ
 */

import { SkillCard } from "./base";

export class OracleCard extends SkillCard {
  constructor() {
    super({
      id: "oracle",
      name: "神託",
      description: "山札を見て1枚手札に加える。",
      color: "#99CCFF",
    });
  }

  get effect() { return "search"; }
}
