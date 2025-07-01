import "./globals.css";
import Head from "next/head";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <Head>
        <title>AdminBlog</title>
        <meta name="description" content="AdminBlog: Database-free, GitHub-powered blog and CMS" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <body className="bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-50 antialiased focus:outline-none focus:ring-2 focus:ring-blue-500">
        <a href="#main-content" className="sr-only focus:not-sr-only absolute left-2 top-2 z-50 bg-white text-black dark:bg-gray-800 dark:text-white px-4 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-blue-500">Skip to content</a>
        <main id="main-content" tabIndex={-1} className="outline-none">
          {children}
        </main>
      </body>
    </html>
  );
}
