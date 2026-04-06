# PHP 8.2 FPM (FastCGI Process Manager) をベースイメージとして使用
# FPMはNginxからのリクエストを受け取りPHPを実行する仕組みです
FROM php:8.4-fpm

# システムパッケージのインストール
# git: Composerのパッケージ取得に必要
# libzip-dev, zip: ZIPファイル処理
# libpng-dev: 画像処理（GD拡張用）
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    libzip-dev \
    zip \
    unzip \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# PHP拡張のインストール
# pdo_mysql: LaravelからMySQLに接続するために必須
# mbstring: 日本語などマルチバイト文字の処理
# exif: 画像のメタデータ読み取り
# pcntl: プロセス制御（Queueなどで使用）
# bcmath: 高精度計算
# gd: 画像の生成・加工
# zip: ZIPファイル操作
RUN docker-php-ext-install \
    pdo_mysql \
    mbstring \
    exif \
    pcntl \
    bcmath \
    gd \
    zip

# Composerのインストール
# Composerはphpのパッケージマネージャーです（Node.jsのnpmに相当）
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# 作業ディレクトリの設定
WORKDIR /var/www/backend

# PHP-FPMの設定: www-dataユーザーで動作させる
# Nginxと同じユーザーにすることでファイルの権限問題を防ぎます
RUN usermod -u 1000 www-data
