/**
 * @module theomachia/server/cards
 * @description サーバー側のデッキ構成定義。
 * カードデータは lib/theomachia/cards/ の CardRegistry に統一。
 */

import { CardRegistry } from "../../lib/theomachia/cards";
import type { CardId } from "./types";

// ===========================================
// デッキ構成
// ===========================================

/**
 * 基本デッキ（オプションカードを除いた16枚）。
 */
export const BASE_DECK: CardId[] = CardRegistry.getBase().map((c) => c.id);

/**
 * オプションカードのID配列。
 */
export const OPTIONAL_CARDS: CardId[] = CardRegistry.getOptional().map((c) => c.id);
