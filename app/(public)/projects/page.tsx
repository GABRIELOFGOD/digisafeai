import type { Metadata } from "next";
import ProjectsList from "@/features/home/projects-list";

export const metadata: Metadata = {
  title: "Our Projects",
};

export default function ProjectsPage() {
  return <ProjectsList />;
}
