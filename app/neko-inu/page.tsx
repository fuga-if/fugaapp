"use client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function NekoInuHome(): React.ReactElement {
  const router = useRouter();
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-8">
      <div className="text-center animate-fade-in w-full max-w-sm">
        <div className="mb-6 animate-float"><Image src="/images/neko-inu/main.png" alt="猫派犬派深層診断" width={280} height={280} className="mx-auto drop-shadow-[0_0_30px_rgba(255,105,180,0.3)]" priority /></div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2 drop-shadow-lg">猫派犬派<br />深層診断</h1>
        <p className="text-pink-600 text-lg mb-6 leading-relaxed">10個の質問に答えて、<br />あなたの本当の性格を診断！</p>
        <button onClick={() => router.push("/neko-inu/quiz")} className="px-12 py-5 rounded-full font-bold text-xl shadow-lg bg-gradient-to-r from-pink-400 to-blue-300 hover:from-pink-300 hover:to-blue-200 text-white transition-all transform hover:scale-105 active:scale-95 mb-6">診断スタート </button>
        <p className="text-sm text-pink-400 mb-8">※ あなたは猫？犬？それとも…？</p>
        <div className="pt-6 border-t border-pink-200">
          <p className="text-xs text-pink-400 mb-3">他の診断もやってみる？</p>
          <div className="flex flex-col gap-2">
            <Link href="/menhera" className="text-pink-500 hover:text-pink-600 text-sm"> メンヘラ度診断 →</Link>
            <Link href="/sumaho-izon" className="text-cyan-500 hover:text-cyan-600 text-sm"> スマホ依存タイプ診断 →</Link>
            <Link href="/gacha" className="text-amber-500 hover:text-amber-600 text-sm"> 課金スタイル診断 →</Link>
          </div>
        </div>
      </div>
    </main>
  );
}
