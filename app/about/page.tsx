import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About | fugaapp",
  description: "fugaappについて。運営者情報やお問い合わせ先をご案内します。",
  openGraph: {
    title: "About | fugaapp",
    description: "fugaappについて。運営者情報やお問い合わせ先をご案内します。",
    type: "website",
    locale: "ja_JP",
    siteName: "fugaapp",
  },
};

export default function AboutPage() {
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
            <Link href="/about" className="text-purple-500">About</Link>
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="max-w-2xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          fugaapp について
        </h1>

        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-8 space-y-8">
          {/* About */}
          <section>
            <h2 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
              <span></span> サイトについて
            </h2>
            <p className="text-gray-600 leading-relaxed">
              fugaappは、誰でも気軽に楽しめる診断アプリをまとめたサイトです。
              メンヘラ度診断、推し活診断、Vtuberオタク診断など、オタク文化やネットカルチャーに関連した
              楽しい診断を提供しています。
            </p>
            <p className="text-gray-600 leading-relaxed mt-3">
              診断結果はSNSでシェアして、友達と盛り上がることもできます。
              ちょっとした暇つぶしや話のネタとして楽しんでもらえたら嬉しいです。
            </p>
          </section>

          {/* Operator */}
          <section>
            <h2 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
              <span></span> 運営者
            </h2>
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-gray-700 font-medium">fuga</p>
              <p className="text-gray-500 text-sm mt-1">個人で開発・運営しています</p>
            </div>
          </section>

          {/* Contact */}
          <section>
            <h2 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
              <span></span> お問い合わせ
            </h2>
            <p className="text-gray-600 leading-relaxed">
              ご意見・ご要望・お問い合わせは、X（旧Twitter）のDMにてお気軽にどうぞ。
            </p>
            <a
              href="https://x.com/fuga_If"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-3 bg-gray-900 text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-gray-700 transition-colors"
            >
              𝕏 @fuga_If
            </a>
          </section>

          {/* Policy */}
          <section>
            <h2 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
              <span></span> ポリシー
            </h2>
            <p className="text-gray-600 leading-relaxed">
              当サイトのプライバシーポリシーについては
              <Link href="/privacy" className="text-purple-500 hover:text-purple-600 underline transition-colors">
                こちら
              </Link>
              をご覧ください。
            </p>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-sm text-gray-400 border-t border-gray-100">
        <div className="flex justify-center gap-6 mb-3">
          <Link href="/" className="hover:text-purple-400 transition-colors">トップ</Link>
          <Link href="/blog" className="hover:text-purple-400 transition-colors">ブログ</Link>
          <Link href="/about" className="hover:text-purple-400 transition-colors">About</Link>
          <Link href="/privacy" className="hover:text-purple-400 transition-colors">プライバシーポリシー</Link>
        </div>
        <p>© 2026 fugaapp</p>
      </footer>
    </div>
  );
}
