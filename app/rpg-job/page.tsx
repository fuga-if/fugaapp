"use client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RpgJobHome(): React.ReactElement {
  const router = useRouter();
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-8">
      <div className="text-center animate-fade-in w-full max-w-sm">
        <div className="mb-6 animate-float">
          <Image src="/images/rpg-job/main.png" alt="人生RPGジョブ診断" width={280} height={280} className="mx-auto drop-shadow-[0_0_20px_rgba(251,191,36,0.3)]" priority />
        </div>

        <div className="border-double border-4 border-amber-400 bg-slate-800/80 rounded-lg p-6 mb-6">
          <h1 className="text-3xl font-bold text-amber-400 mb-2">人生RPG<br />ジョブ診断</h1>
          <p className="text-slate-200 text-lg mb-4 leading-relaxed">
            もしあなたの人生がRPGだったら？<br />10問で判明するジョブクラス！
          </p>
          <button
            onClick={() => router.push("/rpg-job/quiz")}
            className="px-12 py-5 rounded font-bold text-xl shadow-lg bg-amber-500 hover:bg-amber-400 text-slate-900 transition-all transform hover:scale-105 active:scale-95"
          >
            ▶ ぼうけんにでる
          </button>
          <p className="text-sm text-slate-400 mt-4">※ 全10問・約2分で完了</p>
        </div>

        <div className="pt-4">
          <p className="text-xs text-slate-500 mb-3">▼ 他の診断もやってみる？</p>
          <div className="flex flex-col gap-2">
            <Link href="/motivation" className="text-amber-400/70 hover:text-amber-400 text-sm">⚡ モチベーション源泉診断 →</Link>
            <Link href="/gamer-type" className="text-amber-400/70 hover:text-amber-400 text-sm">🎮 ゲーマータイプ診断 →</Link>
            <Link href="/yami-zokusei" className="text-amber-400/70 hover:text-amber-400 text-sm">⚔️ 闇属性診断 →</Link>
          </div>
        </div>
      </div>
    </main>
  );
}
