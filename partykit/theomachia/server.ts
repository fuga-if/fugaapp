/**
 * @module theomachia/server
 * @description テオマキア PartyKitサーバー。
 * WebSocket経由でクライアントと通信し、ゲームの進行を管理する。
 *
 * @remarks
 * PartyKit上にデプロイして使用する。
 * デプロイ: `cd /home/fuga/theomachia && npx partykit deploy`
 */

import type * as Party from "partykit/server";

import { CARD_DATA, BASE_DECK, OPTIONAL_CARDS } from "./cards";
import { CardEffects } from "./card-effects";
import { GameActions } from "./game-actions";
import { CardRegistry } from "../../lib/theomachia/cards";
import { SummonCard } from "../../lib/theomachia/cards/base";
import { shuffle } from "./utils";
import { Deck, Graveyard } from "./zones";
import type { CardId, GameState } from "./types";
import { Player } from "./player";
import {
  INITIAL_SOULS,
  INITIAL_SHIELDS,
  INITIAL_SHIELD_STOCK,
  INITIAL_HAND_SIZE,
  BASE_PLAYS_PER_TURN,
  FIRST_TURN_PLAYS,
  COUNTER_SHIELD_COST,
  MAX_OPTIONAL_CARDS,
  MAX_SOULS,
  TURN_TIME_LIMIT,
  SHIELD_TIME_LIMIT,
} from "./types";

// ===========================================
// ゲーム初期状態の生成
// ===========================================

/**
 * ゲームの初期状態を生成する。
 *
 * @returns 初期化されたゲーム状態
 */
function createInitialState(): GameState {
  return {
    phase: "waiting",
    players: {},
    deck: new Deck(),
    graveyard: new Graveyard(),
    currentTurn: null,
    turnNumber: 0,
    playsRemaining: 0,
    winner: null,
    shieldStock: INITIAL_SHIELD_STOCK,
    lastAction: null,
    actionLog: [],
    pendingShield: null,
    pendingCounter: null,
    pendingAction: null,
    creatorId: null,
    creatorTurnChoice: "random",
    optionalCards: [],
    wins: {},
    matchCount: 0,
  };
}

// ===========================================
// メインサーバークラス
// ===========================================

/**
 * テオマキアのPartyKitサーバー。
 *
 * WebSocket接続を管理し、ゲームの状態管理とメッセージハンドリングを行う。
 *
 * @remarks
 * 1つのルームにつき1インスタンスが生成される。
 * 最大2人のプレイヤーが参加可能。
 */
export default class TheoMachiaServer implements Party.Server {
  /** ゲーム状態 */
  state: GameState;
  /** ゲームアクション操作クラス */
  actions: GameActions;

  /** ターンタイマー */
  private turnTimer: ReturnType<typeof setTimeout> | null = null;
  /** 打ち消しタイマー */
  private shieldTimer: ReturnType<typeof setTimeout> | null = null;
  /** ターンタイマー残り時間（ms） */
  private turnTimeRemaining: number = 0;
  /** ターンタイマー開始時刻 */
  private turnTimerStartedAt: number = 0;

  constructor(readonly room: Party.Room) {
    this.state = createInitialState();
    this.actions = new GameActions(
      this.state,
      () => this.broadcastState(),
      (id, msg) => this.sendToPlayer(id, msg),
      (msg) => this.logAction(msg)
    );
  }

  // ===========================================
  // タイマー管理
  // ===========================================

  /** ターンタイマーを開始する */
  private startTurnTimer(): void {
    this.clearTurnTimer();
    this.turnTimeRemaining = TURN_TIME_LIMIT;
    this.turnTimerStartedAt = Date.now();
    this.turnTimer = setTimeout(() => this.onTurnTimeout(), TURN_TIME_LIMIT);
    this.broadcastTimerState();
  }

  /** ターンタイマーを一時停止する（pendingAction設定時） */
  private pauseTurnTimer(): void {
    if (this.turnTimer) {
      clearTimeout(this.turnTimer);
      this.turnTimer = null;
      const elapsed = Date.now() - this.turnTimerStartedAt;
      this.turnTimeRemaining = Math.max(0, this.turnTimeRemaining - elapsed);
    }
    this.broadcastTimerState();
  }

