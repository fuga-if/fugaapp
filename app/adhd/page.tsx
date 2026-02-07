"use client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AdhdHome(): React.ReactElement {
  const router = useRouter();
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-8">
      <div className="text-center animate-fade-in w-full max-w-sm">
        <div className="mb-6 animate-float">
          <Image src="/images/adhd/main.png" alt="ADHD傾向チェック" width={280} height={280} className="mx-auto drop-shadow-lg" priority />
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">ADHD傾向チェック</h1>
        <p className="text-orange-500 text-lg mb-6 leading-relaxed">
          集中力のクセを知る。<br />あなたの脳タイプ診断
        </p>
        <button
          onClick={() => router.push("/adhd/quiz")}
          className="px-12 py-5 rounded-full font-bold text-xl shadow-lg bg-gradient-to-r from-orange-400 to-yellow-400 hover:from-orange-500 hover:to-yellow-500 text-white transition-all transform hover:scale-105 active:scale-95 mb-6"
        >
          診断スタート 🚀
        </button>
        <p className="text-sm text-gray-400 mb-8">※ 全10問・約2分で完了</p>
        
        <div className="text-xs text-gray-400 mt-8 p-4 bg-gray-50 rounded-lg">
          <p className="mb-1">※このチェックは医学的診断ではありません</p>
          <p className="mb-1">※ADHDの診断は専門医のみが行えます</p>
          <p>※気になる症状がある場合は医療機関にご相談ください</p>
        </div>

        <div className="pt-6 border-t border-gray-200 mt-6">
          <p className="text-xs text-gray-400 mb-3">他の診断もやってみる？</p>
          <div className="flex flex-col gap-2">
            <Link href="/shikou-type" className="text-blue-500 hover:text-blue-600 text-sm">🧠 思考タイプ診断 →</Link>
            <Link href="/stress-taisho" className="text-green-500 hover:text-green-600 text-sm">🌿 ストレス対処法タイプ診断 →</Link>
            <Link href="/motivation" className="text-purple-500 hover:text-purple-600 text-sm">⚡ モチベーション源泉診断 →</Link>
          </div>
        </div>
      </div>
    </main>
  );
}
