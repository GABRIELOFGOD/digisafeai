import "server-only";
import { BlogModel } from "./blog.model";
import type { BlogPost } from "./blog.types";
import { connectToDatabase } from "@/lib/db/mongoose";
import type { BlogInput } from "./blog.schema";

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
  isPublished: boolean;
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
    isPublished: blog.isPublished,
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

export async function listAllBlogs() {
  await connectToDatabase();
  const blogs = await BlogModel.find()
    .sort({ publishedAt: -1 })
    .lean();

  return blogs.map(toBlogPost);
}

export async function saveBlog(slug: string | null, input: BlogInput) {
  await connectToDatabase();
  const values = { ...input, publishedAt: new Date(input.publishedAt) };

  if (slug) {
    const updated = await BlogModel.findOneAndUpdate(
      { slug },
      { $set: values },
      { new: true, runValidators: true },
    ).lean();

    return updated ? toBlogPost(updated) : null;
  }

  const created = await BlogModel.create(values);
  return toBlogPost(created);
}

export async function deleteBlog(slug: string) {
  await connectToDatabase();
  return BlogModel.findOneAndDelete({ slug });
}
