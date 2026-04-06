"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/context/AuthContext";
import { clientApi } from "@/lib/axios";
import Header from "@/components/Header";

const postSchema = z.object({
  title:   z.string().min(1, "タイトルを入力してください").max(255),
  excerpt: z.string().max(500, "500文字以内で入力してください").optional(),
  body:    z.string().min(1, "本文を入力してください"),
  status:  z.enum(["draft", "published"]),
});

type PostFormValues = z.infer<typeof postSchema>;

export default function NewPostPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<PostFormValues>({
    resolver: zodResolver(postSchema),
    defaultValues: { status: "draft" },
  });

  const status = watch("status");

  useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [user, loading, router]);

  const onSubmit = async (data: PostFormValues) => {
    try {
      await clientApi.post("/posts", data);
      router.push("/admin");
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { message?: string } } })
        .response?.data?.message ?? "投稿に失敗しました。";
      setError("root", { message });
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

        {errors.root && (
          <p className="text-red-500 text-sm mb-4 bg-red-50 p-3 rounded">
            {errors.root.message}
          </p>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              タイトル <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              {...register("title")}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
              placeholder="記事のタイトルを入力"
            />
            {errors.title && (
              <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              概要
              <span className="text-xs text-gray-400 ml-2">（一覧ページに表示されます）</span>
            </label>
            <textarea
              {...register("excerpt")}
              rows={2}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400 resize-none"
              placeholder="記事の概要を入力（省略可）"
            />
            {errors.excerpt && (
              <p className="text-red-500 text-xs mt-1">{errors.excerpt.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              本文 <span className="text-red-400">*</span>
            </label>
            <textarea
              {...register("body")}
              rows={16}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-gray-400 resize-y"
              placeholder="Markdown形式で入力できます"
            />
            {errors.body && (
              <p className="text-red-500 text-xs mt-1">{errors.body.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              公開ステータス
            </label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" value="draft" {...register("status")} className="accent-gray-700" />
                <span className="text-sm text-gray-700">下書き</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" value="published" {...register("status")} className="accent-gray-700" />
                <span className="text-sm text-gray-700">公開</span>
              </label>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-gray-900 text-white rounded px-6 py-2 text-sm font-medium hover:bg-gray-700 disabled:opacity-50"
            >
              {isSubmitting ? "投稿中..." : status === "published" ? "公開する" : "下書き保存"}
            </button>
            <Link href="/admin" className="border border-gray-300 text-gray-600 rounded px-6 py-2 text-sm hover:bg-gray-50">
              キャンセル
            </Link>
          </div>
        </form>
      </main>
    </>
  );
}
