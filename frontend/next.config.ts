import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // 外部から画像を読み込む場合に許可するドメインを設定します
    // サムネイル画像をLaravelサーバーから取得する場合に使います
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
      },
    ],
  },
};

export default nextConfig;
