import axios from "axios";
import Cookies from "js-cookie";

/**
 * サーバーサイド用axiosインスタンス
 *
 * SSG (generateStaticParams / fetch) のビルド時に使用します。
 * DockerコンテナのnginxサービスのURLを使って内部通信します。
 * このインスタンスはブラウザでは使いません。
 */
export const serverApi = axios.create({
  baseURL: process.env.API_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

/**
 * クライアントサイド用axiosインスタンス
 *
 * ブラウザから直接APIを呼び出す際に使用します（ログイン・ログアウトなど）。
 * withCredentials: true でCookieをリクエストに含めます。
 * Authorizationヘッダーはリクエストインターセプターで自動付与します。
 */
export const clientApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true,
});

/**
 * リクエストインターセプター
 *
 * すべてのリクエスト送信前に実行されます。
 * CookieからSanctumトークンを取得して Authorization ヘッダーに付与します。
 * これにより認証が必要なAPIに自動的に認証情報が送られます。
 */
clientApi.interceptors.request.use((config) => {
  const token = Cookies.get("auth_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
