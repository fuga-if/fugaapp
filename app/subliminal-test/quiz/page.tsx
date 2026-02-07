"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { questions, AxisKey, FlashType } from "@/lib/subliminal-test/questions";
import type { AnswerData } from "@/lib/subliminal-test/results";

/* ─── Flash Visual Components ─── */

function ColorBurst() {
  return (
    <div className="relative w-full h-full">
      {/* 4色のグラデーション放射 */}
      <div className="absolute inset-0 bg-gradient-to-tr from-red-500 via-transparent to-blue-500 opacity-90" />
      <div className="absolute inset-0 bg-gradient-to-bl from-green-400 via-transparent to-yellow-400 opacity-80 mix-blend-screen" />
      {/* 放射状 */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full bg-gradient-radial from-white/60 to-transparent" />
      <div className="absolute top-[20%] left-[15%] w-24 h-24 rounded-full bg-red-500/80 blur-sm" />
      <div className="absolute top-[15%] right-[15%] w-28 h-28 rounded-full bg-blue-500/80 blur-sm" />
      <div className="absolute bottom-[15%] left-[20%] w-26 h-26 rounded-full bg-green-400/80 blur-sm" />
      <div className="absolute bottom-[20%] right-[15%] w-24 h-24 rounded-full bg-yellow-400/80 blur-sm" />
    </div>
  );
}

function ShapeBurst() {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <svg viewBox="0 0 300 300" className="w-full h-full">
        {/* 丸 */}
        <circle cx="80" cy="80" r="45" fill="#F472B6" opacity="0.9" />
        {/* 三角 */}
        <polygon points="220,35 260,115 180,115" fill="#60A5FA" opacity="0.9" />
        {/* 四角 */}
        <rect x="50" y="170" width="80" height="80" fill="#34D399" opacity="0.9" />
        {/* 星 */}
        <polygon
          points="220,170 230,200 262,200 236,218 246,250 220,232 194,250 204,218 178,200 210,200"
          fill="#FBBF24"
          opacity="0.9"
        />
      </svg>
    </div>
  );
}

function NumberSwarm() {
  const numbers = [
    { n: "7", x: 15, y: 20, size: 48, color: "#EF4444" },
    { n: "4", x: 60, y: 15, size: 42, color: "#3B82F6" },
    { n: "1", x: 35, y: 55, size: 52, color: "#22C55E" },
    { n: "9", x: 70, y: 60, size: 44, color: "#EAB308" },
    { n: "3", x: 20, y: 75, size: 30, color: "#A855F7" },
    { n: "6", x: 80, y: 30, size: 32, color: "#EC4899" },
    { n: "2", x: 45, y: 80, size: 28, color: "#06B6D4" },
    { n: "8", x: 10, y: 45, size: 34, color: "#F97316" },
    { n: "5", x: 55, y: 40, size: 36, color: "#8B5CF6" },
  ];
  return (
    <div className="relative w-full h-full">
      {numbers.map((item, i) => (
        <span
          key={i}
          className="absolute font-black"
          style={{
            left: `${item.x}%`,
            top: `${item.y}%`,
            fontSize: `${item.size}px`,
            color: item.color,
            transform: `rotate(${(i * 37) % 360 - 180}deg)`,
            textShadow: `0 0 10px ${item.color}`,
          }}
        >
          {item.n}
        </span>
      ))}
    </div>
  );
}

function LandscapeSilhouette() {
  return (
    <div className="relative w-full h-full">
      <svg viewBox="0 0 300 300" className="w-full h-full">
        {/* 山 */}
        <polygon points="20,250 75,80 130,250" fill="#6366F1" opacity="0.8" />
        <polygon points="50,250 90,120 130,250" fill="#818CF8" opacity="0.6" />
        {/* 海（波） */}
        <path d="M130,200 Q165,170 200,200 Q235,230 270,200 L270,250 L130,250 Z" fill="#06B6D4" opacity="0.8" />
        {/* 森（木） */}
        <circle cx="60" cy="180" r="25" fill="#22C55E" opacity="0.7" />
        <circle cx="40" cy="190" r="20" fill="#16A34A" opacity="0.7" />
        <circle cx="80" cy="190" r="22" fill="#15803D" opacity="0.7" />
        {/* 街（ビル） */}
        <rect x="200" y="100" width="25" height="150" fill="#F59E0B" opacity="0.7" />
        <rect x="230" y="130" width="20" height="120" fill="#D97706" opacity="0.7" />
        <rect x="255" y="110" width="22" height="140" fill="#EAB308" opacity="0.7" />
        {/* 窓 */}
        <rect x="205" y="110" width="6" height="6" fill="#FEF3C7" opacity="0.9" />
        <rect x="214" y="110" width="6" height="6" fill="#FEF3C7" opacity="0.9" />
        <rect x="205" y="125" width="6" height="6" fill="#FEF3C7" opacity="0.9" />
        <rect x="235" y="140" width="5" height="5" fill="#FEF3C7" opacity="0.9" />
        <rect x="245" y="140" width="5" height="5" fill="#FEF3C7" opacity="0.9" />
      </svg>
    </div>
  );
}

