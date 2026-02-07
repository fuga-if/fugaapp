/**
 * @module theomachia/components/Card
 * @description カード表示関連のコンポーネント群。
 * カード単体の表示、詳細ポップアップ、カード選択モーダル、捨て札モーダルを含む。
 */

"use client";

import { useState } from "react";
import { CARDS, TYPE_COLORS, type CardId } from "@/lib/theomachia/cards";
import Image from "next/image";

/** Card コンポーネントのプロパティ */
interface CardProps {
  /** 表示するカードID。"hidden" の場合は裏面を表示 */
  cardId: CardId | "hidden";
  /** カードサイズ（sm: 56×78, md: 72×100, lg: 140×196） */
  size?: "sm" | "md" | "lg";
  /** クリック時のコールバック */
  onClick?: () => void;
  /** 選択状態（ゴールド枠で強調表示） */
  selected?: boolean;
  /** 無効状態（半透明、クリック不可） */
  disabled?: boolean;
}

const SIZES = {
  sm: { width: 56, height: 78, nameSize: 8, iconSize: 14 },
  md: { width: 72, height: 100, nameSize: 9, iconSize: 18 },
  lg: { width: 140, height: 196, nameSize: 13, iconSize: 28 },
};

// カードID → 画像ファイル名マッピング
const CARD_IMAGES: Record<string, string> = {
  zeus: "zeus",
  eris: "eris",
  medusa: "medusa",
  keraunos: "thunderbolt",
  ascension: "descent",
  necromancy: "gate",
  metamorphose: "metamorphosis",
  tartarus: "tartarus",
  ambrosia: "ambrosia",
  nectar: "nectar",
  oracle: "oracle",
  hermesLetter: "letter",
  clairvoyance: "clairvoyance",
  trueName: "truename",
  aegis: "aegis",
  godspeed: "speed",
};

// タイプアイコン
const TYPE_ICONS: Record<string, string> = {
  summon: "",
  spell: "",
  skill: "",
};

/**
 * カード画像コンポーネント（フォールバック付き）。
 * 画像が404の場合、カード名+タイプ色グラデーションのフォールバックを表示する。
 */
function CardImage({ imageName, cardName, cardColor, width, nameSize }: {
  imageName: string;
  cardName: string;
  cardColor: string;
  width: number;
  nameSize: number;
}) {
  const [imgError, setImgError] = useState(false);

  if (imgError) {
    return (
      <div style={{
        position: "absolute",
        inset: 0,
        background: `linear-gradient(180deg, ${cardColor || '#333'}40 0%, ${cardColor || '#333'}80 50%, #0a0a0f 100%)`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 8,
      }}>
        <span style={{
          color: cardColor || '#C9A227',
          fontSize: nameSize * 1.5,
          fontWeight: 900,
          textAlign: "center",
          textShadow: "0 2px 8px rgba(0,0,0,0.8)",
        }}>
          {cardName}
        </span>
      </div>
    );
  }

  return (
    <Image
      src={`/theomachia/cards/${imageName}.webp`}
      alt={cardName}
      fill
      style={{ objectFit: "cover" }}
      sizes={`${width}px`}
      onError={() => setImgError(true)}
    />
  );
}

/**
 * カード表示コンポーネント。
 * カード画像、名前、タイプアイコンを表示する。裏面表示にも対応。
 *
 * @param props - コンポーネントプロパティ
 *
 * @example
 * ```tsx
 * <Card cardId="zeus" size="lg" onClick={() => selectCard("zeus")} selected={true} />
 * <Card cardId="hidden" size="sm" /> // 裏面
 * ```
 */
