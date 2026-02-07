"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { questions } from "@/lib/menhera/questions";

export default function MenheraQuizPage(): React.ReactElement {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [history, setHistory] = useState<{ score: number; prevTotal: number }[]>([]);

  function handleAnswer(score: number): void {
    setHistory((prev) => [...prev, { score, prevTotal: totalScore }]);
    const newScore = totalScore + score;
    const isLastQuestion = currentIndex >= questions.length - 1;
    if (isLastQuestion) {
      router.push(`/menhera/result?score=${newScore}`);
      return;
    }
    setTotalScore(newScore);
    setCurrentIndex((prev) => prev + 1);
  }

  function handleBack(): void {
    if (history.length === 0) return;
    const prevState = history[history.length - 1];
    setTotalScore(prevState.prevTotal);
    setHistory((prev) => prev.slice(0, -1));
    setCurrentIndex((prev) => prev - 1);
  }

  const q = questions[currentIndex];
  const answered = currentIndex;
  const percentage = (answered / questions.length) * 100;

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg relative">
        {currentIndex > 0 && (
          <button onClick={handleBack} className="absolute -top-8 left-0 text-gray-400 hover:text-gray-600 text-sm transition-colors flex items-center gap-1">
            <span>←</span><span>戻る</span>
          </button>
        )}

        <div className="w-full max-w-md mx-auto mb-8">
          <div className="flex justify-between text-sm text-pink-600 mb-2">
            <span>質問 {currentIndex + 1} / {questions.length}</span>
            <span>{Math.round(percentage)}%</span>
          </div>
          <div className="w-full h-3 bg-pink-100 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-pink-400 to-purple-500 rounded-full transition-all duration-500 ease-out" style={{ width: `${percentage}%` }} />
          </div>
        </div>

        <div className="w-full max-w-lg mx-auto animate-fade-in">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-pink-100">
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-8 text-center leading-relaxed">
              Q{q.id}. {q.text}
            </h2>
            <div className="space-y-4">
              {q.options.map((option, index) => (
                <button key={index} onClick={() => handleAnswer(option.score)}
                  className="w-full p-4 text-left bg-gradient-to-r from-pink-50 to-purple-50 hover:from-pink-100 hover:to-purple-100 rounded-2xl border-2 border-transparent hover:border-pink-300 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] group">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-pink-400 text-white text-sm font-bold mr-3 group-hover:bg-pink-500 transition-colors">
                    {String.fromCharCode(65 + index)}
                  </span>
                  <span className="text-gray-700 font-medium">{option.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
