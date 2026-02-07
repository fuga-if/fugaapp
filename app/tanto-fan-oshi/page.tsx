"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function TantoHome(): React.ReactElement {
  const router = useRouter();
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-8">
      <div className="text-center animate-fade-in w-full max-w-sm">
        <div className="mb-6 animate-float">
          <Image src="/images/tanto-fan-oshi/logo.png" alt="担当/ファン/推し診断" width={280} height={280} className="mx-auto drop-shadow-[0_0_30px_rgba(236,72,153,0.3)]" priority />
        </div>
        <h1 className="text-3xl font-bold text-white mb-2 drop-shadow-lg">担当/ファン/推し<br />診断</h1>
        <p className="text-purple-200 text-lg mb-6 leading-relaxed">7つの質問に答えて、<br />あなたの応援スタイルを診断！</p>
        <button onClick={() => router.push("/tanto-fan-oshi/quiz")} className="px-12 py-5 rounded-full font-bold text-xl shadow-lg bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white hover:opacity-90 transition-all transform hover:scale-105 active:scale-95 mb-6">診断スタート</button>
        <p className="text-sm text-purple-300 mb-8">※ あなたはP？ファン？それとも…💜</p>
        <div className="pt-6 border-t border-purple-800/50">
          <p className="text-xs text-purple-500 mb-3">他の診断もやってみる？</p>
          <div className="flex flex-col gap-2">
            <Link href="/gacha" className="text-amber-400 hover:text-amber-300 transition-colors text-sm">💰 課金スタイル診断 →</Link>
            <Link href="/menhera" className="text-pink-400 hover:text-pink-300 transition-colors text-sm">🖤 メンヘラ度診断 →</Link>
          </div>
        </div>
      </div>
    </main>
  );
}
