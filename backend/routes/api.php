<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\PostController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
| すべてのルートには /api プレフィックスが自動で付きます
| 例: Route::get('/posts') → GET /api/posts
|
| ミドルウェア:
|   - auth:sanctum → Sanctumトークン認証が必要なルート
|--------------------------------------------------------------------------
*/

// ========================================
// 認証不要のルート (パブリック)
// ========================================

// ユーザー登録
Route::post('/register', [AuthController::class, 'register']);

// ログイン → Sanctumトークンを発行
Route::post('/login', [AuthController::class, 'login']);

// ブログ記事一覧 (SSGでビルド時に取得)
Route::get('/posts', [PostController::class, 'index']);

// ブログ記事詳細 (SSGでビルド時に取得)
Route::get('/posts/{post}', [PostController::class, 'show']);

// ========================================
// 認証必須のルート (auth:sanctum)
// Authorizationヘッダーに有効なBearerトークンが必要
// ========================================
Route::middleware('auth:sanctum')->group(function () {

    // ログアウト → 現在のトークンを削除
    Route::post('/logout', [AuthController::class, 'logout']);

    // 認証中のユーザー情報取得
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    // ブログ記事の作成・更新・削除 (管理者のみ)
    Route::post('/posts', [PostController::class, 'store']);
    Route::put('/posts/{post}', [PostController::class, 'update']);
    Route::delete('/posts/{post}', [PostController::class, 'destroy']);
});
