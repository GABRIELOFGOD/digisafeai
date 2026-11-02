import { getPublishedBlog } from "@/features/blogs/blog.service";

type RouteContext = { params: Promise<{ slug: string }> };

export async function GET(_request: Request, { params }: RouteContext) {
  const { slug } = await params;

  try {
    const blog = await getPublishedBlog(slug);

    if (!blog) {
      return Response.json({ error: "Blog post not found." }, { status: 404 });
    }

    return Response.json({ blog });
  } catch (error) {
    console.error(
      "Blog post could not be loaded.",
      error instanceof Error ? error.name : "UnknownError",
    );
    return Response.json(
      { error: "This blog post is temporarily unavailable." },
      { status: 503 },
    );
  }
}
