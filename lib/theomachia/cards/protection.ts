/**
 * @module theomachia/cards/protection
 * @description 加護 — ダメージ無効化スキル。
 *
 * - 次に受けるダメージを1回無効化
 * - ゼウスの即死攻撃は防げない
 * - 既に加護状態の場合はプレイ不可
 * - 自傷ダメージ（簒奪・血の契約）も防げる
 *
 * @remarks オプションカード
 */

import { SkillCard } from "./base";
import type { GameEffects } from "./base";

export class ProtectionCard extends SkillCard {
  constructor() {
    super({
      id: "protection",
      name: "加護",
      description: "次に受けるダメージを1回無効化（ゼウスを除く）。",
      color: "#FFDDAA",
      optional: true,
    });
  }

  /**
   * 既に加護状態ならプレイ不可。
   */
  canExecute(effects: GameEffects): boolean {
    return !effects.player.isProtected;
  }

  /**
   * プレイヤーに加護を付与する。
   * 実際のprotected状態の変更はサーバー側で処理される。
   */
  protected onExecute(effects: GameEffects): void {
    effects.log(`${effects.player.name}に加護が付与された`);
  }
}
