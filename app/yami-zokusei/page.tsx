"use client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function YamiZokuseiHome(): React.ReactElement {
  const router = useRouter();
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-8">
      <div className="text-center animate-fade-in w-full max-w-sm">
        <div className="mb-6 animate-float"><Image src="/images/yami-zokusei/main.png" alt="闇属性診断" width={280} height={280} className="mx-auto drop-shadow-[0_0_30px_rgba(255,0,0,0.3)]" priority /></div>
        <h1 className="text-3xl font-bold text-white mb-2 drop-shadow-lg">闇属性診断</h1>
        <p className="text-red-200 text-lg mb-6 leading-relaxed">10個の質問に答えて、<br />あなたの魂に宿る属性を解放せよ！</p>
        <button onClick={() => router.push("/yami-zokusei/quiz")} className="px-12 py-5 rounded-full font-bold text-xl shadow-lg bg-gradient-to-r from-red-700 to-red-900 hover:from-red-600 hover:to-red-800 text-white transition-all transform hover:scale-105 active:scale-95 mb-6 border border-red-500/50">属性を覚醒する ⚔️</button>
        <p className="text-sm text-red-600 mb-8">※ 厨二病は一生モノ</p>
        <div className="pt-6 border-t border-red-900">
          <p className="text-xs text-red-800 mb-3">他の診断もやってみる？</p>
          <div className="flex flex-col gap-2">
            <Link href="/yoru-gata" className="text-indigo-400 hover:text-indigo-300 text-sm">🌙 夜型オタク診断 →</Link>
            <Link href="/menhera" className="text-pink-400 hover:text-pink-300 text-sm">🖤 メンヘラ度診断 →</Link>
            <Link href="/gacha" className="text-amber-400 hover:text-amber-300 text-sm">💰 課金スタイル診断 →</Link>
          </div>
        </div>
      </div>
    </main>
  );
}
