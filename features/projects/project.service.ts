import "server-only";
import { connectToDatabase } from "@/lib/db/mongoose";
import { ProjectModel } from "./project.model";
import type { ProjectInput } from "./project.schema";
import type { RichTextDocument } from "@/features/rich-content/rich-text";

export type Project = Omit<ProjectInput, "fullDescription"> & {
  id: number;
  fullDescription: string | RichTextDocument;
};

function toProject(project: {
  id: number;
  name: string;
  description: string;
  image: string;
  slug: string;
  outcomes: string[];
  fullDescription: string | RichTextDocument;
}): Project {
  return {
    ...project,
    slug: `/project/${project.slug}`,
  };
}

export async function listProjects(): Promise<Project[]> {
  await connectToDatabase();
  const projects = await ProjectModel.find()
    .sort({ id: 1 })
    .select("id name description image slug outcomes fullDescription")
    .lean();

  return projects.map(toProject);
}

export async function getProject(slug: string): Promise<Project | null> {
  await connectToDatabase();
  const project = await ProjectModel.findOne({ slug })
    .select("id name description image slug outcomes fullDescription")
    .lean();

  return project ? toProject(project) : null;
}

export async function upsertProject(slug: string | null, input: ProjectInput) {
  await connectToDatabase();

  if (slug) {
    const updated = await ProjectModel.findOneAndUpdate(
      { slug },
      { $set: input },
      { new: true, runValidators: true },
    ).lean();
    return updated;
  }

  const latest = await ProjectModel.findOne().sort({ id: -1 }).select("id").lean();
  return ProjectModel.create({
    ...input,
    id: (latest?.id ?? 0) + 1,
  });
}

export async function deleteProject(slug: string) {
  await connectToDatabase();
  return ProjectModel.findOneAndDelete({ slug });
}

export async function listAllProjects(): Promise<Project[]> {
  return listProjects();
}
