"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { questions } from "@/lib/asd/questions";

export default function QuizPage(): React.ReactElement {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [history, setHistory] = useState<{ optionIndex: number; prevScore: number }[]>([]);

  function handleAnswer(optionIndex: number): void {
    const option = questions[currentIndex].options[optionIndex];
    setHistory((prev) => [...prev, { optionIndex, prevScore: totalScore }]);
    const newScore = totalScore + option.score;
    
    if (currentIndex >= questions.length - 1) {
      router.push(`/asd/result?score=${newScore}`);
      return;
    }
    setTotalScore(newScore);
    setCurrentIndex((prev) => prev + 1);
  }

  function handleBack(): void {
    if (history.length === 0) return;
    setTotalScore(history[history.length - 1].prevScore);
    setHistory((prev) => prev.slice(0, -1));
    setCurrentIndex((prev) => prev - 1);
  }

  const q = questions[currentIndex];
  const percentage = (currentIndex / questions.length) * 100;

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg relative">
        {currentIndex > 0 && (
          <button onClick={handleBack} className="absolute -top-8 left-0 text-blue-500 hover:text-blue-700 text-sm flex items-center gap-1">
            <span>←</span><span>戻る</span>
          </button>
        )}
        <div className="w-full max-w-md mx-auto mb-8">
          <div className="flex justify-between text-sm text-blue-500 mb-2">
            <span>質問 {currentIndex + 1} / {questions.length}</span>
            <span>{Math.round(percentage)}%</span>
          </div>
          <div className="w-full h-3 bg-blue-100 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full transition-all duration-500" style={{ width: `${percentage}%` }} />
          </div>
        </div>
        <div className="animate-fade-in">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-blue-100">
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-8 text-center leading-relaxed">
              Q{q.id}. {q.text}
            </h2>
            <div className="space-y-3">
              {q.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(index)}
                  className="w-full p-4 text-left bg-gradient-to-r from-blue-50 to-cyan-50 hover:from-blue-100 hover:to-cyan-100 rounded-2xl border-2 border-blue-100 hover:border-blue-400 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] group"
                >
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-cyan-400 text-white text-sm font-bold mr-3">
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
