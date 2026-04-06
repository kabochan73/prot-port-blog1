import Link from "next/link";
import type { Post } from "@/types";

type Props = {
  post: Post;
};

export default function PostCard({ post }: Props) {
  const publishedAt = post.published_at
    ? new Date(post.published_at).toLocaleDateString("ja-JP", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

  return (
    <article className="bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow overflow-hidden">
      <Link href={`/posts/${post.slug}`} className="flex gap-4 p-6">
        {/* サムネイル */}
        {post.thumbnail && (
          <div className="shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={post.thumbnail}
              alt={post.title}
              className="rounded object-cover w-30 h-20"
            />
          </div>
        )}

        <div className="flex flex-col justify-between flex-1 min-w-0">
          <h2 className="text-xl font-bold text-gray-900 hover:text-gray-600 mb-2 truncate">
            {post.title}
          </h2>

          {post.excerpt && (
            <p className="text-gray-600 text-sm mb-3 line-clamp-2">{post.excerpt}</p>
          )}

          <div className="flex items-center gap-3 text-xs text-gray-400">
            {post.user && <span>{post.user.name}</span>}
            <span>{publishedAt}</span>
          </div>
        </div>
      </Link>
    </article>
  );
}