function AnimalSilhouette() {
  return (
    <div className="relative w-full h-full">
      <svg viewBox="0 0 300 300" className="w-full h-full">
        {/* 猫 */}
        <g transform="translate(20,140)" fill="#A78BFA" opacity="0.85">
          <ellipse cx="40" cy="40" rx="30" ry="20" />
          <circle cx="20" cy="20" r="15" />
          <polygon points="8,18 12,0 22,12" />
          <polygon points="18,18 28,0 32,12" />
          <path d="M60,35 Q80,20 85,40" strokeWidth="3" stroke="#A78BFA" fill="none" />
        </g>
        {/* 鳥 */}
        <g transform="translate(160,40)" fill="#38BDF8" opacity="0.85">
          <ellipse cx="30" cy="25" rx="25" ry="15" />
          <circle cx="10" cy="18" r="10" />
          <polygon points="0,18 -12,15 0,22" />
          <path d="M20,12 Q35,-5 55,8" strokeWidth="2" stroke="#38BDF8" fill="#38BDF8" />
          <path d="M25,15 Q42,0 58,15" strokeWidth="2" stroke="#38BDF8" fill="#38BDF8" />
        </g>
        {/* 魚 */}
        <g transform="translate(30,230)" fill="#2DD4BF" opacity="0.85">
          <ellipse cx="40" cy="15" rx="35" ry="15" />
          <polygon points="75,15 95,0 95,30" />
          <circle cx="18" cy="12" r="4" fill="#1F2937" />
        </g>
        {/* 蝶 */}
        <g transform="translate(180,180)" fill="#F472B6" opacity="0.85">
          <ellipse cx="25" cy="20" rx="22" ry="18" transform="rotate(-30,25,20)" />
          <ellipse cx="55" cy="20" rx="22" ry="18" transform="rotate(30,55,20)" />
          <ellipse cx="30" cy="45" rx="15" ry="12" transform="rotate(-20,30,45)" />
          <ellipse cx="50" cy="45" rx="15" ry="12" transform="rotate(20,50,45)" />
          <rect x="38" y="10" width="4" height="40" rx="2" fill="#EC4899" />
        </g>
      </svg>
    </div>
  );
}

function WeatherImage() {
  return (
    <div className="relative w-full h-full">
      <svg viewBox="0 0 300 300" className="w-full h-full">
        {/* 晴れ（太陽） */}
        <circle cx="75" cy="75" r="30" fill="#FBBF24" opacity="0.9" />
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
          <line
            key={i}
            x1={75 + 38 * Math.cos((angle * Math.PI) / 180)}
            y1={75 + 38 * Math.sin((angle * Math.PI) / 180)}
            x2={75 + 52 * Math.cos((angle * Math.PI) / 180)}
            y2={75 + 52 * Math.sin((angle * Math.PI) / 180)}
            stroke="#FBBF24"
            strokeWidth="4"
            strokeLinecap="round"
            opacity="0.8"
          />
        ))}
        {/* 雨（雲＋雨粒） */}
        <g transform="translate(170,50)" opacity="0.85">
          <circle cx="20" cy="30" r="18" fill="#94A3B8" />
          <circle cx="42" cy="28" r="22" fill="#94A3B8" />
          <circle cx="62" cy="32" r="16" fill="#94A3B8" />
          <rect x="5" y="30" width="70" height="18" rx="8" fill="#94A3B8" />
          <line x1="20" y1="55" x2="15" y2="75" stroke="#60A5FA" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="38" y1="55" x2="33" y2="75" stroke="#60A5FA" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="56" y1="55" x2="51" y2="75" stroke="#60A5FA" strokeWidth="2.5" strokeLinecap="round" />
        </g>
        {/* 雷 */}
        <polygon points="100,150 120,150 110,180 130,180 95,220 105,190 85,190" fill="#EAB308" opacity="0.9" />
        {/* 雪（結晶） */}
        <g transform="translate(210,180)" opacity="0.85">
          <circle cx="30" cy="30" r="6" fill="#E0E7FF" />
          {[0, 60, 120].map((angle, i) => (
            <g key={i}>
              <line
                x1={30 + 6 * Math.cos((angle * Math.PI) / 180)}
                y1={30 + 6 * Math.sin((angle * Math.PI) / 180)}
                x2={30 + 25 * Math.cos((angle * Math.PI) / 180)}
                y2={30 + 25 * Math.sin((angle * Math.PI) / 180)}
                stroke="#E0E7FF"
                strokeWidth="2.5"
              />
              <line
                x1={30 - 6 * Math.cos((angle * Math.PI) / 180)}
                y1={30 - 6 * Math.sin((angle * Math.PI) / 180)}
                x2={30 - 25 * Math.cos((angle * Math.PI) / 180)}
                y2={30 - 25 * Math.sin((angle * Math.PI) / 180)}
                stroke="#E0E7FF"
                strokeWidth="2.5"
              />
            </g>
          ))}
        </g>
      </svg>
    </div>
  );
}

