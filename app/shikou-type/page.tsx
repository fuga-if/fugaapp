"use client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ShikouTypeHome(): React.ReactElement {
  const router = useRouter();
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-8">
      <div className="text-center animate-fade-in w-full max-w-sm">
        <div className="mb-6 animate-float">
          <Image src="/images/shikou-type/main.png" alt="思考タイプ診断" width={280} height={280} className="mx-auto drop-shadow-lg" priority />
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">思考タイプ診断</h1>
        <p className="text-blue-600 text-lg mb-6 leading-relaxed">
          あなたの脳はどう考えてる？<br />10問で思考のクセが丸わかり！
        </p>
        <button
          onClick={() => router.push("/shikou-type/quiz")}
          className="px-12 py-5 rounded-full font-bold text-xl shadow-lg bg-gradient-to-r from-blue-500 to-amber-500 hover:from-blue-600 hover:to-amber-600 text-white transition-all transform hover:scale-105 active:scale-95 mb-6"
        >
          診断スタート 🧠
        </button>
        <p className="text-sm text-gray-400 mb-8">※ 全10問・約2分で完了</p>
        <div className="pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-400 mb-3">他の診断もやってみる？</p>
          <div className="flex flex-col gap-2">
            <Link href="/inkya-youkya" className="text-purple-500 hover:text-purple-600 text-sm">🌓 陰キャ陽キャスペクトラム診断 →</Link>
            <Link href="/menhera" className="text-pink-500 hover:text-pink-600 text-sm">🖤 メンヘラ度診断 →</Link>
            <Link href="/gamer-type" className="text-red-500 hover:text-red-600 text-sm">🎮 ゲーマータイプ診断 →</Link>
          </div>
        </div>
      </div>
    </main>
  );
}
