/**
 * @module theomachia/server/cards
 * @description サーバー側のカードデータ定義。
 * クライアント側の cards.ts とは別に、サーバー処理に必要なプロパティのみ持つ。
 */

import type { CardDefinition, CardId } from "./types";

// ===========================================
// カードデータ
// ===========================================

/**
 * 全カードの定義データ。
 * サーバー側ではダメージ計算・効果処理に必要な情報のみ保持する。
 *
 * @remarks
 * color や description はクライアント側 (fugaapp/lib/theomachia/cards.ts) で管理。
 */
export const CARD_DATA: Record<string, CardDefinition> = {
  // --- 召喚獣 ---
  zeus: { id: "zeus", name: "ゼウス", type: "summon", damage: 4, summonOnly: true },
  eris: { id: "eris", name: "エリス", type: "summon", damage: 1 },
  medusa: { id: "medusa", name: "メデューサ", type: "summon", reflect: true },

  // --- スキル（ダメージ） ---
  keraunos: { id: "keraunos", name: "雷霆", type: "skill" },

  // --- 儀式 ---
  ascension: { id: "ascension", name: "降臨", type: "spell" },
  necromancy: { id: "necromancy", name: "冥界の門", type: "spell" },
  metamorphose: { id: "metamorphose", name: "変身の秘術", type: "spell" },
  tartarus: { id: "tartarus", name: "奈落送り", type: "spell" },

  // --- スキル（アクション） ---
  ambrosia: { id: "ambrosia", name: "神々の糧", type: "skill" },
  nectar: { id: "nectar", name: "神酒", type: "skill" },
  oracle: { id: "oracle", name: "神託", type: "skill" },
  hermesLetter: { id: "hermesLetter", name: "冥府の手紙", type: "skill" },
  clairvoyance: { id: "clairvoyance", name: "千里眼", type: "skill" },
  trueName: { id: "trueName", name: "真名看破", type: "skill" },
  aegis: { id: "aegis", name: "神盾", type: "skill" },
  godspeed: { id: "godspeed", name: "神速", type: "skill" },

  // --- オリジナルカード（オプション） ---
  asclepius: { id: "asclepius", name: "アスクレピオス", type: "summon", damage: 0, optional: true },
  piercingArrow: { id: "piercingArrow", name: "貫通の矢", type: "skill", unblockable: true, optional: true },
  equilibrium: { id: "equilibrium", name: "均衡", type: "spell", optional: true },
  usurp: { id: "usurp", name: "簒奪", type: "skill", optional: true },
  protection: { id: "protection", name: "加護", type: "skill", optional: true },
  bloodPact: { id: "bloodPact", name: "血の契約", type: "skill", optional: true },
  prayer: { id: "prayer", name: "祈り", type: "skill", optional: true },
};

// ===========================================
// デッキ構成
// ===========================================

/**
 * 基本デッキ（オプションカードを除いた16枚）。
 */
export const BASE_DECK: CardId[] = (Object.keys(CARD_DATA) as CardId[]).filter(
  (id) => !CARD_DATA[id].optional
);

/**
 * オプションカードのID配列。
 */
export const OPTIONAL_CARDS: CardId[] = (Object.keys(CARD_DATA) as CardId[]).filter(
  (id) => CARD_DATA[id].optional
);