function AbstractPattern() {
  return (
    <div className="relative w-full h-full">
      <svg viewBox="0 0 300 300" className="w-full h-full">
        {/* 波 */}
        <path
          d="M10,80 Q40,40 70,80 Q100,120 130,80 Q160,40 190,80"
          fill="none"
          stroke="#818CF8"
          strokeWidth="5"
          opacity="0.85"
        />
        <path
          d="M10,100 Q40,60 70,100 Q100,140 130,100 Q160,60 190,100"
          fill="none"
          stroke="#6366F1"
          strokeWidth="3"
          opacity="0.6"
        />
        {/* 渦 */}
        <g transform="translate(230,70)" opacity="0.85">
          <path
            d="M0,0 C10,-15 30,-15 30,0 C30,20 5,25 0,10 C-5,-5 15,-20 35,-10 C55,0 40,35 15,30"
            fill="none"
            stroke="#F472B6"
            strokeWidth="4"
          />
        </g>
        {/* 直線 */}
        <g opacity="0.85">
          <line x1="30" y1="170" x2="170" y2="170" stroke="#34D399" strokeWidth="4" />
          <line x1="30" y1="185" x2="160" y2="185" stroke="#34D399" strokeWidth="3" />
          <line x1="30" y1="198" x2="150" y2="198" stroke="#34D399" strokeWidth="2" />
          <line x1="30" y1="208" x2="140" y2="208" stroke="#34D399" strokeWidth="4" />
        </g>
        {/* 点 */}
        <g opacity="0.85">
          {[
            [200, 180], [220, 195], [240, 175], [210, 210], [235, 225],
            [255, 190], [195, 230], [260, 215], [225, 245], [250, 240],
            [215, 165], [245, 205], [270, 230],
          ].map(([cx, cy], i) => (
            <circle key={i} cx={cx} cy={cy} r={4 + (i % 3)} fill="#FBBF24" />
          ))}
        </g>
      </svg>
    </div>
  );
}

function LightShadow() {
  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* 明るい側 */}
      <div className="absolute inset-0 w-1/2 bg-gradient-to-r from-white/80 via-yellow-100/60 to-transparent" />
      <div className="absolute left-[10%] top-[20%] w-24 h-24 rounded-full bg-yellow-200/60 blur-md" />
      <div className="absolute left-[5%] top-[50%] w-16 h-16 rounded-full bg-white/40 blur-sm" />
      {/* 暗い側 */}
      <div className="absolute inset-0 left-1/2 w-1/2 bg-gradient-to-l from-gray-900/90 via-indigo-950/70 to-transparent" />
      <div className="absolute right-[10%] top-[30%] w-20 h-20 rounded-full bg-indigo-900/60 blur-md" />
      <div className="absolute right-[5%] bottom-[25%] w-16 h-16 rounded-full bg-gray-800/50 blur-sm" />
      {/* 境界線 */}
      <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-purple-400/40 to-transparent" />
    </div>
  );
}

function FlashVisual({ type }: { type: FlashType }) {
  switch (type) {
    case "color-burst":
      return <ColorBurst />;
    case "shape-burst":
      return <ShapeBurst />;
    case "number-swarm":
      return <NumberSwarm />;
    case "landscape-silhouette":
      return <LandscapeSilhouette />;
    case "animal-silhouette":
      return <AnimalSilhouette />;
    case "weather-image":
      return <WeatherImage />;
    case "abstract-pattern":
      return <AbstractPattern />;
    case "light-shadow":
      return <LightShadow />;
  }
}

/* ─── Quiz Page ─── */

type Phase = "ready" | "flash" | "choose" | "transition";

