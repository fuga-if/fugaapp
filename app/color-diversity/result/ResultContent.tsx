"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { analyzeResults, questions } from "@/lib/color-diversity/questions";
import { getResultType, ResultType } from "@/lib/color-diversity/results";

function ResultContentInner() {
  const searchParams = useSearchParams();
  const [result, setResult] = useState<{
    type: ResultType;
    pScore: number;
    dScore: number;
    tScore: number;
    normalScore: number;
  } | null>(null);

  useEffect(() => {
    const answersParam = searchParams.get("answers");
    if (answersParam) {
      try {
        const answers = JSON.parse(decodeURIComponent(answersParam));
        const analysis = analyzeResults(answers);
        const resultType = getResultType(analysis.type);
        setResult({
          type: resultType,
          pScore: analysis.pScore,
          dScore: analysis.dScore,
          tScore: analysis.tScore,
          normalScore: analysis.normalScore,
        });

        // URLをシェア用に更新
        const url = new URL(window.location.href);
        url.searchParams.delete("answers");
        url.searchParams.set("type", analysis.type);
        url.searchParams.set("score", analysis.normalScore.toString());
        window.history.replaceState({}, "", url.toString());
      } catch {
        const defaultResult = getResultType("type-c");
        setResult({
          type: defaultResult,
          pScore: 0,
          dScore: 0,
          tScore: 0,
          normalScore: 10,
        });
      }
    } else {
      const typeParam = searchParams.get("type") || "type-c";
      const scoreParam = parseInt(searchParams.get("score") || "0", 10);
      const resultType = getResultType(typeParam);
      setResult({
        type: resultType,
        pScore: 0,
        dScore: 0,
        tScore: 0,
        normalScore: scoreParam,
      });
    }
  }, [searchParams]);

  if (!result) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent" />
      </div>
    );
  }

  const shareText = `【色覚多様性チェック】私の色覚タイプは「${result.type.title}」でした！${result.type.emoji} 色の見え方は人それぞれ。 #色覚多様性チェック #fugaapp`;
  const shareUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/color-diversity/result?type=${result.type.id}&score=${result.normalScore}`
      : "";

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "色覚多様性チェック結果",
          text: shareText,
          url: shareUrl,
        });
      } catch {
        // シェアキャンセル
      }
    }
  };

  const handleTwitterShare = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(twitterUrl, "_blank", "noopener,noreferrer");
  };

  // 傾向があるかどうか
  const hasTendency = result.pScore > 0 || result.dScore > 0 || result.tScore > 0;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 py-8">
      <div className="w-full max-w-md">
        {/* 結果ヘッダー */}
        <div className="text-center mb-6">
          <div className="text-6xl mb-2">{result.type.emoji}</div>
          <p className="text-gray-500 text-sm mb-2">あなたの色覚タイプは...</p>
          <h1
            className="text-2xl font-bold mb-1"
            style={{ color: result.type.color }}
          >
            {result.type.title}
          </h1>
          <p className="text-gray-600 text-sm">{result.type.subtitle}</p>
        </div>

        {/* スコアカード */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="text-center mb-4">
            <div className="text-4xl font-bold text-gray-800">
              {result.normalScore}
              <span className="text-lg text-gray-500">/{questions.length}</span>
            </div>
            <p className="text-gray-500 text-sm">通常回答数</p>
          </div>

          {/* 傾向スコア（傾向がある場合のみ表示） */}
          {hasTendency && (
            <div className="grid grid-cols-3 gap-2 mb-4">
              <div className="bg-red-50 rounded-lg p-2 text-center">
                <div className="text-red-500 font-bold">{result.pScore}</div>
                <div className="text-xs text-gray-500">P型傾向</div>
              </div>
              <div className="bg-green-50 rounded-lg p-2 text-center">
                <div className="text-green-500 font-bold">{result.dScore}</div>
                <div className="text-xs text-gray-500">D型傾向</div>
              </div>
              <div className="bg-blue-50 rounded-lg p-2 text-center">
                <div className="text-blue-500 font-bold">{result.tScore}</div>
                <div className="text-xs text-gray-500">T型傾向</div>
              </div>
            </div>
          )}

          {/* 説明 */}
          <p className="text-gray-600 text-sm leading-relaxed">
            {result.type.description}
          </p>
        </div>

        {/* シェアボタン */}
        <div className="flex gap-3 mb-6">
          <button
            onClick={handleShare}
            className="flex-1 bg-gradient-to-r from-red-400 via-green-400 to-blue-400 text-white font-bold py-3 px-4 rounded-full shadow-lg hover:shadow-xl transition-all"
          >
            結果をシェア
          </button>
          <button
            onClick={handleTwitterShare}
            className="bg-black text-white font-bold py-3 px-6 rounded-full shadow-lg hover:bg-gray-800 transition-all"
          >
            𝕏
          </button>
        </div>

        {/* もう一度・ホーム */}
        <div className="flex gap-3 mb-6">
          <Link
            href="/color-diversity"
            className="flex-1 bg-white text-gray-700 font-bold py-3 px-4 rounded-full shadow text-center hover:bg-gray-50 transition-all"
          >
            もう一度
          </Link>
          <Link
            href="/"
            className="flex-1 bg-gray-100 text-gray-600 font-bold py-3 px-4 rounded-full text-center hover:bg-gray-200 transition-all"
          >
            ホームへ
          </Link>
        </div>

        {/* 注意書き */}
        <div className="text-xs text-gray-400 p-4 bg-gray-50 rounded-lg">
          <p className="mb-1">※このチェックは医学的診断ではありません</p>
          <p className="mb-1">※正確な色覚検査は眼科で受けてください</p>
          <p>※モニターの設定により結果が変わる場合があります</p>
        </div>
      </div>
    </div>
  );
}

export default function ResultContent() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent" />
        </div>
      }
    >
      <ResultContentInner />
    </Suspense>
  );
}
