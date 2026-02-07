import Link from "next/link";
import Image from "next/image";
import { getDiagnosesByCategory, getNewestDiagnoses, getPopularDiagnoses, getPopularGames, type DiagnosisInfo } from "@/lib/diagnoses";
import { getLatestPosts } from "@/lib/blog/posts";

function AppCard({ d, actionLabel }: { d: DiagnosisInfo; actionLabel: string }) {
  return (
    <Link
      href={`/${d.slug}`}
      className={`group bg-white rounded-3xl shadow-md ${d.border} border-2 ${d.hoverBorder} hover:shadow-xl transition-all duration-300 transform hover:scale-[1.03] overflow-hidden`}
    >
      <div className={`bg-gradient-to-br ${d.bgGradient} p-6 flex items-center justify-center`}>
        <Image
          src={d.image}
          alt={d.title}
          width={140}
          height={140}
          className="object-contain drop-shadow-md group-hover:scale-110 transition-transform duration-300"
        />
      </div>
      <div className="p-5">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-2xl">{d.emoji}</span>
          <h2 className="text-lg font-bold text-gray-800">{d.title}</h2>
        </div>
        <p className="text-sm text-gray-500">{d.description}</p>
        <div className={`mt-4 inline-flex items-center gap-1 text-sm font-medium bg-gradient-to-r ${d.gradient} bg-clip-text text-transparent`}>
          {actionLabel} →
        </div>
      </div>
    </Link>
  );
}

function SmallCard({ d }: { d: DiagnosisInfo }) {
  return (
    <Link
      href={`/${d.slug}`}
      className={`group flex-shrink-0 w-40 bg-white rounded-2xl shadow-md ${d.border} border-2 ${d.hoverBorder} hover:shadow-lg transition-all duration-300 overflow-hidden`}
    >
      <div className={`bg-gradient-to-br ${d.bgGradient} p-3 flex items-center justify-center h-24`}>
        <Image
          src={d.image}
          alt={d.title}
          width={64}
          height={64}
          className="object-contain drop-shadow-md group-hover:scale-110 transition-transform duration-300"
        />
      </div>
      <div className="p-3">
        <div className="flex items-center gap-1 mb-1">
          <span className="text-base">{d.emoji}</span>
          <h3 className="text-sm font-bold text-gray-800 truncate">{d.shortTitle}</h3>
        </div>
      </div>
    </Link>
  );
}

