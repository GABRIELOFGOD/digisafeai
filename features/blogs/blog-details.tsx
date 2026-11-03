"use client";

import Image from "next/image";
import Link from "next/link";
import { useBlog } from "@/hooks/blogs";
import { imageSource } from "@/features/rich-content/rich-text";
import { RichTextContent } from "@/features/rich-content/rich-text-content";

export function BlogDetails({ slug }: { slug: string }) {
  const { blog, isLoading, error } = useBlog(slug);

  if (isLoading) {
    return (
      <main className="public-main" id="main-content">
        <p className="text-sm text-muted-foreground" aria-live="polite">
          Loading blog post…
        </p>
      </main>
    );
  }

  if (error || !blog) {
    return (
      <main className="public-main" id="main-content">
        <p className="text-sm text-destructive" role="alert">
          {error || "This blog post could not be found."}
        </p>
        <Link
          className="mt-4 inline-block text-sm font-medium text-primary hover:underline"
          href="/blog"
        >
          Back to the blog
        </Link>
      </main>
    );
  }

  return (
    <main className="public-main" id="main-content">
      <Link
        className="text-sm font-medium text-primary hover:underline"
        href="/blog"
      >
        ← All blog posts
      </Link>
      <article className="mx-auto mt-6 max-w-3xl">
        <div className="relative aspect-[16/9] overflow-hidden rounded-xl">
          <Image
            alt={blog.imageAlt}
            className="object-cover"
            fill
            priority
            sizes="(max-width: 768px) 100vw, 768px"
            src={imageSource(blog.image)}
            unoptimized={blog.image.startsWith("/api/v1/content-images/")}
          />
        </div>
        <header className="mt-8">
          <p className="eyebrow">{blog.category}</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
            {blog.title}
          </h1>
          <p className="mt-4 text-lg leading-7 text-muted-foreground">
            {blog.excerpt}
          </p>
          <p className="mt-4 text-sm text-muted-foreground">
            By {blog.author} ·{" "}
            {new Intl.DateTimeFormat("en", {
              dateStyle: "long",
              timeZone: "UTC",
            }).format(new Date(blog.publishedAt))}
          </p>
        </header>
        <div className="mt-8">
          <RichTextContent content={blog.content} />
        </div>
        <footer className="mt-10 border-t border-border pt-6">
          <p className="leading-7 text-muted-foreground">
            If something you read here connects to a worry in your own life,
            you do not have to handle it alone.
          </p>
          <Link
            className="mt-4 inline-block text-sm font-medium text-primary hover:underline"
            href="/help-now"
          >
            Find support
          </Link>
        </footer>
      </article>
    </main>
  );
}
