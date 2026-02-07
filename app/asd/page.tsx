import Link from "next/link";
import Image from "next/image";

export default function AsdTopPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      <div className="max-w-lg w-full text-center">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-blue-100">
          <div className="mb-6">
            <Image
              src="/images/asd/main.png"
              alt="ASD傾向チェック"
              width={200}
              height={200}
              className="mx-auto drop-shadow-lg"
              priority
            />
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
            ASD傾向チェック
          </h1>
          
          <p className="text-lg text-blue-500 font-medium mb-4">
             独自の視点は才能。あなたのコミュニケーションスタイル診断
          </p>
          
          <p className="text-gray-600 mb-8 leading-relaxed">
            ASD（自閉スペクトラム症）は、コミュニケーションや
            こだわり、感覚に特徴のある発達特性です。
            <br />
            <span className="text-blue-500 font-medium">10個の質問</span>であなたの
            ASD傾向をチェックします。
          </p>

          <div className="bg-blue-50 rounded-2xl p-4 mb-8 border border-blue-100">
            <p className="text-blue-600 text-sm">
               人口の約1〜2%がASDとされています（CDC, 2020）
            </p>
          </div>

          <Link
            href="/asd/quiz"
            className="inline-block w-full px-8 py-4 rounded-full font-bold text-lg shadow-lg bg-gradient-to-r from-blue-400 to-cyan-400 text-white hover:from-blue-500 hover:to-cyan-500 transition-all duration-300 transform hover:scale-105 active:scale-95"
          >
            チェックをはじめる 
          </Link>

          <p className="mt-6 text-sm text-gray-400">
            所要時間：約2分
          </p>
        </div>

        {/* 注意書き */}
        <div className="text-xs text-gray-400 mt-8 p-4 bg-gray-50 rounded-lg">
          <p className="mb-1">※このチェックは医学的診断ではありません</p>
          <p className="mb-1">※ASDの診断は専門医のみが行えます</p>
          <p>※気になる症状がある場合は医療機関にご相談ください</p>
        </div>
      </div>
    </main>
  );
}
