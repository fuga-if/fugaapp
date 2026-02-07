import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { getPostsByCategory } from "@/lib/blog/posts";
import BlogTabs from "./BlogTabs";

export const metadata: Metadata = {
  title: "ブログ | fugaapp",
  description: "診断に関連するコラムや記事をお届け。メンヘラあるある、推し活の課金事情、SNS疲れ対策など。",
  openGraph: {
    title: "ブログ | fugaapp",
    description: "診断に関連するコラムや記事をお届け。メンヘラあるある、推し活の課金事情、SNS疲れ対策など。",
    type: "website",
    locale: "ja_JP",
    siteName: "fugaapp",
  },
};

interface Props {
  searchParams: Promise<{ category?: string }>;
}

export default async function BlogPage({ searchParams }: Props) {
  const params = await searchParams;
  const category = params.category as "column" | "tech" | undefined;
  const validCategory = category === "column" || category === "tech" ? category : undefined;
  const posts = getPostsByCategory(validCategory);

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
            <Link href="/blog" className="text-purple-500">ブログ</Link>
            <Link href="/about" className="hover:text-purple-500 transition-colors">About</Link>
            <Link href="/contact" className="hover:text-purple-500 transition-colors">お問い合わせ</Link>
          </div>
        </div>
      </nav>

      {/* Header */}
      <header className="pt-12 pb-8 px-4 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
          📝 ブログ
        </h1>
        <p className="text-gray-500 max-w-md mx-auto">
          診断に関連するコラムや豆知識をお届けします
        </p>
      </header>

      {/* Category Tabs */}
      <BlogTabs currentCategory={validCategory} />

      {/* Posts Grid */}
      <main className="max-w-4xl mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group bg-white rounded-2xl shadow-md border border-gray-100 hover:border-purple-200 hover:shadow-xl transition-all duration-300 overflow-hidden"
            >
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 flex items-center justify-center aspect-[16/10] relative overflow-hidden">
                {post.image ? (
                  <Image
                    src={post.image}
                    alt={post.title}
                    width={320}
                    height={200}
                    className="object-contain group-hover:scale-110 transition-transform duration-300 max-h-[160px]"
                  />
                ) : (
                  <span className="text-6xl group-hover:scale-110 transition-transform duration-300">
                    {post.emoji}
                  </span>
                )}
              </div>
              <div className="p-5">
                <div className="flex items-center gap-2 mb-1">
                  <time className="text-xs text-gray-400">{post.date}</time>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    post.category === "tech"
                      ? "bg-blue-50 text-blue-500"
                      : "bg-pink-50 text-pink-500"
                  }`}>
                    {post.category === "tech" ? "技術" : "コラム"}
                  </span>
                </div>
                <h2 className="text-lg font-bold text-gray-800 mt-1 mb-2 group-hover:text-purple-600 transition-colors">
                  {post.title}
                </h2>
                <p className="text-sm text-gray-500 line-clamp-2">
                  {post.description}
                </p>
                {post.relatedDiagnoses.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {post.relatedDiagnoses.map((d) => (
                      <span
                        key={d.slug}
                        className="text-xs bg-purple-50 text-purple-500 px-2 py-0.5 rounded-full"
                      >
                        🔗 {d.title}
                      </span>
                    ))}
                  </div>
                )}
                <div className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-purple-500">
                  続きを読む →
                </div>
              </div>
            </Link>
          ))}
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
          <Link href="/privacy" className="hover:text-purple-400 transition-colors">プライバシーポリシー</Link>
        </div>
        <p>© 2026 fugaapp</p>
      </footer>
    </div>
  );
}
