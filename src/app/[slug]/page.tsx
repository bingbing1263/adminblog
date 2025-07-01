import Head from "next/head";
import { getFileContent } from "@/lib/github";
import { parseMarkdown, markdownToHtml } from "@/lib/markdown";
import { notFound } from "next/navigation";

interface PostPageProps {
  params: { slug: string };
}

export default async function PostPage({ params }: PostPageProps) {
  try {
    const md = await getFileContent(`data/md/${params.slug}.md`);
    const { data, content } = parseMarkdown(md);
    const html = await markdownToHtml(content);
    return (
      <>
        <Head>
          <title>{data.title} | AdminBlog</title>
          <meta name="description" content={content.slice(0, 160)} />
        </Head>
        <main className="max-w-2xl mx-auto py-8 px-4">
          <h1 className="text-3xl font-bold mb-2">{data.title}</h1>
          <div className="text-gray-500 text-sm mb-6">{data.date}</div>
          <article className="prose prose-neutral" dangerouslySetInnerHTML={{ __html: html }} />
        </main>
      </>
    );
  } catch (e) {
    notFound();
  }
} 