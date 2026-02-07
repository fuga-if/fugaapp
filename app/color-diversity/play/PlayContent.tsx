"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { questions, getChoices, Question } from "@/lib/color-diversity/questions";

// 数字の形を定義（7x9グリッド、1がドット描画位置）
const digitPatterns: Record<string, number[][]> = {
  "0": [
    [0, 1, 1, 1, 1, 1, 0],
    [1, 1, 0, 0, 0, 1, 1],
    [1, 1, 0, 0, 0, 1, 1],
    [1, 1, 0, 0, 0, 1, 1],
    [1, 1, 0, 0, 0, 1, 1],
    [1, 1, 0, 0, 0, 1, 1],
    [1, 1, 0, 0, 0, 1, 1],
    [1, 1, 0, 0, 0, 1, 1],
    [0, 1, 1, 1, 1, 1, 0],
  ],
  "1": [
    [0, 0, 0, 1, 1, 0, 0],
    [0, 0, 1, 1, 1, 0, 0],
    [0, 1, 0, 1, 1, 0, 0],
    [0, 0, 0, 1, 1, 0, 0],
    [0, 0, 0, 1, 1, 0, 0],
    [0, 0, 0, 1, 1, 0, 0],
    [0, 0, 0, 1, 1, 0, 0],
    [0, 0, 0, 1, 1, 0, 0],
    [0, 1, 1, 1, 1, 1, 1],
  ],
  "2": [
    [0, 1, 1, 1, 1, 1, 0],
    [1, 1, 0, 0, 0, 1, 1],
    [0, 0, 0, 0, 0, 1, 1],
    [0, 0, 0, 0, 1, 1, 0],
    [0, 0, 0, 1, 1, 0, 0],
    [0, 0, 1, 1, 0, 0, 0],
    [0, 1, 1, 0, 0, 0, 0],
    [1, 1, 0, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 1, 1],
  ],
  "3": [
    [0, 1, 1, 1, 1, 1, 0],
    [1, 1, 0, 0, 0, 1, 1],
    [0, 0, 0, 0, 0, 1, 1],
    [0, 0, 0, 0, 0, 1, 1],
    [0, 0, 1, 1, 1, 1, 0],
    [0, 0, 0, 0, 0, 1, 1],
    [0, 0, 0, 0, 0, 1, 1],
    [1, 1, 0, 0, 0, 1, 1],
    [0, 1, 1, 1, 1, 1, 0],
  ],
  "4": [
    [0, 0, 0, 0, 1, 1, 0],
    [0, 0, 0, 1, 1, 1, 0],
    [0, 0, 1, 1, 1, 1, 0],
    [0, 1, 1, 0, 1, 1, 0],
    [1, 1, 0, 0, 1, 1, 0],
    [1, 1, 1, 1, 1, 1, 1],
    [0, 0, 0, 0, 1, 1, 0],
    [0, 0, 0, 0, 1, 1, 0],
    [0, 0, 0, 0, 1, 1, 0],
  ],
  "5": [
    [1, 1, 1, 1, 1, 1, 1],
    [1, 1, 0, 0, 0, 0, 0],
    [1, 1, 0, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 1, 0],
    [0, 0, 0, 0, 0, 1, 1],
    [0, 0, 0, 0, 0, 1, 1],
    [0, 0, 0, 0, 0, 1, 1],
    [1, 1, 0, 0, 0, 1, 1],
    [0, 1, 1, 1, 1, 1, 0],
  ],
  "6": [
    [0, 0, 1, 1, 1, 1, 0],
    [0, 1, 1, 0, 0, 0, 0],
    [1, 1, 0, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 1, 0],
    [1, 1, 0, 0, 0, 1, 1],
    [1, 1, 0, 0, 0, 1, 1],
    [1, 1, 0, 0, 0, 1, 1],
    [1, 1, 0, 0, 0, 1, 1],
    [0, 1, 1, 1, 1, 1, 0],
  ],
  "7": [
    [1, 1, 1, 1, 1, 1, 1],
    [0, 0, 0, 0, 0, 1, 1],
    [0, 0, 0, 0, 1, 1, 0],
    [0, 0, 0, 0, 1, 1, 0],
    [0, 0, 0, 1, 1, 0, 0],
    [0, 0, 0, 1, 1, 0, 0],
    [0, 0, 1, 1, 0, 0, 0],
    [0, 0, 1, 1, 0, 0, 0],
    [0, 0, 1, 1, 0, 0, 0],
  ],
  "8": [
    [0, 1, 1, 1, 1, 1, 0],
    [1, 1, 0, 0, 0, 1, 1],
    [1, 1, 0, 0, 0, 1, 1],
    [1, 1, 0, 0, 0, 1, 1],
    [0, 1, 1, 1, 1, 1, 0],
    [1, 1, 0, 0, 0, 1, 1],
    [1, 1, 0, 0, 0, 1, 1],
    [1, 1, 0, 0, 0, 1, 1],
    [0, 1, 1, 1, 1, 1, 0],
  ],
  "9": [
    [0, 1, 1, 1, 1, 1, 0],
    [1, 1, 0, 0, 0, 1, 1],
    [1, 1, 0, 0, 0, 1, 1],
    [1, 1, 0, 0, 0, 1, 1],
    [0, 1, 1, 1, 1, 1, 1],
    [0, 0, 0, 0, 0, 1, 1],
    [0, 0, 0, 0, 0, 1, 1],
    [0, 0, 0, 0, 1, 1, 0],
    [0, 1, 1, 1, 1, 0, 0],
  ],
};