  /** ターンタイマーを再開する（pendingAction解決時） */
  private resumeTurnTimer(): void {
    if (this.turnTimeRemaining <= 0) {
      this.onTurnTimeout();
      return;
    }
    this.turnTimerStartedAt = Date.now();
    this.turnTimer = setTimeout(() => this.onTurnTimeout(), this.turnTimeRemaining);
    this.broadcastTimerState();
  }

  /** ターンタイマーをクリアする */
  private clearTurnTimer(): void {
    if (this.turnTimer) {
      clearTimeout(this.turnTimer);
      this.turnTimer = null;
    }
  }

  /** ターンタイムアウト処理 */
  private onTurnTimeout(): void {
    this.clearTurnTimer();
    this.turnTimeRemaining = 0;
    if (this.state.phase !== "playing" || !this.state.currentTurn) return;
    this.logAction("⏰ タイムアウト！ターン終了");
    this.state.playsRemaining = 0;
    this.broadcastTimerState();
    this.doEndTurn(this.state.currentTurn);
  }

  /** 打ち消しタイマーを開始する */
  private startShieldTimer(): void {
    this.clearShieldTimer();
    this.shieldTimer = setTimeout(() => this.onShieldTimeout(), SHIELD_TIME_LIMIT);
    this.broadcastTimerState();
  }

  /** 打ち消しタイマーをクリアする */
  private clearShieldTimer(): void {
    if (this.shieldTimer) {
      clearTimeout(this.shieldTimer);
      this.shieldTimer = null;
    }
  }

  /** 打ち消しタイムアウト処理 */
  private onShieldTimeout(): void {
    this.clearShieldTimer();
    if (this.state.pendingShield) {
      const { by, cardId, target } = this.state.pendingShield;
      this.logAction("⏰ 打ち消し判定タイムアウト — 通し");
      this.resolveCard(by, cardId, target);
    } else if (this.state.pendingCounter) {
      const { cardId } = this.state.pendingCounter;
      this.state.graveyard.add(cardId);
      this.state.pendingCounter = null;
      this.state.playsRemaining -= 1;
      this.logAction("⏰ 打ち消し返し判定タイムアウト — 打ち消し確定");
      this.broadcastTimerState();
      this.broadcastState();
    }
  }

  /** タイマー状態を全クライアントに送信する */
  private broadcastTimerState(): void {
    const timerState = {
      type: "timer",
      turnTimeRemaining: this.turnTimeRemaining,
      turnPaused: this.turnTimer === null && this.turnTimeRemaining > 0,
      shieldActive: this.shieldTimer !== null,
      shieldTimeLimit: SHIELD_TIME_LIMIT,
    };
    this.broadcastRaw(JSON.stringify(timerState));
  }

  // ===========================================
  // ログ
  // ===========================================

  /**
   * アクションログにメッセージを追加する。
   * ターン番号付きでログに記録される。
   *
   * @param message - ログメッセージ
   */
  logAction(message: string): void {
    this.state.lastAction = message;
    this.state.actionLog.push(`[T${this.state.turnNumber}] ${message}`);
  }

  // ===========================================
  // 接続管理
  // ===========================================

  /**
   * 新しいクライアント接続時の処理。
   * 現在のゲーム状態を送信する。
   */
  onConnect(conn: Party.Connection): void {
    conn.send(JSON.stringify({ type: "state", state: this.getPublicState(conn.id) }));
  }

  // ===========================================
  // メッセージルーティング
  // ===========================================

