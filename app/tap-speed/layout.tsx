import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "タップ速度テスト - 10秒間で何回タップできる？",
  description:
    "10秒間でできるだけ速くタップ！タップ回数とCPS（Clicks Per Second）でS〜Eランク判定。友達と競い合おう！",
  openGraph: {
    title: "タップ速度テスト - 10秒間で何回タップできる？",
    description:
      "10秒間の連打速度を計測！結果をXでシェアしよう！",
    images: [
      {
        url: "/api/og/tap-speed",
        width: 1200,
        height: 630,
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "タップ速度テスト",
    description: "10秒間で何回タップできる？",
    images: [
      {
        url: "/api/og/tap-speed",
        width: 1200,
        height: 630,
        type: "image/png",
      },
    ],
  },
};

export default function TapSpeedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "#0F172A" }}
    >
      <main className="flex-grow">{children}</main>
      <footer className="py-4 text-center text-sm text-gray-500">
        <p>© 2026 タップ速度テスト</p>
        <p className="mt-1">
          Created by fuga |{" "}
          <Link
            href="/privacy"
            className="text-purple-400 hover:text-purple-300 transition-colors"
          >
            プライバシーポリシー
          </Link>
          {" | "}
          <Link
            href="/"
            className="text-purple-400 hover:text-purple-300 transition-colors"
          >
            診断一覧
          </Link>
        </p>
      </footer>
    </div>
  );
}
