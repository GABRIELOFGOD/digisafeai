import { blogInputSchema } from "@/features/blogs/blog.schema";
import { listAllBlogs, saveBlog } from "@/features/blogs/blog.service";
import { authorizeAdminApi } from "@/lib/auth/admin-api";

export async function GET(request: Request) {
  const authorization = await authorizeAdminApi(request);
  if ("response" in authorization) return authorization.response;

  try {
    return Response.json({ blogs: await listAllBlogs() });
  } catch (error) {
    console.error(
      "Admin blog list failed.",
      error instanceof Error ? error.name : "UnknownError",
    );
    return Response.json({ error: "Blog posts could not be loaded." }, { status: 503 });
  }
}

export async function POST(request: Request) {
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
    return Response.json(
      { error: "Check the post fields and try again." },
      { status: 400 },
    );
  }

  try {
    const blog = await saveBlog(null, result.data);
    return Response.json({ blog }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && "code" in error && error.code === 11000) {
      return Response.json(
        { error: "A blog post already uses that slug." },
        { status: 409 },
      );
    }

    console.error(
      "Admin blog creation failed.",
      error instanceof Error ? error.name : "UnknownError",
    );
    return Response.json({ error: "The blog post could not be saved." }, { status: 503 });
  }
}
