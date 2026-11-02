import { listFeaturedBlogs } from "@/features/blogs/blog.service";

export async function GET() {
  try {
    const blogs = await listFeaturedBlogs(3);
    return Response.json({ blogs });
  } catch (error) {
    console.error(
      "Featured blog posts could not be loaded.",
      error instanceof Error ? error.name : "UnknownError",
    );
    return Response.json(
      { error: "Featured blog posts are temporarily unavailable." },
      { status: 503 },
    );
  }
}
