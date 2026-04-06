"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { clientApi } from "@/lib/axios";
import Header from "@/components/Header";
import type { Post } from "@/types";

export default function AdminPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [fetching, setFetching] = useState(true);

  // 認証チェック: 未ログインならログインページへ
  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  // 自分の記事一覧を取得
  useEffect(() => {
    if (!user) return;
    clientApi
      .get<Post[]>("/posts")
      .then((res) => setPosts(res.data))
      .finally(() => setFetching(false));
  }, [user]);

  const handleDelete = async (slug: string) => {
    if (!confirm("この記事を削除しますか？")) return;
    await clientApi.delete(`/posts/${slug}`);
    setPosts((prev) => prev.filter((p) => p.slug !== slug));
  };

  // ロード中
  if (loading || fetching) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-400">読み込み中...</p>
      </div>
    );
  }

  return (
    <>
      <Header />
      <main className="max-w-4xl mx-auto px-4 py-10 w-full">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-gray-900">記事管理</h1>
          <Link
            href="/admin/new"
            className="bg-gray-900 text-white text-sm px-4 py-2 rounded hover:bg-gray-700"
          >
            + 新規作成
          </Link>
        </div>

        {posts.length === 0 ? (
          <p className="text-gray-500">記事がありません。</p>
        ) : (
          <div className="flex flex-col gap-3">
            {posts.map((post) => (
              <div
                key={post.id}
                className="bg-white border border-gray-200 rounded-lg px-5 py-4 flex items-center justify-between"
              >
                <div>
                  <p className="font-medium text-gray-900">{post.title}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {post.status === "published" ? "公開中" : "下書き"}
                  </p>
                </div>
                <div className="flex gap-3">
                  <Link
                    href={`/posts/${post.slug}`}
                    className="text-sm text-gray-500 hover:text-gray-900"
                  >
                    表示
                  </Link>
                  <Link
                    href={`/admin/edit/${post.slug}`}
                    className="text-sm text-blue-500 hover:text-blue-700"
                  >
                    編集
                  </Link>
                  <button
                    onClick={() => handleDelete(post.slug)}
                    className="text-sm text-red-400 hover:text-red-600"
                  >
                    削除
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
