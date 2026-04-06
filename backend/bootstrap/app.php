<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        // Webルート (今回は使用しない)
        web: __DIR__.'/../routes/web.php',
        // APIルート: /api/* へのリクエストはすべてここで処理
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        // ----------------------------------------
        // APIミドルウェアの設定
        // ----------------------------------------
        $middleware->api(prepend: [
            // CORSヘッダーをレスポンスに付与
            // フロントエンド(Next.js)からのクロスオリジンリクエストを許可します
            \Illuminate\Http\Middleware\HandleCors::class,
        ]);

        // ----------------------------------------
        // Sanctumのステートフルドメイン設定
        // .envの SANCTUM_STATEFUL_DOMAINS に記載したドメインからの
        // リクエストはセッション認証も使えます
        // ----------------------------------------
        $middleware->statefulApi();
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        //
    })->create();
