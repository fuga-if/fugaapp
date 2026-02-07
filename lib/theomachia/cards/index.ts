/**
 * @module theomachia/cards
 * @description カードレジストリ。全カードの登録・検索・デッキ構成を管理する。
 *
 * 新しいカードを追加する手順:
 * 1. `cards/` ディレクトリに新しいファイルを作成
 * 2. `BaseCard` のサブクラス（SummonCard / SpellCard / SkillCard）を実装
 * 3. このファイルの `ALL_CARD_INSTANCES` に追加
 *
 * @example
 * ```typescript
 * import { CARDS, CardRegistry, BASE_DECK } from "@/lib/theomachia/cards";
 *
 * // 旧API互換（オブジェクト形式）
 * const zeus = CARDS["zeus"];
 * console.log(zeus.name); // "ゼウス"
 *
 * // 新API（クラスインスタンス）
 * const zeusCard = CardRegistry.get("zeus");
 * console.log(zeusCard?.name); // "ゼウス"
 * ```
 */

import type { BaseCard, CardType } from "./base";
export type { BaseCard, SummonCard, SpellCard, SkillCard, CardType } from "./base";

// --- カードクラスのインポート ---
import { ZeusCard } from "./zeus";
import { ErisCard } from "./eris";
import { MedusaCard } from "./medusa";
import { KeraunosCard } from "./keraunos";
import { AscensionCard } from "./ascension";
import { NecromancyCard } from "./necromancy";
import { MetamorphoseCard } from "./metamorphose";
import { TartarusCard } from "./tartarus";
import { AmbrosiaCard } from "./ambrosia";
import { NectarCard } from "./nectar";
import { OracleCard } from "./oracle";
import { HermesLetterCard } from "./hermes-letter";
import { ClairvoyanceCard } from "./clairvoyance";
import { TrueNameCard } from "./true-name";
import { AegisCard } from "./aegis";
import { GodspeedCard } from "./godspeed";
import { AsclepiusCard } from "./asclepius";
import { PiercingArrowCard } from "./piercing-arrow";
import { EquilibriumCard } from "./equilibrium";
import { UsurpCard } from "./usurp";
import { ProtectionCard } from "./protection";
import { BloodPactCard } from "./blood-pact";
import { PrayerCard } from "./prayer";

// ===========================================
// 全カードインスタンス
// ===========================================

/**
 * 全カードのインスタンス配列。
 * 新しいカードを追加する場合はここにインスタンスを追加するだけでOK。
 */
const ALL_CARD_INSTANCES: BaseCard[] = [
  // --- 基本カード ---
  new ZeusCard(),
  new ErisCard(),
  new MedusaCard(),
  new KeraunosCard(),
  new AscensionCard(),
  new NecromancyCard(),
  new MetamorphoseCard(),
  new TartarusCard(),
  new AmbrosiaCard(),
  new NectarCard(),
  new OracleCard(),
  new HermesLetterCard(),
  new ClairvoyanceCard(),
  new TrueNameCard(),
  new AegisCard(),
  new GodspeedCard(),
  // --- オプションカード ---
  new AsclepiusCard(),
  new PiercingArrowCard(),
  new EquilibriumCard(),
  new UsurpCard(),
  new ProtectionCard(),
  new BloodPactCard(),
  new PrayerCard(),
];

// ===========================================
// カードレジストリ
// ===========================================

/**
 * カードレジストリ。カードIDからインスタンスを検索する。
 *
 * @example
 * ```typescript
 * const card = CardRegistry.get("zeus");
 * if (card instanceof SummonCard) {
 *   console.log(card.damage); // 4
 * }
 * ```
 */
export class CardRegistry {
  private static readonly map = new Map<string, BaseCard>(
    ALL_CARD_INSTANCES.map((card) => [card.id, card])
  );

  /** カードIDからインスタンスを取得する */
  static get(id: string): BaseCard | undefined {
    return this.map.get(id);
  }