  /**
   * クライアントからのメッセージを処理する。
   * メッセージタイプに応じて適切なハンドラにディスパッチする。
   */
  onMessage(message: string, sender: Party.Connection): void {
    try {
      const data = JSON.parse(message);

      switch (data.type) {
        case "join":
          this.handleJoin(sender, data.name, data.turnChoice, data.optionalCards);
          break;
        case "ready":
          this.handleReady(sender);
          break;
        case "play":
          this.handlePlay(sender, data.cardId, data.target);
          break;
        case "shield":
          this.handleShield(sender);
          break;
        case "shieldCounter":
          this.handleShieldCounter(sender);
          break;
        case "passCounter":
          this.handlePassCounter(sender);
          break;
        case "passShield":
          this.handlePassShield(sender);
          break;
        case "discard":
          this.handleDiscard(sender, data.cardIds);
          break;
        case "selectCard":
          this.handleSelectCard(sender, data.cardId);
          break;
        case "guessCard":
          this.handleGuessCard(sender, data.cardId);
          break;
        case "endTurn":
          this.handleEndTurn(sender);
          break;
        case "rematch":
          this.handleRematch(sender);
          break;
        case "updateSettings":
          this.handleUpdateSettings(sender, data.turnChoice, data.optionalCards);
          break;
      }
    } catch (e) {
      console.error("Error processing message:", e);
    }
  }

  // ===========================================
  // 設定更新
  // ===========================================

  /**
   * ルーム設定を更新する（ルーム作成者のみ、待機中のみ）。
   *
   * @param conn - 送信元の接続
   * @param turnChoice - 先攻/後攻選択
   * @param optionalCards - 追加カード配列
   */
  handleUpdateSettings(
    conn: Party.Connection,
    turnChoice?: "first" | "second" | "random",
    optionalCards?: CardId[]
  ): void {
    if (this.state.phase !== "waiting") return;
    if (this.state.creatorId !== conn.id) return;

    if (turnChoice) {
      this.state.creatorTurnChoice = turnChoice;
    }
    if (optionalCards !== undefined) {
      this.state.optionalCards = optionalCards
        .slice(0, MAX_OPTIONAL_CARDS)
        .filter((id) => OPTIONAL_CARDS.includes(id));
    }
    this.broadcastState();
  }

  // ===========================================
  // 参加・準備
  // ===========================================

  /**
   * プレイヤーの参加を処理する。
   * 最初のプレイヤーがルーム作成者となり、設定権限を持つ。
   *
   * @param conn - 送信元の接続
   * @param name - プレイヤー名
   * @param turnChoice - 先攻/後攻選択（作成者のみ）
   * @param optionalCards - 追加カード（作成者のみ）
   */
  handleJoin(
    conn: Party.Connection,
    name: string,
    turnChoice?: "first" | "second" | "random",
    optionalCards?: CardId[]
  ): void {
    if (this.state.phase !== "waiting") {
      conn.send(JSON.stringify({ type: "error", message: "ゲームは既に開始されています" }));
      return;
    }
    if (Object.keys(this.state.players).length >= 2) {
      conn.send(JSON.stringify({ type: "error", message: "部屋が満員です" }));
      return;
    }

    // 最初のプレイヤー = ルーム作成者
    if (Object.keys(this.state.players).length === 0) {
      this.state.creatorId = conn.id;
      this.state.creatorTurnChoice = turnChoice ?? "random";
      if (optionalCards && optionalCards.length > 0) {
        this.state.optionalCards = optionalCards
          .slice(0, MAX_OPTIONAL_CARDS)
          .filter((id) => OPTIONAL_CARDS.includes(id));
      }
    }

    this.state.players[conn.id] = new Player(
      conn.id,
      name || `プレイヤー${Object.keys(this.state.players).length + 1}`,
      INITIAL_SOULS,
      INITIAL_SHIELDS,
    );

    conn.send(JSON.stringify({ type: "joined", playerId: conn.id }));
    this.broadcastState();
  }

  /**
   * プレイヤーのREADY状態を処理する。
   * 両プレイヤーがREADYになるとゲームが開始される。
   */
  handleReady(conn: Party.Connection): void {
    const player = this.state.players[conn.id];
    if (!player) return;

    player.setReady();

    const players = Object.values(this.state.players);
    if (players.length === 2 && players.every((p) => p.isReady)) {
      this.startGame();
    }

    this.broadcastState();
  }

  // ===========================================
  // ゲーム開始
  // ===========================================

