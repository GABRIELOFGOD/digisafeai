"use client";

import Link from "next/link";
import { BlogCard } from "./blog-card";
import { useBlogs } from "@/hooks/blogs";

export function FeaturedBlogs() {
  const { blogs, isLoading, error } = useBlogs("/api/v1/blogs/featured");

  if (isLoading || blogs.length === 0) {
    return null;
  }

  if (error) {
    return (
      <section
        aria-labelledby="featured-blogs-heading"
           className="relative left-1/2 ml-[-50vw] w-screen bg-muted px-[max(1.25rem,calc((100vw-70rem)/2))] py-12"
      >
        <h2
          className="text-2xl font-semibold tracking-tight"
          id="featured-blogs-heading"
        >
          From the blog
        </h2>
        <p className="mt-3 text-sm text-destructive" role="alert">
          Featured blog posts are temporarily unavailable.
        </p>
      </section>
    );
  }

  return (
    <section
      aria-labelledby="featured-blogs-heading"
         className="relative left-1/2 ml-[-50vw] w-screen bg-muted px-[max(1.25rem,calc((100vw-70rem)/2))] py-20"
    >
      <header className="mb-6 flex items-end justify-between gap-4">
        <div>
             <p className="mb-4 text-[0.82rem] font-bold uppercase tracking-[0.14em] text-primary">From the blog</p>
          <h2
            className="mt-2 text-2xl font-semibold tracking-tight"
            id="featured-blogs-heading"
          >
            Helpful reads for everyday life
          </h2>
        </div>
        <Link
          className="shrink-0 text-sm font-medium text-primary hover:underline"
          href="/blog"
        >
          Visit the blog
        </Link>
      </header>
      <ul className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {blogs.map((blog) => (
          <BlogCard key={blog.slug} blog={blog} />
        ))}
      </ul>
    </section>
  );
}
