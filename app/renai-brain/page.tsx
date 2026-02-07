"use client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RenaiBrainHome(): React.ReactElement {
  const router = useRouter();
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-8">
      <div className="text-center animate-fade-in w-full max-w-sm">
        <div className="mb-6 animate-float">
          <Image src="/images/renai-brain/main.png" alt="恋愛脳レベル診断" width={280} height={280} className="mx-auto drop-shadow-lg" priority />
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">恋愛脳レベル診断</h1>
        <p className="text-pink-500 text-lg mb-6 leading-relaxed">
          あなたの恋愛脳、どのくらい？<br />10問でバレる恋愛への本気度
        </p>
        <button
          onClick={() => router.push("/renai-brain/quiz")}
          className="px-12 py-5 rounded-full font-bold text-xl shadow-lg bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white transition-all transform hover:scale-105 active:scale-95 mb-6"
        >
          診断スタート 
        </button>
        <p className="text-sm text-gray-400 mb-8">※ 全10問・約2分で完了</p>
        <div className="pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-400 mb-3">他の診断もやってみる？</p>
          <div className="flex flex-col gap-2">
            <Link href="/menhera" className="text-pink-500 hover:text-pink-600 text-sm"> メンヘラ度診断 →</Link>
            <Link href="/stress-taisho" className="text-green-500 hover:text-green-600 text-sm"> ストレス対処法タイプ診断 →</Link>
            <Link href="/commu-style" className="text-amber-500 hover:text-amber-600 text-sm"> コミュニケーションスタイル診断 →</Link>
          </div>
        </div>
      </div>
    </main>
  );
}
