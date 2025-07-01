import { NextResponse } from "next/server";
import { octokit } from "@/lib/github";
import { parseMarkdown } from "@/lib/markdown";
import jwt from "jsonwebtoken";

function verifyAuth(req: Request) {
  const auth = req.headers.get("authorization");
  if (!auth) return false;
  const token = auth.replace(/^Bearer /, "");
  try {
    jwt.verify(token, process.env.JWT_SECRET || "changeme");
    return true;
  } catch {
    return false;
  }
}

export async function GET() {
  try {
    const { data } = await octokit.repos.getContent({
      owner: process.env.GITHUB_OWNER!,
      repo: process.env.GITHUB_REPO!,
      path: "data/md",
    });
    if (!Array.isArray(data)) return NextResponse.json([]);
    const posts = await Promise.all(
      data.filter(f => f.name.endsWith(".md")).map(async (file) => {
        const slug = file.name.replace(/\.md$/, "");
        const fileRes = await octokit.repos.getContent({
          owner: process.env.GITHUB_OWNER!,
          repo: process.env.GITHUB_REPO!,
          path: `data/md/${file.name}`,
        });
        if (
          typeof fileRes.data === "object" &&
          "content" in fileRes.data &&
          fileRes.data.content
        ) {
          const md = Buffer.from(fileRes.data.content, "base64").toString("utf-8");
          const { data } = parseMarkdown(md);
          return {
            title: data.title || slug,
            date: data.date || "",
            slug,
          };
        }
        return null;
      })
    );
    return NextResponse.json(posts.filter(Boolean));
  } catch (e) {
    return NextResponse.json([], { status: 500 });
  }
}

export async function POST(req: Request) {
  if (!verifyAuth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { title, date, content } = await req.json();
    if (!title || !content) {
      return NextResponse.json({ error: "Missing title or content" }, { status: 400 });
    }
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    const md = `---\ntitle: ${title}\ndate: ${date || new Date().toISOString().slice(0,10)}\n---\n\n${content}\n`;
    await octokit.repos.createOrUpdateFileContents({
      owner: process.env.GITHUB_OWNER!,
      repo: process.env.GITHUB_REPO!,
      path: `data/md/${slug}.md`,
      message: `Create post: ${title}`,
      content: Buffer.from(md).toString("base64"),
    });
    return NextResponse.json({ ok: true, slug });
  } catch (e) {
    return NextResponse.json({ error: "Failed to create post" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  if (!verifyAuth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { slug, title, date, content } = await req.json();
    if (!slug || !title || !content) {
      return NextResponse.json({ error: "Missing slug, title, or content" }, { status: 400 });
    }
    // Get current file SHA
    const fileRes = await octokit.repos.getContent({
      owner: process.env.GITHUB_OWNER!,
      repo: process.env.GITHUB_REPO!,
      path: `data/md/${slug}.md`,
    });
    if (!('sha' in fileRes.data)) throw new Error('File SHA not found');
    const sha = fileRes.data.sha;
    const md = `---\ntitle: ${title}\ndate: ${date || new Date().toISOString().slice(0,10)}\n---\n\n${content}\n`;
    await octokit.repos.createOrUpdateFileContents({
      owner: process.env.GITHUB_OWNER!,
      repo: process.env.GITHUB_REPO!,
      path: `data/md/${slug}.md`,
      message: `Update post: ${title}`,
      content: Buffer.from(md).toString("base64"),
      sha,
    });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: "Failed to update post" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  if (!verifyAuth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { slug } = await req.json();
    if (!slug) {
      return NextResponse.json({ error: "Missing slug" }, { status: 400 });
    }
    // Get current file SHA
    const fileRes = await octokit.repos.getContent({
      owner: process.env.GITHUB_OWNER!,
      repo: process.env.GITHUB_REPO!,
      path: `data/md/${slug}.md`,
    });
    if (!('sha' in fileRes.data)) throw new Error('File SHA not found');
    const sha = fileRes.data.sha;
    await octokit.repos.deleteFile({
      owner: process.env.GITHUB_OWNER!,
      repo: process.env.GITHUB_REPO!,
      path: `data/md/${slug}.md`,
      message: `Delete post: ${slug}`,
      sha,
    });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: "Failed to delete post" }, { status: 500 });
  }
} 