"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { clientApi } from "@/lib/axios";
import Header from "@/components/Header";

export default function NewPostPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [body, setBody] = useState("");
  const [status, setStatus] = useState<"draft" | "published">("draft");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // 未ログインならログインページへ
  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      await clientApi.post("/posts", { title, excerpt, body, status });
      router.push("/admin");
    } catch (err: unknown) {
      const res = (err as { response?: { data?: { message?: string } } }).response;
      setError(res?.data?.message ?? "投稿に失敗しました。");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-400">読み込み中...</p>
      </div>
    );
  }

  return (
    <>
      <Header />
      <main className="max-w-3xl mx-auto px-4 py-10 w-full">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-gray-900">新規記事作成</h1>
          <Link href="/admin" className="text-sm text-gray-500 hover:text-gray-900">
            ← 管理画面に戻る
          </Link>
        </div>

        {error && (
          <p className="text-red-500 text-sm mb-4 bg-red-50 p-3 rounded">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* タイトル */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              タイトル <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
              placeholder="記事のタイトルを入力"
            />
          </div>

          {/* 概要 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              概要
              <span className="text-xs text-gray-400 ml-2">（一覧ページに表示されます）</span>
            </label>
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              rows={2}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400 resize-none"
              placeholder="記事の概要を入力（省略可）"
            />
          </div>

          {/* 本文 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              本文 <span className="text-red-400">*</span>
            </label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              required
              rows={16}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-gray-400 resize-y"
              placeholder="記事の本文を入力"
            />
          </div>

          {/* 公開ステータス */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              公開ステータス
            </label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  value="draft"
                  checked={status === "draft"}
                  onChange={() => setStatus("draft")}
                  className="accent-gray-700"
                />
                <span className="text-sm text-gray-700">下書き</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  value="published"
                  checked={status === "published"}
                  onChange={() => setStatus("published")}
                  className="accent-gray-700"
                />
                <span className="text-sm text-gray-700">公開</span>
              </label>
            </div>
          </div>

          {/* 送信ボタン */}
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="bg-gray-900 text-white rounded px-6 py-2 text-sm font-medium hover:bg-gray-700 disabled:opacity-50"
            >
              {submitting ? "投稿中..." : status === "published" ? "公開する" : "下書き保存"}
            </button>
            <Link
              href="/admin"
              className="border border-gray-300 text-gray-600 rounded px-6 py-2 text-sm hover:bg-gray-50"
            >
              キャンセル
            </Link>
          </div>
        </form>
      </main>
    </>
  );
}
