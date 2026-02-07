import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "お問い合わせ | fugaapp",
  description: "fugaappへのお問い合わせはX（Twitter）のDMからお願いします。",
  openGraph: {
    title: "お問い合わせ | fugaapp",
    description: "fugaappへのお問い合わせはX（Twitter）のDMからお願いします。",
    type: "website",
    locale: "ja_JP",
    siteName: "fugaapp",
  },
};

export default function ContactPage() {
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
            <Link href="/contact" className="text-purple-500">お問い合わせ</Link>
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="max-w-2xl mx-auto px-4 py-16">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 text-center mb-8">
          📩 お問い合わせ
        </h1>

        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-8 text-center">
          <p className="text-gray-700 text-lg mb-6 leading-relaxed">
            fugaappへのお問い合わせは、<br />
            X（Twitter）のDMからお願いします。
          </p>

          <a
            href="https://x.com/fuga_If"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-black text-white font-bold px-8 py-4 rounded-full shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300 text-lg"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
            @fuga_If にDMを送る
          </a>

          <p className="text-gray-400 text-sm mt-8">
            ※ 診断の不具合報告、ご意見・ご要望など、お気軽にどうぞ。
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-sm text-gray-400 border-t border-gray-100">
        <div className="flex justify-center gap-6 mb-3">
          <Link href="/" className="hover:text-purple-400 transition-colors">トップ</Link>
          <Link href="/blog" className="hover:text-purple-400 transition-colors">ブログ</Link>
          <Link href="/about" className="hover:text-purple-400 transition-colors">About</Link>
          <Link href="/contact" className="hover:text-purple-400 transition-colors">お問い合わせ</Link>
          <Link href="/terms" className="hover:text-purple-400 transition-colors">利用規約</Link>
          <Link href="/privacy" className="hover:text-purple-400 transition-colors">プライバシーポリシー</Link>
        </div>
        <p>© 2026 fugaapp</p>
      </footer>
    </div>
  );
}
