import { projectInputSchema } from "@/features/projects/project.schema";
import {
  listAllProjects,
  upsertProject,
} from "@/features/projects/project.service";
import { authorizeAdminApi } from "@/lib/auth/admin-api";

export async function GET(request: Request) {
  const authorization = await authorizeAdminApi(request);
  if ("response" in authorization) return authorization.response;

  try {
    return Response.json({ projects: await listAllProjects() });
  } catch (error) {
    console.error(
      "Admin project list failed.",
      error instanceof Error ? error.name : "UnknownError",
    );
    return Response.json({ error: "Projects could not be loaded." }, { status: 503 });
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

  const result = projectInputSchema.safeParse(payload);
  if (!result.success) {
    return Response.json(
      { error: "Check the project fields and try again." },
      { status: 400 },
    );
  }

  try {
    const project = await upsertProject(null, result.data);
    return Response.json({ project }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && "code" in error && error.code === 11000) {
      return Response.json(
        { error: "A project already uses that slug or ID." },
        { status: 409 },
      );
    }

    console.error(
      "Admin project creation failed.",
      error instanceof Error ? error.name : "UnknownError",
    );
    return Response.json({ error: "The project could not be saved." }, { status: 503 });
  }
}