  /**
   * ゲームを開始する。
   * デッキのシャッフル、手札配布、先攻決定を行う。
   */
  startGame(): void {
    // 基本デッキ + 選択されたオプションカード
    const deckCards = [...BASE_DECK, ...this.state.optionalCards];
    this.state.deck.init(deckCards);
    this.state.graveyard.clear();

    if (this.state.optionalCards.length > 0) {
      const cardNames = this.state.optionalCards.map((id) => CARD_DATA[id].name).join("、");
      this.logAction(`【追加カード】${cardNames}`);
    }

    const playerIds = Object.keys(this.state.players);
    for (const playerId of playerIds) {
      const player = this.state.players[playerId];
      player.hand.setCards(this.state.deck.draw(INITIAL_HAND_SIZE));
      player.field.clear();
      player.setSouls(INITIAL_SOULS);
      player.setShields(INITIAL_SHIELDS);
      player.consumeProtection();
    }

    this.state.shieldStock = INITIAL_SHIELD_STOCK;

    // 先攻決定
    if (this.state.creatorId && this.state.creatorId in this.state.players) {
      const opponentId = playerIds.find((id) => id !== this.state.creatorId)!;
      switch (this.state.creatorTurnChoice) {
        case "first":
          this.state.currentTurn = this.state.creatorId;
          break;
        case "second":
          this.state.currentTurn = opponentId;
          break;
        case "random":
        default:
          this.state.currentTurn = playerIds[Math.floor(Math.random() * 2)];
          break;
      }
    } else {
      this.state.currentTurn = playerIds[Math.floor(Math.random() * 2)];
    }

    this.state.turnNumber = 1;
    this.state.playsRemaining = FIRST_TURN_PLAYS;
    this.state.phase = "playing";
    this.state.pendingAction = null;

    this.broadcastState();
    this.startTurnTimer();
  }

  // ===========================================
  // カードプレイ
  // ===========================================

  /**
   * カードのプレイを処理する。
   *
   * 処理フロー:
   * 1. バリデーション（ターン、プレイ回数、カード所持）
   * 2. 打ち消し不可カード → 直接解決
   * 3. 相手にシールドあり → 打ち消し待機状態へ
   * 4. 相手にシールドなし → 直接解決
   *
   * @param conn - 送信元の接続
   * @param cardId - プレイするカードID
   * @param target - ターゲットのカードID（必要な場合）
   */
  handlePlay(conn: Party.Connection, cardId: CardId, target?: string): void {
    const player = this.state.players[conn.id];
    if (!player) return;
    if (this.state.currentTurn !== conn.id) return;
    if (this.state.playsRemaining <= 0) return;

    // 打ち消し待機中はプレイ不可
    if (this.state.pendingShield || this.state.pendingCounter) {
      conn.send(JSON.stringify({ type: "error", message: "打ち消し判定中です" }));
      return;
    }

    if (!player.hand.has(cardId)) return;

    const effect = CardEffects[cardId];
    if (!effect || !effect.canPlay(player, this.state)) {
      conn.send(JSON.stringify({ type: "error", message: "このカードは今プレイできません" }));
      return;
    }

    // カードクラスに直接プレイ可否を問い合わせ
    const cardInstance = CardRegistry.get(cardId);
    if (cardInstance && !cardInstance.canDirectPlay) {
      conn.send(JSON.stringify({ type: "error", message: `${cardInstance.name}は魔法カードでのみ召喚できます` }));
      return;
    }

    player.hand.remove(cardId);

    const opponent = Object.values(this.state.players).find((p) => p.id !== conn.id);
    const card = CARD_DATA[cardId];

    // カードクラスに打ち消し可否を問い合わせ
    if (cardInstance && !cardInstance.isCounterable) {
      this.logAction(`${player.name}が「${card.name}」をプレイ（打ち消し不可）`);
      this.resolveCard(conn.id, cardId, target);
    } else if (opponent && opponent.shields > 0) {
      // 相手にシールドがある → 打ち消し待機
      this.state.pendingShield = { by: conn.id, cardId, target };
      this.logAction(`${player.name}が「${card.name}」をプレイ`);
      this.pauseTurnTimer();
      this.broadcastState();
      this.startShieldTimer();
    } else {
      // 直接解決
      this.logAction(`${player.name}が「${card.name}」をプレイ`);
      this.resolveCard(conn.id, cardId, target);
    }
  }

