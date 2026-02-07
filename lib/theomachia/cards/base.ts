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
// ダメージ結果
// ===========================================

/** dealDamage の結果 */
export interface DamageResult {
  /** メデューサ等により反射されたか */
  reflected: boolean;
  /** 加護で無効化されたか */
  blocked: boolean;
}

// ===========================================
// GameEffects インターフェース
// ===========================================

/**
 * カード効果で使える汎用アクション群。
 *
 * 各カードの `execute` メソッドに注入される。
 * サーバー側で具体実装を提供し、カードクラスはこのインターフェースにのみ依存する。
 */
export interface GameEffects {
  /** 山札からカードを引く */
  draw(count: number): void;
  /** プレイヤーに手札を捨てさせる（UIを表示） */
  discard(count: number): void;
  /** 相手にダメージを与える */
  dealDamage(amount: number): DamageResult;
  /** 自分にダメージを与える（コスト等） */
  selfDamage(amount: number): boolean;
  /** ソウルを回復する */
  heal(amount: number): void;
  /** 召喚獣を場に出す */
  summonToField(cardId: string): void;
  /** 場のカードを除去して墓地へ送る */
  removeFromField(cardId: string): void;
  /** シールドストックからGUARDを1つ獲得する */
  gainShield(): boolean;
  /** 追加プレイ回数を付与する */
  addExtraPlays(count: number): void;
  /** 山札をプレイヤーに公開する（閲覧のみ） */
  showDeck(): void;
  /** プレイヤーに山札から1枚選択させる（非同期） */
  requestSelectFromDeck(): void;
  /** 相手の手札をプレイヤーに公開する（閲覧のみ） */
  showOpponentHand(): void;
  /** 公開した相手の手札から1枚捨てさせる（非同期） */
  requestDiscardFromOpponent(): void;
  /** カード名を宣言させる（非同期） */
  requestGuess(): void;
  /** 墓地から召喚獣を復活させて場に出す */
  reviveFromDiscard(cardId: string): boolean;
  /** 墓地からカードを手札に回収する */
  retrieveFromDiscard(cardId: string): boolean;
  /** ゼウスとエリスを全ての場所で入れ替える */
  swapZeusAndEris(): void;
  /** 自分の手札を相手に公開する */
  peekHand(message: string): void;
  /** カードを墓地に送る */
  sendToDiscard(cardId: string): void;
  /** アクションログに記録する */
  log(message: string): void;

  // --- コンテキスト情報 ---

  /** 現在のプレイヤーの状態 */
  player: {
    readonly hand: readonly string[];
    readonly field: readonly string[];
    readonly souls: number;
    readonly isProtected: boolean;
    readonly name: string;
  };
  /** 相手プレイヤーの状態 */
  opponent: {
    readonly hand: readonly string[];
    readonly field: readonly string[];
    readonly souls: number;
    readonly name: string;
  };
  /** ゲーム全体の状態 */
  state: {
    readonly deck: readonly string[];
    readonly discard: readonly string[];
  };
}

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
 *   execute(effects: GameEffects) {
 *     effects.draw(1);
 *   }
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

  constructor(opts: {
    id: string;
    name: string;
    description: string;
    color: string;
    optional?: boolean;
  }) {
    this.id = opts.id;
    this.name = opts.name;
    this.description = opts.description;
    this.color = opts.color;
    this.optional = opts.optional ?? false;
  }

  /**
   * 手札から直接プレイ可能か。
   * デフォルトは true。ゼウスなど儀式でのみ召喚可能なカードは false を返す。
   */
  get canDirectPlay(): boolean {
    return true;
  }

  /**
   * 相手が打ち消し可能か。
   * デフォルトは true。貫通の矢など打ち消し不可カードは false を返す。
   */
  get isCounterable(): boolean {
    return true;
  }

  /**
   * カード効果を実行する（エントリポイント）。
   * 効果本体（onExecute）を呼び、その後に共通の後処理（afterExecute）を実行する。
   *
   * @param effects - ゲームアクション群（サーバーから注入される）
   * @param target - ターゲットのカードID（必要な場合）
   */
  execute(effects: GameEffects, target?: string): void {
    this.onExecute(effects, target);
    this.afterExecute(effects);
  }

  /**
   * カード効果の本体。各カードクラスで実装する。
   */
  protected abstract onExecute(effects: GameEffects, target?: string): void;

  /**
   * 効果解決後の共通処理。
   * デフォルトでは自身を墓地に送る。召喚獣など場に残るカードはオーバーライドする。
   */
  protected afterExecute(effects: GameEffects): void {
    effects.sendToDiscard(this.id);
  }

  /**
   * カードがプレイ可能かどうかを判定する。
   * デフォルトは常にプレイ可能。サブクラスでオーバーライド可能。
   *
   * @param effects - ゲームアクション群（状態参照用）
   * @returns プレイ可能なら true
   */
  canExecute(_effects: GameEffects): boolean {
    return true;
  }

  /**
   * ターゲット選択が必要かどうか、及びその種類を返す。
   * デフォルトはターゲット不要。サブクラスでオーバーライド可能。
   *
   * @param effects - ゲームアクション群（状態参照用）
   * @returns ターゲットの種類。不要なら "none"
   */
  getTargetType(_effects: GameEffects): "summon" | "field" | "discard" | "none" {
    return "none";
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

  /** 召喚獣は場に残るため墓地送りしない */
  protected afterExecute(_effects: GameEffects): void {
    // 場に残る — 何もしない
  }

  /**
   * 場に出ている時の毎ターン自動攻撃。
   * サーバーのターン開始処理から呼ばれる。
   *
   * デフォルトで `this.damage` 分のダメージを相手に与える。
   * メデューサなど特殊な攻撃パターンを持つ召喚獣はオーバーライド可能。
   *
   * @param effects - ゲームアクション群
   * @returns ダメージ結果（反射・無効化情報を含む）
   */
  attack(effects: GameEffects): DamageResult {
    return effects.dealDamage(this.damage);
  }
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