interface IshiharaPlateProps {
  question: Question;
}

function IshiharaPlate({ question }: IshiharaPlateProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { bgColors, numAColor, numBColor, numA, numB } = question;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const size = 300;
    const centerX = size / 2;
    const centerY = size / 2;
    const radius = size / 2 - 10;

    ctx.clearRect(0, 0, size, size);

    // 円形のクリッピングマスク
    ctx.save();
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.clip();

    // 数字のパターンを取得
    const patternA = digitPatterns[numA];
    const patternB = digitPatterns[numB];
    if (!patternA || !patternB) return;

    // グリッドサイズの計算
    const gridCols = 7;
    const gridRows = 9;
    const cellWidth = (size * 0.6) / gridCols;
    const cellHeight = (size * 0.7) / gridRows;
    const offsetX = size * 0.2;
    const offsetY = size * 0.15;

    // ドットを生成
    type DotType = "bg" | "numA" | "numB" | "both";
    const dots: { x: number; y: number; type: DotType }[] = [];

    for (let i = 0; i < 900; i++) {
      const angle = Math.random() * Math.PI * 2;
      const dist = Math.random() * radius;
      const x = centerX + Math.cos(angle) * dist;
      const y = centerY + Math.sin(angle) * dist;

      const gridX = Math.floor((x - offsetX) / cellWidth);
      const gridY = Math.floor((y - offsetY) / cellHeight);

      let inA = false;
      let inB = false;

      if (gridX >= 0 && gridX < gridCols && gridY >= 0 && gridY < gridRows) {
        if (patternA[gridY] && patternA[gridY][gridX] === 1) inA = true;
        if (patternB[gridY] && patternB[gridY][gridX] === 1) inB = true;
      }

      let dotType: DotType = "bg";
      if (inA && inB) {
        // 両方の数字が重なる部分 - ランダムにどちらかの色
        dotType = Math.random() > 0.5 ? "numA" : "numB";
      } else if (inA) {
        dotType = "numA";
      } else if (inB) {
        dotType = "numB";
      }

      dots.push({ x, y, type: dotType });
    }

    // ドットを描画
    dots.forEach((dot) => {
      const r = 4 + Math.random() * 8;
      const variation = 25;

      let color: [number, number, number];
      
      if (dot.type === "numA") {
        color = [
          Math.max(0, Math.min(255, numAColor[0] + (Math.random() - 0.5) * variation)),
          Math.max(0, Math.min(255, numAColor[1] + (Math.random() - 0.5) * variation)),
          Math.max(0, Math.min(255, numAColor[2] + (Math.random() - 0.5) * variation)),
        ];
      } else if (dot.type === "numB") {
        color = [
          Math.max(0, Math.min(255, numBColor[0] + (Math.random() - 0.5) * variation)),
          Math.max(0, Math.min(255, numBColor[1] + (Math.random() - 0.5) * variation)),
          Math.max(0, Math.min(255, numBColor[2] + (Math.random() - 0.5) * variation)),
        ];
      } else {
        // 背景 - 複数の背景色からランダムに選択
        const bgColor = bgColors[Math.floor(Math.random() * bgColors.length)];
        color = [
          Math.max(0, Math.min(255, bgColor[0] + (Math.random() - 0.5) * variation)),
          Math.max(0, Math.min(255, bgColor[1] + (Math.random() - 0.5) * variation)),
          Math.max(0, Math.min(255, bgColor[2] + (Math.random() - 0.5) * variation)),
        ];
      }

      ctx.beginPath();
      ctx.arc(dot.x, dot.y, r, 0, Math.PI * 2);
      ctx.fillStyle = `rgb(${Math.round(color[0])}, ${Math.round(color[1])}, ${Math.round(color[2])})`;
      ctx.fill();
    });

    ctx.restore();

    // 枠線
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.strokeStyle = "#ccc";
    ctx.lineWidth = 2;
    ctx.stroke();
  }, [bgColors, numAColor, numBColor, numA, numB]);

  return (
    <canvas
      ref={canvasRef}
      width={300}
      height={300}
      className="rounded-full shadow-lg"
    />
  );
}

