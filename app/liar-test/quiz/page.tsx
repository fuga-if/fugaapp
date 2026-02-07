"use client";
import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { questions, AnswerData, encodeAnswers } from "@/lib/liar-test/questions";

export default function QuizPage(): React.ReactElement {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<AnswerData[]>([]);
  const [history, setHistory] = useState<AnswerData[][]>([]);
  const questionStartTime = useRef<number>(Date.now());
  const [isTransitioning, setIsTransitioning] = useState(false);

  // 質問が表示された時点で計測開始
  const startTimer = useCallback(() => {
    questionStartTime.current = Date.now();
  }, []);

  // 初回マウント時にタイマー開始
  useState(() => {
    startTimer();
  });

  function handleAnswer(answer: boolean): void {
    if (isTransitioning) return;

    const timeMs = Date.now() - questionStartTime.current;
    const newAnswer: AnswerData = { answer, timeMs };
    const newAnswers = [...answers, newAnswer];

    setHistory((prev) => [...prev, [...answers]]);

    if (currentIndex >= questions.length - 1) {
      // 最後の質問 → 結果ページへ
      const params = encodeAnswers(newAnswers);
      router.push(`/liar-test/result?${params}`);
      return;
    }

    setIsTransitioning(true);
    setAnswers(newAnswers);

    // 短いアニメーション後に次の質問
    setTimeout(() => {
      setCurrentIndex((prev) => prev + 1);
      startTimer();
      setIsTransitioning(false);
    }, 200);
  }

  function handleBack(): void {
    if (history.length === 0) return;
    setAnswers(history[history.length - 1]);
    setHistory((prev) => prev.slice(0, -1));
    setCurrentIndex((prev) => prev - 1);
    startTimer();
  }

  const q = questions[currentIndex];
  const percentage = (currentIndex / questions.length) * 100;

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg relative">
        {currentIndex > 0 && (
          <button
            onClick={handleBack}
            className="absolute -top-8 left-0 text-gray-400/70 hover:text-gray-300 text-sm flex items-center gap-1"
          >
            <span>←</span>
            <span>もどる</span>
          </button>
        )}

        {/* プログレスバー */}
        <div className="w-full max-w-md mx-auto mb-8">
          <div className="flex justify-between text-sm text-gray-400 mb-2">
            <span className="font-mono">
              Q{currentIndex + 1} / {questions.length}
            </span>
            <span className="font-mono">{Math.round(percentage)}%</span>
          </div>
          <div className="w-full h-3 bg-gray-800/50 rounded-full overflow-hidden border border-gray-600/30">
            <div
              className="h-full bg-gradient-to-r from-gray-500 to-white rounded-full transition-all duration-500"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>

        {/* 質問カード */}
        <div
          className={`transition-all duration-200 ${
            isTransitioning
              ? "opacity-0 translate-x-4"
              : "opacity-100 translate-x-0"
          }`}
        >
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-600/50 rounded-2xl p-8 shadow-[0_0_40px_rgba(156,163,175,0.1)]">
            <h2 className="text-xl md:text-2xl font-bold text-gray-100 mb-8 text-center leading-relaxed">
              Q{q.id}. {q.text}
            </h2>

            {/* はい / いいえ ボタン */}
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => handleAnswer(true)}
                className="p-5 text-center bg-gray-700/30 hover:bg-gray-600/40 rounded-xl border border-gray-500/30 hover:border-green-400/60 transition-all duration-300 transform hover:scale-[1.03] active:scale-[0.97] group"
              >
                <span className="text-3xl block mb-2">⭕</span>
                <span className="text-gray-100 font-bold text-lg">はい</span>
              </button>
              <button
                onClick={() => handleAnswer(false)}
                className="p-5 text-center bg-gray-700/30 hover:bg-gray-600/40 rounded-xl border border-gray-500/30 hover:border-red-400/60 transition-all duration-300 transform hover:scale-[1.03] active:scale-[0.97] group"
              >
                <span className="text-3xl block mb-2">❌</span>
                <span className="text-gray-100 font-bold text-lg">いいえ</span>
              </button>
            </div>

            {/* 回答時間は裏で計測（表示しない） */}
          </div>
        </div>
      </div>
    </main>
  );
}
