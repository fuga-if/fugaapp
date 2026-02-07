import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllPosts, getPostBySlug } from "@/lib/blog/posts";
import BlogContent from "./BlogContent";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  return {
    title: `${post.title} | fugaapp`,
    description: post.description,
    openGraph: {
      title: `${post.title} | fugaapp`,
      description: post.description,
      type: "article",
      locale: "ja_JP",
      siteName: "fugaapp",
      publishedTime: post.date,
    },
    twitter: {
      card: "summary_large_image",
      title: `${post.title} | fugaapp`,
      description: post.description,
    },
  };
}



export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

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

      {/* Article */}
      <article className="max-w-3xl mx-auto px-4 py-12">
        {/* Breadcrumb */}
        <div className="text-sm text-gray-400 mb-6">
          <Link href="/" className="hover:text-purple-400 transition-colors">トップ</Link>
          <span className="mx-2">›</span>
          <Link href="/blog" className="hover:text-purple-400 transition-colors">ブログ</Link>
          <span className="mx-2">›</span>
          <span className="text-gray-500">{post.title}</span>
        </div>

        {/* Hero Image */}
        {post.image && (
          <div className="mb-8 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 flex items-center justify-center">
            <Image
              src={post.image}
              alt={post.title}
              width={400}
              height={300}
              className="object-contain max-h-[250px] drop-shadow-md"
            />
          </div>
        )}

        {/* Title */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-4xl">{post.emoji}</span>
            <time className="text-sm text-gray-400">{post.date}</time>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
              post.category === "tech"
                ? "bg-blue-50 text-blue-500"
                : "bg-pink-50 text-pink-500"
            }`}>
              {post.category === "tech" ? "技術" : "コラム"}
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 leading-tight">
            {post.title}
          </h1>
          <p className="mt-4 text-gray-500">{post.description}</p>
        </div>

        {/* Content */}
        <div className="prose-custom">
          <BlogContent content={post.content} />
        </div>

        {/* CTA */}
        <div className="mt-12 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-8 text-center border border-purple-100">
          <p className="text-lg font-bold text-gray-800 mb-4">
            🔍 あなたも診断してみよう！
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {post.relatedDiagnoses.map((d) => (
              <Link
                key={d.slug}
                href={`/${d.slug}`}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold px-6 py-3 rounded-full shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300"
              >
                {d.title}を受ける →
              </Link>
            ))}
          </div>
        </div>

        {/* Back */}
        <div className="mt-8 text-center">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-purple-500 hover:text-purple-600 font-medium transition-colors"
          >
            ← 記事一覧に戻る
          </Link>
        </div>
      </article>

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
