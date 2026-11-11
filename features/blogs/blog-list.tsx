"use client";

import Link from "next/link";
import { BlogCard } from "./blog-card";
import { useBlogs } from "@/hooks/blogs";

export function BlogList() {
  const { blogs, isLoading, error } = useBlogs();

  return (
    <main className="mx-auto w-[calc(100%-2.5rem)] max-w-[70rem] flex-1 py-8 pb-15" id="main-content">
      <header className="mb-8">
        <p className="mb-4 text-[0.82rem] font-bold uppercase tracking-[0.14em] text-primary">Stories and guidance</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
          The DigiSafe blog
        </h1>
        <p className="mt-3 max-w-2xl leading-7 text-muted-foreground">
          Friendly, practical reads about online safety, wellbeing, and finding
          support. Take what is useful and go at your own pace.
        </p>
        <Link
          className="mt-4 inline-block text-sm font-medium text-primary hover:underline"
          href="/"
        >
          Back to home
        </Link>
      </header>

      {isLoading ? (
        <p className="text-sm text-muted-foreground" aria-live="polite">
          Loading blog posts…
        </p>
      ) : error ? (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : blogs.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          There are no blog posts to show right now.
        </p>
      ) : (
        <ul className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {blogs.map((blog) => (
            <BlogCard key={blog.slug} blog={blog} />
          ))}
        </ul>
      )}
    </main>
  );
}
