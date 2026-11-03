import { listProjects } from "@/features/projects/project.service";

export async function GET() {
  try {
    return Response.json({ projects: await listProjects() });
  } catch (error) {
    console.error(
      "Project listing could not be loaded.",
      error instanceof Error ? error.name : "UnknownError",
    );
    return Response.json(
      { error: "Projects are temporarily unavailable." },
      { status: 503 },
    );
  }
}