  // ===========================================
  // シールド（打ち消し）処理
  // ===========================================

  /**
   * 打ち消しを処理する。
   * シールド1つを消費して相手のカードを無効化する。
   * 元のプレイヤーがシールド2以上あれば打ち消し返しが可能。
   */
  handleShield(conn: Party.Connection): void {
    const player = this.state.players[conn.id];
    if (!player || !this.state.pendingShield) return;
    if (this.state.pendingShield.by === conn.id) return;
    if (player.shields < 1) return;

    this.clearShieldTimer();
    this.actions.useShield(player, 1);

    const { by, cardId, target } = this.state.pendingShield;
    const originalPlayer = this.state.players[by];

    // 打ち消し返しの余地がない場合は即確定
    if (!originalPlayer || originalPlayer.shields < COUNTER_SHIELD_COST) {
      this.state.graveyard.add(cardId);
      this.state.pendingShield = null;
      this.state.playsRemaining -= 1;
      this.logAction(`${player.name}が「${CARD_DATA[cardId].name}」を打ち消した！`);
      this.broadcastState();
      this.resumeTurnTimer();
      return;
    }

    // 打ち消し返しの選択肢を提示
    this.state.pendingCounter = { by, cardId, target, shieldedBy: conn.id };
    this.state.pendingShield = null;
    this.logAction(
      `${player.name}が「${CARD_DATA[cardId].name}」を打ち消し！打ち消し返しますか？`
    );
    this.broadcastState();
    this.startShieldTimer();
  }

  /**
   * 打ち消しをパス（通す）する。
   * カード効果が解決される。
   */
  handlePassShield(conn: Party.Connection): void {
    if (!this.state.pendingShield) {
      this.broadcastState();
      return;
    }
    if (this.state.pendingShield.by === conn.id) return;

    this.clearShieldTimer();
    const { by, cardId, target } = this.state.pendingShield;
    this.resolveCard(by, cardId, target);
  }

  /**
   * 打ち消し返しを実行する。
   * シールド2つを消費して、打ち消しを無効化しカード効果を解決する。
   */
  handleShieldCounter(conn: Party.Connection): void {
    const player = this.state.players[conn.id];
    if (!player || !this.state.pendingCounter) return;
    if (this.state.pendingCounter.by !== conn.id) return;
    if (player.shields < COUNTER_SHIELD_COST) return;

    this.clearShieldTimer();
    this.actions.useShield(player, COUNTER_SHIELD_COST);

    const { by, cardId, target } = this.state.pendingCounter;
    this.state.pendingCounter = null;
    this.logAction(`${player.name}がうちけし返し！`);
    this.resolveCard(by, cardId, target);
  }

  /**
   * 打ち消し返しをパスする。
   * カードは墓地に送られ、効果は発動しない。
   */
  handlePassCounter(conn: Party.Connection): void {
    if (!this.state.pendingCounter) return;
    if (this.state.pendingCounter.by !== conn.id) return;

    this.clearShieldTimer();
    const { cardId } = this.state.pendingCounter;
    this.state.graveyard.add(cardId);
    this.state.pendingCounter = null;
    this.state.playsRemaining -= 1;
    this.logAction(`「${CARD_DATA[cardId].name}」が打ち消された`);
    this.broadcastState();
    this.resumeTurnTimer();
  }

  // ===========================================
  // カード効果解決
  // ===========================================

