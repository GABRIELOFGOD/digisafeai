"use client";

import { useEffect, useState } from "react";
import type {
  BlogDetailResponse,
  BlogListResponse,
  BlogPost,
} from "@/features/blogs/blog.types";
import type { LegacyBlogSection } from "@/features/rich-content/rich-text";
import { isRichTextDocument } from "@/features/rich-content/rich-text";

function isBlogSection(value: unknown): value is LegacyBlogSection {
  return (
    typeof value === "object" &&
    value !== null &&
    "heading" in value &&
    typeof value.heading === "string" &&
    "paragraphs" in value &&
    Array.isArray(value.paragraphs) &&
    value.paragraphs.every(
      (paragraph: unknown) => typeof paragraph === "string",
    )
  );
}

function isBlogPost(value: unknown): value is BlogPost {
  return (
    typeof value === "object" &&
    value !== null &&
    "slug" in value &&
    typeof value.slug === "string" &&
    "title" in value &&
    typeof value.title === "string" &&
    "excerpt" in value &&
    typeof value.excerpt === "string" &&
    "category" in value &&
    typeof value.category === "string" &&
    "author" in value &&
    typeof value.author === "string" &&
    "publishedAt" in value &&
    typeof value.publishedAt === "string" &&
    !Number.isNaN(Date.parse(value.publishedAt)) &&
    "image" in value &&
    typeof value.image === "string" &&
    "imageAlt" in value &&
    typeof value.imageAlt === "string" &&
    "isFeatured" in value &&
    typeof value.isFeatured === "boolean" &&
    "isPublished" in value &&
    typeof value.isPublished === "boolean" &&
    "content" in value &&
    ((Array.isArray(value.content) && value.content.every(isBlogSection)) ||
      isRichTextDocument(value.content))
  );
}

function isBlogListResponse(value: unknown): value is BlogListResponse {
  return (
    typeof value === "object" &&
    value !== null &&
    "blogs" in value &&
    Array.isArray(value.blogs) &&
    value.blogs.every(isBlogPost)
  );
}

function isBlogDetailResponse(value: unknown): value is BlogDetailResponse {
  return (
    typeof value === "object" &&
    value !== null &&
    "blog" in value &&
    isBlogPost(value.blog)
  );
}

export function useBlogs(endpoint = "/api/v1/blogs") {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function loadBlogs() {
      try {
        const response = await fetch(endpoint, { signal: controller.signal });
        const result: unknown = await response.json();

        if (!response.ok || !isBlogListResponse(result)) {
          throw new Error("Blog posts could not be loaded.");
        }

        setBlogs(result.blogs);
      } catch {
        if (!controller.signal.aborted) {
          setError("Blog posts could not be loaded. Please try again later.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    void loadBlogs();
    return () => controller.abort();
  }, [endpoint]);

  return { blogs, isLoading, error };
}

export function useBlog(slug: string) {
  const [blog, setBlog] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function loadBlog() {
      try {
        const response = await fetch(
          `/api/v1/blogs/${encodeURIComponent(slug)}`,
          { signal: controller.signal },
        );
        const result: unknown = await response.json();

        if (!response.ok || !isBlogDetailResponse(result)) {
          throw new Error("Blog post could not be loaded.");
        }

        setBlog(result.blog);
      } catch {
        if (!controller.signal.aborted) {
          setError("This blog post could not be found or loaded.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    void loadBlog();
    return () => controller.abort();
  }, [slug]);

  return { blog, isLoading, error };
}
