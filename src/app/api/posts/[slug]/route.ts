import { NextResponse } from "next/server";
import { getFileContent } from "@/lib/github";
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

export async function GET(_req: Request, { params }: { params: { slug: string } }) {
  try {
    const md = await getFileContent(`data/md/${params.slug}.md`);
    const { data, content } = parseMarkdown(md);
    return NextResponse.json({ ...data, content });
  } catch (e) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }
}

// Add PUT and DELETE handlers here if needed, with verifyAuth

// Add PUT and DELETE handlers here if needed, with verifyAuth 