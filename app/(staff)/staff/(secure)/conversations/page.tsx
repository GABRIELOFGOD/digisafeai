import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { CompanionArchiveManager } from "@/features/companion/companion-archive-manager";
import { connectToDatabase } from "@/lib/db/mongoose";
import { requireStaffSession } from "@/lib/auth/staff-session";
import { listConversationSummaries } from "@/features/companion/chat.service";

export const metadata: Metadata = {
  title: "AI conversations",
  robots: { index: false, follow: false },
};

export default async function ConversationsPage() {
  const session = await requireStaffSession();
  if (session.user.role !== "admin") redirect("/staff/dashboard");

  await connectToDatabase();
  const archive = await listConversationSummaries(1);

  return (
    <section>
      <p className="text-sm font-semibold uppercase tracking-[0.14em] text-primary">
        Administrator tools
      </p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight">
        AI conversations
      </h1>
      <p className="mt-3 max-w-3xl leading-7 text-muted-foreground">
        Review conversations saved by Digisafe AI. They remain in the archive
        until an administrator deletes them.
      </p>
      <div className="mt-8">
        <CompanionArchiveManager initialArchive={archive} />
      </div>
    </section>
  );
}
