/** ユーザー */
export type User = {
  id: number;
  name: string;
  email: string;
  created_at: string;
  updated_at: string;
};

/** ブログ記事 */
export type Post = {
  id: number;
  user_id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  body: string;
  thumbnail: string | null;
  status: "draft" | "published";
  published_at: string | null;
  created_at: string;
  updated_at: string;
  user?: Pick<User, "id" | "name">;
};

/** ログインリクエスト */
export type LoginRequest = {
  email: string;
  password: string;
};

/** 登録リクエスト */
export type RegisterRequest = {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
};

/** 認証レスポンス */
export type AuthResponse = {
  user: User;
  token: string;
};