export default function QuizPage(): React.ReactElement {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>("ready");
  const [answers, setAnswers] = useState<AnswerData[]>([]);
  const flashStartRef = useRef<number>(0);

  const startFlash = useCallback(() => {
    setPhase("flash");
    flashStartRef.current = Date.now();
    // Flash for 150ms then show choices
    setTimeout(() => {
      setPhase("choose");
    }, 150);
  }, []);

  // Auto-start first flash
  useEffect(() => {
    if (phase === "ready") {
      const timer = setTimeout(() => {
        startFlash();
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [phase, startFlash]);

  function handleAnswer(choiceIndex: number): void {
    const responseTimeMs = Date.now() - flashStartRef.current;
    const newAnswers = [...answers, { choiceIndex, responseTimeMs }];

    if (currentIndex >= questions.length - 1) {
      // All done - navigate to result
      const params = new URLSearchParams();
      params.set(
        "a",
        newAnswers.map((a) => `${a.choiceIndex}:${a.responseTimeMs}`).join(",")
      );
      router.push(`/subliminal-test/result?${params.toString()}`);
      return;
    }

    setAnswers(newAnswers);
    setPhase("transition");
    setTimeout(() => {
      setCurrentIndex((prev) => prev + 1);
      setPhase("ready");
    }, 300);
  }

  const q = questions[currentIndex];
  const percentage = (currentIndex / questions.length) * 100;

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg relative">
        {/* Progress */}
        <div className="w-full max-w-md mx-auto mb-6">
          <div className="flex justify-between text-sm text-indigo-300 mb-2">
            <span>◈ {currentIndex + 1} / {questions.length}</span>
            <span>{Math.round(percentage)}%</span>
          </div>
          <div className="w-full h-2 bg-indigo-900/50 rounded-full overflow-hidden border border-indigo-500/30">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>

        {/* Flash Area */}
        <div className="relative">
          {/* Ready phase: countdown */}
          {phase === "ready" && (
            <div className="bg-indigo-900/40 backdrop-blur-sm border border-indigo-500/40 rounded-2xl p-8 shadow-[0_0_40px_rgba(99,102,241,0.15)] animate-fade-in">
              <div className="flex flex-col items-center justify-center h-64">
                <div className="text-indigo-300 text-lg mb-4">次のフラッシュに備えて…</div>
                <div className="w-16 h-16 rounded-full border-4 border-indigo-400 border-t-transparent animate-spin" />
                <div className="text-indigo-400/60 text-sm mt-4">画面を見つめてください</div>
              </div>
            </div>
          )}

          {/* Flash phase: 150ms visual burst */}
          {phase === "flash" && (
            <div className="rounded-2xl overflow-hidden shadow-[0_0_60px_rgba(99,102,241,0.4)]">
              <div className="h-72 relative animate-flash-in">
                <FlashVisual type={q.flash} />
              </div>
            </div>
          )}

          {/* Choose phase: question + choices */}
          {phase === "choose" && (
            <div className="bg-indigo-900/40 backdrop-blur-sm border border-indigo-500/40 rounded-2xl p-8 shadow-[0_0_40px_rgba(99,102,241,0.15)] animate-fade-in">
              <h2 className="text-xl md:text-2xl font-bold text-indigo-100 mb-6 text-center leading-relaxed">
                Q{q.id}. {q.prompt}
              </h2>
              <div className="grid grid-cols-2 gap-3">
                {q.choices.map((choice, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswer(index)}
                    className="p-4 text-center bg-indigo-800/30 hover:bg-indigo-700/40 rounded-xl border border-indigo-500/30 hover:border-purple-400/60 transition-all duration-200 transform hover:scale-[1.03] active:scale-[0.97]"
                  >
                    <span className="text-indigo-100 font-bold text-lg">
                      {choice}
                    </span>
                  </button>
                ))}
              </div>
              <p className="text-center text-indigo-400/50 text-xs mt-4">
                直感で選んでね。考えないで！
              </p>
            </div>
          )}

          {/* Transition phase */}
          {phase === "transition" && (
            <div className="bg-indigo-900/40 backdrop-blur-sm border border-indigo-500/40 rounded-2xl p-8 shadow-[0_0_40px_rgba(99,102,241,0.15)]">
              <div className="flex items-center justify-center h-64">
                <div className="text-indigo-300 animate-pulse text-lg">◈</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Flash animation keyframes */}
      <style jsx global>{`
        @keyframes flash-in {
          0% {
            opacity: 0;
            transform: scale(1.3);
          }
          15% {
            opacity: 1;
            transform: scale(1);
          }
          85% {
            opacity: 1;
          }
          100% {
            opacity: 0;
          }
        }
        .animate-flash-in {
          animation: flash-in 150ms ease-out forwards;
        }
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </main>
  );
}
