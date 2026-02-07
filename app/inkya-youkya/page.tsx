"use client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function InkyaYoukyaHome(): React.ReactElement {
  const router = useRouter();
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-8">
      <div className="text-center animate-fade-in w-full max-w-sm">
        <div className="mb-6 animate-float">
          <Image src="/images/inkya-youkya/main.png" alt="陰キャ陽キャスペクトラム診断" width={280} height={280} className="mx-auto drop-shadow-lg" priority />
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">陰キャ陽キャスペクトラム診断</h1>
        <p className="text-purple-600 text-lg mb-6 leading-relaxed">
          あなたは陰と陽のどこにいる？<br />10問で本当の自分を発見！
        </p>
        <button
          onClick={() => router.push("/inkya-youkya/quiz")}
          className="px-12 py-5 rounded-full font-bold text-xl shadow-lg bg-gradient-to-r from-purple-500 to-amber-500 hover:from-purple-600 hover:to-amber-600 text-white transition-all transform hover:scale-105 active:scale-95 mb-6"
        >
          診断スタート 🌓
        </button>
        <p className="text-sm text-gray-400 mb-8">※ 全10問・約2分で完了</p>
        <div className="pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-400 mb-3">他の診断もやってみる？</p>
          <div className="flex flex-col gap-2">
            <Link href="/menhera" className="text-pink-500 hover:text-pink-600 text-sm">🖤 メンヘラ度診断 →</Link>
            <Link href="/commu-ryoku" className="text-teal-500 hover:text-teal-600 text-sm">🗣️ オタクコミュ力診断 →</Link>
            <Link href="/neko-inu" className="text-blue-500 hover:text-blue-600 text-sm">🐱 猫派犬派深層診断 →</Link>
          </div>
        </div>
      </div>
    </main>
  );
}
