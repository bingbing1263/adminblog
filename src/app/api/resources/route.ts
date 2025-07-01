import { NextResponse } from "next/server";
import { octokit } from "@/lib/github";
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

const path = "data/json/resources.json";

export async function GET() {
  try {
    const { data } = await octokit.repos.getContent({
      owner: process.env.GITHUB_OWNER!,
      repo: process.env.GITHUB_REPO!,
      path,
    });
    if (typeof data === "object" && "content" in data && data.content) {
      const json = Buffer.from(data.content, "base64").toString("utf-8");
      return NextResponse.json(JSON.parse(json));
    }
    return NextResponse.json([]);
  } catch {
    return NextResponse.json([]);
  }
}

export async function POST(req: Request) {
  if (!verifyAuth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const resource = await req.json();
    // Get current resources
    const { data } = await octokit.repos.getContent({
      owner: process.env.GITHUB_OWNER!,
      repo: process.env.GITHUB_REPO!,
      path,
    });
    let resources = [];
    let sha = undefined;
    if (typeof data === "object" && "content" in data && data.content) {
      resources = JSON.parse(Buffer.from(data.content, "base64").toString("utf-8"));
      sha = data.sha;
    }
    resources.push(resource);
    await octokit.repos.createOrUpdateFileContents({
      owner: process.env.GITHUB_OWNER!,
      repo: process.env.GITHUB_REPO!,
      path,
      message: "Add resource",
      content: Buffer.from(JSON.stringify(resources, null, 2)).toString("base64"),
      sha,
    });
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ error: "Failed to add resource", details: err?.response?.data || err?.message || String(err) }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  if (!verifyAuth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { index, resource } = await req.json();
    // Get current resources
    const { data } = await octokit.repos.getContent({
      owner: process.env.GITHUB_OWNER!,
      repo: process.env.GITHUB_REPO!,
      path,
    });
    let resources = [];
    let sha = undefined;
    if (typeof data === "object" && "content" in data && data.content) {
      resources = JSON.parse(Buffer.from(data.content, "base64").toString("utf-8"));
      sha = data.sha;
    }
    resources[index] = resource;
    await octokit.repos.createOrUpdateFileContents({
      owner: process.env.GITHUB_OWNER!,
      repo: process.env.GITHUB_REPO!,
      path,
      message: "Update resource",
      content: Buffer.from(JSON.stringify(resources, null, 2)).toString("base64"),
      sha,
    });
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ error: "Failed to update resource", details: err?.response?.data || err?.message || String(err) }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  if (!verifyAuth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { index } = await req.json();
    // Get current resources
    const { data } = await octokit.repos.getContent({
      owner: process.env.GITHUB_OWNER!,
      repo: process.env.GITHUB_REPO!,
      path,
    });
    let resources = [];
    let sha = undefined;
    if (typeof data === "object" && "content" in data && data.content) {
      resources = JSON.parse(Buffer.from(data.content, "base64").toString("utf-8"));
      sha = data.sha;
    }
    resources.splice(index, 1);
    await octokit.repos.createOrUpdateFileContents({
      owner: process.env.GITHUB_OWNER!,
      repo: process.env.GITHUB_REPO!,
      path,
      message: "Delete resource",
      content: Buffer.from(JSON.stringify(resources, null, 2)).toString("base64"),
      sha,
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete resource" }, { status: 500 });
  }
} 