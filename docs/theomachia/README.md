# テオマキア（Theomachia）アーキテクチャ概要

## ゲーム概要

テオマキアは、ギリシャ神話をモチーフにした2人対戦カードゲーム。
WebSocket（PartyKit）を介したリアルタイム対戦と、ローカルソロモードに対応。

### 勝利条件
相手のソウル（HP=4）を0にする。

### ターンの流れ
1. 場の召喚獣が自動攻撃
2. 1枚ドロー（2ターン目以降）
3. カードを2枚までプレイ
4. ターン終了

---

## システム構成

```
┌──────────────────────────────────┐
│         クライアント (Next.js)       │
│  fugaapp/app/theomachia/          │
│                                    │
│  ┌─────────┐  ┌────────────────┐  │
│  │  Lobby   │  │  GameClient    │  │
│  │ (page)   │  │  ├ useGameConn │  │
│  └────┬─────┘  │  ├ useGameActs │  │
│       │        │  ├ WaitingRoom │  │
│       │        │  ├ GameResult  │  │
│       │        │  └ GamePlay    │  │
│       │        └────────────────┘  │
│       │                            │
│  ┌────┴──────────────────────────┐ │
│  │  lib/theomachia/              │ │
│  │  ├ cards/ (OOP, 個別ファイル)  │ │
│  │  ├ types.ts                   │ │
│  │  └ constants.ts               │ │
│  └───────────────────────────────┘ │
└──────────────┬───────────────────┘
               │ WebSocket (PartyKit)
┌──────────────┴───────────────────┐
│        サーバー (PartyKit)         │
│  theomachia/src/                  │
│  ├ server.ts    (メインサーバー)   │
│  ├ game-actions.ts (ゲーム操作)   │
│  ├ card-effects.ts (カード効果)   │
│  ├ cards.ts     (カードデータ)    │
│  ├ types.ts     (型定義)         │
│  └ utils.ts     (ユーティリティ)  │
└──────────────────────────────────┘
```

---

## フロントエンド構造

### ディレクトリ構成

```
fugaapp/
├── app/theomachia/
│   ├── page.tsx                 # ロビー（ルーム作成/参加）
│   ├── layout.tsx               # レイアウト（OGP, ビューポート）
│   ├── GameClient.tsx           # メインゲームUI
│   ├── SoloGameClient.tsx       # ソロモード
│   ├── hooks/
│   │   ├── useGameConnection.ts # WebSocket接続管理
│   │   └── useGameActions.ts    # ゲームアクション
│   └── components/
│       ├── Card.tsx             # カード表示 + モーダル群
│       ├── StatusGauge.tsx      # HP/シールド/アクションゲージ
│       ├── AttackCutin.tsx      # 攻撃カットインアニメ
│       ├── WaitingRoom.tsx      # 待機画面
│       └── GameResult.tsx       # 結果画面
├── lib/theomachia/
│   ├── cards/                   # カード定義（OOP）
│   │   ├── base.ts              # 抽象基底クラス
│   │   ├── index.ts             # レジストリ + 旧API互換
│   │   ├── zeus.ts              # ゼウス
│   │   ├── eris.ts              # エリス
│   │   ├── medusa.ts            # メデューサ
│   │   ├── keraunos.ts          # 雷霆
│   │   ├── ascension.ts         # 降臨
│   │   ├── necromancy.ts        # 冥界の門
│   │   ├── metamorphose.ts      # 変身の秘術
│   │   ├── tartarus.ts          # 奈落送り
│   │   ├── ambrosia.ts          # 神々の糧
│   │   ├── nectar.ts            # 神酒
│   │   ├── oracle.ts            # 神託
│   │   ├── hermes-letter.ts     # 冥府の手紙
│   │   ├── clairvoyance.ts      # 千里眼
│   │   ├── true-name.ts         # 真名看破
│   │   ├── aegis.ts             # 神盾
│   │   ├── godspeed.ts          # 神速
│   │   ├── asclepius.ts         # アスクレピオス (opt)
│   │   ├── piercing-arrow.ts    # 貫通の矢 (opt)
│   │   ├── equilibrium.ts       # 均衡 (opt)
│   │   ├── usurp.ts             # 簒奪 (opt)
│   │   ├── protection.ts        # 加護 (opt)
│   │   ├── blood-pact.ts        # 血の契約 (opt)
│   │   └── prayer.ts            # 祈り (opt)
│   ├── types.ts                 # 共有型定義
│   └── constants.ts             # ゲーム定数
└── docs/theomachia/
    └── README.md                # このファイル
```

