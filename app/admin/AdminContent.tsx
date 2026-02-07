"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

// Diagnosis data with result types for admin preview
interface DiagnosisPreview {
  slug: string;
  title: string;
  emoji: string;
  category?: string;
  resultType: "score" | "multi-type" | "single-type";
  // For score-based: the score values that trigger each result
  scoreResults?: { label: string; score: number }[];
  // For multi-type: the type keys
  typeKeys?: string[];
  // For single-type: the type values
  typeValues?: string[];
  // Result titles mapped by key
  resultTitles?: Record<string, string>;
}

const diagnosisData: DiagnosisPreview[] = [
  {
    slug: "menhera",
    title: "メンヘラ度診断",
    emoji: "🖤",
    resultType: "score",
    scoreResults: [
      { label: "メンタル鋼鉄タイプ (0%)", score: 10 },
      { label: "ちょっぴり寂しがりやさん (25%)", score: 20 },
      { label: "隠れメンヘラ (50%)", score: 25 },
      { label: "ガチメンヘラ予備軍 (75%)", score: 32 },
      { label: "メンヘラの極み (100%)", score: 40 },
    ],
  },
  {
    slug: "oshi",
    title: "推し活スタイル診断",
    emoji: "💖",
    resultType: "multi-type",
    typeKeys: ["kakin-senshi", "genba-shijou", "sousaku-numa", "data-chuu", "fukyou-shi", "seikan-sei"],
    resultTitles: {
      "kakin-senshi": "課金戦士",
      "genba-shijou": "現場至上主義",
      "sousaku-numa": "創作沼",
      "data-chuu": "データ厨",
      "fukyou-shi": "布教師",
      "seikan-sei": "静観勢",
    },
  },
  {
    slug: "tanto-fan-oshi",
    title: "担当/ファン/推し診断",
    emoji: "💜",
    resultType: "multi-type",
    typeKeys: ["tanto", "fan", "oshi"],
    resultTitles: {
      tanto: "担当",
      fan: "ファン",
      oshi: "推し",
    },
  },
  {
    slug: "vtuber",
    title: "Vtuberオタクタイプ診断",
    emoji: "📺",
    resultType: "multi-type",
    typeKeys: ["gachi-koi", "hako-oshi", "archive", "shokunin", "teetee", "kosan"],
    resultTitles: {
      "gachi-koi": "ガチ恋勢",
      "hako-oshi": "箱推し勢",
      archive: "アーカイブ勢",
      shokunin: "職人勢",
      teetee: "てぇてぇ勢",
      kosan: "古参勢",
    },
  },
  {
    slug: "gacha",
    title: "ソシャゲ課金スタイル診断",
    emoji: "💰",
    resultType: "multi-type",
    typeKeys: ["tenjou-kyouto", "shoudou-kakin", "bi-kakin", "mu-kakin", "gentei-killer", "hai-kakin"],
    resultTitles: {
      "tenjou-kyouto": "天井教徒",
      "shoudou-kakin": "衝動課金",
      "bi-kakin": "微課金",
      "mu-kakin": "無課金",
      "gentei-killer": "限定キラー",
      "hai-kakin": "廃課金",
    },
  },
  {
    slug: "sns-fatigue",
    title: "SNS疲れタイプ診断",
    emoji: "😵",
    resultType: "single-type",
    typeValues: ["A", "B", "C", "D", "E", "F"],
    resultTitles: {
      A: "比較疲れタイプ",
      B: "情報過多タイプ",
      C: "承認欲求タイプ",
      D: "人間関係疲れ",
      E: "FOMO型",
      F: "デジタル中毒型",
    },
  },
  {
    slug: "otaku-kakuredo",
    title: "オタクの隠れ度診断",
    emoji: "🥷",
    resultType: "multi-type",
    typeKeys: ["type-a", "type-b", "type-c", "type-d", "type-e", "type-f"],
    resultTitles: {
      "type-a": "完全隠密型",
      "type-b": "チラ見せ型",
      "type-c": "仲間内オープン型",
      "type-d": "TPO切替型",
      "type-e": "ほぼオープン型",
      "type-f": "全開型",
    },
  },
  {
    slug: "commu-ryoku",
    title: "オタクコミュ力診断",
    emoji: "🗣️",
    resultType: "score",
    scoreResults: [
      { label: "コミュ力カンスト型", score: 30 },
      { label: "社交上手型", score: 24 },
      { label: "普通に話せる型", score: 18 },
      { label: "人見知り型", score: 12 },
      { label: "コミュ障型", score: 6 },
      { label: "ぼっち極振り型", score: 0 },
    ],
  },
  {
    slug: "gamer-type",
    title: "ゲーマータイプ診断",
    emoji: "🎮",
    resultType: "multi-type",
    typeKeys: ["gachi", "enjoy", "story", "collector", "streamer", "numa"],
    resultTitles: {
      gachi: "ガチ勢",
      enjoy: "エンジョイ勢",
      story: "ストーリー重視",
      collector: "コレクター",
      streamer: "配信者タイプ",
      numa: "沼落ちタイプ",
    },
  },
  {
    slug: "sanzai-type",
    title: "オタク散財タイプ診断",
    emoji: "💸",
    resultType: "multi-type",
    typeKeys: ["goods", "ensei", "gacha", "doujin", "superchat", "collab"],
    resultTitles: {
      goods: "グッズ散財",
      ensei: "遠征散財",
      gacha: "ガチャ散財",
      doujin: "同人散財",
      superchat: "スパチャ散財",
      collab: "コラボ散財",
    },
  },
  {
    slug: "yoru-gata",
    title: "夜型オタク診断",
    emoji: "🌙",
    resultType: "multi-type",
    typeKeys: ["anime-ikki", "game-shuukai", "sousaku-engine", "sns-junkai", "kousatsu-fukabori", "kyomu-yofukashi"],
    resultTitles: {
      "anime-ikki": "アニメ一気見型",
      "game-shuukai": "ゲーム終会型",
      "sousaku-engine": "創作エンジン型",
      "sns-junkai": "SNS巡回型",
      "kousatsu-fukabori": "考察深掘り型",
      "kyomu-yofukashi": "虚無夜更かし型",
    },
  },
  {
    slug: "yami-zokusei",
    title: "闇属性診断",
    emoji: "⚔️",
    resultType: "multi-type",
    typeKeys: ["shikkoku-yami", "souen-gouka", "itetsuku-hyouga", "shiden-raikou", "seinaru-hikari", "kyomu-kaze"],
    resultTitles: {
      "shikkoku-yami": "漆黒の闇",
      "souen-gouka": "蒼炎の業火",
      "itetsuku-hyouga": "凍てつく氷河",
      "shiden-raikou": "紫電の雷光",
      "seinaru-hikari": "聖なる光",
      "kyomu-kaze": "虚無の風",
    },
  },
  {
    slug: "neko-inu",
    title: "猫派犬派深層診断",
    emoji: "🐱",
    resultType: "multi-type",
    typeKeys: ["type-a", "type-b", "type-c", "type-d", "type-e", "type-f"],
    resultTitles: {
      "type-a": "完全猫派",
      "type-b": "やや猫派",
      "type-c": "猫寄りどちらも",
      "type-d": "犬寄りどちらも",
      "type-e": "やや犬派",
      "type-f": "完全犬派",
    },
  },
  {
    slug: "inkya-youkya",
    title: "陰キャ陽キャスペクトラム診断",
    emoji: "🌓",
    resultType: "multi-type",
    typeKeys: ["type-a", "type-b", "type-c", "type-d", "type-e", "type-f"],
    resultTitles: {
      "type-a": "完全陽キャ",
      "type-b": "陽キャ寄り",
      "type-c": "やや陽キャ",
      "type-d": "やや陰キャ",
      "type-e": "陰キャ寄り",
      "type-f": "完全陰キャ",
    },
  },
  {
    slug: "shikou-type",
    title: "思考タイプ診断",
    emoji: "🧠",
    resultType: "multi-type",
    typeKeys: ["type-a", "type-b", "type-c", "type-d", "type-e", "type-f"],
    resultTitles: {
      "type-a": "論理分析型",
      "type-b": "直感ひらめき型",
      "type-c": "共感重視型",
      "type-d": "実践行動型",
      "type-e": "俯瞰思考型",
      "type-f": "創造発想型",
    },
  },
  {
    slug: "sumaho-izon",
    title: "スマホ依存タイプ診断",
    emoji: "📱",
    resultType: "multi-type",
    typeKeys: ["type-a", "type-b", "type-c", "type-d", "type-e", "type-f"],
    resultTitles: {
      "type-a": "SNS依存型",
      "type-b": "動画沼型",
      "type-c": "ゲーム廃人型",
      "type-d": "情報中毒型",
      "type-e": "コミュニケーション依存",
      "type-f": "なんとなく触る型",
    },
  },
  {
    slug: "motivation",
    title: "モチベーション源泉診断",
    emoji: "⚡",
    resultType: "multi-type",
    typeKeys: ["type-a", "type-b", "type-c", "type-d", "type-e", "type-f"],
    resultTitles: {
      "type-a": "承認欲求型",
      "type-b": "成長実感型",
      "type-c": "競争勝利型",
      "type-d": "貢献使命型",
      "type-e": "自由探求型",
      "type-f": "安定安心型",
    },
  },
  {
    slug: "stress-taisho",
    title: "ストレス対処法タイプ診断",
    emoji: "🌿",
    resultType: "multi-type",
    typeKeys: ["type-a", "type-b", "type-c", "type-d", "type-e", "type-f"],
    resultTitles: {
      "type-a": "運動発散型",
      "type-b": "没頭逃避型",
      "type-c": "人に話す型",
      "type-d": "寝て忘れる型",
      "type-e": "分析解決型",
      "type-f": "我慢蓄積型",
    },
  },
  {
    slug: "renai-brain",
    title: "恋愛脳レベル診断",
    emoji: "💘",
    resultType: "multi-type",
    typeKeys: ["type-a", "type-b", "type-c", "type-d", "type-e", "type-f"],
    resultTitles: {
      "type-a": "恋愛脳MAX型",
      "type-b": "ロマンチスト型",
      "type-c": "バランス型",
      "type-d": "理性優位型",
      "type-e": "クール型",
      "type-f": "恋愛無関心型",
    },
  },
  {
    slug: "commu-style",
    title: "コミュニケーションスタイル診断",
    emoji: "💬",
    resultType: "multi-type",
    typeKeys: ["type-a", "type-b", "type-c", "type-d", "type-e", "type-f"],
    resultTitles: {
      "type-a": "共感マスター",
      "type-b": "ムードメーカー",
      "type-c": "的確アドバイザー",
      "type-d": "気配り調整役",
      "type-e": "独自路線クリエイター",
      "type-f": "静かな信頼構築型",
    },
  },
];

