<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class UploadController extends Controller
{
    /**
     * 画像をアップロードしてURLを返す
     *
     * POST /api/upload
     * Content-Type: multipart/form-data
     * Body: image (file)
     */
    public function image(Request $request): JsonResponse
    {
        $request->validate([
            // mimes: 許可する拡張子
            // max: 最大ファイルサイズ (KB) = 2MB
            'image' => 'required|image|mimes:jpeg,png,webp|max:2048',
        ]);

        // storage/app/public/thumbnails/ に保存
        // store() はランダムなファイル名を自動生成します
        $path = $request->file('image')->store('thumbnails', 'public');

        // ブラウザからアクセスできるURLを生成
        // storage_path ではなく asset() または url() を使います
        $url = asset('storage/' . $path);

        return response()->json(['url' => $url]);
    }
}