  /**
   * カード効果を解決（実行）する。
   * 打ち消し判定を通過した後に呼ばれる。
   *
   * @param playerId - カードをプレイしたプレイヤーのID
   * @param cardId - 解決するカードID
   * @param target - ターゲットのカードID
   */
  resolveCard(playerId: string, cardId: CardId, target?: string): void {
    const player = this.state.players[playerId];
    if (!player) return;

    const opponent = Object.values(this.state.players).find((p) => p.id !== playerId);
    if (!opponent) return;

    this.clearShieldTimer();
    this.state.pendingShield = null;
    this.state.playsRemaining -= 1;

    const card = CARD_DATA[cardId];
    const effect = CardEffects[cardId];

    effect.play(player, opponent, this.actions, target);
    // 後処理（墓地送り等）はカードクラスのexecute→afterExecuteで処理される

    this.checkWinCondition();
    this.broadcastState();

    // カード効果でpendingActionが設定された場合、タイマーを一時停止
    if (this.state.pendingAction) {
      this.pauseTurnTimer();
    } else {
      // pendingShield/Counter解決後はタイマーを再開
      this.resumeTurnTimer();
    }
  }

  // ===========================================
  // 選択ハンドラー
  // ===========================================

  /**
   * カード選択を処理する（神託・千里眼・冥界の門・冥府の手紙）。
   *
   * @param conn - 送信元の接続
   * @param cardId - 選択されたカードID
   */
  handleSelectCard(conn: Party.Connection, cardId: CardId): void {
    const player = this.state.players[conn.id];
    if (!player) return;

    const opponent = Object.values(this.state.players).find((p) => p.id !== conn.id);
    if (!opponent) return;

    const pending = this.state.pendingAction;
    if (!pending || pending.playerId !== conn.id) return;

    switch (pending.type) {
      case "selectFromDeck":
        if (this.actions.selectFromDeck(conn.id, cardId)) {
          this.logAction(`${player.name}が神託で山札からカードを得た`);
        }
        break;
      case "selectFromHand":
        if (this.actions.discardFromOpponentHand(conn.id, opponent.id, cardId)) {
          this.logAction(`${player.name}が相手の「${CARD_DATA[cardId].name}」を捨てさせた`);
        }
        break;
      case "selectFromDiscard":
        if (CARD_DATA[cardId].type === "summon") {
          if (this.actions.reviveFromDiscard(conn.id, cardId)) {
            this.logAction(`${player.name}が「${CARD_DATA[cardId].name}」を復活させた`);
          }
        } else {
          if (this.actions.retrieveFromDiscard(conn.id, cardId)) {
            this.logAction(`${player.name}が「${CARD_DATA[cardId].name}」を回収した`);
          }
        }
        break;
    }

    this.broadcastState();

    // pendingActionが解決されたらターンタイマーを再開
    if (!this.state.pendingAction) {
      this.resumeTurnTimer();
    }
  }

  /**
   * カード名宣言（真名看破）の結果を処理する。
   */
  handleGuessCard(conn: Party.Connection, cardId: CardId): void {
    const player = this.state.players[conn.id];
    if (!player) return;

    const opponent = Object.values(this.state.players).find((p) => p.id !== conn.id);
    if (!opponent) return;

    if (this.actions.guessCard(conn.id, opponent.id, cardId)) {
      this.logAction(`${player.name}が「${CARD_DATA[cardId].name}」を当てて奪った！`);
    } else {
      this.logAction(`${player.name}の真名看破は外れた...`);
    }

    this.broadcastState();

    // pendingActionが解決されたらターンタイマーを再開
    if (!this.state.pendingAction) {
      this.resumeTurnTimer();
    }
  }

  /**
   * 手札捨て選択を処理する（神々の糧・神酒で引いた後）。
   */
  handleDiscard(conn: Party.Connection, cardIds: CardId[]): void {
    const player = this.state.players[conn.id];
    if (!player) return;

    this.actions.discardCards(conn.id, cardIds);
    this.broadcastState();

    // pendingActionが解決されたらターンタイマーを再開
    if (!this.state.pendingAction) {
      this.resumeTurnTimer();
    }
  }

  // ===========================================
  // ターン処理
  // ===========================================

