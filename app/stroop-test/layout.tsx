import Link from "next/link";

export default function StroopTestLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "#F5F5F5" }}
    >
      <main className="flex-grow">{children}</main>
      <footer className="py-4 text-center text-sm text-gray-400">
        <p>&copy; 2026 ストループテスト</p>
        <p className="mt-1">
          Created by fuga |{" "}
          <Link
            href="/privacy"
            className="text-indigo-500 hover:text-indigo-400 transition-colors"
          >
            プライバシーポリシー
          </Link>
          {" | "}
          <Link
            href="/"
            className="text-indigo-500 hover:text-indigo-400 transition-colors"
          >
            トップ
          </Link>
        </p>
      </footer>
    </div>
  );
}
