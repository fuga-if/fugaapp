import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "利用規約 | 私のベスト声優",
};

export default function MyBestTermsPage(): React.ReactElement {
  return (
    <div className="text-neutral-300 px-4 py-10 max-w-2xl mx-auto">
      <a
        href="/my-best/seiyuu"
        className="inline-flex items-center gap-1 text-neutral-500 text-xs mb-6 active:text-white transition-colors"
      >
        <svg
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M15 19l-7-7 7-7"
          />
        </svg>
        戻る
      </a>

      <h1 className="text-lg font-bold text-white mb-6">
        利用規約 — 私のベスト声優
      </h1>

      <section className="mb-6">
        <h2 className="text-sm font-bold text-white mb-2">
          1. 本サービスについて
        </h2>
        <p className="text-xs leading-relaxed text-neutral-400">
          「私のベスト声優」は、アニメ声優のベストキャラ3選画像を作成・共有するエンターテインメントツールです。
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-sm font-bold text-white mb-2">
          2. データソースについて
        </h2>
        <p className="text-xs leading-relaxed text-neutral-400">
          本サービスは{" "}
          <a
            href="https://anilist.co"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-neutral-200"
          >
            AniList
          </a>{" "}
          のAPIを利用してキャラクター情報を取得しています。キャラクター情報・画像はAniListおよび各権利者に帰属します。
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-sm font-bold text-white mb-2">
          3. キャラクター画像・名称の権利
        </h2>
        <p className="text-xs leading-relaxed text-neutral-400">
          表示されるキャラクター画像および名称の著作権は、各作品の権利者に帰属します。本サービスはファン活動の範囲での利用を想定しています。
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-sm font-bold text-white mb-2">
          4. 生成画像について
        </h2>
        <p className="text-xs leading-relaxed text-neutral-400">
          本サービスで生成される画像は、個人利用およびSNSでのシェアを目的とした利用を想定しています。商用利用はできません。
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-sm font-bold text-white mb-2">5. 対応範囲</h2>
        <p className="text-xs leading-relaxed text-neutral-400">
          本サービスで表示されるキャラクターは、アニメ出演キャラクターのみです。ゲーム・吹替・ドラマCD等のキャラクターは対象外です。
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-sm font-bold text-white mb-2">6. 免責事項</h2>
        <p className="text-xs leading-relaxed text-neutral-400">
          キャラクターデータの正確性・網羅性は保証しません。AniList
          APIの仕様変更等により、予告なく機能が停止する可能性があります。
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-sm font-bold text-white mb-2">7. プライバシー</h2>
        <p className="text-xs leading-relaxed text-neutral-400">
          シェア時に声優名・キャラクター名を匿名で集計記録します。個人を特定する情報は収集しません。詳細は{" "}
          <a href="/privacy" className="underline hover:text-neutral-200">
            プライバシーポリシー
          </a>{" "}
          をご確認ください。
        </p>
      </section>

      <footer className="px-4 py-6 mt-8 border-t border-neutral-800/50 text-center text-[10px] text-neutral-600 space-y-1">
        <p>
          <a
            href="/my-best/terms"
            className="underline hover:text-neutral-400"
          >
            利用規約
          </a>
          {" | "}
          <a href="/privacy" className="underline hover:text-neutral-400">
            プライバシーポリシー
          </a>
        </p>
        <p>&copy; 2026 fugaapp</p>
      </footer>
    </div>
  );
}
