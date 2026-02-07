import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "プライバシーポリシー | fugaapp",
  description: "fugaappのプライバシーポリシー",
};

export default function PrivacyPage(): React.ReactElement {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50">
      {/* Header Nav */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="text-lg font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
            fugaapp
          </Link>
          <div className="flex items-center gap-6 text-sm font-medium text-gray-600">
            <Link href="/" className="hover:text-purple-500 transition-colors">トップ</Link>
            <Link href="/blog" className="hover:text-purple-500 transition-colors">ブログ</Link>
            <Link href="/about" className="hover:text-purple-500 transition-colors">About</Link>
            <Link href="/contact" className="hover:text-purple-500 transition-colors">お問い合わせ</Link>
          </div>
        </div>
      </nav>

      <main className="max-w-2xl mx-auto px-4 py-12">
        <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">
            プライバシーポリシー
          </h1>

          <div className="space-y-6 text-gray-600 text-sm leading-relaxed">
            <section>
              <h2 className="text-lg font-bold text-gray-700 mb-2">
                1. 個人情報の収集について
              </h2>
              <p>
                当サイト「fugaapp」では、診断やゲームの回答内容をサーバーに保存・収集することはありません。
                すべての処理はお使いのブラウザ上で完結します。
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-gray-700 mb-2">
                2. 広告について
              </h2>
              <p>
                当サイトでは、第三者配信の広告サービス（Google AdSense）を利用する予定です。
                広告配信事業者は、ユーザーの興味に応じた広告を表示するためにCookieを使用することがあります。
                Cookieを無効にする方法やGoogleアドセンスに関する詳細は、
                <a href="https://policies.google.com/technologies/ads?hl=ja" target="_blank" rel="noopener noreferrer" className="text-purple-500 hover:text-purple-600">
                  広告 – ポリシーと規約 – Google
                </a>
                をご確認ください。
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-gray-700 mb-2">
                3. アクセス解析について
              </h2>
              <p>
                当サイトでは、サービス向上のためにアクセス解析ツールを使用する場合があります。
                これらのツールはCookieを使用してアクセス情報を収集しますが、
                個人を特定する情報は含まれません。
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-gray-700 mb-2">
                4. 外部サービスへの共有
              </h2>
              <p>
                診断結果をX（Twitter）でシェアする機能を提供していますが、
                これはユーザー自身の操作によるものであり、
                当サイトが自動的に情報を送信することはありません。
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-gray-700 mb-2">
                5. 免責事項
              </h2>
              <p>
                当サイトの診断結果はエンターテインメント目的であり、
                医学的・心理学的な診断ではありません。
                特にADHD、ASD、HSPなどに関するコンテンツは、
                あくまで自己理解のきっかけを提供するものであり、
                正式な診断は専門の医療機関でのみ行えます。
                診断結果について当サイトは一切の責任を負いません。
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-gray-700 mb-2">
                6. お問い合わせ
              </h2>
              <p>
                本ポリシーに関するお問い合わせは、
                <a
                  href="https://x.com/fuga_If"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-500 hover:text-purple-600"
                >
                  X (@fuga_If)
                </a>
                までお願いいたします。
              </p>
            </section>

            <p className="text-xs text-gray-400 mt-8">
              最終更新日: 2026年2月7日
            </p>
          </div>

          <div className="mt-8 text-center">
            <Link
              href="/"
              className="inline-block px-6 py-3 bg-gradient-to-r from-purple-400 to-pink-400 text-white font-bold rounded-full hover:opacity-90 transition-opacity"
            >
              トップに戻る
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-sm text-gray-400 border-t border-gray-100">
        <div className="flex flex-wrap justify-center gap-6 mb-3">
          <Link href="/" className="hover:text-purple-400 transition-colors">トップ</Link>
          <Link href="/blog" className="hover:text-purple-400 transition-colors">ブログ</Link>
          <Link href="/about" className="hover:text-purple-400 transition-colors">About</Link>
          <Link href="/contact" className="hover:text-purple-400 transition-colors">お問い合わせ</Link>
          <Link href="/terms" className="hover:text-purple-400 transition-colors">利用規約</Link>
          <Link href="/privacy" className="text-purple-500">プライバシーポリシー</Link>
        </div>
        <p>© 2026 fugaapp</p>
      </footer>
    </div>
  );
}
