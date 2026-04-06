import { notFound } from "next/navigation";
import { serverApi } from "@/lib/axios";
import Header from "@/components/Header";
import type { Post } from "@/types";

// ISR: 60秒ごとに再生成
export const revalidate = 60;

/**
 * generateStaticParams
 *
 * SSGの核心部分です。
 * ビルド時にこの関数が実行され、全記事のslugを取得します。
 * Next.jsはここで返されたslugの数だけ静的HTMLを生成します。
 *
 * 例: [{slug: "nextjs-laravel-blog"}, {slug: "docker-introduction"}, ...]
 *     → /posts/nextjs-laravel-blog
 *     → /posts/docker-introduction
 *     → ... が静的に生成される
 */
export async function generateStaticParams() {
  try {
    const res = await serverApi.get<Post[]>("/posts");
    return res.data.map((post) => ({ slug: post.slug }));
  } catch {
    return [];
  }
}

async function getPost(slug: string): Promise<Post | null> {
  try {
    const res = await serverApi.get<Post>(`/posts/${slug}`);
    return res.data;
  } catch {
    return null;
  }
}

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPost(slug);

  // 記事が見つからない場合は404ページを表示
  if (!post) notFound();

  const publishedAt = post.published_at
    ? new Date(post.published_at).toLocaleDateString("ja-JP", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

  return (
    <>
      <Header />
      <main className="max-w-3xl mx-auto px-4 py-10 w-full">
        <article>
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {post.title}
            </h1>
            <div className="flex items-center gap-3 text-sm text-gray-400">
              {post.user && <span>{post.user.name}</span>}
              <span>{publishedAt}</span>
            </div>
          </header>

          {/* 記事本文: 改行を<br>に変換して表示 */}
          <div className="prose max-w-none text-gray-700 leading-8 whitespace-pre-wrap">
            {post.body}
          </div>
        </article>

        <div className="mt-12">
          <a href="/" className="text-sm text-gray-500 hover:text-gray-900">
            ← 記事一覧に戻る
          </a>
        </div>
      </main>
    </>
  );
}
