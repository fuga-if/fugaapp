import Link from "next/link";
import Image from "next/image";

export default function HspTopPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      <div className="max-w-lg w-full text-center">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-purple-100">
          <div className="mb-6">
            <Image
              src="/images/hsp/main.png"
              alt="HSP診断"
              width={200}
              height={200}
              className="mx-auto drop-shadow-lg"
              priority
            />
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
            HSP診断
          </h1>
          
          <p className="text-lg text-purple-500 font-medium mb-4">
            🌸 繊細さは才能。あなたの感受性レベルをチェック
          </p>
          
          <p className="text-gray-600 mb-8 leading-relaxed">
            HSP（Highly Sensitive Person）とは、生まれつき感受性が高く、
            刺激に敏感な気質を持つ人のこと。
            <br />
            <span className="text-purple-500 font-medium">10個の質問</span>であなたの
            繊細さレベルを診断します。
          </p>

          <div className="bg-purple-50 rounded-2xl p-4 mb-8 border border-purple-100">
            <p className="text-purple-600 text-sm">
              📊 人口の約15〜20%がHSP気質を持つと言われています
            </p>
          </div>

          <Link
            href="/hsp/quiz"
            className="inline-block w-full px-8 py-4 rounded-full font-bold text-lg shadow-lg bg-gradient-to-r from-purple-400 to-pink-400 text-white hover:from-purple-500 hover:to-pink-500 transition-all duration-300 transform hover:scale-105 active:scale-95"
          >
            診断をはじめる 🌿
          </Link>

          <p className="mt-6 text-sm text-gray-400">
            所要時間：約2分
          </p>
        </div>

        {/* 注意書き */}
        <div className="text-xs text-gray-400 mt-8 p-4 bg-gray-50 rounded-lg">
          <p className="mb-1">※このチェックは医学的診断ではありません</p>
          <p className="mb-1">※HSPは病気ではなく、生まれ持った気質のひとつです</p>
          <p>※つらい症状がある場合は専門家にご相談ください</p>
        </div>
      </div>
    </main>
  );
}