function generateResultUrl(diag: DiagnosisPreview, targetKey: string): string {
  const base = `/${diag.slug}/result`;

  if (diag.resultType === "score") {
    const scoreResult = diag.scoreResults?.find((r) => r.label === targetKey);
    return `${base}?score=${scoreResult?.score ?? 0}`;
  }

  if (diag.resultType === "single-type") {
    return `${base}?type=${targetKey}`;
  }

  // multi-type: set target key to 30, others to 0
  if (diag.typeKeys) {
    const params = diag.typeKeys.map((k) => `${k}=${k === targetKey ? 30 : 0}`).join("&");
    return `${base}?${params}`;
  }

  return base;
}

function generateOgpUrl(diag: DiagnosisPreview, targetKey: string): string {
  if (diag.resultType === "score") {
    const scoreResult = diag.scoreResults?.find((r) => r.label === targetKey);
    return `/api/og/${diag.slug}?score=${scoreResult?.score ?? 0}`;
  }
  if (diag.resultType === "single-type") {
    return `/api/og/${diag.slug}?type=${targetKey}`;
  }
  return `/api/og/${diag.slug}?type=${targetKey}`;
}

interface Props {
  needSetCookie: boolean;
  adminKey: string;
}

export default function AdminContent({ needSetCookie, adminKey }: Props) {
  const [expandedSlug, setExpandedSlug] = useState<string | null>(null);

  useEffect(() => {
    if (needSetCookie) {
      document.cookie = `admin_key=${adminKey}; path=/; max-age=${60 * 60 * 24}; SameSite=Lax`;
    }
  }, [needSetCookie, adminKey]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-gray-800">🔧 Admin - 診断結果プレビュー</h1>
          <Link href="/" className="text-sm text-purple-500 hover:underline">← サイトに戻る</Link>
        </div>

        <div className="space-y-4">
          {diagnosisData.map((diag) => {
            const isExpanded = expandedSlug === diag.slug;
            const resultKeys =
              diag.resultType === "score"
                ? diag.scoreResults?.map((r) => r.label) ?? []
                : diag.resultType === "single-type"
                  ? diag.typeValues ?? []
                  : diag.typeKeys ?? [];

            return (
              <div key={diag.slug} className="bg-white rounded-lg shadow-sm border border-gray-200">
                <button
                  onClick={() => setExpandedSlug(isExpanded ? null : diag.slug)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{diag.emoji}</span>
                    <div>
                      <span className="font-bold text-gray-800">{diag.title}</span>
                      <span className="ml-2 text-xs text-gray-400">/{diag.slug}</span>
                    </div>
                    <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded">
                      {resultKeys.length}タイプ
                    </span>
                  </div>
                  <span className="text-gray-400">{isExpanded ? "▲" : "▼"}</span>
                </button>

                {isExpanded && (
                  <div className="px-6 pb-4 border-t border-gray-100">
                    <table className="w-full mt-3 text-sm">
                      <thead>
                        <tr className="text-left text-gray-500 border-b">
                          <th className="py-2 pr-4">タイプ</th>
                          <th className="py-2 pr-4">結果ページ</th>
                          <th className="py-2">OGP画像</th>
                        </tr>
                      </thead>
                      <tbody>
                        {resultKeys.map((key) => {
                          const title = diag.resultTitles?.[key] ?? key;
                          const resultUrl = generateResultUrl(diag, key);
                          const ogpUrl = generateOgpUrl(diag, key);

                          return (
                            <tr key={key} className="border-b border-gray-50 hover:bg-gray-50">
                              <td className="py-3 pr-4 font-medium text-gray-700">
                                {title}
                                <span className="ml-1 text-xs text-gray-400">({key})</span>
                              </td>
                              <td className="py-3 pr-4">
                                <a
                                  href={resultUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-purple-500 hover:underline text-xs"
                                >
                                  結果を見る ↗
                                </a>
                              </td>
                              <td className="py-3">
                                <a
                                  href={ogpUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-500 hover:underline text-xs"
                                >
                                  OGP画像 ↗
                                </a>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-8 text-center text-xs text-gray-400">
          ⚠️ このページはAdmin専用です。cookieは24時間有効です。
        </div>
      </div>
    </div>
  );
}
