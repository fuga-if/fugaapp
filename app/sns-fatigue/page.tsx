"use client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SnsFatigueHome(): React.ReactElement {
  const router = useRouter();
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-8">
      <div className="text-center animate-fade-in w-full max-w-sm">
        <div className="mb-6 animate-float"><Image src="/images/sns-fatigue/main.png" alt="SNS疲れタイプ診断" width={420} height={420} className="mx-auto drop-shadow-lg w-full max-w-[85vw]" priority /></div>
        <p className="text-gray-600 text-lg mb-6 leading-relaxed">10個の質問に答えて、<br />あなたのSNS疲れタイプを診断！</p>
        <button onClick={() => router.push("/sns-fatigue/quiz")} className="px-12 py-5 rounded-full font-bold text-xl shadow-lg bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 text-white hover:from-cyan-500 hover:via-blue-600 hover:to-indigo-600 transition-all transform hover:scale-105 active:scale-95 mb-6">診断スタート</button>
        <p className="text-sm text-blue-400 mb-8">📱💤 SNSとの付き合い方を見直そう</p>
        <div className="pt-6 border-t border-blue-100">
          <p className="text-xs text-gray-400 mb-3">他の診断もやってみる？</p>
          <div className="flex flex-col gap-2">
            <Link href="/menhera" className="text-blue-400 hover:text-blue-500 text-sm">🖤 メンヘラ度診断 →</Link>
            <Link href="/gacha" className="text-blue-400 hover:text-blue-500 text-sm">💸 課金スタイル診断 →</Link>
          </div>
        </div>
      </div>
    </main>
  );
}
