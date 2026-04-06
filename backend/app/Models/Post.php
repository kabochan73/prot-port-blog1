<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Post extends Model
{
    /**
     * ルートモデルバインディングのキーをslugに変更
     *
     * これにより GET /api/posts/{slug} でslugを使ったルックアップになります
     * デフォルトはidですが、URLをわかりやすくするためslugを使います
     */
    public function getRouteKeyName(): string
    {
        return 'slug';
    }

    /**
     * 一括代入を許可するカラム
     *
     * $fillable に列挙したカラムだけが Post::create() や update() で
     * 使えるようになります。意図しないカラムの書き換えを防ぐ仕組みです。
     */
    protected $fillable = [
        'user_id',
        'title',
        'slug',
        'excerpt',
        'body',
        'thumbnail',
        'status',
        'published_at',
    ];

    /**
     * 型キャスト
     *
     * DBから取得した値を自動的に指定の型に変換します
     * published_at: 文字列 → Carbonオブジェクト (日付操作が簡単になる)
     */
    protected $casts = [
        'published_at' => 'datetime',
    ];

    /**
     * リレーション: 記事は1人のユーザーに属する
     *
     * $post->user で投稿者情報を取得できます
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * スコープ: 公開済みの記事のみを取得
     *
     * 使い方: Post::published()->get()
     * SSGでNext.jsが記事一覧を取得する際はこのスコープを使います
     */
    public function scopePublished($query)
    {
        return $query->where('status', 'published')
                     ->whereNotNull('published_at')
                     ->orderBy('published_at', 'desc');
    }
}
