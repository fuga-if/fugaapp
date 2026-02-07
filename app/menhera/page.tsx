"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function MenheraHome(): React.ReactElement {
  const router = useRouter();

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-8">
      <div className="text-center animate-fade-in w-full max-w-sm">
        <div className="mb-6 animate-float">
          <Image
            src="/images/menhera/menhera-01-sad.png"
            alt="メンヘラちゃん"
            width={240}
            height={240}
            className="mx-auto drop-shadow-lg"
            priority
          />
        </div>

        <div className="mb-4">
          <Image
            src="/images/menhera/logo.png"
            alt="メンヘラ度診断"
            width={360}
            height={197}
            className="mx-auto w-full max-w-[85vw]"
            priority
          />
        </div>

        <p className="text-gray-600 text-lg mb-6 leading-relaxed">
          10個の質問に答えて、
          <br />
          あなたのメンヘラ度をチェック!
        </p>

        <div className="space-y-4 mb-6">
          <button
            onClick={() => router.push("/menhera/quiz")}
            className="px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg bg-gradient-to-r from-pink-400 via-pink-500 to-purple-500 text-white hover:from-pink-500 hover:via-pink-600 hover:to-purple-600 hover:shadow-pink-300/50 text-xl py-5 px-12"
          >
            診断スタート
          </button>
        </div>

        <p className="text-sm text-pink-400 mb-8">
          ※ この診断はジョークです
        </p>

        <div className="pt-6 border-t border-pink-100">
          <p className="text-xs text-gray-400 mb-3">他の診断もやってみる？</p>
          <div className="flex flex-col gap-2">
            <Link href="/oshi" className="inline-flex items-center justify-center gap-2 text-pink-400 hover:text-pink-500 transition-colors text-sm">
              💖 推し活タイプ診断 <span className="text-xs">→</span>
            </Link>
            <Link href="/gacha" className="inline-flex items-center justify-center gap-2 text-amber-500 hover:text-amber-600 transition-colors text-sm">
              💰 課金スタイル診断 <span className="text-xs">→</span>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
