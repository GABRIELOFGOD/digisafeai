import type {
  LegacyBlogSection,
  RichTextDocument,
} from "@/features/rich-content/rich-text";

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  publishedAt: string;
  image: string;
  imageAlt: string;
  isFeatured: boolean;
  isPublished: boolean;
  content: RichTextDocument | LegacyBlogSection[];
};

export type BlogListResponse = {
  blogs: BlogPost[];
};

export type BlogDetailResponse = {
  blog: BlogPost;
};
