<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('posts', function (Blueprint $table) {
            $table->id();

            // 投稿者 (usersテーブルのidを参照する外部キー)
            // onDelete('cascade') = ユーザーが削除されたら記事も削除される
            $table->foreignId('user_id')->constrained()->onDelete('cascade');

            // 記事タイトル
            $table->string('title');

            // スラッグ: URLに使う一意の識別子 (例: my-first-post)
            // unique() = 同じスラッグは登録できない
            $table->string('slug')->unique();

            // 記事の概要 (一覧ページでの表示用)
            $table->text('excerpt')->nullable();

            // 記事本文 (longText = 最大4GBまで保存可能)
            $table->longText('body');

            // サムネイル画像のパス (nullable = 任意)
            $table->string('thumbnail')->nullable();

            // 公開状態: draft(下書き) or published(公開済み)
            $table->enum('status', ['draft', 'published'])->default('draft');

            // 公開日時 (nullableなので下書きの場合はnull)
            $table->timestamp('published_at')->nullable();

            // created_at と updated_at を自動管理
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('posts');
    }
};
