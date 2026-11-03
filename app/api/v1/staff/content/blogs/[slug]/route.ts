import { blogInputSchema } from "@/features/blogs/blog.schema";
import { deleteBlog, saveBlog } from "@/features/blogs/blog.service";
import { authorizeAdminApi } from "@/lib/auth/admin-api";

type RouteContext = { params: Promise<{ slug: string }> };

export async function PUT(request: Request, { params }: RouteContext) {
  const authorization = await authorizeAdminApi(request, true);
  if ("response" in authorization) return authorization.response;

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }

  const result = blogInputSchema.safeParse(payload);
  if (!result.success) {
    return Response.json({ error: "Check the post fields and try again." }, { status: 400 });
  }

  const { slug } = await params;
  try {
    const blog = await saveBlog(slug, result.data);
    if (!blog) {
      return Response.json({ error: "Blog post not found." }, { status: 404 });
    }
    return Response.json({ blog });
  } catch (error) {
    if (error instanceof Error && "code" in error && error.code === 11000) {
      return Response.json(
        { error: "A blog post already uses that slug." },
        { status: 409 },
      );
    }

    console.error(
      "Admin blog update failed.",
      error instanceof Error ? error.name : "UnknownError",
    );
    return Response.json({ error: "The blog post could not be updated." }, { status: 503 });
  }
}

export async function DELETE(request: Request, { params }: RouteContext) {
  const authorization = await authorizeAdminApi(request, true);
  if ("response" in authorization) return authorization.response;

  const { slug } = await params;
  try {
    const deleted = await deleteBlog(slug);
    if (!deleted) {
      return Response.json({ error: "Blog post not found." }, { status: 404 });
    }
    return Response.json({ success: true });
  } catch (error) {
    console.error(
      "Admin blog deletion failed.",
      error instanceof Error ? error.name : "UnknownError",
    );
    return Response.json({ error: "The blog post could not be deleted." }, { status: 503 });
  }
}