### カスタムフック

#### `useGameConnection`
PartyKit WebSocket接続の管理を担当。
- ゲーム状態の受信・保持
- メッセージ送信
- 接続状態監視
- 各種モーダル制御のステート管理

#### `useGameActions`
ゲーム操作のロジックを担当。
- カードプレイ（確認UI含む）
- ターン終了
- 打ち消し
- 設定変更（先攻/後攻、オプションカード）

### コンポーネント

| コンポーネント | 役割 |
|---|---|
| `GameClient` | メインゲーム画面（3フェーズの分岐） |
| `WaitingRoom` | 待機画面（プレイヤー一覧、設定、READY） |
| `GameResult` | 結果画面（勝敗、戦績、リマッチ） |
| `Card` | カード表示（表面/裏面、サイズ3種） |
| `CardDetail` | カード詳細ポップアップ |
| `CardListModal` | カード選択モーダル（真名看破、神託） |
| `DiscardPileModal` | 捨て札閲覧/選択モーダル |
| `StatusGauge` | ステータスゲージ（HP/シールド/アクション） |
| `AttackCutin` | 攻撃カットインアニメーション |

---

## カードシステム（OOP設計）

### クラス階層

```
BaseCard (abstract)
├── SummonCard (abstract)
│   ├── ZeusCard      (damage: 4, summonOnly)
│   ├── ErisCard      (damage: 1)
│   ├── MedusaCard    (damage: 0, reflect)
│   └── AsclepiusCard (damage: 0, optional)
├── SpellCard (abstract)
│   ├── AscensionCard
│   ├── NecromancyCard
│   ├── MetamorphoseCard
│   ├── TartarusCard
│   └── EquilibriumCard (optional)
└── SkillCard (abstract)
    ├── KeraunosCard
    ├── AmbrosiaCard
    ├── NectarCard
    ├── OracleCard
    ├── HermesLetterCard
    ├── ClairvoyanceCard
    ├── TrueNameCard
    ├── AegisCard
    ├── GodspeedCard
    ├── PiercingArrowCard  (optional, unblockable)
    ├── UsurpCard          (optional)
    ├── ProtectionCard     (optional)
    ├── BloodPactCard      (optional)
    └── PrayerCard         (optional)
```

### 新しいカードの追加手順

1. `lib/theomachia/cards/` に新しいファイルを作成
2. 適切なサブクラスを継承
3. `cards/index.ts` の `ALL_CARD_INSTANCES` 配列にインスタンスを追加
4. サーバー側（`theomachia/src/`）にも対応するデータ・効果を追加

**例: 新しいスキルカード「聖火」を追加する場合**

```typescript
// lib/theomachia/cards/sacred-fire.ts
import { SkillCard } from "./base";

export class SacredFireCard extends SkillCard {
  constructor() {
    super({
      id: "sacredFire",
      name: "聖火",
      description: "相手に1ダメージ。自分のソウルを1回復。",
      color: "#FF8800",
      optional: true,
    });
  }
  get effect() { return "sacredFire"; }
}
```

```typescript
// cards/index.ts に追加
import { SacredFireCard } from "./sacred-fire";
// ALL_CARD_INSTANCES に追加:
new SacredFireCard(),
```

```typescript
// サーバー側: src/cards.ts + src/card-effects.ts に効果を追加
```

---

## バックエンド構造（PartyKit）

### ディレクトリ構成

```
theomachia/src/
├── server.ts         # メインサーバー（接続管理、メッセージルーティング）
├── game-actions.ts   # ゲーム基本操作（ドロー、ダメージ、シールド等）
├── card-effects.ts   # カード効果定義（各カードの振る舞い）
├── cards.ts          # カードデータ定義
├── types.ts          # サーバー側型定義＋定数
└── utils.ts          # ユーティリティ（shuffle等）
```

