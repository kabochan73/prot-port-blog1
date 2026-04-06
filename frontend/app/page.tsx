import { serverApi } from "@/lib/axios";
import Header from "@/components/Header";
import PostCard from "@/components/PostCard";
import type { Post } from "@/types";

// ISR: 60秒ごとにバックグラウンドで再生成
// 新しい記事が投稿されても最大60秒後には反映されます
export const revalidate = 60;

async function getPosts(): Promise<Post[]> {
  try {
    const res = await serverApi.get<Post[]>("/posts");
    return res.data;
  } catch {
    return [];
  }
}

export default async function HomePage() {
  // ビルド時 (またはrevalidate後) にサーバーサイドでAPIを呼び出す
  const posts = await getPosts();

  return (
    <>
      <Header />
      <main className="max-w-4xl mx-auto px-4 py-10 w-full">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">記事一覧</h1>

        {posts.length === 0 ? (
          <p className="text-gray-500">記事がありません。</p>
        ) : (
          <div className="grid gap-6">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </main>
    </>
  );
}
