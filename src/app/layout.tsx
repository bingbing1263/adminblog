import "./globals.css";
import Head from "next/head";
import Link from "next/link";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <Head>
        <title>AdminBlog</title>
        <meta name="description" content="AdminBlog: Database-free, GitHub-powered blog and CMS" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <body className="bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-50 antialiased focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-screen flex flex-col">
        <a href="#main-content" className="sr-only focus:not-sr-only absolute left-2 top-2 z-50 bg-white text-black dark:bg-gray-800 dark:text-white px-4 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-blue-500">Skip to content</a>
        <header className="w-full border-b bg-white/80 dark:bg-gray-900/80 backdrop-blur sticky top-0 z-40">
          <nav className="max-w-3xl mx-auto flex items-center justify-between px-4 py-3">
            <Link href="/" className="text-2xl font-bold tracking-tight hover:opacity-80">📝 AdminBlog</Link>
            <div className="flex gap-4">
              <Link href="/" className="hover:underline">Home</Link>
              <Link href="/admin" className="hover:underline">Admin</Link>
            </div>
          </nav>
        </header>
        <main id="main-content" tabIndex={-1} className="outline-none flex-1 max-w-3xl mx-auto w-full px-4 py-8">
          {children}
        </main>
        <footer className="w-full border-t bg-white/80 dark:bg-gray-900/80 py-4 text-center text-sm text-gray-500 mt-8">
          <div>
            &copy; {new Date().getFullYear()} AdminBlog. Powered by <a href="https://nextjs.org/" className="underline hover:text-blue-600">Next.js</a> &amp; <a href="https://github.com/bingbing1263/adminblog" className="underline hover:text-blue-600">GitHub</a>.
          </div>
        </footer>
      </body>
    </html>
  );
}