  /**
   * ターン終了の内部処理。
   *
   * 処理順序:
   * 1. 次のプレイヤーに切り替え
   * 2. ドロー（2ターン目以降）
   * 3. アスクレピオスの回復効果
   * 4. 場の召喚獣による自動攻撃
   * 5. 勝利判定
   *
   * @param playerId - ターンを終了するプレイヤーのID
   */
  doEndTurn(playerId: string): void {
    const player = this.state.players[playerId];
    if (!player) return;

    const playerIds = Object.keys(this.state.players);
    const currentIndex = playerIds.indexOf(playerId);
    const nextPlayerId = playerIds[(currentIndex + 1) % 2];

    this.state.currentTurn = nextPlayerId;
    this.state.turnNumber += 1;
    this.state.playsRemaining = BASE_PLAYS_PER_TURN;

    const nextPlayer = this.state.players[nextPlayerId];

    // 2ターン目以降にドロー
    if (this.state.turnNumber > 1) {
      this.actions.drawCards(nextPlayer, 1);
    }

    // アスクレピオスの毎ターン回復
    if (nextPlayer.field.has("asclepius" as CardId)) {
      const healed = nextPlayer.heal(1);
      if (healed > 0) {
        this.logAction(`${nextPlayer.name}のアスクレピオスがソウルを1回復`);
      }
    }

    // 場の召喚獣による攻撃
    const attackTarget = Object.values(this.state.players).find((p) => p.id !== nextPlayerId)!;
    for (const cardId of nextPlayer.field.cards) {
      const cardInstance = CardRegistry.get(cardId);
      if (cardInstance instanceof SummonCard && cardInstance.damage > 0) {
        this.logAction(`${nextPlayer.name}の${cardInstance.name}が攻撃！`);
        const isZeus = cardId === "zeus";
        const result = this.actions.dealDamage(attackTarget, nextPlayer, cardInstance.damage, isZeus);

        // 攻撃カットインイベントを全クライアントに送信
        if (result.reflected) {
          this.logAction(`→ メデューサが反射！`);
          this.broadcastRaw(
            JSON.stringify({
              type: "attack",
              card: cardId,
              damage: cardInstance.damage,
              isReflect: true,
            })
          );
        } else if (!result.blocked) {
          this.broadcastRaw(
            JSON.stringify({
              type: "attack",
              card: cardId,
              damage: cardInstance.damage,
            })
          );
        }
      }
    }

    this.checkWinCondition();
    this.broadcastState();

    // ゲームが終了していなければ次のターンのタイマーを開始
    if (this.state.phase === "playing") {
      this.startTurnTimer();
    }
  }

  /**
   * プレイヤーのターン終了要求を処理する。
   * 保留中のアクションがある場合はエラーを返す。
   */
  handleEndTurn(conn: Party.Connection): void {
    if (this.state.currentTurn !== conn.id) return;

    const player = this.state.players[conn.id];
    if (!player) return;

    // 保留中の処理がある場合はターン終了不可
    if (this.state.pendingShield || this.state.pendingCounter || this.state.pendingAction) {
      conn.send(JSON.stringify({ type: "error", message: "処理中です" }));
      return;
    }

    this.logAction(`${player.name}のターン終了`);
    this.doEndTurn(conn.id);
  }

  // ===========================================
  // 勝利判定
  // ===========================================

  /**
   * 勝利条件をチェックする。
   * いずれかのプレイヤーのソウルが0以下になったらゲーム終了。
   */
  checkWinCondition(): void {
    for (const player of Object.values(this.state.players)) {
      if (player.souls <= 0) {
        const winner = Object.values(this.state.players).find((p) => p.id !== player.id);
        this.state.winner = winner?.id || null;
        this.state.phase = "ended";

        // ゲーム終了時にタイマーをクリア
        this.clearTurnTimer();
        this.clearShieldTimer();
        this.turnTimeRemaining = 0;

        if (winner) {
          this.state.wins[winner.id] = (this.state.wins[winner.id] || 0) + 1;
          this.state.matchCount++;
        }
        return;
      }
    }
  }

  // ===========================================
  // 再戦
  // ===========================================

