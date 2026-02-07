/**
 * @module theomachia/cards/base
 * @description カードの抽象基底クラスとタイプ別サブクラス。
 *
 * すべてのカードは `BaseCard` を継承し、3種のサブクラスに分類される:
 * - {@link SummonCard} — 場に残り毎ターン攻撃する召喚獣
 * - {@link SpellCard} — 召喚に関する儀式カード
 * - {@link SkillCard} — 補助効果のスキルカード
 *
 * 新しいカードを追加する場合:
 * 1. 適切なサブクラスを継承したクラスを作成
 * 2. `cards/` ディレクトリに新しいファイルとして配置
 * 3. `cards/index.ts` のレジストリに追加
 */

// ===========================================
// カードタイプ
// ===========================================

/** カードのタイプ */
export type CardType = "summon" | "spell" | "skill";

// ===========================================
// 抽象基底クラス
// ===========================================

/**
 * すべてのカードの抽象基底クラス。
 *
 * @example
 * ```typescript
 * class MyNewCard extends SkillCard {
 *   constructor() {
 *     super({
 *       id: "myCard",
 *       name: "新カード",
 *       description: "何かする。",
 *       color: "#FF0000",
 *     });
 *   }
 *   // ...
 * }
 * ```
 */
export abstract class BaseCard {
  /** カードの一意識別子 */
  readonly id: string;
  /** カードの表示名（日本語） */
  readonly name: string;
  /** カードのタイプ */
  abstract readonly type: CardType;
  /** カード効果の説明文 */
  readonly description: string;
  /** カードのUI表示色 */
  readonly color: string;
  /** オプションカードかどうか（デッキ構築時に任意追加） */
  readonly optional: boolean;
  /** 打ち消し不可フラグ */
  readonly unblockable: boolean;

  constructor(opts: {
    id: string;
    name: string;
    description: string;
    color: string;
    optional?: boolean;
    unblockable?: boolean;
  }) {
    this.id = opts.id;
    this.name = opts.name;
    this.description = opts.description;
    this.color = opts.color;
    this.optional = opts.optional ?? false;
    this.unblockable = opts.unblockable ?? false;
  }

  /**
   * カードの「効果キー」を返す。
   * クライアント側でカード効果の種類を判定するために使用。
   * デフォルトは undefined（効果なし）。
   */
  get effect(): string | undefined {
    return undefined;
  }

  /**
   * 効果の数値（ダメージ量など）。
   * デフォルトは undefined。
   */
  get value(): number | undefined {
    return undefined;
  }
}

// ===========================================
// 召喚獣カード
// ===========================================

/**
 * 召喚獣カードの基底クラス。
 * 場に残り、毎ターン開始時に自動攻撃を行う。
 */
export abstract class SummonCard extends BaseCard {
  readonly type = "summon" as const;
  /** 毎ターンのダメージ量 */
  abstract readonly damage: number;
  /** ダメージ反射能力 */
  readonly reflect: boolean = false;
  /** 儀式でのみ召喚可能か */
  readonly summonOnly: boolean = false;
}

// ===========================================
// 儀式カード
// ===========================================

/**
 * 儀式カードの基底クラス。
 * 召喚に関連する効果を持つ。使用後は捨て札に送られる。
 */
export abstract class SpellCard extends BaseCard {
  readonly type = "spell" as const;
}

// ===========================================
// スキルカード
// ===========================================

/**
 * スキルカードの基底クラス。
 * 各種補助効果を持つ。使用後は捨て札に送られる。
 */
export abstract class SkillCard extends BaseCard {
  readonly type = "skill" as const;
}
