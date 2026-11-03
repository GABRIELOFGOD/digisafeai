import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { listAllBlogs } from "@/features/blogs/blog.service";
import { ContentManager } from "@/features/staff-admin/content-manager";
import { requireStaffSession } from "@/lib/auth/staff-session";

export const metadata: Metadata = {
  title: "Blog management",
  robots: { index: false, follow: false },
};

export default async function StaffBlogPage() {
  const session = await requireStaffSession();
  if (session.user.role !== "admin") redirect("/staff/dashboard");
  const blogs = await listAllBlogs();

  return (
    <section>
      <p className="text-sm font-semibold uppercase tracking-[0.14em] text-primary">
        Administrator tools
      </p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight">
        Blog management
      </h1>
      <p className="mt-3 max-w-3xl leading-7 text-muted-foreground">
        Write, update, publish, and feature blog posts.
      </p>
      <div className="mt-8">
        <ContentManager initialBlogs={blogs} section="blogs" />
      </div>
    </section>
  );
}
