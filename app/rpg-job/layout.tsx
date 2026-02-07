import Link from "next/link";
import type { Metadata } from "next";
import { DotGothic16 } from "next/font/google";

const dotGothic = DotGothic16({ weight: "400", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "人生RPGジョブ診断 - もしあなたの人生がRPGだったら？",
  description: "10問の冒険クエストで、あなたの人生ジョブが判明！勇者？魔法使い？盗賊？僧侶？吟遊詩人？錬金術師？",
  openGraph: {
    title: "人生RPGジョブ診断",
    description: "もしあなたの人生がRPGだったら？10問で判明するジョブクラス！",
    images: [{ url: "/api/og/rpg-job", width: 1200, height: 630, type: "image/png" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "人生RPGジョブ診断",
    images: [{ url: "/api/og/rpg-job", width: 1200, height: 630, type: "image/png" }],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${dotGothic.className} min-h-screen flex flex-col bg-gradient-to-b from-[#0F172A] to-[#1E293B]`}>
      <main className="flex-grow">{children}</main>
      <footer className="py-4 text-center text-sm text-slate-500">
        <p>© 2026 人生RPGジョブ診断</p>
        <p className="mt-1">
          Created by fuga |{" "}
          <Link href="/privacy" className="text-amber-400/60 hover:text-amber-400 transition-colors">プライバシーポリシー</Link>
          {" | "}
          <Link href="/" className="text-amber-400/60 hover:text-amber-400 transition-colors">診断一覧</Link>
        </p>
      </footer>
    </div>
  );
}
