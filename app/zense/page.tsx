"use client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ZenseHome(): React.ReactElement {
  const router = useRouter();
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-8">
      <div className="text-center animate-fade-in w-full max-w-sm">
        <div className="mb-6 animate-float">
          <Image src="/images/zense/main.png" alt="前世診断" width={280} height={280} className="mx-auto drop-shadow-[0_0_30px_rgba(168,85,247,0.4)]" priority />
        </div>

        <div className="bg-purple-900/50 backdrop-blur-sm border border-purple-500/50 rounded-2xl p-6 mb-6 shadow-[0_0_40px_rgba(168,85,247,0.15)]">
          <p className="text-amber-300/70 text-sm mb-2">✦ 魂の記憶を呼び覚ます ✦</p>
          <h1 className="text-3xl font-bold text-amber-300 mb-2">前世診断</h1>
          <p className="text-purple-100 text-lg mb-4 leading-relaxed">
            あなたの前世の職業は？<br />10問で判明する魂の記憶
          </p>
          <p className="text-purple-300/70 text-sm mb-6">
            騎士、魔女、旅芸人、巫女、学者、海賊…<br />あなたの魂が覚えている前世とは？
          </p>
          <button
            onClick={() => router.push("/zense/quiz")}
            className="px-12 py-5 rounded-xl font-bold text-xl shadow-lg bg-gradient-to-r from-amber-500 to-purple-500 hover:from-amber-400 hover:to-purple-400 text-white transition-all transform hover:scale-105 active:scale-95"
          >
            🔮 前世を占う
          </button>
          <p className="text-sm text-purple-400/60 mt-4">※ 全10問・約2分で完了</p>
        </div>

        <div className="pt-4">
          <p className="text-xs text-purple-400/50 mb-3">▼ 他の診断もやってみる？</p>
          <div className="flex flex-col gap-2">
            <Link href="/rpg-job" className="text-amber-300/60 hover:text-amber-300 text-sm transition-colors">⚔️ 人生RPGジョブ診断 →</Link>
            <Link href="/yami-zokusei" className="text-amber-300/60 hover:text-amber-300 text-sm transition-colors">⚔️ 闇属性診断 →</Link>
            <Link href="/motivation" className="text-amber-300/60 hover:text-amber-300 text-sm transition-colors">⚡ モチベーション源泉診断 →</Link>
          </div>
        </div>
      </div>
    </main>
  );
}
