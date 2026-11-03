import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/hooks/projects";
import { imageSource } from "@/features/rich-content/rich-text";

const ProjectCard = ({ project }: { project: Project }) => {
  return (
    <li>
      <Link
        className="flex h-full flex-col overflow-hidden rounded-sm border border-border bg-card transition-colors hover:border-primary"
        href={project.slug}
      >
        <div className="relative aspect-4/3 w-full">
          <Image
            alt=""
            className="object-cover"
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
            src={imageSource(project.image)}
            unoptimized={project.image.startsWith("/api/v1/content-images/")}
          />
        </div>
        <div className="flex flex-1 flex-col gap-2 p-4">
          <h3 className="font-semibold">{project.name}</h3>
          <p className="text-sm leading-6 text-muted-foreground">
            {project.description}
          </p>
          {project.outcomes && (
            <div className="flex gap-3 flex-col mt-3">
              <p className="text-sm font-bold">
                Outcomes:
              </p>
              <ul className="flex flex-col gap-1">
                {project.outcomes.map((outcome, index) => (
                  <li key={index} className="text-sm text-muted-foreground">
                    • {outcome}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <Link
            className="mt-auto bottom-1 text-sm font-medium text-primary border rounded-sm w-full px-3 h-10 flex items-center justify-center hover:bg-primary/10 transition-colors"
            href={project.slug}
          >
            View Project
          </Link>
        </div>
      </Link>
    </li>
  )
}

export default ProjectCard;