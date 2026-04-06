"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/context/AuthContext";

// Zodでバリデーションスキーマを定義
// 型も自動生成されるのでTypeScriptと相性が良い
const loginSchema = z.object({
  email: z
    .string()
    .min(1, "メールアドレスを入力してください")
    .email("正しいメールアドレスを入力してください"),
  password: z.string().min(1, "パスワードを入力してください"),
});

// スキーマから型を自動生成
type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();

  const {
    register,       // inputをフォームに登録する関数
    handleSubmit,   // 送信時にバリデーションを実行してからコールバックを呼ぶ
    setError,       // サーバーエラーをフォームにセットする
    formState: { errors, isSubmitting }, // エラー状態と送信中フラグ
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema), // Zodスキーマをバリデーターとして使用
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      await login(data);
      router.push("/admin");
    } catch {
      // サーバーエラーを "root" キーにセットするとフォーム全体のエラーとして扱える
      setError("root", {
        message: "メールアドレスまたはパスワードが正しくありません。",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white rounded-lg border border-gray-200 p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">ログイン</h1>

        {/* サーバーエラー */}
        {errors.root && (
          <p className="text-red-500 text-sm mb-4 bg-red-50 p-3 rounded">
            {errors.root.message}
          </p>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              メールアドレス
            </label>
            <input
              type="email"
              {...register("email")}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
              placeholder="admin@example.com"
            />
            {/* フィールドごとのエラーメッセージ */}
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              パスワード
            </label>
            <input
              type="password"
              {...register("password")}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
              placeholder="password"
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-gray-900 text-white rounded py-2 text-sm font-medium hover:bg-gray-700 disabled:opacity-50 mt-2"
          >
            {isSubmitting ? "ログイン中..." : "ログイン"}
          </button>
        </form>
      </div>
    </div>
  );
}
