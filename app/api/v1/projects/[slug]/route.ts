import projectsData from "@/data/projects.json";

type RouteContext = { params: Promise<{ slug: string }> };

export async function GET(_request: Request, { params }: RouteContext) {
  const { slug } = await params;
  const project = projectsData.projects.find(
    (item) => item.slug === `/project/${slug}`,
  );

  if (!project) {
    return Response.json({ error: "Project not found." }, { status: 404 });
  }

  return Response.json({ project });
}
