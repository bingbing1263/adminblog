import Link from "next/link";

interface PostMeta {
  title: string;
  date: string;
  slug: string;
  excerpt?: string;
}

interface Resource {
  title: string;
  url: string;
  description?: string;
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

interface Resource {
  id: string;
  title: string;
  url: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

async function getResources(): Promise<Resource[]> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const res = await fetch(`${baseUrl}/api/resources`, { 
    cache: "no-store",
    headers: {
      'Content-Type': 'application/json'
    }
  });
  if (!res.ok) return [];
  
  const data = await res.json();
  
  type ResourceValue = string | number | boolean | Date | null | undefined | ResourceValue[] | { [key: string]: ResourceValue };

  const serializeValue = (value: ResourceValue): ResourceValue => {
    if (value instanceof Date) {
      return value.toISOString();
    }
    if (Array.isArray(value)) {
      return value.map(serializeValue);
    }
    if (value && typeof value === 'object') {
      return Object.fromEntries(
        Object.entries(value).map(([k, v]) => [k, serializeValue(v)])
      );
    }
    return value;
  };

  return data.map((resource: Resource) => {
    const serialized = serializeValue(resource);
    return {
      ...serialized,
      title: String(serialized.title),
      url: String(serialized.url),
      description: serialized.description ? String(serialized.description) : undefined
    };
  });
}

export default async function HomePage() {
  const [posts, resources] = await Promise.all([getPosts(), getResources()]);
  return (
    <section>
      <h1 className="text-4xl font-extrabold mb-2 text-center">AdminBlog</h1>
      <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 text-center">A database-free, GitHub-powered blog and CMS.</p>
      
      {resources.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-center">Featured Resources</h2>
          <ul className="grid gap-6 md:grid-cols-2 mb-12">
            {resources.map((resource, index) => (
              <li key={`${resource.url}-${resource.title}-${index}`} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-800 hover:shadow-xl transition-shadow">
                <a 
                  href={resource.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block"
                >
                  <h3 className="text-xl font-bold mb-2">{resource.title}</h3>
                  <p className="text-gray-700 dark:text-gray-200">
                    {resource.description?.toString() || 'No description available'}
                  </p>
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
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