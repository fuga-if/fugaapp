import Link from "next/link";

export default function MyBestIndex(): React.ReactElement {
  return (
    <div className="px-4 pt-16 pb-12">
      <h1 className="text-2xl font-bold text-center text-white tracking-tight mb-2">
        MY BEST
      </h1>
      <p className="text-neutral-500 text-center text-xs mb-10">
        声優メーカーを選んでXでシェアしよう
      </p>

      <div className="max-w-sm mx-auto space-y-4">
        <Link
          href="/my-best/seiyuu"
          className="block rounded-2xl bg-neutral-900 border border-neutral-800 p-5 active:bg-neutral-800 transition-colors"
        >
          <p className="text-white font-bold text-base mb-1">
            私のベスト声優
          </p>
          <p className="text-neutral-500 text-xs">
            推し声優を選んでベストキャラ3選の画像を作ろう
          </p>
        </Link>

        <Link
          href="/my-best/seiyuu-9"
          className="block rounded-2xl bg-neutral-900 border border-neutral-800 p-5 active:bg-neutral-800 transition-colors relative overflow-hidden"
        >
          <span className="absolute top-3 right-3 text-[10px] font-bold bg-white text-black px-2 py-0.5 rounded-full">
            NEW
          </span>
          <p className="text-white font-bold text-base mb-1">
            私を構成する9人の声優
          </p>
          <p className="text-neutral-500 text-xs">
            9人の声優を選んで、あなたを構成する声優マップを作ろう
          </p>
        </Link>
      </div>

      <footer className="mt-16 text-center text-[10px] text-neutral-600 space-y-1">
        <p>
          <Link href="/my-best/terms" className="underline hover:text-neutral-400">
            利用規約
          </Link>
          {" | "}
          <Link href="/privacy" className="underline hover:text-neutral-400">
            プライバシーポリシー
          </Link>
        </p>
        <p>&copy; 2026 fugaapp</p>
      </footer>
    </div>
  );
}
