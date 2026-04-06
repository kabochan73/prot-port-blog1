"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import Cookies from "js-cookie";
import { clientApi } from "@/lib/axios";
import type { User, LoginRequest, AuthResponse } from "@/types";

type AuthContextType = {
  /** 現在ログイン中のユーザー (未ログインはnull) */
  user: User | null;
  /** ログイン処理中のローディング状態 */
  loading: boolean;
  /** ログイン関数 */
  login: (data: LoginRequest) => Promise<void>;
  /** ログアウト関数 */
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * AuthProvider
 *
 * アプリ全体をこのコンポーネントでラップすることで
 * すべての子コンポーネントで useAuth() が使えるようになります。
 * layout.tsx で使用します。
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  /**
   * 初回マウント時にCookieのトークンを確認し、
   * 有効であればユーザー情報を取得してログイン状態を復元します
   */
  useEffect(() => {
    const token = Cookies.get("auth_token");
    if (!token) {
      setLoading(false);
      return;
    }

    clientApi
      .get<User>("/user")
      .then((res) => setUser(res.data))
      .catch(() => Cookies.remove("auth_token"))
      .finally(() => setLoading(false));
  }, []);

  /**
   * ログイン
   * トークンをCookieに保存します（7日間有効）
   */
  const login = async (data: LoginRequest) => {
    const res = await clientApi.post<AuthResponse>("/login", data);
    Cookies.set("auth_token", res.data.token, { expires: 7 });
    setUser(res.data.user);
  };

  /**
   * ログアウト
   * APIでサーバー側のトークンを削除し、CookieとStateをクリアします
   */
  const logout = async () => {
    await clientApi.post("/logout");
    Cookies.remove("auth_token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * useAuth カスタムフック
 *
 * AuthProvider の外で呼ばれた場合はエラーを投げます
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
