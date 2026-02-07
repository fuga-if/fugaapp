"use client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function VtuberHome(): React.ReactElement {
  const router = useRouter();
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-8">
      <div className="text-center animate-fade-in w-full max-w-sm">
        <div className="mb-6 animate-float"><Image src="/images/vtuber/main-visual.png" alt="Vtuberオタク" width={280} height={280} className="mx-auto drop-shadow-lg" priority /></div>
        <h1 className="text-3xl font-bold text-white mb-2 drop-shadow-lg">Vtuberオタク<br />タイプ診断</h1>
        <p className="text-purple-200 text-lg mb-6 leading-relaxed">10個の質問に答えて、<br />あなたのリスナータイプを診断！</p>
        <button onClick={() => router.push("/vtuber/quiz")} className="px-12 py-5 rounded-full font-bold text-xl shadow-lg bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white transition-all transform hover:scale-105 active:scale-95 mb-6">診断スタート</button>
        <p className="text-sm text-purple-300 mb-8">※ 楽しんでね！</p>
        <div className="pt-6 border-t border-purple-700">
          <p className="text-xs text-purple-400 mb-3">他の診断もやってみる？</p>
          <div className="flex flex-col gap-2">
            <Link href="/menhera" className="text-pink-400 hover:text-pink-300 text-sm">🖤 メンヘラ度診断 →</Link>
            <Link href="/oshi" className="text-pink-400 hover:text-pink-300 text-sm">💖 推し活診断 →</Link>
          </div>
        </div>
      </div>
    </main>
  );
}
