import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI support companion",
};

export default function CompanionPage() {
  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-5 py-12 sm:px-8 sm:py-16" id="main-content">
      <p className="text-sm font-semibold uppercase tracking-[0.14em] text-primary">
        AI support companion
      </p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
        The companion is being prepared
      </h1>
      <p className="mt-5 leading-7 text-muted-foreground">
        The AI companion is not available yet. It will be added after its
        safeguarding behaviour, privacy controls, provider, and fallback
        support have been reviewed.
      </p>
      <p className="mt-4 leading-7 text-muted-foreground">
        DigiSafe AI is not a therapist, investigator, or emergency service.
      </p>
      <Link
        className="mt-6 inline-flex font-semibold text-primary underline-offset-4 hover:underline"
        href="/report"
      >
        Share a concern with the safeguarding team
      </Link>
    </main>
  );
}
