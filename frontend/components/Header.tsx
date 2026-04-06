"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function Header() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* ロゴ */}
        <Link href="/" className="text-xl font-bold text-gray-900 hover:text-gray-600">
          Blog
        </Link>

        {/* ナビゲーション */}
        <nav className="flex items-center gap-4">
          {user ? (
            <>
              {/* ログイン中: ユーザー名・管理画面・ログアウト */}
              <span className="text-sm text-gray-500">{user.name}</span>
              <Link
                href="/admin"
                className="text-sm text-gray-700 hover:text-gray-900"
              >
                管理画面
              </Link>
              <button
                onClick={handleLogout}
                className="text-sm bg-gray-900 text-white px-3 py-1.5 rounded hover:bg-gray-700"
              >
                ログアウト
              </button>
            </>
          ) : (
            <>
              {/* 未ログイン: ログインボタン */}
              <Link
                href="/login"
                className="text-sm bg-gray-900 text-white px-3 py-1.5 rounded hover:bg-gray-700"
              >
                ログイン
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
