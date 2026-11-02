import type { Metadata } from "next";
import { BlogList } from "@/features/blogs/blog-list";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Friendly, practical reads about online safety, wellbeing, and finding support.",
};

export default function BlogPage() {
  return <BlogList />;
}