  /**
   * 再戦を処理する。
   * プレイヤー情報と戦績を保持しつつ、ゲーム状態をリセットする。
   */
  handleRematch(conn: Party.Connection): void {
    if (this.state.phase !== "ended") return;

    this.clearTurnTimer();
    this.clearShieldTimer();
    this.turnTimeRemaining = 0;

    const playerIds = Object.keys(this.state.players);
    const playerNames: Record<string, string> = {};
    for (const [id, player] of Object.entries(this.state.players)) {
      playerNames[id] = player.name;
    }
    const wins = { ...this.state.wins };
    const matchCount = this.state.matchCount;
    const creatorId = this.state.creatorId;
    const creatorTurnChoice = this.state.creatorTurnChoice;
    const optionalCards = [...this.state.optionalCards];

    // デッキを再シャッフル
    this.state.deck.init([...BASE_DECK, ...optionalCards]);
    this.state.graveyard.clear();
    this.state.currentTurn = null;
    this.state.turnNumber = 0;
    this.state.playsRemaining = 0;
    this.state.winner = null;
    this.state.shieldStock = INITIAL_SHIELD_STOCK;
    this.state.lastAction = null;
    this.state.actionLog = [];
    this.state.pendingShield = null;
    this.state.pendingCounter = null;
    this.state.pendingAction = null;
    this.state.wins = wins;
    this.state.matchCount = matchCount;
    this.state.creatorId = creatorId;
    this.state.creatorTurnChoice = creatorTurnChoice;
    this.state.optionalCards = optionalCards;

    // プレイヤーをリセット
    for (const playerId of playerIds) {
      this.state.players[playerId] = new Player(
        playerId,
        playerNames[playerId],
        INITIAL_SOULS,
        INITIAL_SHIELDS,
      );
    }

    this.state.phase = "waiting";
    this.logAction("=== 再戦準備 ===");
    this.broadcastState();
  }

  // ===========================================
  // 状態送信
  // ===========================================

  /**
   * クライアントに送信するための公開状態を生成する。
   * 相手プレイヤーの手札を隠蔽し、山札を枚数に変換する。
   *
   * @param forPlayerId - 送信先のプレイヤーID
   * @returns 秘匿情報が除去されたゲーム状態
   */
  getPublicState(forPlayerId: string): object {
    const publicPlayers: Record<string, object> = {};
    const isSoloMode = forPlayerId.includes("solo");

    for (const [id, player] of Object.entries(this.state.players)) {
      if (id === forPlayerId || isSoloMode) {
        publicPlayers[id] = player.toPrivateState();
      } else {
        publicPlayers[id] = player.toPublicState();
      }
    }

    return {
      phase: this.state.phase,
      players: publicPlayers,
      deck: this.state.deck.count,
      discard: this.state.graveyard.toArray(),
      currentTurn: this.state.currentTurn,
      turnNumber: this.state.turnNumber,
      playsRemaining: this.state.playsRemaining,
      winner: this.state.winner,
      shieldStock: this.state.shieldStock,
      lastAction: this.state.lastAction,
      actionLog: this.state.actionLog,
      pendingShield: this.state.pendingShield,
      pendingCounter: this.state.pendingCounter,
      pendingAction: this.state.pendingAction,
      creatorId: this.state.creatorId,
      creatorTurnChoice: this.state.creatorTurnChoice,
      optionalCards: this.state.optionalCards,
      wins: this.state.wins,
      matchCount: this.state.matchCount,
    };
  }

  /**
   * 全クライアントにゲーム状態を送信する。
   * 各クライアントにはそのプレイヤー用にフィルターされた状態が送信される。
   */
  broadcastState(): void {
    for (const conn of this.room.getConnections()) {
      conn.send(JSON.stringify({ type: "state", state: this.getPublicState(conn.id) }));
    }
  }

  /**
   * 全クライアントにメッセージをそのまま送信する（カットイン等）。
   *
   * @param message - 送信するJSONメッセージ文字列
   */
  broadcastRaw(message: string): void {
    for (const conn of this.room.getConnections()) {
      conn.send(message);
    }
  }

  /**
   * 特定のプレイヤーにメッセージを送信する。
   *
   * @param playerId - 送信先のプレイヤーID
   * @param message - 送信するメッセージオブジェクト
   */
  sendToPlayer(playerId: string, message: object): void {
    const conn = this.room.getConnection(playerId);
    if (conn) {
      conn.send(JSON.stringify(message));
    }
  }
}
