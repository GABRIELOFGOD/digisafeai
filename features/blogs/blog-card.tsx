import Image from "next/image";
import Link from "next/link";
import type { BlogPost } from "./blog.types";
import { imageSource } from "@/features/rich-content/rich-text";

export function BlogCard({ blog }: { blog: BlogPost }) {
  return (
    <li>
      <article className="flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card">
        <Link
          aria-label={`Read ${blog.title}`}
          className="relative block aspect-[16/10] w-full"
          href={`/blog/${blog.slug}`}
        >
          <Image
            alt={blog.imageAlt}
            className="object-cover"
            fill
            sizes="(max-width: 700px) 100vw, (max-width: 1024px) 50vw, 33vw"
            src={imageSource(blog.image)}
            unoptimized={blog.image.startsWith("/api/v1/content-images/")}
          />
        </Link>
        <div className="flex flex-1 flex-col items-start gap-3 p-5">
          <p className="text-sm font-medium text-primary">{blog.category}</p>
          <h2 className="text-lg font-semibold leading-snug">
            <Link
              className="hover:text-primary"
              href={`/blog/${blog.slug}`}
            >
              {blog.title}
            </Link>
          </h2>
          <p className="text-sm leading-6 text-muted-foreground">
            {blog.excerpt}
          </p>
          <p className="mt-auto pt-2 text-xs text-muted-foreground">
            {new Intl.DateTimeFormat("en", {
              dateStyle: "long",
              timeZone: "UTC",
            }).format(new Date(blog.publishedAt))}
          </p>
        </div>
      </article>
    </li>
  );
}
