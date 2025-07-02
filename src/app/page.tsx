import Link from "next/link";

interface PostMeta {
  title: string;
  date: string;
  slug: string;
  excerpt?: string;
}

function getExcerpt(excerpt?: string) {
  if (!excerpt) return "No excerpt available. Click to read more.";
  const paragraphs = excerpt.split(/\n\s*\n/).map(p => p.trim()).filter(Boolean);
  return paragraphs[0] || excerpt.trim() || "No excerpt available. Click to read more.";
}

async function getPosts(): Promise<PostMeta[]> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const res = await fetch(`${baseUrl}/api/posts`, { 
    cache: "no-store",
    headers: {
      'Content-Type': 'application/json'
    }
  });
  if (!res.ok) return [];
  return res.json();
}

export default async function HomePage() {
  const posts = await getPosts();
  return (
    <section>
      <h1 className="text-4xl font-extrabold mb-2 text-center">AdminBlog</h1>
      <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 text-center">A database-free, GitHub-powered blog and CMS.</p>
      {posts.length === 0 ? (
        <div className="text-center mt-16">
          <p className="text-xl mb-4">No posts found.</p>
          <Link href="/admin" className="inline-block bg-blue-600 text-white px-6 py-2 rounded shadow hover:bg-blue-700 transition">Log in as admin to create your first post</Link>
        </div>
      ) : (
        <ul className="grid gap-8 md:grid-cols-2">
          {posts.map(post => (
            <li key={post.slug} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 flex flex-col justify-between border border-gray-100 dark:border-gray-800 hover:shadow-xl transition-shadow">
              <div>
                <h2 className="text-2xl font-bold mb-2">
                  <Link href={`/${post.slug}`} className="hover:underline">
                    {post.title}
                  </Link>
                </h2>
                <div className="text-gray-500 text-sm mb-3">{post.date}</div>
                <p className="text-gray-700 dark:text-gray-200 mb-4 min-h-[48px]">
                  {getExcerpt(post.excerpt)}
                </p>
              </div>
              <Link href={`/${post.slug}`} className="mt-auto text-blue-600 hover:underline font-medium">Read more &rarr;</Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}