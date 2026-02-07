import Link from "next/link";

export default function ReactionTestLayout({
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
        <p>© 2026 反射神経テスト</p>
        <p className="mt-1">
          Created by fuga |{" "}
          <Link
            href="/privacy"
            className="text-emerald-400 hover:text-emerald-300 transition-colors"
          >
            プライバシーポリシー
          </Link>
          {" | "}
          <Link
            href="/"
            className="text-emerald-400 hover:text-emerald-300 transition-colors"
          >
            トップ
          </Link>
        </p>
      </footer>
    </div>
  );
}