export function Card({ cardId, size = "md", onClick, selected, disabled }: CardProps) {
  const s = SIZES[size];
  
  // 裏面
  if (cardId === "hidden") {
    return (
      <div
        style={{
          width: s.width,
          height: s.height,
          background: "linear-gradient(135deg, #1a1a3e 0%, #2d2d5a 50%, #1a1a3e 100%)",
          borderRadius: 8,
          border: "2px solid #4a4a8a",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
        }}
      >
        <div
          style={{
            width: "60%",
            height: "60%",
            background: "radial-gradient(circle, #3a3a7a 0%, #2a2a5a 100%)",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "2px solid #5a5a9a",
          }}
        >
          <span style={{ fontSize: s.iconSize * 1.2, filter: "drop-shadow(0 0 4px #6a6aba)" }}></span>
        </div>
      </div>
    );
  }

  const card = CARDS[cardId];
  const typeColor = TYPE_COLORS[card.type];
  const imageName = CARD_IMAGES[cardId] || cardId;
  const typeIcon = TYPE_ICONS[card.type];

  return (
    <div
      data-card={cardId}
      data-type={card.type}
      onClick={disabled ? undefined : onClick}
      style={{
        width: s.width,
        height: s.height,
        minWidth: s.width,
        borderRadius: 6,
        border: `2px solid ${selected ? "#FFD700" : typeColor}`,
        boxShadow: selected
          ? `0 0 20px ${typeColor}80, 0 4px 12px rgba(0,0,0,0.4)`
          : "0 4px 12px rgba(0,0,0,0.3)",
        cursor: disabled ? "not-allowed" : onClick ? "pointer" : "default",
        opacity: disabled ? 0.5 : 1,
        transition: "all 0.15s ease",
        overflow: "hidden",
        position: "relative",
        flexShrink: 0,
      }}
    >
      {/* カード画像 */}
      <CardImage imageName={imageName} cardName={card.name} cardColor={card.color} width={s.width} nameSize={s.nameSize} />
      
      {/* 上部グラデーション（名前用） */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "30%",
          background: "linear-gradient(180deg, rgba(0,0,0,0.7) 0%, transparent 100%)",
          pointerEvents: "none",
        }}
      />
      
      {/* カード名 */}
      <div
        style={{
          position: "absolute",
          top: 4,
          left: 0,
          right: 0,
          textAlign: "center",
          pointerEvents: "none",
        }}
      >
        <span
          style={{
            color: "#fff",
            fontSize: s.nameSize,
            fontWeight: 700,
            textShadow: "0 1px 3px rgba(0,0,0,0.9), 0 0 8px rgba(0,0,0,0.5)",
            letterSpacing: 1,
          }}
        >
          {card.name}
        </span>
      </div>

      {/* 反射アイコン（メデューサ） */}
      {"reflect" in card && card.reflect && (
        <div
          style={{
            position: "absolute",
            bottom: 4,
            left: 4,
            width: s.iconSize,
            height: s.iconSize,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #33CC33, #228822)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "1px solid rgba(255,255,255,0.3)",
            boxShadow: "0 2px 4px rgba(0,0,0,0.4)",
            pointerEvents: "none",
          }}
        >
          <span style={{ fontSize: s.iconSize * 0.6 }}></span>
        </div>
      )}

    </div>
  );
}

/**
 * カード詳細ポップアップコンポーネント。
 * カードの大きな画像、名前、タイプ、説明文、ダメージを表示する。
 *
 * @param props.cardId - 表示するカードID
 * @param props.onClose - 閉じるコールバック
 */
