"use client";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface PostMeta {
  title: string;
  date: string;
  slug: string;
}

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [error, setError] = useState("");
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [content, setContent] = useState("");
  const [saveMsg, setSaveMsg] = useState("");
  const [posts, setPosts] = useState<PostMeta[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [resources, setResources] = useState<unknown[]>([]);
  const [resourceLoading, setResourceLoading] = useState(false);
  const [resourceMsg, setResourceMsg] = useState("");
  const [editingResourceIdx, setEditingResourceIdx] = useState<number | null>(null);
  const [resourceValue, setResourceValue] = useState("");

  useEffect(() => {
    const t = localStorage.getItem("adminblog_token");
    if (t) setToken(t);
  }, []);

  useEffect(() => {
    if (isLoggedIn) fetchPosts();
    if (isLoggedIn) fetchResources();
    // eslint-disable-next-line
  }, [isLoggedIn]);

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        const data = await res.json();
        setToken(data.token);
        localStorage.setItem("adminblog_token", data.token);
        setIsLoggedIn(true);
      } else {
        setError("Invalid password");
      }
    } catch {
      setError("Login failed");
    }
  }

  async function fetchPosts() {
    setLoading(true);
    try {
      const res = await fetch("/api/posts", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (handleApiError(res)) return;
      if (res.ok) {
        setPosts(await res.json());
      }
    } finally {
      setLoading(false);
    }
  }

  async function fetchResources() {
    setResourceLoading(true);
    try {
      const res = await fetch("/api/resources", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (handleApiError(res)) return;
      if (res.ok) {
        setResources(await res.json());
      }
    } finally {
      setResourceLoading(false);
    }
  }

  async function handleCreatePost(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaveMsg("");
    setLoading(true);
    try {
      let res;
      if (editingSlug) {
        res = await fetch("/api/posts", {
          method: "PUT",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({ slug: editingSlug, title, date, content }),
        });
      } else {
        res = await fetch("/api/posts", {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({ title, date, content }),
        });
      }
      if (handleApiError(res)) return;
      if (res.ok) {
        setSaveMsg(editingSlug ? "Post updated successfully!" : "Post created successfully!");
        setTitle("");
        setDate("");
        setContent("");
        setEditingSlug(null);
        fetchPosts();
      } else {
        const data = await res.json();
        setSaveMsg(data.error || "Failed to save post");
      }
    } catch {
      setSaveMsg("Failed to save post");
    } finally {
      setLoading(false);
    }
  }

  async function handleEdit(post: PostMeta) {
    setTitle(post.title);
    setDate(post.date);
    setContent("");
    setEditingSlug(post.slug);
    // Fetch content
    const res = await fetch(`/api/posts/${post.slug}`);
    if (res.ok) {
      const data = await res.json();
      setContent(data.content || "");
    }
  }

  async function handleDelete(slug: string) {
    if (!window.confirm("Delete this post?")) return;
    setSaveMsg("");
    setLoading(true);
    try {
      const res = await fetch("/api/posts", {
        method: "DELETE",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ slug }),
      });
      if (handleApiError(res)) return;
      if (res.ok) {
        setSaveMsg("Post deleted.");
        fetchPosts();
      } else {
        setSaveMsg("Failed to delete post");
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleAddResource(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setResourceMsg("");
    setResourceLoading(true);
    try {
      const res = await fetch("/api/resources", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(resourceValue),
      });
      if (handleApiError(res)) return;
      if (res.ok) {
        setResourceMsg("Resource added.");
        setResourceValue("");
        fetchResources();
      } else {
        setResourceMsg("Failed to add resource");
      }
    } catch {
      setResourceMsg("Failed to add resource");
    } finally {
      setResourceLoading(false);
    }
  }

  async function handleEditResource(idx: number) {
    setEditingResourceIdx(idx);
    setResourceValue(JSON.stringify(resources[idx], null, 2));
  }

  async function handleUpdateResource(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setResourceMsg("");
    setResourceLoading(true);
    try {
      const res = await fetch("/api/resources", {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ index: editingResourceIdx, resource: JSON.parse(resourceValue) }),
      });
      if (handleApiError(res)) return;
      if (res.ok) {
        setResourceMsg("Resource updated.");
        setEditingResourceIdx(null);
        setResourceValue("");
        fetchResources();
      } else {
        setResourceMsg("Failed to update resource");
      }
    } catch {
      setResourceMsg("Failed to update resource");
    } finally {
      setResourceLoading(false);
    }
  }

  async function handleDeleteResource(idx: number) {
    if (!window.confirm("Delete this resource?")) return;
    setResourceMsg("");
    setResourceLoading(true);
    try {
      const res = await fetch("/api/resources", {
        method: "DELETE",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ index: idx }),
      });
      if (handleApiError(res)) return;
      if (res.ok) {
        setResourceMsg("Resource deleted.");
        fetchResources();
      } else {
        setResourceMsg("Failed to delete resource");
      }
    } finally {
      setResourceLoading(false);
    }
  }

  function handleLogout() {
    setIsLoggedIn(false);
    setToken(null);
    localStorage.removeItem("adminblog_token");
    setPassword("");
  }

  function handleApiError(res: Response) {
    if (res.status === 401) {
      handleLogout();
      setError("Session expired. Please log in again.");
      return true;
    }
    return false;
  }

  if (!isLoggedIn) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <form onSubmit={handleLogin} className="space-y-4 p-8 border rounded shadow-md bg-white">
          <h1 className="text-2xl font-bold">Admin Login</h1>
          <Input
            type="password"
            placeholder="Enter admin password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          {error && <div className="text-red-500">{error}</div>}
          <Button type="submit">Login</Button>
        </form>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Admin Panel</h1>
        <Button type="button" variant="secondary" onClick={handleLogout} aria-label="Logout">Logout</Button>
      </div>
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Posts</h2>
        {loading && <div className="text-gray-500" role="status" aria-live="polite">Loading posts...</div>}
        <ul className="space-y-2" aria-label="Blog posts">
          {posts.map(post => (
            <li key={post.slug} className="flex items-center gap-2" tabIndex={0} aria-label={`Post: ${post.title}`}>
              <span>{post.title}</span>
              <Button type="button" onClick={() => handleEdit(post)} size="sm" aria-label={`Edit ${post.title}`}>Edit</Button>
              <Button type="button" onClick={() => handleDelete(post.slug)} size="sm" variant="destructive" aria-label={`Delete ${post.title}`}>Delete</Button>
            </li>
          ))}
        </ul>
      </div>
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Resources</h2>
        {resourceLoading && <div className="text-gray-500" role="status" aria-live="polite">Loading resources...</div>}
        <ul className="space-y-2 mb-4" aria-label="Resources">
          {resources.map((res, idx) => (
            <li key={idx} className="flex items-center gap-2" tabIndex={0} aria-label={`Resource ${idx + 1}`}>
              <span className="truncate max-w-xs">{JSON.stringify(res)}</span>
              <Button type="button" onClick={() => handleEditResource(idx)} size="sm" aria-label={`Edit resource ${idx + 1}`}>Edit</Button>
              <Button type="button" onClick={() => handleDeleteResource(idx)} size="sm" variant="destructive" aria-label={`Delete resource ${idx + 1}`}>Delete</Button>
            </li>
          ))}
        </ul>
        {editingResourceIdx !== null ? (
          <form onSubmit={handleUpdateResource} className="space-y-2" aria-label="Edit resource form">
            <textarea
              className="w-full border rounded p-2 min-h-[80px] font-mono"
              value={resourceValue}
              onChange={e => setResourceValue(e.target.value)}
              aria-label="Resource JSON"
            />
            <Button type="submit" aria-label="Update resource">Update Resource</Button>
            <Button type="button" variant="secondary" onClick={() => { setEditingResourceIdx(null); setResourceValue(""); }} aria-label="Cancel edit">Cancel</Button>
          </form>
        ) : (
          <form onSubmit={handleAddResource} className="space-y-2" aria-label="Add resource form">
            <textarea
              className="w-full border rounded p-2 min-h-[80px] font-mono"
              placeholder="New resource as JSON"
              value={resourceValue}
              onChange={e => setResourceValue(e.target.value)}
              aria-label="Resource JSON"
            />
            <Button type="submit" aria-label="Add resource">Add Resource</Button>
          </form>
        )}
        {resourceMsg && <div className="text-green-600 mt-2" role="status" aria-live="polite">{resourceMsg}</div>}
      </div>
      <form onSubmit={handleCreatePost} className="space-y-4 max-w-xl" aria-label={editingSlug ? "Edit post form" : "Create post form"}>
        <Input
          placeholder="Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          aria-label="Post title"
        />
        <Input
          placeholder="Date (YYYY-MM-DD)"
          value={date}
          onChange={e => setDate(e.target.value)}
          aria-label="Post date"
        />
        <textarea
          className="w-full border rounded p-2 min-h-[120px]"
          placeholder="Markdown content"
          value={content}
          onChange={e => setContent(e.target.value)}
          aria-label="Post content"
        />
        <Button type="submit" aria-label={editingSlug ? "Update post" : "Create post"}>{editingSlug ? "Update Post" : "Create Post"}</Button>
        {editingSlug && (
          <Button type="button" variant="secondary" onClick={() => {
            setEditingSlug(null); setTitle(""); setDate(""); setContent(""); setSaveMsg("");
          }} aria-label="Cancel edit">Cancel Edit</Button>
        )}
        {saveMsg && <div className="text-green-600" role="status" aria-live="polite">{saveMsg}</div>}
      </form>
      {error && <div className="text-red-600 mb-2" role="alert">{error}</div>}
    </div>
  );
} 