  /** カードIDからインスタンスを取得する（存在しない場合はエラー） */
  static getOrThrow(id: string): BaseCard {
    const card = this.map.get(id);
    if (!card) throw new Error(`Card not found: ${id}`);
    return card;
  }

  /** 全カードのインスタンスを返す */
  static getAll(): BaseCard[] {
    return ALL_CARD_INSTANCES;
  }

  /** 基本カード（optional = false）のインスタンスを返す */
  static getBase(): BaseCard[] {
    return ALL_CARD_INSTANCES.filter((card) => !card.optional);
  }

  /** オプションカード（optional = true）のインスタンスを返す */
  static getOptional(): BaseCard[] {
    return ALL_CARD_INSTANCES.filter((card) => card.optional);
  }

  /** タイプでフィルタしたカードを返す */
  static getByType(type: CardType): BaseCard[] {
    return ALL_CARD_INSTANCES.filter((card) => card.type === type);
  }

  /** 全カードIDの配列を返す */
  static getAllIds(): string[] {
    return ALL_CARD_INSTANCES.map((card) => card.id);
  }
}

// ===========================================
// 旧API互換 — CARDS オブジェクト
// ===========================================

/**
 * 旧API互換の CARDS 定義オブジェクト。
 * 既存のコードとの後方互換性を維持する。
 *
 * @remarks
 * 新しいコードでは `CardRegistry` の使用を推奨。
 * この定義はカードインスタンスから自動生成される。
 */
function buildCardsObject(): Record<string, any> {
  const obj: Record<string, any> = {};
  for (const card of ALL_CARD_INSTANCES) {
    const entry: Record<string, any> = {
      id: card.id,
      name: card.name,
      type: card.type,
      description: card.description,
      color: card.color,
    };
    if (card.optional) entry.optional = true;
    if (card.unblockable) entry.unblockable = true;
    if (card.effect !== undefined) entry.effect = card.effect;
    if (card.value !== undefined) entry.value = card.value;

    // SummonCard 固有プロパティ
    if (card.type === "summon") {
      const summon = card as any;
      if (summon.damage !== undefined) entry.damage = summon.damage;
      if (summon.reflect) entry.reflect = true;
      if (summon.summonOnly) entry.summonOnly = true;
    }

    obj[card.id] = entry;
  }
  return obj;
}

/**
 * 全カードの定義オブジェクト（旧API互換）。
 *
 * @example
 * ```typescript
 * const card = CARDS["zeus"];
 * console.log(card.name); // "ゼウス"
 * console.log(card.damage); // 4
 * ```
 */
export const CARDS = buildCardsObject() as Record<string, {
  id: string;
  name: string;
  type: "summon" | "spell" | "skill";
  description: string;
  color: string;
  damage?: number;
  reflect?: boolean;
  summonOnly?: boolean;
  optional?: boolean;
  unblockable?: boolean;
  effect?: string;
  value?: number;
}>;

// ===========================================
// 型定義
// ===========================================

/** カードIDの型 */
export type CardId = string & keyof typeof CARDS;

/** カード定義の型（旧互換） */
export type Card = (typeof CARDS)[CardId];

// ===========================================
// カードタイプの色（定数からre-export）
// ===========================================

export { TYPE_COLORS } from "../constants";

// ===========================================
// デッキ構成
// ===========================================

/**
 * 基本デッキのカードID配列（16枚）。
 */
export const BASE_DECK: CardId[] = CardRegistry.getBase().map((c) => c.id) as CardId[];

/**
 * オプションカードのID配列。
 */
export const OPTIONAL_CARDS: CardId[] = CardRegistry.getOptional().map((c) => c.id) as CardId[];

/**
 * デッキ（互換性エイリアス）。
 * @deprecated `BASE_DECK` を使用してください。
 */
export const DECK = BASE_DECK;
