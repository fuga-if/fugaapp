"use client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function OtakuKakuredoHome(): React.ReactElement {
  const router = useRouter();
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-8">
      <div className="text-center animate-fade-in w-full max-w-sm">
        <div className="mb-6 animate-float"><Image src="/images/otaku-kakuredo/main.png" alt="オタクの隠れ度診断" width={280} height={280} className="mx-auto drop-shadow-[0_0_30px_rgba(255,165,0,0.3)]" priority /></div>
        <h1 className="text-3xl font-bold text-white mb-2 drop-shadow-lg">オタクの隠れ度<br />診断</h1>
        <p className="text-orange-200 text-lg mb-6 leading-relaxed">10個の質問に答えて、<br />あなたのオタク隠れ度を診断！</p>
        <button onClick={() => router.push("/otaku-kakuredo/quiz")} className="px-12 py-5 rounded-full font-bold text-xl shadow-lg bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-400 hover:to-amber-500 text-white transition-all transform hover:scale-105 active:scale-95 mb-6">診断スタート</button>
        <p className="text-sm text-orange-400 mb-8">※ あなたのオタク、バレてる？🥷</p>
        <div className="pt-6 border-t border-orange-800">
          <p className="text-xs text-orange-600 mb-3">他の診断もやってみる？</p>
          <div className="flex flex-col gap-2">
            <Link href="/commu-ryoku" className="text-teal-400 hover:text-teal-300 text-sm">🗣️ オタクコミュ力診断 →</Link>
            <Link href="/gacha" className="text-amber-400 hover:text-amber-300 text-sm">💰 課金スタイル診断 →</Link>
            <Link href="/sns-fatigue" className="text-blue-400 hover:text-blue-300 text-sm">📱 SNS疲れ診断 →</Link>
          </div>
        </div>
      </div>
    </main>
  );
}
