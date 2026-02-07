"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function OshiHome(): React.ReactElement {
  const router = useRouter();
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-8">
      <div className="text-center animate-fade-in w-full max-w-sm">
        <div className="mb-6 animate-float">
          <Image src="/images/oshi/main-visual.png" alt="推し活スタイル診断" width={280} height={280} className="mx-auto drop-shadow-[0_0_30px_rgba(236,72,153,0.3)]" priority />
        </div>
        <h1 className="text-3xl font-bold text-white mb-2 drop-shadow-lg">推し活スタイル<br />診断</h1>
        <p className="text-pink-200 text-lg mb-6 leading-relaxed">8個の質問に答えて、<br />あなたの推し活タイプを診断！</p>
        <div className="space-y-4 mb-6">
          <button onClick={() => router.push("/oshi/quiz")} className="px-12 py-5 rounded-full font-bold text-xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-400 hover:to-purple-400 text-white">診断スタート</button>
        </div>
        <p className="text-sm text-pink-400 mb-8">※ 推しへの愛し方は人それぞれ💖</p>
        <div className="pt-6 border-t border-pink-800">
          <p className="text-xs text-pink-600 mb-3">他の診断もやってみる？</p>
          <div className="flex flex-col gap-2">
            <Link href="/menhera" className="text-pink-400 hover:text-pink-300 transition-colors text-sm">🖤 メンヘラ度診断 →</Link>
            <Link href="/vtuber" className="text-purple-400 hover:text-purple-300 transition-colors text-sm">🎮 Vtuberオタク診断 →</Link>
          </div>
        </div>
      </div>
    </main>
  );
}
