"use client";

import Link from "next/link"
import ProjectCard from "./project-card";
import { useProjects } from "@/hooks/projects";

const Projects = () => {
  const { projects, isLoading, error } = useProjects();

  return (
    <div className="flex flex-col gap-10 py-20">
      <div className="flex justify-between gap-5">
        <div className="flex flex-col">
          <h2 className="text-2xl font-bold">Our Projects</h2>
          <p className="text-sm text-muted-foreground">
            Explore our projects and initiatives aimed at promoting digital
            safety and awareness.
          </p>
        </div>

        <Link
          href="/projects"
          className="text-sm font-medium text-primary hover:underline"
        >
          View All Projects
        </Link>
      </div>

      {isLoading ? (
        <p className="text-sm text-muted-foreground" aria-live="polite">
          Loading projects…
        </p>
      ) : error ? (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : (
        <ul className="grid grid-cols-1 gap-5 md:grid-cols-4">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </ul>
      )}
    </div>
  )
}

export default Projects;