export function CardDetail({ cardId, onClose }: { cardId: CardId; onClose: () => void }) {
  const card = CARDS[cardId];
  const typeColor = TYPE_COLORS[card.type];
  const imageName = CARD_IMAGES[cardId] || cardId;
  const typeIcon = TYPE_ICONS[card.type];

  const typeNames: Record<string, string> = {
    summon: "召喚",
    spell: "儀式",
    skill: "スキル",
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.85)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: 20,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 16,
          maxWidth: 300,
        }}
      >
        {/* 大きいカード画像 */}
        <div
          style={{
            width: 200,
            height: 280,
            borderRadius: 12,
            border: `3px solid ${typeColor}`,
            boxShadow: `0 0 30px ${typeColor}60`,
            overflow: "hidden",
            position: "relative",
          }}
        >
          <CardImage imageName={imageName} cardName={card.name} cardColor={card.color} width={200} nameSize={20} />
        </div>

        {/* カード情報 */}
        <div
          style={{
            background: "rgba(20,20,40,0.95)",
            borderRadius: 12,
            padding: 16,
            width: "100%",
            border: `1px solid ${typeColor}60`,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <span style={{ fontSize: 20 }}>{typeIcon}</span>
            <span style={{ color: typeColor, fontSize: 12, fontWeight: 600 }}>
              {typeNames[card.type]}
            </span>
          </div>
          
          <h3 style={{ color: "#fff", fontSize: 20, margin: "0 0 12px", fontWeight: 700 }}>
            {card.name}
          </h3>
          
          <p style={{ color: "#aaa", fontSize: 14, lineHeight: 1.6, margin: 0 }}>
            {card.description}
          </p>

          {"damage" in card && card.damage && (
            <div style={{ marginTop: 12, color: "#FF6B6B", fontWeight: 600 }}>
              ダメージ: {card.damage}
            </div>
          )}
        </div>

        <button
          onClick={onClose}
          style={{
            padding: "10px 32px",
            background: "rgba(255,255,255,0.1)",
            border: "1px solid rgba(255,255,255,0.2)",
            borderRadius: 8,
            color: "#fff",
            fontSize: 14,
            cursor: "pointer",
          }}
        >
          閉じる
        </button>
      </div>
    </div>
  );
}

/**
 * カード一覧モーダルコンポーネント（カード選択用）。
 * 真名看破のカード名宣言、神託の山札選択などに使用される。
 * 長押しでカード効果の確認が可能。
 */
export function CardListModal({
  title,
  onSelect,
  onClose,
  filterType,
  cards,
}: {
  title: string;
  onSelect: (cardId: CardId) => void;
  onClose: () => void;
  filterType?: "summon" | "spell" | "skill";
  cards?: CardId[];  // 指定されたカードのみ表示（指定なしなら全カード）
}) {
  const [selectedDetail, setSelectedDetail] = useState<CardId | null>(null);
  
  const allCards = cards 
    ? cards.map(id => [id, CARDS[id]] as [string, typeof CARDS[CardId]])
    : Object.entries(CARDS).filter(
        ([, card]) => !filterType || card.type === filterType
      );

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.9)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: 20,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "rgba(20,20,40,0.95)",
          borderRadius: 12,
          padding: 20,
          maxWidth: 400,
          maxHeight: "80vh",
          overflow: "auto",
        }}
      >
        <h3 style={{ color: "#fff", marginTop: 0, marginBottom: 16, textAlign: "center" }}>
          {title}
        </h3>
        
        {/* 選択中カードの説明 */}
        {selectedDetail && (
          <div style={{ 
            background: "rgba(0, 191, 255, 0.1)", 
            padding: 12, 
            borderRadius: 8, 
            marginBottom: 12,
            border: "1px solid #00BFFF"
          }}>
            <p style={{ color: "#00BFFF", fontWeight: "bold", margin: "0 0 4px 0", fontSize: 14 }}>
              {CARDS[selectedDetail].name}
            </p>
            <p style={{ color: "#ccc", margin: 0, fontSize: 12 }}>
              {CARDS[selectedDetail].description}
            </p>
          </div>
        )}
        
        <p style={{ color: "#666", fontSize: 10, textAlign: "center", margin: "0 0 8px 0" }}>
          タップで選択 / 長押しで効果確認
        </p>
        
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 8,
          }}
        >
          {allCards.map(([id, card]) => (
            <div
              key={id}
              onClick={() => onSelect(id as CardId)}
              onContextMenu={(e) => {
                e.preventDefault();
                setSelectedDetail(id as CardId);
              }}
              onTouchStart={() => {
                const timer = setTimeout(() => setSelectedDetail(id as CardId), 500);
                (window as unknown as { __cardTimer?: NodeJS.Timeout }).__cardTimer = timer;
              }}
              onTouchEnd={() => {
                const timer = (window as unknown as { __cardTimer?: NodeJS.Timeout }).__cardTimer;
                if (timer) clearTimeout(timer);
              }}
              style={{
                cursor: "pointer",
                border: selectedDetail === id ? "3px solid #00BFFF" : "3px solid transparent",
                borderRadius: 6,
              }}
            >
              <Card cardId={id as CardId} size="sm" />
            </div>
          ))}
        </div>
        <button
          onClick={onClose}
          style={{
            marginTop: 16,
            width: "100%",
            padding: "10px",
            background: "rgba(255,255,255,0.1)",
            border: "1px solid rgba(255,255,255,0.2)",
            borderRadius: 8,
            color: "#fff",
            cursor: "pointer",
          }}
        >
          キャンセル
        </button>
      </div>
    </div>
  );
}

