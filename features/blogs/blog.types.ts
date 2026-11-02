export type BlogSection = {
  heading: string;
  paragraphs: string[];
};

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
  content: BlogSection[];
};

export type BlogListResponse = {
  blogs: BlogPost[];
};

export type BlogDetailResponse = {
  blog: BlogPost;
};
