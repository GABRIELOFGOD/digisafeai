import "server-only";
import { BlogModel } from "./blog.model";
import type { BlogPost } from "./blog.types";
import { connectToDatabase } from "@/lib/db/mongoose";

function toBlogPost(blog: {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  publishedAt: Date;
  image: string;
  imageAlt: string;
  isFeatured: boolean;
  content: BlogPost["content"];
}): BlogPost {
  return {
    slug: blog.slug,
    title: blog.title,
    excerpt: blog.excerpt,
    category: blog.category,
    author: blog.author,
    publishedAt: blog.publishedAt.toISOString(),
    image: blog.image,
    imageAlt: blog.imageAlt,
    isFeatured: blog.isFeatured,
    content: blog.content,
  };
}

export async function listPublishedBlogs() {
  await connectToDatabase();
  const blogs = await BlogModel.find({ isPublished: true })
    .sort({ publishedAt: -1 })
    .lean();

  return blogs.map(toBlogPost);
}

export async function getPublishedBlog(slug: string) {
  await connectToDatabase();
  const blog = await BlogModel.findOne({ slug, isPublished: true }).lean();
  return blog ? toBlogPost(blog) : null;
}

export async function listFeaturedBlogs(limit: number) {
  await connectToDatabase();
  const blogs = await BlogModel.find({
    isPublished: true,
    isFeatured: true,
  })
    .sort({ publishedAt: -1 })
    .limit(limit)
    .lean();

  return blogs.map(toBlogPost);
}
