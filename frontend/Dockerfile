# Node.js 20 Alpine をベースイメージとして使用
# Alpineは軽量なLinuxディストリビューションでイメージサイズを小さくできます
FROM node:20-alpine

# 作業ディレクトリを設定
WORKDIR /app

# package.jsonとlock fileを先にコピー
# ソースコードより先にコピーすることで、
# package.jsonが変わっていない場合はnpm installのキャッシュが使われ
# ビルドが高速になります (Dockerレイヤーキャッシュの活用)
COPY package*.json ./

# 依存パッケージのインストール
RUN npm install

# ソースコードをコピー
COPY . .

# 開発サーバーを起動
# 0.0.0.0 にバインドすることでコンテナ外からアクセス可能になります
CMD ["npm", "run", "dev", "--", "--hostname", "0.0.0.0"]
