"use client";

import Link from "next/link";
import ProjectCard from "./project-card";
import { useProjects } from "@/hooks/projects";

export default function ProjectsList() {
  const { projects, isLoading, error } = useProjects();

  return (
    <main className="mx-auto w-[calc(100%-2.5rem)] max-w-[70rem] flex-1 py-8 pb-15" id="main-content">
      <header className="mb-8">
        <p className="mb-4 text-[0.82rem] font-bold uppercase tracking-[0.14em] text-primary">Our work</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
          Our Projects
        </h1>
        <p className="mt-3 max-w-2xl leading-7 text-muted-foreground">
          Explore our projects and initiatives aimed at promoting digital
          safety, education, and wellbeing.
        </p>
        <Link
          className="mt-4 inline-block text-sm font-medium text-primary hover:underline"
          href="/"
        >
          Back to home
        </Link>
      </header>

      {isLoading ? (
        <p className="text-sm text-muted-foreground" aria-live="polite">
          Loading projects…
        </p>
      ) : error ? (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : projects.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          There are no projects to show right now.
        </p>
      ) : (
        <ul className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </ul>
      )}
    </main>
  );
}
