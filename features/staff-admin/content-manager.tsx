"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import type { BlogPost } from "@/features/blogs/blog.types";
import type { Project } from "@/hooks/projects";
import { ImageUpload } from "./image-upload";
import { RichTextEditor } from "@/features/rich-content/rich-text-editor";
import {
  blogContentToDocument,
  emptyRichTextDocument,
  projectContentToDocument,
} from "@/features/rich-content/rich-text";

type BlogDraft = Omit<BlogPost, "publishedAt"> & { publishedAt: string };
type ProjectDraft = Omit<Project, "id" | "slug"> & { slug: string };

function toLocalDateTime(value: string) {
  const date = new Date(value);
  return new Date(date.getTime() - date.getTimezoneOffset() * 60_000)
    .toISOString()
    .slice(0, 16);
}

function newBlogDraft(): BlogDraft {
  return {
    slug: "",
    title: "",
    excerpt: "",
    category: "",
    author: "DigiSafe AI Team",
    publishedAt: toLocalDateTime(new Date().toISOString()),
    image: "",
    imageAlt: "",
    isFeatured: false,
    isPublished: false,
    content: emptyRichTextDocument(),
  };
}

function toBlogDraft(blog: BlogPost): BlogDraft {
  return {
    ...blog,
    publishedAt: toLocalDateTime(blog.publishedAt),
    content: blogContentToDocument(blog.content),
  };
}

function newProjectDraft(): ProjectDraft {
  return {
    name: "",
    description: "",
    image: "",
    slug: "",
    outcomes: [""],
    fullDescription: emptyRichTextDocument(),
  };
}

