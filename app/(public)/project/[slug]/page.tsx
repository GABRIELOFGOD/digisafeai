import type { Metadata } from "next";
import { notFound } from "next/navigation";
import projectsData from "@/data/projects.json";
import ProjectDetails from "@/features/home/project-details";

type ProjectPageProps = {
  params: Promise<{ slug: string }>;
};

export const metadata: Metadata = {
  title: "Project",
};

export function generateStaticParams() {
  return projectsData.projects.map((project) => ({
    slug: project.slug.split("/").at(-1) ?? "",
  }));
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;

  if (
    !projectsData.projects.some(
      (project) => project.slug === `/project/${slug}`,
    )
  ) {
    notFound();
  }

  return <ProjectDetails slug={slug} />;
}
