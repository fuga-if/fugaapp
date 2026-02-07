"use client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SainouHome(): React.ReactElement {
  const router = useRouter();
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-8">
      <div className="text-center animate-fade-in w-full max-w-sm">
        <div className="mb-6 animate-float">
          <Image src="/images/sainou/main.png" alt="隠れ才能診断" width={280} height={280} className="mx-auto drop-shadow-[0_0_20px_rgba(245,158,11,0.3)]" priority />
        </div>

        <div className="bg-white/80 backdrop-blur border border-amber-200 rounded-2xl p-6 mb-6 shadow-lg">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-500 to-purple-500 bg-clip-text text-transparent mb-2">隠れ才能診断</h1>
          <p className="text-gray-700 text-lg mb-4 leading-relaxed">
            まだ気づいてない才能がある。<br />10問で見つかるあなたの隠れた力！
          </p>
          <button
            onClick={() => router.push("/sainou/quiz")}
            className="px-12 py-5 rounded-xl font-bold text-xl shadow-lg bg-gradient-to-r from-amber-500 to-purple-500 hover:from-amber-400 hover:to-purple-400 text-white transition-all transform hover:scale-105 active:scale-95"
          >
            💎 診断スタート
          </button>
          <p className="text-sm text-gray-400 mt-4">※ 全10問・約2分で完了</p>
        </div>

        <div className="pt-4">
          <p className="text-xs text-gray-400 mb-3">▼ 他の診断もやってみる？</p>
          <div className="flex flex-col gap-2">
            <Link href="/motivation" className="text-amber-500/70 hover:text-amber-500 text-sm">⚡ モチベーション源泉診断 →</Link>
            <Link href="/shikou-type" className="text-amber-500/70 hover:text-amber-500 text-sm">🧠 思考タイプ診断 →</Link>
            <Link href="/commu-style" className="text-amber-500/70 hover:text-amber-500 text-sm">💬 コミュニケーションスタイル診断 →</Link>
          </div>
        </div>
      </div>
    </main>
  );
}