/**
 * 捨て札（墓地）モーダルコンポーネント。
 * 墓地の閲覧や、冥界の門/冥府の手紙でのカード選択に使用される。
 */
export function DiscardPileModal({
  discard,
  onClose,
  onSelect,
  filterType,
  title,
}: {
  discard: CardId[];
  onClose: () => void;
  onSelect?: (cardId: CardId) => void;
  filterType?: "summon" | "all";
  title?: string;
}) {
  const [selectedDetail, setSelectedDetail] = useState<CardId | null>(null);
  
  const filteredDiscard = filterType === "summon"
    ? discard.filter((id) => CARDS[id].type === "summon")
    : discard;

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.9)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: 20,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "rgba(20,20,40,0.95)",
          borderRadius: 12,
          padding: 20,
          maxWidth: 400,
          maxHeight: "80vh",
          overflow: "auto",
        }}
      >
        <h3 style={{ color: "#fff", marginTop: 0, marginBottom: 16, textAlign: "center" }}>
          {title || `捨て札 (${filteredDiscard.length}枚)`}
        </h3>
        
        {/* 選択中カードの説明 */}
        {selectedDetail && (
          <div style={{ 
            background: "rgba(0, 191, 255, 0.1)", 
            padding: 12, 
            borderRadius: 8, 
            marginBottom: 12,
            border: "1px solid #00BFFF"
          }}>
            <p style={{ color: "#00BFFF", fontWeight: "bold", margin: "0 0 4px 0", fontSize: 14 }}>
              {CARDS[selectedDetail].name}
            </p>
            <p style={{ color: "#ccc", margin: 0, fontSize: 12 }}>
              {CARDS[selectedDetail].description}
            </p>
          </div>
        )}
        
        {onSelect && (
          <p style={{ color: "#666", fontSize: 10, textAlign: "center", margin: "0 0 8px 0" }}>
            タップで選択 / 長押しで効果確認
          </p>
        )}
        
        {filteredDiscard.length === 0 ? (
          <p style={{ color: "#888", textAlign: "center" }}>捨て札はありません</p>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: 8,
            }}
          >
            {filteredDiscard.map((cardId, i) => (
              <div
                key={`${cardId}-${i}`}
                onClick={() => onSelect?.(cardId)}
                onContextMenu={(e) => {
                  e.preventDefault();
                  setSelectedDetail(cardId);
                }}
                onTouchStart={() => {
                  const timer = setTimeout(() => setSelectedDetail(cardId), 500);
                  (window as unknown as { __cardTimer?: NodeJS.Timeout }).__cardTimer = timer;
                }}
                onTouchEnd={() => {
                  const timer = (window as unknown as { __cardTimer?: NodeJS.Timeout }).__cardTimer;
                  if (timer) clearTimeout(timer);
                }}
                style={{
                  cursor: onSelect ? "pointer" : "default",
                  border: selectedDetail === cardId ? "3px solid #00BFFF" : "3px solid transparent",
                  borderRadius: 6,
                }}
              >
                <Card cardId={cardId} size="sm" />
              </div>
            ))}
          </div>
        )}
        <button
          onClick={onClose}
          style={{
            marginTop: 16,
            width: "100%",
            padding: "10px",
            background: "rgba(255,255,255,0.1)",
            border: "1px solid rgba(255,255,255,0.2)",
            borderRadius: 8,
            color: "#fff",
            cursor: "pointer",
          }}
        >
          閉じる
        </button>
      </div>
    </div>
  );
}
