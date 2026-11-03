import { projectInputSchema } from "@/features/projects/project.schema";
import {
  deleteProject,
  upsertProject,
} from "@/features/projects/project.service";
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

  const result = projectInputSchema.safeParse(payload);
  if (!result.success) {
    return Response.json({ error: "Check the project fields and try again." }, { status: 400 });
  }

  const { slug } = await params;
  try {
    const project = await upsertProject(slug, result.data);
    if (!project) {
      return Response.json({ error: "Project not found." }, { status: 404 });
    }
    return Response.json({ project });
  } catch (error) {
    if (error instanceof Error && "code" in error && error.code === 11000) {
      return Response.json(
        { error: "A project already uses that slug or ID." },
        { status: 409 },
      );
    }

    console.error(
      "Admin project update failed.",
      error instanceof Error ? error.name : "UnknownError",
    );
    return Response.json({ error: "The project could not be updated." }, { status: 503 });
  }
}

export async function DELETE(request: Request, { params }: RouteContext) {
  const authorization = await authorizeAdminApi(request, true);
  if ("response" in authorization) return authorization.response;

  const { slug } = await params;
  try {
    const deleted = await deleteProject(slug);
    if (!deleted) {
      return Response.json({ error: "Project not found." }, { status: 404 });
    }
    return Response.json({ success: true });
  } catch (error) {
    console.error(
      "Admin project deletion failed.",
      error instanceof Error ? error.name : "UnknownError",
    );
    return Response.json({ error: "The project could not be deleted." }, { status: 503 });
  }
}
