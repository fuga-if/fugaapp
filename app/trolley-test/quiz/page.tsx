"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { questions, AxisType } from "@/lib/trolley-test/questions";

export default function QuizPage(): React.ReactElement {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<AxisType[]>([]);
  const [isTransitioning, setIsTransitioning] = useState(false);

  function handleAnswer(optionIndex: number): void {
    if (isTransitioning) return;
    const option = questions[currentIndex].options[optionIndex];
    const newAnswers = [...answers, option.axis];

    if (currentIndex >= questions.length - 1) {
      // 最終問題 → 結果へ
      const utilitarian = newAnswers.filter(
        (a) => a === "utilitarian"
      ).length;
      const deontological = newAnswers.filter(
        (a) => a === "deontological"
      ).length;
      const params = new URLSearchParams({
        u: utilitarian.toString(),
        d: deontological.toString(),
        a: newAnswers.map((a) => (a === "utilitarian" ? "U" : "D")).join(""),
      });
      router.push(`/trolley-test/result?${params.toString()}`);
      return;
    }

    setIsTransitioning(true);
    setAnswers(newAnswers);

    setTimeout(() => {
      setCurrentIndex((prev) => prev + 1);
      setIsTransitioning(false);
    }, 300);
  }

  function handleBack(): void {
    if (currentIndex === 0 || isTransitioning) return;
    setAnswers((prev) => prev.slice(0, -1));
    setCurrentIndex((prev) => prev - 1);
  }

  const q = questions[currentIndex];
  const percentage = (currentIndex / questions.length) * 100;

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg relative">
        {currentIndex > 0 && (
          <button
            onClick={handleBack}
            className="absolute -top-8 left-0 text-amber-300/70 hover:text-amber-300 text-sm flex items-center gap-1"
          >
            <span>←</span>
            <span>もどる</span>
          </button>
        )}

        {/* プログレスバー */}
        <div className="w-full max-w-md mx-auto mb-8">
          <div className="flex justify-between text-sm text-amber-300 mb-2">
            <span>
              Q{currentIndex + 1} / {questions.length}
            </span>
            <span>{Math.round(percentage)}%</span>
          </div>
          <div className="w-full h-3 bg-slate-800/50 rounded-full overflow-hidden border border-amber-500/20">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-orange-600 rounded-full transition-all duration-500"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>

        {/* 質問カード */}
        <div
          className={`transition-all duration-300 ${isTransitioning ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"}`}
        >
          <div className="bg-slate-800/60 backdrop-blur-sm border border-amber-500/30 rounded-2xl p-8 shadow-[0_0_40px_rgba(245,158,11,0.1)]">
            {/* シナリオ */}
            <div className="text-center mb-6">
              <span className="text-4xl mb-3 block">{q.emoji}</span>
              <p className="text-amber-400/80 text-xs font-medium mb-1">
                {q.title}
              </p>
            </div>

            <h2 className="text-lg md:text-xl font-bold text-slate-100 mb-8 text-center leading-relaxed">
              {q.scenario}
            </h2>

            {/* 選択肢 */}
            <div className="space-y-3">
              {q.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(index)}
                  className="w-full p-4 text-left bg-slate-700/30 hover:bg-slate-700/50 rounded-xl border border-slate-600/30 hover:border-amber-400/60 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] group"
                >
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-r from-amber-500 to-orange-600 text-white text-sm font-bold mr-3">
                    {String.fromCharCode(65 + index)}
                  </span>
                  <span className="text-slate-100 font-medium">
                    {option.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ミニスコア表示 */}
        {answers.length > 0 && (
          <div className="mt-4 flex justify-center gap-2">
            {answers.map((a, i) => (
              <div
                key={i}
                className={`w-2.5 h-2.5 rounded-full ${a === "utilitarian" ? "bg-blue-400" : "bg-orange-400"}`}
                title={`Q${i + 1}: ${a === "utilitarian" ? "功利主義" : "義務論"}`}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
