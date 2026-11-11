import type { Metadata } from "next";
import { ReportForm } from "@/features/reports/report-form";

export const metadata: Metadata = {
  title: "Report a concern",
  description: "Share a safeguarding concern with DigiSafe AI.",
};

export default function ReportPage() {
  return (
    <main className="mx-auto w-[calc(100%-2.5rem)] max-w-[70rem] flex-1 py-8 pb-15" id="main-content">
      <header className="mx-auto w-full max-w-[40rem]">
        <p className="mb-4 text-[0.82rem] font-bold uppercase tracking-[0.14em] text-primary">
        Report a concern
        </p>
        <h1 className="m-0 text-[2.4rem] font-bold leading-tight text-[var(--public-deep)] sm:text-5xl">
          You can share what happened in your own words.
        </h1>
        <p className="mt-4 leading-7 text-muted-foreground">
          You do not need to create an account or provide your name. Only share
          details you feel comfortable sharing.
        </p>
        <div className="mt-5 rounded-2xl border border-primary/20 bg-secondary p-4 text-sm leading-7 text-foreground sm:p-5">
          <p className="m-0">
            Reports are reviewed and acted on by AYVDi safeguarding team.
          </p>
          <p className="mt-3">
            Anonymous reports can limit follow-up. If you choose to provide
            safe contact details, it is stored separately in encrypted form.
          </p>
          <p className="mt-3">
            Please do not upload or send nude or private images. A description
            in your own words is enough.
          </p>
        </div>
      </header>
      <ReportForm />
    </main>
  );
}
