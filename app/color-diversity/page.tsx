import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "色覚多様性チェック | 石原式風テストであなたの色覚タイプをチェック",
  description:
    "石原式風のドットパターンであなたの色覚タイプを簡易チェック！P型・D型・T型・C型、あなたはどのタイプ？",
  openGraph: {
    title: "色覚多様性チェック",
    description: "石原式風テストであなたの色覚タイプをチェック！",
    images: [
      { url: "/api/og/color-diversity", width: 1200, height: 630, type: "image/png" },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "色覚多様性チェック",
    description: "石原式風テストであなたの色覚タイプをチェック！",
    images: ["/api/og/color-diversity"],
  },
};

export default function ColorDiversityPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* ヘッダー */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🌈</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            色覚多様性チェック
          </h1>
          <p className="text-gray-600 text-sm">
            色の見え方は人それぞれ。
            <br />
            あなたの色覚タイプを知ろう
          </p>
        </div>

        {/* 説明カード */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h2 className="font-bold text-gray-800 mb-3">🔍 テストについて</h2>
          <ul className="text-sm text-gray-600 space-y-2">
            <li className="flex items-start gap-2">
              <span className="text-red-400">●</span>
              <span>石原式風のドットパターンで数字を識別</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-400">●</span>
              <span>全10問、4択形式</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-400">●</span>
              <span>P型・D型・T型・C型の傾向をチェック</span>
            </li>
          </ul>
        </div>

        {/* 色覚タイプの説明 */}
        <div className="bg-white/80 rounded-2xl p-4 mb-6">
          <h3 className="font-bold text-gray-700 text-sm mb-3">📊 色覚タイプとは？</h3>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-emerald-50 rounded-lg p-2">
              <span className="font-bold text-emerald-600">C型</span>
              <p className="text-gray-600">一般的な色覚</p>
            </div>
            <div className="bg-red-50 rounded-lg p-2">
              <span className="font-bold text-red-500">P型</span>
              <p className="text-gray-600">赤系が見えにくい</p>
            </div>
            <div className="bg-green-50 rounded-lg p-2">
              <span className="font-bold text-green-600">D型</span>
              <p className="text-gray-600">緑系が見えにくい</p>
            </div>
            <div className="bg-blue-50 rounded-lg p-2">
              <span className="font-bold text-blue-500">T型</span>
              <p className="text-gray-600">青系が見えにくい</p>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            ※ 人口の約5%が色覚特性を持っています
          </p>
        </div>

        {/* スタートボタン */}
        <Link
          href="/color-diversity/play"
          className="block w-full bg-gradient-to-r from-red-400 via-green-400 to-blue-400 text-white font-bold py-4 px-6 rounded-full text-center shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all"
        >
          チェックを始める
        </Link>

        {/* 注意書き */}
        <div className="text-xs text-gray-400 mt-8 p-4 bg-gray-50 rounded-lg">
          <p className="mb-1">※このチェックは医学的診断ではありません</p>
          <p className="mb-1">※正確な色覚検査は眼科で受けてください</p>
          <p>※モニターの設定により結果が変わる場合があります</p>
        </div>
      </div>
    </div>
  );
}
