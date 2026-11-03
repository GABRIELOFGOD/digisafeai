"use client";

import { useEffect, useState } from "react";
import type { RichTextDocument } from "@/features/rich-content/rich-text";

export type Project = {
  id: number;
  name: string;
  description: string;
  image: string;
  slug: string;
  outcomes: string[];
  fullDescription: string | RichTextDocument;
};

function isProject(value: unknown): value is Project {
  return (
    typeof value === "object" &&
    value !== null &&
    "id" in value &&
    typeof value.id === "number" &&
    "name" in value &&
    typeof value.name === "string" &&
    "description" in value &&
    typeof value.description === "string" &&
    "image" in value &&
    typeof value.image === "string" &&
    "slug" in value &&
    typeof value.slug === "string" &&
    "outcomes" in value &&
    Array.isArray(value.outcomes) &&
    value.outcomes.every((outcome) => typeof outcome === "string") &&
    "fullDescription" in value &&
    (typeof value.fullDescription === "string" ||
      (typeof value.fullDescription === "object" &&
        value.fullDescription !== null &&
        "type" in value.fullDescription &&
        value.fullDescription.type === "doc" &&
        "content" in value.fullDescription &&
        Array.isArray(value.fullDescription.content)))
  );
}

function isProjectResponse(value: unknown): value is { project: Project } {
  return (
    typeof value === "object" &&
    value !== null &&
    "project" in value &&
    isProject(value.project)
  );
}

function isProjectsResponse(value: unknown): value is { projects: Project[] } {
  return (
    typeof value === "object" &&
    value !== null &&
    "projects" in value &&
    Array.isArray(value.projects) &&
    value.projects.every(isProject)
  );
}

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function loadProjects() {
      try {
        const response = await fetch("/api/v1/projects", {
          signal: controller.signal,
        });
        const result: unknown = await response.json();

        if (!response.ok || !isProjectsResponse(result)) {
          throw new Error("Projects could not be loaded.");
        }

        setProjects(result.projects);
      } catch {
        if (!controller.signal.aborted) {
          setError("Projects could not be loaded. Please try again later.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    void loadProjects();
    return () => controller.abort();
  }, []);

  return { projects, isLoading, error };
}

export function useProject(slug: string) {
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function loadProject() {
      try {
        const response = await fetch(
          `/api/v1/projects/${encodeURIComponent(slug)}`,
          { signal: controller.signal },
        );
        const result: unknown = await response.json();

        if (!response.ok || !isProjectResponse(result)) {
          throw new Error("Project could not be loaded.");
        }

        setProject(result.project);
      } catch {
        if (!controller.signal.aborted) {
          setError(
            "This project could not be found or loaded. Please try again later.",
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    void loadProject();
    return () => controller.abort();
  }, [slug]);

  return { project, isLoading, error };
}