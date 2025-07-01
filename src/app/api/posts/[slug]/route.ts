import { NextResponse } from "next/server";
import { getFileContent } from "@/lib/github";
import { parseMarkdown } from "@/lib/markdown";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const slug = url.pathname.split("/").filter(Boolean).pop();
    if (!slug) throw new Error("Missing slug");
    const md = await getFileContent(`data/md/${slug}.md`);
    const { data, content } = parseMarkdown(md);
    return NextResponse.json({ ...data, content });
  } catch {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }
}

// Add PUT and DELETE handlers here if needed, with verifyAuth

// Add PUT and DELETE handlers here if needed, with verifyAuth 