export default function PlayContent() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<(string | null)[]>(
    new Array(questions.length).fill(null)
  );
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const currentQuestion = questions[currentIndex];
  const choices = getChoices(currentQuestion);

  const handleAnswer = useCallback(
    (choice: string) => {
      if (isTransitioning) return;

      setSelectedAnswer(choice);
      setIsTransitioning(true);

      const newAnswers = [...answers];
      newAnswers[currentIndex] = choice;
      setAnswers(newAnswers);

      setTimeout(() => {
        if (currentIndex < questions.length - 1) {
          setCurrentIndex(currentIndex + 1);
          setSelectedAnswer(null);
          setIsTransitioning(false);
        } else {
          const answersParam = encodeURIComponent(JSON.stringify(newAnswers));
          router.push(`/color-diversity/result?answers=${answersParam}`);
        }
      }, 500);
    },
    [currentIndex, answers, isTransitioning, router]
  );

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* 進捗 */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">
              問題 {currentIndex + 1} / {questions.length}
            </span>
            <span className="text-xs text-gray-400">
              {currentQuestion.type === "p" && "P型検出"}
              {currentQuestion.type === "d" && "D型検出"}
              {currentQuestion.type === "t" && "T型検出"}
              {currentQuestion.type === "all" && "確認問題"}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-red-400 via-green-400 to-blue-400 h-2 rounded-full transition-all duration-300"
              style={{
                width: `${((currentIndex + 1) / questions.length) * 100}%`,
              }}
            />
          </div>
        </div>

        {/* 問題カード */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h2 className="text-center text-gray-700 font-bold mb-4">
            何が見える？
          </h2>

          {/* 石原式プレート */}
          <div className="flex justify-center mb-6">
            <IshiharaPlate question={currentQuestion} />
          </div>

          {/* 選択肢 */}
          <div className="grid grid-cols-2 gap-3">
            {choices.map((choice) => (
              <button
                key={choice}
                onClick={() => handleAnswer(choice)}
                disabled={isTransitioning}
                className={`
                  py-4 px-6 rounded-xl font-bold text-lg transition-all
                  ${
                    selectedAnswer === choice
                      ? "bg-gradient-to-r from-red-400 via-green-400 to-blue-400 text-white scale-95"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200 active:scale-95"
                  }
                  disabled:opacity-50
                `}
              >
                {choice}
              </button>
            ))}
          </div>
        </div>

        {/* ヒント */}
        <p className="text-center text-xs text-gray-400">
          一番はっきり見える数字を選んでね
        </p>
      </div>
    </div>
  );
}
