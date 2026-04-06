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
    <article className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <Link href={`/posts/${post.slug}`}>
        <h2 className="text-xl font-bold text-gray-900 hover:text-gray-600 mb-2">
          {post.title}
        </h2>
      </Link>

      {post.excerpt && (
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{post.excerpt}</p>
      )}

      <div className="flex items-center gap-3 text-xs text-gray-400">
        {post.user && <span>{post.user.name}</span>}
        <span>{publishedAt}</span>
      </div>
    </article>
  );
}
