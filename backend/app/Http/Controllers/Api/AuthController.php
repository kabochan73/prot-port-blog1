<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    /**
     * ユーザー登録
     *
     * リクエスト例:
     * POST /api/register
     * { "name": "山田太郎", "email": "taro@example.com", "password": "password", "password_confirmation": "password" }
     *
     * レスポンス例:
     * { "user": {...}, "token": "1|xxxxxx" }
     */
    public function register(Request $request): JsonResponse
    {
        // バリデーション
        // 失敗した場合は自動的に422 Unprocessable Entityを返します
        $validated = $request->validate([
            'name'     => 'required|string|max:255',
            'email'    => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
        ]);

        // ユーザーを作成
        // Hash::make()でパスワードをbcryptでハッシュ化します
        // 平文のパスワードはDBに保存しません
        $user = User::create([
            'name'     => $validated['name'],
            'email'    => $validated['email'],
            'password' => Hash::make($validated['password']),
        ]);

        // Sanctumトークンを生成
        // 'auth_token' はトークンの名前 (用途を識別するための任意の文字列)
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'user'  => $user,
            'token' => $token,
        ], 201);
    }

    /**
     * ログイン
     *
     * リクエスト例:
     * POST /api/login
     * { "email": "taro@example.com", "password": "password" }
     *
     * レスポンス例:
     * { "user": {...}, "token": "2|xxxxxx" }
     */
    public function login(Request $request): JsonResponse
    {
        $request->validate([
            'email'    => 'required|email',
            'password' => 'required',
        ]);

        // メールアドレスでユーザーを検索
        $user = User::where('email', $request->email)->first();

        // ユーザーが存在しない、またはパスワードが一致しない場合
        // Hash::check()でハッシュ化されたパスワードと比較します
        if (! $user || ! Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['メールアドレスまたはパスワードが正しくありません。'],
            ]);
        }

        // 既存のトークンをすべて削除して新しいトークンを発行
        // セキュリティのため、ログインのたびに新しいトークンを発行します
        $user->tokens()->delete();
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'user'  => $user,
            'token' => $token,
        ]);
    }

    /**
     * ログアウト
     *
     * リクエストヘッダー:
     * Authorization: Bearer {token}
     *
     * 現在のトークンをDBから削除します
     * 削除されたトークンは以降使用できなくなります
     */
    public function logout(Request $request): JsonResponse
    {
        // 現在のリクエストで使われているトークンのみを削除
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'ログアウトしました。',
        ]);
    }
}
