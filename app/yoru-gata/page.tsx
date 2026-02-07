"use client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function YoruGataHome(): React.ReactElement {
  const router = useRouter();
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-8">
      <div className="text-center animate-fade-in w-full max-w-sm">
        <div className="mb-6 animate-float"><Image src="/images/yoru-gata/main.png" alt="夜型オタク診断" width={280} height={280} className="mx-auto drop-shadow-[0_0_30px_rgba(100,100,255,0.3)]" priority /></div>
        <h1 className="text-3xl font-bold text-white mb-2 drop-shadow-lg">夜型オタク診断</h1>
        <p className="text-indigo-200 text-lg mb-6 leading-relaxed">10個の質問に答えて、<br />あなたの夜更かしタイプを診断！</p>
        <button onClick={() => router.push("/yoru-gata/quiz")} className="px-12 py-5 rounded-full font-bold text-xl shadow-lg bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white transition-all transform hover:scale-105 active:scale-95 mb-6">診断スタート </button>
        <p className="text-sm text-indigo-400 mb-8">※ 夜更かしは計画的に…</p>
        <div className="pt-6 border-t border-indigo-800">
          <p className="text-xs text-indigo-600 mb-3">他の診断もやってみる？</p>
          <div className="flex flex-col gap-2">
            <Link href="/yami-zokusei" className="text-red-400 hover:text-red-300 text-sm"> 闇属性診断 →</Link>
            <Link href="/menhera" className="text-pink-400 hover:text-pink-300 text-sm"> メンヘラ度診断 →</Link>
            <Link href="/gacha" className="text-amber-400 hover:text-amber-300 text-sm"> 課金スタイル診断 →</Link>
          </div>
        </div>
      </div>
    </main>
  );
}