### クラス構造

#### `TheoMachiaServer` (server.ts)
PartyKitのメインサーバー。WebSocket接続管理とメッセージルーティングを担当。

#### `GameActions` (game-actions.ts)
ゲームの基本操作を提供。カード効果から呼び出される低レベルな操作を集約。

| メソッド | 説明 |
|---|---|
| `drawCards()` | 山札からカードを引く |
| `dealDamage()` | ダメージ処理（反射・加護判定含む） |
| `selfDamage()` | 自傷ダメージ |
| `gainShield()` / `useShield()` | シールド操作 |
| `summonToField()` / `removeFromField()` | 場操作 |
| `swapZeusAndEris()` | 変身の秘術 |
| `showDeck()` / `selectFromDeck()` | 神託 |
| `showOpponentHand()` | 千里眼 |
| `requestGuess()` / `guessCard()` | 真名看破 |
| `requestDiscard()` / `discardCards()` | 捨てカード選択 |

#### `CardEffects` (card-effects.ts)
各カードの振る舞いを定義するオブジェクト。カードIDをキーにして、
`canPlay`、`play`、`needsTarget` を持つ。

---

## 通信プロトコル

### クライアント → サーバー (`MessageToServer`)

| type | 説明 | パラメータ |
|---|---|---|
| `join` | ルーム参加 | name, turnChoice?, optionalCards? |
| `ready` | 準備完了 | - |
| `play` | カードプレイ | cardId, target? |
| `shield` | 打ち消し | - |
| `shieldCounter` | 打ち消し返し | - |
| `passShield` | 打ち消しパス | - |
| `passCounter` | 打ち消し返しパス | - |
| `discard` | 捨てカード選択確定 | cardIds[] |
| `selectCard` | カード選択（神託/千里眼） | cardId |
| `guessCard` | カード名宣言 | cardId |
| `endTurn` | ターン終了 | - |
| `rematch` | リマッチ要求 | - |

### サーバー → クライアント (`MessageFromServer`)

| type | 説明 | データ |
|---|---|---|
| `state` | ゲーム状態更新 | state |
| `joined` | 参加成功 | playerId |
| `error` | エラー | message |
| `showOpponentHand` | 千里眼用手札公開 | hand[] |
| `showDeck` | 神託用山札公開 | deck[] |
| `requestDiscard` | 捨てカード要求 | count |
| `requestTarget` | ターゲット選択要求 | targetType |
| `requestGuess` | カード名宣言要求 | - |
| `peekHand` | 手札公開（閲覧のみ） | hand[], message |
| `attack` | 攻撃カットイン | card, damage, isReflect? |

---

## ゲーム定数 (constants.ts)

| 定数 | 値 | 説明 |
|---|---|---|
| `INITIAL_SOULS` | 4 | 初期HP |
| `MAX_SOULS` | 4 | 最大HP |
| `INITIAL_SHIELDS` | 2 | 初期シールド |
| `MAX_SHIELDS` | 3 | 最大シールド |
| `INITIAL_SHIELD_STOCK` | 2 | シールドストック初期値 |
| `INITIAL_HAND_SIZE` | 5 | 初期手札枚数 |
| `BASE_PLAYS_PER_TURN` | 2 | 1ターンのプレイ回数 |
| `FIRST_TURN_PLAYS` | 1 | 1ターン目のプレイ回数 |
| `COUNTER_SHIELD_COST` | 2 | 打ち消し返しのコスト |
| `MAX_OPTIONAL_CARDS` | 4 | 追加カード最大枚数 |

---

## デプロイ

### フロントエンド (Next.js → Vercel)
```bash
cd /home/fuga/fugaapp
vercel --prod
```

### バックエンド (PartyKit)
```bash
cd /home/fuga/theomachia
npx partykit deploy
```

### API ドキュメント生成 (TypeDoc)
```bash
cd /home/fuga/fugaapp
npx typedoc --entryPoints lib/theomachia/cards/index.ts lib/theomachia/types.ts lib/theomachia/constants.ts --out docs/theomachia/api
```
