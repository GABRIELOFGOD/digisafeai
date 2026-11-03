import { getProject } from "@/features/projects/project.service";

type RouteContext = { params: Promise<{ slug: string }> };

export async function GET(_request: Request, { params }: RouteContext) {
  const { slug } = await params;
  try {
    const project = await getProject(slug);

    if (!project) {
      return Response.json({ error: "Project not found." }, { status: 404 });
    }

    return Response.json({ project });
  } catch (error) {
    console.error(
      "Project could not be loaded.",
      error instanceof Error ? error.name : "UnknownError",
    );
    return Response.json(
      { error: "This project is temporarily unavailable." },
      { status: 503 },
    );
  }
}
