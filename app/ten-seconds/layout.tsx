import Link from "next/link";

export default function TenSecondsLayout({
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
        <p>© 2026 10秒チャレンジ</p>
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
            トップ
          </Link>
        </p>
      </footer>
    </div>
  );
}
