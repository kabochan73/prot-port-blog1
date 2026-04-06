<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Str;

class PostController extends Controller
{
    /**
     * 記事一覧を取得
     *
     * GET /api/posts
     * 公開済みの記事のみを返します。
     * Next.jsのSSGがビルド時にこのエンドポイントを叩いて静的ページを生成します。
     *
     * with('user') = 投稿者情報を一緒に取得 (N+1問題を防ぐ)
     */
    public function index(): JsonResponse
    {
        $posts = Post::published()
            ->with('user:id,name')
            ->get(['id', 'user_id', 'title', 'slug', 'excerpt', 'thumbnail', 'published_at']);

        return response()->json($posts);
    }

    /**
     * 記事詳細を取得
     *
     * GET /api/posts/{slug}
     * slugでURLフレンドリーなルートを実現します。
     * Next.jsのSSGがビルド時に各記事ページを生成するために使います。
     */
    public function show(Post $post): JsonResponse
    {
        // 下書きは公開しない
        if ($post->status !== 'published') {
            return response()->json(['message' => '記事が見つかりません。'], 404);
        }

        $post->load('user:id,name');

        return response()->json($post);
    }

    /**
     * 記事を作成
     *
     * POST /api/posts
     * 認証必須 (auth:sanctum)
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title'        => 'required|string|max:255',
            'excerpt'      => 'nullable|string|max:500',
            'body'         => 'required|string',
            'thumbnail'    => 'nullable|string',
            'status'       => 'required|in:draft,published',
            'published_at' => 'nullable|date',
        ]);

        // タイトルからスラッグを自動生成
        // 例: "初めての投稿" → "初めての投稿" (日本語はそのまま、英語はケバブケースに)
        $validated['slug'] = Str::slug($validated['title']) ?: Str::uuid();
        $validated['user_id'] = $request->user()->id;

        // 公開ステータスの場合、published_atが未設定なら現在時刻を設定
        if ($validated['status'] === 'published' && empty($validated['published_at'])) {
            $validated['published_at'] = now();
        }

        $post = Post::create($validated);

        return response()->json($post, 201);
    }

    /**
     * 記事を更新
     *
     * PUT /api/posts/{post}
     * 認証必須 (auth:sanctum)
     */
    public function update(Request $request, Post $post): JsonResponse
    {
        // 自分の記事のみ更新可能
        if ($post->user_id !== $request->user()->id) {
            return response()->json(['message' => '権限がありません。'], 403);
        }

        $validated = $request->validate([
            'title'        => 'sometimes|string|max:255',
            'excerpt'      => 'nullable|string|max:500',
            'body'         => 'sometimes|string',
            'thumbnail'    => 'nullable|string',
            'status'       => 'sometimes|in:draft,published',
            'published_at' => 'nullable|date',
        ]);

        // タイトルが変更された場合はスラッグも更新
        if (isset($validated['title'])) {
            $validated['slug'] = Str::slug($validated['title']) ?: Str::uuid();
        }

        // 新たに公開する場合、published_atを設定
        if (
            isset($validated['status']) &&
            $validated['status'] === 'published' &&
            $post->status === 'draft'
        ) {
            $validated['published_at'] = $validated['published_at'] ?? now();
        }

        $post->update($validated);

        return response()->json($post);
    }

    /**
     * 記事を削除
     *
     * DELETE /api/posts/{post}
     * 認証必須 (auth:sanctum)
     */
    public function destroy(Request $request, Post $post): JsonResponse
    {
        // 自分の記事のみ削除可能
        if ($post->user_id !== $request->user()->id) {
            return response()->json(['message' => '権限がありません。'], 403);
        }

        $post->delete();

        return response()->json(['message' => '記事を削除しました。'], 200);
    }
}
