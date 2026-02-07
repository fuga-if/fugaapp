"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { questions, RpgJobType } from "@/lib/rpg-job/questions";

type Scores = Record<RpgJobType, number>;
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
      newScores[type as RpgJobType] += score;
    }
    if (currentIndex >= questions.length - 1) {
      const params = new URLSearchParams();
      for (const [type, score] of Object.entries(newScores)) {
        params.set(type, score.toString());
      }
      router.push(`/rpg-job/result?${params.toString()}`);
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
          <button onClick={handleBack} className="absolute -top-8 left-0 text-amber-400/70 hover:text-amber-400 text-sm flex items-center gap-1">
            <span>←</span><span>もどる</span>
          </button>
        )}
        <div className="w-full max-w-md mx-auto mb-8">
          <div className="flex justify-between text-sm text-amber-400 mb-2">
            <span>クエスト {currentIndex + 1} / {questions.length}</span>
            <span>{Math.round(percentage)}%</span>
          </div>
          <div className="w-full h-3 bg-slate-700 rounded-full overflow-hidden border border-slate-600">
            <div className="h-full bg-gradient-to-r from-amber-500 to-amber-400 rounded-full transition-all duration-500" style={{ width: `${percentage}%` }} />
          </div>
        </div>
        <div className="animate-fade-in">
          <div className="border-double border-4 border-amber-400 bg-slate-800/80 rounded-lg p-8 shadow-xl">
            <h2 className="text-xl md:text-2xl font-bold text-slate-200 mb-8 text-center leading-relaxed">
              Q{q.id}. {q.text}
            </h2>
            <div className="space-y-3">
              {q.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(index)}
                  className="w-full p-4 text-left bg-slate-700/50 hover:bg-slate-600/70 rounded border-2 border-slate-600 hover:border-amber-400 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] group"
                >
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded bg-amber-500 text-slate-900 text-sm font-bold mr-3">
                    {String.fromCharCode(65 + index)}
                  </span>
                  <span className="text-slate-200 font-medium">{option.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
