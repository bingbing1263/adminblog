import Link from "next/link";

interface PostMeta {
  title: string;
  date: string;
  slug: string;
}

async function getPosts(): Promise<PostMeta[]> {
  const baseUrl =
    process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const res = await fetch(`${baseUrl}/api/posts`, { cache: "no-store" });
  if (!res.ok) return [];
  return res.json();
}

export default async function HomePage() {
  const posts = await getPosts();
  return (
    <main className="max-w-2xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">AdminBlog</h1>
      <ul className="space-y-4">
        {posts.map(post => (
          <li key={post.slug} className="border-b pb-2">
            <Link href={`/${post.slug}`}
              className="text-xl font-semibold hover:underline">
              {post.title}
            </Link>
            <div className="text-gray-500 text-sm">{post.date}</div>
          </li>
        ))}
        {posts.length === 0 && <li>No posts found.</li>}
      </ul>
    </main>
  );
}
