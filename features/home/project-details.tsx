"use client";

import Image from "next/image";
import Link from "next/link";
import { useProject } from "@/hooks/projects";
import { imageSource } from "@/features/rich-content/rich-text";
import { RichTextContent } from "@/features/rich-content/rich-text-content";

export default function ProjectDetails({ slug }: { slug: string }) {
  const { project, isLoading, error } = useProject(slug);

  if (isLoading) {
    return (
      <main className="mx-auto w-[calc(100%-2.5rem)] max-w-[70rem] flex-1 py-8 pb-15" id="main-content">
        <p className="text-sm text-muted-foreground" aria-live="polite">
          Loading project…
        </p>
      </main>
    );
  }

  if (error || !project) {
    return (
      <main className="mx-auto w-[calc(100%-2.5rem)] max-w-[70rem] flex-1 py-8 pb-15" id="main-content">
        <p className="text-sm text-destructive" role="alert">
          {error || "This project could not be found."}
        </p>
        <Link
          className="mt-4 inline-block text-sm font-medium text-primary hover:underline"
          href="/projects"
        >
          Back to all projects
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto w-[calc(100%-2.5rem)] max-w-[70rem] flex-1 py-8 pb-15" id="main-content">
      <Link
        className="text-sm font-medium text-primary hover:underline"
        href="/projects"
      >
        ← All projects
      </Link>
      <article className="mt-6">
        <div className="relative aspect-[16/8] overflow-hidden rounded-xl">
          <Image
            alt=""
            className="object-cover"
            fill
            priority
            sizes="(max-width: 1120px) 100vw, 1120px"
            src={imageSource(project.image)}
            unoptimized={project.image.startsWith("/api/v1/content-images/")}
          />
        </div>
        <header className="mt-8">
          <p className="mb-4 text-[0.82rem] font-bold uppercase tracking-[0.14em] text-primary">Our work</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
            {project.name}
          </h1>
          <p className="mt-4 max-w-3xl leading-7 text-muted-foreground">
            {project.description}
          </p>
        </header>
        <section className="mt-8 max-w-3xl">
          <h2 className="text-xl font-semibold">Project story</h2>
          <div className="mt-3">
            <RichTextContent content={project.fullDescription} />
          </div>
        </section>
        <section className="mt-8">
          <h2 className="text-xl font-semibold">Expected outcomes</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 leading-7 text-muted-foreground">
            {project.outcomes.map((outcome) => (
              <li key={outcome}>{outcome}</li>
            ))}
          </ul>
        </section>
      </article>
    </main>
  );
}