export default function Home(): React.ReactElement {
  const latestPosts = getLatestPosts(3);
  const { shindan, game } = getDiagnosesByCategory();
  const newestDiagnoses = getNewestDiagnoses(6);
  const popularDiagnoses = getPopularDiagnoses(6);
  const popularGames = getPopularGames(6);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50">
      {/* Header Nav */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="text-lg font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
            fugaapp
          </Link>
          <div className="flex items-center gap-6 text-sm font-medium text-gray-600">
            <Link href="/" className="text-purple-500">トップ</Link>
            <Link href="/blog" className="hover:text-purple-500 transition-colors">ブログ</Link>
            <Link href="/about" className="hover:text-purple-500 transition-colors">About</Link>
            <Link href="/contact" className="hover:text-purple-500 transition-colors">お問い合わせ</Link>
          </div>
        </div>
      </nav>

      {/* Header */}
      <header className="pt-12 pb-8 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent mb-4">
          診断 & ゲーム
        </h1>
        <p className="text-gray-500 text-lg max-w-md mx-auto">
          気になるアプリを選んで、結果をシェアしよう！
        </p>
      </header>

      <main className="max-w-4xl mx-auto px-4 pb-16">
        {/*  テオマキア - ピックアップ */}
        <section className="mb-10">
          <Link
            href="/theomachia"
            className="group block rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-amber-200/30 hover:border-amber-300/60"
          >
            <div className="relative">
              <Image
                src="/theomachia/banner.png"
                alt="THEOMACHIA - 神々の戦い"
                width={1200}
                height={630}
                className="w-full h-auto group-hover:scale-[1.02] transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-5 right-5">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold bg-amber-500 text-black px-2 py-0.5 rounded-full">NEW</span>
                  <span className="text-xs text-amber-200/80">2人対戦カードゲーム</span>
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-white tracking-wider">THEOMACHIA <span className="text-sm font-normal text-amber-200/80">- 神々の戦い</span></h2>
                <p className="text-sm text-gray-300 mt-1">神話カードで激突する対戦ゲーム。友達とオンラインで対戦しよう！</p>
              </div>
            </div>
          </Link>
        </section>

        {/*  人気診断 */}
        {popularDiagnoses.length > 0 && (
          <section className="mb-10">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl"></span>
              <h2 className="text-xl font-bold text-gray-800">人気診断</h2>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
              {popularDiagnoses.map((d) => (
                <SmallCard key={d.slug} d={d} />
              ))}
            </div>
          </section>
        )}

        {/*  人気ゲーム */}
        {popularGames.length > 0 && (
          <section className="mb-10">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl"></span>
              <h2 className="text-xl font-bold text-gray-800">人気ゲーム</h2>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
              {popularGames.map((d) => (
                <SmallCard key={d.slug} d={d} />
              ))}
            </div>
          </section>
        )}

        {/* 🆕 新着 */}
        {newestDiagnoses.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">🆕</span>
              <h2 className="text-xl font-bold text-gray-800">新着</h2>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
              {newestDiagnoses.map((d) => (
                <SmallCard key={d.slug} d={d} />
              ))}
            </div>
          </section>
        )}

        {/*  ゲーム・テスト */}
        {game.length > 0 && (
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-3xl"></span>
              <h2 className="text-2xl font-bold text-gray-800">ゲーム・テスト</h2>
              <span className="text-sm text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{game.length}</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {game.map((d) => (
                <AppCard key={d.slug} d={d} actionLabel="プレイする" />
              ))}
            </div>
          </section>
        )}

        {/*  診断アプリ */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-3xl"></span>
            <h2 className="text-2xl font-bold text-gray-800">診断アプリ</h2>
            <span className="text-sm text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{shindan.length}</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {shindan.map((d) => (
              <AppCard key={d.slug} d={d} actionLabel="診断する" />
            ))}
          </div>
        </section>

        {/* Blog Section */}
        <section className="mt-20">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
               最新の記事
            </h2>
            <p className="text-gray-500">診断に関連するコラムや豆知識</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {latestPosts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group bg-white rounded-2xl shadow-md border border-gray-100 hover:border-purple-200 hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 flex items-center justify-center aspect-[16/10] relative overflow-hidden">
                  {post.image ? (
                    <Image
                      src={post.image}
                      alt={post.title}
                      width={240}
                      height={150}
                      className="object-contain group-hover:scale-110 transition-transform duration-300 max-h-[120px]"
                    />
                  ) : (
                    <span className="text-5xl group-hover:scale-110 transition-transform duration-300">
                      {post.emoji}
                    </span>
                  )}
                </div>
                <div className="p-4">
                  <time className="text-xs text-gray-400">{post.date}</time>
                  <h3 className="text-base font-bold text-gray-800 mt-1 mb-1 group-hover:text-purple-600 transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-sm text-gray-500 line-clamp-2">{post.description}</p>
                </div>
              </Link>
            ))}
          </div>
          <div className="text-center mt-6">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-purple-500 hover:text-purple-600 font-medium transition-colors"
            >
              記事一覧を見る →
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-sm text-gray-400 border-t border-gray-100">
        <div className="flex flex-wrap justify-center gap-6 mb-3">
          <Link href="/" className="hover:text-purple-400 transition-colors">トップ</Link>
          <Link href="/blog" className="hover:text-purple-400 transition-colors">ブログ</Link>
          <Link href="/about" className="hover:text-purple-400 transition-colors">About</Link>
          <Link href="/contact" className="hover:text-purple-400 transition-colors">お問い合わせ</Link>
          <Link href="/terms" className="hover:text-purple-400 transition-colors">利用規約</Link>
          <Link href="/privacy" className="hover:text-purple-400 transition-colors">プライバシーポリシー</Link>
        </div>
        <p>© 2026 fugaapp</p>
        <p className="mt-1">
          Created by fuga
        </p>
      </footer>
    </div>
  );
}
