"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  questions,
  answerLabels,
  DarkTriadAxis,
  normalizeScore,
} from "@/lib/dark-triad/questions";

interface RawScores {
  M: number;
  N: number;
  P: number;
}

const initialScores: RawScores = { M: 0, N: 0, P: 0 };

export default function QuizPage(): React.ReactElement {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [scores, setScores] = useState<RawScores>({ ...initialScores });
  const [history, setHistory] = useState<
    { value: number; prevScores: RawScores }[]
  >([]);
  const [isTransitioning, setIsTransitioning] = useState(false);

  function handleAnswer(value: number): void {
    if (isTransitioning) return;
    const q = questions[currentIndex];
    setHistory((prev) => [...prev, { value, prevScores: { ...scores } }]);
    const newScores = { ...scores };
    newScores[q.axis] += value;

    if (currentIndex >= questions.length - 1) {
      // 最後の問題→結果へ
      const params = new URLSearchParams();
      params.set("m", normalizeScore(newScores.M).toString());
      params.set("n", normalizeScore(newScores.N).toString());
      params.set("p", normalizeScore(newScores.P).toString());
      router.push(`/dark-triad/result?${params.toString()}`);
      return;
    }

    setIsTransitioning(true);
    setScores(newScores);
    setTimeout(() => {
      setCurrentIndex((prev) => prev + 1);
      setIsTransitioning(false);
    }, 150);
  }

  function handleBack(): void {
    if (history.length === 0) return;
    setScores(history[history.length - 1].prevScores);
    setHistory((prev) => prev.slice(0, -1));
    setCurrentIndex((prev) => prev - 1);
  }

  const q = questions[currentIndex];
  const percentage = (currentIndex / questions.length) * 100;

  // 軸ラベル
  const axisLabel: Record<DarkTriadAxis, string> = {
    M: "マキャベリズム",
    N: "ナルシシズム",
    P: "サイコパシー",
  };
  const axisEmoji: Record<DarkTriadAxis, string> = {
    M: "🦊",
    N: "👑",
    P: "🧊",
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg relative">
        {currentIndex > 0 && (
          <button
            onClick={handleBack}
            className="absolute -top-8 left-0 text-purple-400/70 hover:text-purple-400 text-sm flex items-center gap-1"
          >
            <span>←</span>
            <span>もどる</span>
          </button>
        )}

        {/* プログレスバー */}
        <div className="w-full max-w-md mx-auto mb-8">
          <div className="flex justify-between text-sm text-purple-300 mb-2">
            <span>
              {axisEmoji[q.axis]} Q{currentIndex + 1} / {questions.length}
            </span>
            <span>{Math.round(percentage)}%</span>
          </div>
          <div className="w-full h-3 bg-black/50 rounded-full overflow-hidden border border-purple-500/30">
            <div
              className="h-full bg-gradient-to-r from-purple-600 to-purple-400 rounded-full transition-all duration-500"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>

        {/* 質問カード */}
        <div
          className={`transition-opacity duration-150 ${isTransitioning ? "opacity-0" : "opacity-100"}`}
        >
          <div className="bg-black/50 backdrop-blur-sm border border-purple-500/40 rounded-2xl p-8 shadow-[0_0_40px_rgba(168,85,247,0.15)]">
            {/* 軸インジケーター */}
            <div className="flex justify-center mb-4">
              <span className="inline-block px-3 py-1 rounded-full bg-purple-900/50 border border-purple-500/30 text-purple-300 text-xs">
                {axisEmoji[q.axis]} {axisLabel[q.axis]}
              </span>
            </div>

            <h2 className="text-xl md:text-2xl font-bold text-white mb-8 text-center leading-relaxed">
              「{q.text}」
            </h2>

            {/* 5段階ボタン */}
            <div className="space-y-3">
              {answerLabels.map((label, index) => {
                const value = index + 1; // 1-5
                // グラデーション：1は明るめ、5はダークに
                const intensities = [
                  "bg-gray-800/40 hover:bg-gray-700/50 border-gray-600/30 hover:border-purple-400/40",
                  "bg-gray-800/50 hover:bg-gray-700/60 border-gray-600/30 hover:border-purple-400/50",
                  "bg-purple-900/30 hover:bg-purple-800/40 border-purple-500/30 hover:border-purple-400/60",
                  "bg-purple-900/50 hover:bg-purple-800/50 border-purple-500/40 hover:border-purple-300/60",
                  "bg-purple-800/60 hover:bg-purple-700/60 border-purple-400/50 hover:border-purple-300/70",
                ];
                return (
                  <button
                    key={value}
                    onClick={() => handleAnswer(value)}
                    className={`w-full p-4 text-left rounded-xl border transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] ${intensities[index]}`}
                  >
                    <div className="flex items-center gap-3">
                      {/* 数字インジケーター */}
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((dot) => (
                          <div
                            key={dot}
                            className={`w-2 h-2 rounded-full ${
                              dot <= value
                                ? "bg-purple-400"
                                : "bg-gray-600/50"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-gray-200 font-medium text-sm md:text-base">
                        {label}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
