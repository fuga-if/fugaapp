"use client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function MotivationHome(): React.ReactElement {
  const router = useRouter();
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-8">
      <div className="text-center animate-fade-in w-full max-w-sm">
        <div className="mb-6 animate-float">
          <Image src="/images/motivation/main.png" alt="モチベーション源泉診断" width={280} height={280} className="mx-auto drop-shadow-lg" priority />
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">モチベーション<br />源泉診断</h1>
        <p className="text-purple-600 text-lg mb-6 leading-relaxed">
          あなたのやる気スイッチ、どこにある？<br />10問で源泉を特定！
        </p>
        <button
          onClick={() => router.push("/motivation/quiz")}
          className="px-12 py-5 rounded-full font-bold text-xl shadow-lg bg-gradient-to-r from-purple-500 to-amber-500 hover:from-purple-600 hover:to-amber-600 text-white transition-all transform hover:scale-105 active:scale-95 mb-6"
        >
          診断スタート ⚡
        </button>
        <p className="text-sm text-gray-400 mb-8">※ 全10問・約2分で完了</p>
        <div className="pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-400 mb-3">他の診断もやってみる？</p>
          <div className="flex flex-col gap-2">
            <Link href="/commu-style" className="text-amber-500 hover:text-amber-600 text-sm">💬 コミュニケーションスタイル診断 →</Link>
            <Link href="/shikou-type" className="text-blue-500 hover:text-blue-600 text-sm">🧠 思考タイプ診断 →</Link>
            <Link href="/inkya-youkya" className="text-purple-500 hover:text-purple-600 text-sm">🌓 陰キャ陽キャスペクトラム診断 →</Link>
          </div>
        </div>
      </div>
    </main>
  );
}
