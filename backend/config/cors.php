<?php

return [
    /*
     * CORSを適用するパスのパターン
     * api/* = /api/ 以下のすべてのルートに適用
     * sanctum/csrf-cookie = SPA認証用のCSRFトークン取得エンドポイント
     */
    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    /*
     * 許可するHTTPメソッド
     * * = すべてのメソッドを許可 (GET, POST, PUT, DELETE, etc.)
     */
    'allowed_methods' => ['*'],

    /*
     * 許可するオリジン (フロントエンドのURL)
     * env()で.envから読み込むことで環境ごとに変更しやすくなります
     */
    'allowed_origins' => [env('FRONTEND_URL', 'http://localhost:3000')],

    /*
     * 許可するオリジンのパターン (正規表現)
     * ワイルドカードを使いたい場合に使用します
     */
    'allowed_origins_patterns' => [],

    /*
     * 許可するリクエストヘッダー
     * * = すべてのヘッダーを許可
     * Authorizationヘッダーが含まれるため * が必要です
     */
    'allowed_headers' => ['*'],

    /*
     * レスポンスで公開するヘッダー
     */
    'exposed_headers' => [],

    /*
     * プリフライトリクエストのキャッシュ時間 (秒)
     * ブラウザがCORSチェックをキャッシュする時間です
     */
    'max_age' => 0,

    /*
     * クッキーやセッション情報を含むリクエストを許可するか
     * Sanctumのクッキー認証を使う場合はtrueにします
     */
    'supports_credentials' => true,
];
