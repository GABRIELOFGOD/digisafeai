import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { listAllProjects } from "@/features/projects/project.service";
import { ContentManager } from "@/features/staff-admin/content-manager";
import { requireStaffSession } from "@/lib/auth/staff-session";

export const metadata: Metadata = {
  title: "Project management",
  robots: { index: false, follow: false },
};

export default async function StaffProjectsPage() {
  const session = await requireStaffSession();
  if (session.user.role !== "admin") redirect("/staff/dashboard");
  const projects = await listAllProjects();

  return (
    <section>
      <p className="text-sm font-semibold uppercase tracking-[0.14em] text-primary">
        Administrator tools
      </p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight">
        Project management
      </h1>
      <p className="mt-3 max-w-3xl leading-7 text-muted-foreground">
        Update project stories, outcomes, and feature images.
      </p>
      <div className="mt-8">
        <ContentManager initialProjects={projects} section="projects" />
      </div>
    </section>
  );
}
