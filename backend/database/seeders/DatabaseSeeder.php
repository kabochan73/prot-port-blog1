<?php

namespace Database\Seeders;

use App\Models\Post;
use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * テスト用の初期データを投入します
     *
     * 実行コマンド: php artisan db:seed
     * マイグレーションと同時に実行: php artisan migrate --seed
     */
    public function run(): void
    {
        // 管理者ユーザーを作成
        // パスワードは "password" (開発用)
        $admin = User::create([
            'name'     => '管理者',
            'email'    => 'admin@example.com',
            'password' => 'password',
        ]);

        // サンプル記事を3件作成
        $samplePosts = [
            [
                'title'        => 'Next.jsとLaravelでBlogを作る',
                'slug'         => 'nextjs-laravel-blog',
                'excerpt'      => 'Next.jsとLaravelを組み合わせたモダンなBlogアプリの作り方を解説します。',
                'body'         => "# Next.jsとLaravelでBlogを作る\n\nこの記事では、Next.jsとLaravelを使ったBlogアプリの構築方法を解説します。\n\n## 技術スタック\n\n- フロントエンド: Next.js 14 (App Router)\n- バックエンド: Laravel 13 (REST API)\n- 認証: Laravel Sanctum\n- データベース: MySQL 8.0\n- 環境: Docker",
                'status'       => 'published',
                'published_at' => now()->subDays(2),
            ],
            [
                'title'        => 'Docker入門: 開発環境を統一しよう',
                'slug'         => 'docker-introduction',
                'excerpt'      => 'Dockerを使って開発環境を構築する方法を初心者向けに解説します。',
                'body'         => "# Docker入門\n\nDockerを使うと「自分のマシンでは動くのに本番では動かない」問題を解決できます。\n\n## Dockerとは\n\nDockerはコンテナ型の仮想化技術です。アプリとその実行環境をまとめてパッケージ化できます。",
                'status'       => 'published',
                'published_at' => now()->subDays(1),
            ],
            [
                'title'        => 'Laravel Sanctumで認証を実装する',
                'slug'         => 'laravel-sanctum-auth',
                'excerpt'      => 'SPA向けのシンプルなトークン認証をSanctumで実装する方法を紹介します。',
                'body'         => "# Laravel Sanctumで認証を実装する\n\nSanctumはSPA向けの軽量な認証ライブラリです。\n\n## インストール\n\n```bash\ncomposer require laravel/sanctum\n```",
                'status'       => 'published',
                'published_at' => now(),
            ],
        ];

        foreach ($samplePosts as $postData) {
            Post::create(array_merge($postData, ['user_id' => $admin->id]));
        }
    }
}
