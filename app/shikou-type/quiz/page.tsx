"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { questions, ShikouType } from "@/lib/shikou-type/questions";

type Scores = Record<ShikouType, number>;
const initialScores: Scores = { 'type-a': 0, 'type-b': 0, 'type-c': 0, 'type-d': 0, 'type-e': 0, 'type-f': 0 };

export default function QuizPage(): React.ReactElement {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [scores, setScores] = useState<Scores>({ ...initialScores });
  const [history, setHistory] = useState<{ optionIndex: number; prevScores: Scores }[]>([]);

  function handleAnswer(optionIndex: number): void {
    const option = questions[currentIndex].options[optionIndex];
    setHistory((prev) => [...prev, { optionIndex, prevScores: { ...scores } }]);
    const newScores = { ...scores };
    for (const [type, score] of Object.entries(option.scores)) {
      newScores[type as ShikouType] += score;
    }
    if (currentIndex >= questions.length - 1) {
      const params = new URLSearchParams();
      for (const [type, score] of Object.entries(newScores)) {
        params.set(type, score.toString());
      }
      router.push(`/shikou-type/result?${params.toString()}`);
      return;
    }
    setScores(newScores);
    setCurrentIndex((prev) => prev + 1);
  }

  function handleBack(): void {
    if (history.length === 0) return;
    setScores(history[history.length - 1].prevScores);
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
            <div className="h-full bg-gradient-to-r from-blue-500 to-amber-500 rounded-full transition-all duration-500" style={{ width: `${percentage}%` }} />
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
                  className="w-full p-4 text-left bg-gradient-to-r from-blue-50 to-amber-50 hover:from-blue-100 hover:to-amber-100 rounded-2xl border-2 border-blue-100 hover:border-blue-400 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] group"
                >
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-amber-500 text-white text-sm font-bold mr-3">
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
