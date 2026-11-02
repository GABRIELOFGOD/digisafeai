import type { Metadata } from "next";
import blogsData from "@/data/blogs.json";
import { BlogDetails } from "@/features/blogs/blog-details";

type BlogPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: BlogPageProps): Promise<Metadata> {
  const { slug } = await params;
  const blog = blogsData.blogs.find((item) => item.slug === slug);

  return {
    title: blog?.title ?? "Blog post",
    description: blog?.excerpt,
  };
}

export function generateStaticParams() {
  return blogsData.blogs.map((blog) => ({ slug: blog.slug }));
}

export default async function BlogPostPage({ params }: BlogPageProps) {
  const { slug } = await params;
  return <BlogDetails slug={slug} />;
}
