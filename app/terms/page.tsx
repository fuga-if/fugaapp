import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "利用規約 | fugaapp",
  description: "fugaappの利用規約です。本サービスをご利用いただく前に必ずお読みください。",
  openGraph: {
    title: "利用規約 | fugaapp",
    description: "fugaappの利用規約です。",
    type: "website",
    locale: "ja_JP",
    siteName: "fugaapp",
  },
};

export default function TermsPage() {
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
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="max-w-3xl mx-auto px-4 py-16">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 text-center mb-12">
           利用規約
        </h1>

        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-8 md:p-12 space-y-8 text-gray-700 leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-gray-800 mb-3">第1条（適用）</h2>
            <p>
              本利用規約（以下「本規約」）は、fugaapp（以下「本サービス」）が提供するすべてのサービスの利用条件を定めるものです。ユーザーの皆さまには、本規約に同意のうえ本サービスをご利用いただきます。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-800 mb-3">第2条（定義）</h2>
            <p>
              本規約において「本サービス」とは、fugaappが運営するウェブサイト（fugaapp.site）および関連するすべてのコンテンツ・機能を指します。「ユーザー」とは、本サービスを利用するすべての方を指します。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-800 mb-3">第3条（診断結果について）</h2>
            <p>
              本サービスで提供される診断結果は、エンターテインメントを目的としたものであり、医学的・心理学的な診断や助言を構成するものではありません。診断結果を根拠とした判断や行動について、本サービスは一切の責任を負いません。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-800 mb-3">第4条（禁止事項）</h2>
            <p>ユーザーは、本サービスの利用にあたり、以下の行為を行ってはなりません。</p>
            <ul className="list-disc list-inside mt-2 space-y-1 text-gray-600">
              <li>法令または公序良俗に違反する行為</li>
              <li>本サービスの運営を妨害する行為</li>
              <li>他のユーザーまたは第三者の権利を侵害する行為</li>
              <li>本サービスのコンテンツを無断で転載・複製する行為</li>
              <li>本サービスのサーバーやネットワークに過度の負荷をかける行為</li>
              <li>その他、本サービスが不適切と判断する行為</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-800 mb-3">第5条（知的財産権）</h2>
            <p>
              本サービスに掲載されている文章、画像、イラスト、デザインその他のコンテンツに関する知的財産権は、本サービスまたは正当な権利を有する第三者に帰属します。ユーザーは、本サービスの許可なくこれらを使用することはできません。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-800 mb-3">第6条（免責事項）</h2>
            <p>
              本サービスは、提供する情報の正確性、完全性、有用性等について保証するものではありません。本サービスの利用により生じた損害について、本サービスは故意または重過失がある場合を除き、一切の責任を負いません。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-800 mb-3">第7条（サービスの変更・中断・終了）</h2>
            <p>
              本サービスは、事前の通知なくサービスの内容を変更、中断、または終了する場合があります。これによりユーザーに生じた損害について、本サービスは一切の責任を負いません。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-800 mb-3">第8条（規約の変更）</h2>
            <p>
              本サービスは、必要に応じて本規約を変更することがあります。変更後の規約は、本サービス上に掲載した時点で効力を生じるものとします。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-800 mb-3">第9条（準拠法・管轄裁判所）</h2>
            <p>
              本規約の解釈にあたっては日本法を準拠法とします。本サービスに関して紛争が生じた場合には、東京地方裁判所を第一審の専属的合意管轄裁判所とします。
            </p>
          </section>

          <p className="text-sm text-gray-400 pt-4 border-t border-gray-100">
            制定日：2026年1月15日
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