function toProjectDraft(project: Project): ProjectDraft {
  return {
    name: project.name,
    description: project.description,
    image: project.image,
    slug: project.slug.split("/").at(-1) ?? "",
    outcomes: project.outcomes,
    fullDescription: projectContentToDocument(project.fullDescription),
  };
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function ContentManager({
  initialBlogs = [],
  initialProjects = [],
  section,
}: {
  initialBlogs?: BlogPost[];
  initialProjects?: Project[];
  section: "blogs" | "projects";
}) {
  const [blogs, setBlogs] = useState(initialBlogs);
  const [projects, setProjects] = useState(initialProjects);
  const [selectedBlog, setSelectedBlog] = useState<BlogDraft | null>(null);
  const [selectedBlogSlug, setSelectedBlogSlug] = useState<string | null>(null);
  const [selectedProject, setSelectedProject] = useState<ProjectDraft | null>(
    null,
  );
  const [selectedProjectSlug, setSelectedProjectSlug] = useState<string | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function loadContent() {
    setIsLoading(true);
    setError("");

    try {
      const [blogResponse, projectResponse] = await Promise.all([
        fetch("/api/v1/staff/content/blogs", { cache: "no-store" }),
        fetch("/api/v1/staff/content/projects", { cache: "no-store" }),
      ]);
      const [blogResult, projectResult] = (await Promise.all([
        blogResponse.json(),
        projectResponse.json(),
      ])) as [
        { blogs?: BlogPost[]; error?: string },
        { projects?: Project[]; error?: string },
      ];

      if (!blogResponse.ok || !Array.isArray(blogResult.blogs)) {
        throw new Error(blogResult.error ?? "Blog posts could not be loaded.");
      }
      if (!projectResponse.ok || !Array.isArray(projectResult.projects)) {
        throw new Error(projectResult.error ?? "Projects could not be loaded.");
      }

      setBlogs(blogResult.blogs);
      setProjects(projectResult.projects);
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Content could not be loaded.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  async function saveBlog(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedBlog) return;

    setIsSaving(true);
    setError("");
    setMessage("");
    try {
      const payload = {
        ...selectedBlog,
        publishedAt: new Date(selectedBlog.publishedAt).toISOString(),
      };
      const response = await fetch(
        selectedBlogSlug
          ? `/api/v1/staff/content/blogs/${encodeURIComponent(selectedBlogSlug)}`
          : "/api/v1/staff/content/blogs",
        {
          method: selectedBlogSlug ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );
      const result = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(result.error ?? "The post could not be saved.");

      setMessage("Blog post saved.");
      setSelectedBlogSlug(selectedBlog.slug);
      await loadContent();
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : "The post could not be saved.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  async function deleteBlog() {
    if (!selectedBlogSlug || !window.confirm("Delete this blog post?")) return;
    await deleteContent(
      `/api/v1/staff/content/blogs/${encodeURIComponent(selectedBlogSlug)}`,
      () => {
        setSelectedBlog(newBlogDraft());
        setSelectedBlogSlug(null);
        void loadContent();
      },
    );
  }

  async function saveProject(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedProject) return;

    setIsSaving(true);
    setError("");
    setMessage("");
    try {
      const payload = {
        ...selectedProject,
        outcomes: selectedProject.outcomes
          .map((outcome) => outcome.trim())
          .filter(Boolean),
      };
      const response = await fetch(
        selectedProjectSlug
          ? `/api/v1/staff/content/projects/${encodeURIComponent(selectedProjectSlug)}`
          : "/api/v1/staff/content/projects",
        {
          method: selectedProjectSlug ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );
      const result = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(result.error ?? "The project could not be saved.");

      setMessage("Project saved.");
      setSelectedProjectSlug(selectedProject.slug);
      await loadContent();
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : "The project could not be saved.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  async function deleteProject() {
    if (!selectedProjectSlug || !window.confirm("Delete this project?")) return;
    await deleteContent(
      `/api/v1/staff/content/projects/${encodeURIComponent(selectedProjectSlug)}`,
      () => {
        setSelectedProject(newProjectDraft());
        setSelectedProjectSlug(null);
        void loadContent();
      },
    );
  }

  async function deleteContent(url: string, onSuccess: () => void) {
    setError("");
    setMessage("");
    try {
      const response = await fetch(url, { method: "DELETE" });
      const result = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(result.error ?? "Content could not be deleted.");
      setMessage("Content deleted.");
      onSuccess();
    } catch (deleteError) {
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : "Content could not be deleted.",
      );
    }
  }

  const fieldClass =
    "min-h-11 w-full rounded-md border border-input bg-background px-3 py-2";
  const labelClass = "space-y-2 text-sm font-medium";

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(15rem,0.7fr)_minmax(0,1.3fr)]">
      <aside className="space-y-5">
        <Button
          onClick={() => {
            setMessage("");
            setError("");
            if (section === "blogs") {
              const draft = newBlogDraft();
              setSelectedBlogSlug(null);
              setSelectedBlog(draft);
            } else {
              setSelectedProjectSlug(null);
              setSelectedProject(newProjectDraft());
            }
          }}
          type="button"
          variant="outline"
        >
          Add {section === "blogs" ? "blog post" : "project"}
        </Button>
        {isLoading ? (
          <p className="text-sm text-muted-foreground" aria-live="polite">
            Loading content…
          </p>
        ) : (
          <ul className="max-h-136 space-y-2 overflow-y-auto">
            {(section === "blogs" ? blogs : projects).map((item) => (
              <li key={item.slug}>
                <button
                  className="w-full rounded-md border border-border bg-card p-3 text-left text-sm hover:border-primary"
                  onClick={() => {
                    setMessage("");
                    setError("");
                    if (section === "blogs" && "publishedAt" in item) {
                      setSelectedBlogSlug(item.slug);
                      setSelectedBlog(toBlogDraft(item));
                    } else if (section === "projects" && "id" in item) {
                      setSelectedProjectSlug(
                        item.slug.split("/").at(-1) ?? item.slug,
                      );
                      setSelectedProject(toProjectDraft(item));
                    }
                  }}
                  type="button"
                >
                  <span className="block font-medium">
                    {"title" in item ? item.title : item.name}
                  </span>
                  <span className="mt-1 block text-xs text-muted-foreground">
                    {"isPublished" in item
                      ? item.isPublished
                        ? "Published"
                        : "Draft"
                      : item.slug}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </aside>

      <section className="min-w-0 rounded-xl border border-border bg-card p-5 sm:p-6">
        <h2 className="text-xl font-semibold">
          {section === "blogs" ? "Blog post editor" : "Project editor"}
        </h2>
        {error && (
          <p className="mt-4 text-sm text-destructive" role="alert">
            {error}
          </p>
        )}
        {message && (
          <p className="mt-4 text-sm text-primary" role="status">
            {message}
          </p>
        )}

        {section === "blogs" && selectedBlog ? (
          <form className="mt-5 grid gap-4" onSubmit={saveBlog}>
            <label className={labelClass}>
              Title
              <input
                className={fieldClass}
                maxLength={180}
                onChange={(event) => {
                  const title = event.target.value;
                  setSelectedBlog((current) =>
                    current
                      ? {
                          ...current,
                          title,
                          slug: selectedBlogSlug
                            ? current.slug
                            : slugify(title),
                        }
                      : current,
                  );
                }}
                required
                value={selectedBlog.title}
              />
            </label>
            <label className={labelClass}>
              Slug
              <input
                className={fieldClass}
                onChange={(event) =>
                  setSelectedBlog({ ...selectedBlog, slug: slugify(event.target.value) })
                }
                required
                value={selectedBlog.slug}
              />
            </label>
            <label className={labelClass}>
              Summary
              <textarea
                className={`${fieldClass} min-h-20`}
                maxLength={300}
                onChange={(event) =>
                  setSelectedBlog({ ...selectedBlog, excerpt: event.target.value })
                }
                required
                value={selectedBlog.excerpt}
              />
            </label>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className={labelClass}>
                Category
                <input
                  className={fieldClass}
                  onChange={(event) =>
                    setSelectedBlog({ ...selectedBlog, category: event.target.value })
                  }
                  required
                  value={selectedBlog.category}
                />
              </label>
              <label className={labelClass}>
                Author
                <input
                  className={fieldClass}
                  onChange={(event) =>
                    setSelectedBlog({ ...selectedBlog, author: event.target.value })
                  }
                  required
                  value={selectedBlog.author}
                />
              </label>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className={labelClass}>
                Publication date
                <input
                  className={fieldClass}
                  onChange={(event) =>
                    setSelectedBlog({
                      ...selectedBlog,
                      publishedAt: event.target.value,
                    })
                  }
                  required
                  type="datetime-local"
                  value={selectedBlog.publishedAt}
                />
              </label>
            </div>
            <ImageUpload
              label="Blog feature image"
              onChange={(image) =>
                setSelectedBlog({ ...selectedBlog, image })
              }
              value={selectedBlog.image}
            />
            <label className={labelClass}>
              Image description (alt text)
              <input
                className={fieldClass}
                maxLength={180}
                onChange={(event) =>
                  setSelectedBlog({ ...selectedBlog, imageAlt: event.target.value })
                }
                required
                value={selectedBlog.imageAlt}
              />
            </label>
            <div className={labelClass}>
              <span>Blog story</span>
              <RichTextEditor
                label="Blog story"
                onChange={(content) =>
                  setSelectedBlog({ ...selectedBlog, content })
                }
                value={blogContentToDocument(selectedBlog.content)}
              />
            </div>
            <div className="flex flex-wrap gap-5">
              <label className="flex items-center gap-2 text-sm">
                <input
                  checked={selectedBlog.isPublished}
                  onChange={(event) =>
                    setSelectedBlog({
                      ...selectedBlog,
                      isPublished: event.target.checked,
                    })
                  }
                  type="checkbox"
                />
                Published
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input
                  checked={selectedBlog.isFeatured}
                  onChange={(event) =>
                    setSelectedBlog({
                      ...selectedBlog,
                      isFeatured: event.target.checked,
                    })
                  }
                  type="checkbox"
                />
                Feature on homepage
              </label>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button disabled={isSaving} type="submit">
                {isSaving ? "Saving…" : "Save blog post"}
              </Button>
              {selectedBlogSlug && (
                <Button
                  onClick={() => void deleteBlog()}
                  type="button"
                  variant="destructive"
                >
                  Delete
                </Button>
              )}
            </div>
          </form>
        ) : null}

        {section === "projects" && selectedProject ? (
          <form className="mt-5 grid gap-4" onSubmit={saveProject}>
            <label className={labelClass}>
              Name
              <input
                className={fieldClass}
                onChange={(event) => {
                  const name = event.target.value;
                  setSelectedProject((current) =>
                    current
                      ? {
                          ...current,
                          name,
                          slug: selectedProjectSlug
                            ? current.slug
                            : slugify(name),
                        }
                      : current,
                  );
                }}
                required
                value={selectedProject.name}
              />
            </label>
            <label className={labelClass}>
              Slug
              <input
                className={fieldClass}
                onChange={(event) =>
                  setSelectedProject({
                    ...selectedProject,
                    slug: slugify(event.target.value),
                  })
                }
                required
                value={selectedProject.slug}
              />
            </label>
            <label className={labelClass}>
              Summary
              <textarea
                className={`${fieldClass} min-h-20`}
                onChange={(event) =>
                  setSelectedProject({
                    ...selectedProject,
                    description: event.target.value,
                  })
                }
                required
                value={selectedProject.description}
              />
            </label>
            <div className={labelClass}>
              <span>Project story</span>
              <RichTextEditor
                label="Project story"
                onChange={(fullDescription) =>
                  setSelectedProject({ ...selectedProject, fullDescription })
                }
                value={projectContentToDocument(selectedProject.fullDescription)}
              />
            </div>
            <label className={labelClass}>
              Outcomes (one per line)
              <textarea
                className={`${fieldClass} min-h-28`}
                onChange={(event) =>
                  setSelectedProject({
                    ...selectedProject,
                    outcomes: event.target.value.split("\n"),
                  })
                }
                required
                value={selectedProject.outcomes.join("\n")}
              />
            </label>
            <ImageUpload
              label="Project feature image"
              onChange={(image) =>
                setSelectedProject({ ...selectedProject, image })
              }
              value={selectedProject.image}
            />
            <div className="flex flex-wrap gap-3">
              <Button disabled={isSaving} type="submit">
                {isSaving ? "Saving…" : "Save project"}
              </Button>
              {selectedProjectSlug && (
                <Button
                  onClick={() => void deleteProject()}
                  type="button"
                  variant="destructive"
                >
                  Delete
                </Button>
              )}
            </div>
          </form>
        ) : (
          section === "blogs" &&
          !selectedBlog && (
            <p className="mt-4 text-sm text-muted-foreground">
              Choose a post to edit or add a new one.
            </p>
          )
        )}
        {section === "projects" && !selectedProject && (
          <p className="mt-4 text-sm text-muted-foreground">
            Choose a project to edit or add a new one.
          </p>
        )}
      </section>
    </div>
  );
}
