import { listPublishedBlogs } from "@/features/blogs/blog.service";

export async function GET() {
  try {
    const blogs = await listPublishedBlogs();
    return Response.json({ blogs });
  } catch (error) {
    console.error(
      "Blog listing could not be loaded.",
      error instanceof Error ? error.name : "UnknownError",
    );
    return Response.json(
      { error: "Blog posts are temporarily unavailable." },
      { status: 503 },
    );
  }
}
