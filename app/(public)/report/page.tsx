import type { Metadata } from "next";
import { ReportForm } from "@/features/reports/report-form";

export const metadata: Metadata = {
  title: "Report a concern",
  description: "Share a safeguarding concern with DigiSafe AI.",
};

export default function ReportPage() {
  return (
    <main
      className="mx-auto w-full max-w-3xl flex-1 px-5 py-10 sm:px-8 sm:py-14"
      id="main-content"
    >
      <p className="text-sm font-semibold uppercase tracking-[0.14em] text-primary">
        Report a concern
      </p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
        You can share what happened in your own words.
      </h1>
      <p className="mt-4 leading-7 text-muted-foreground">
        You do not need to create an account or provide your name. Only share
        details you feel comfortable sharing. Do not upload or send images.
      </p>
      <div className="mt-6 rounded-xl border border-border bg-muted p-5 text-sm leading-6 text-muted-foreground">
        <p>
          Reports are reviewed by the safeguarding team. DigiSafe AI is not an
          emergency service and cannot dispatch emergency responders.
        </p>
        <p className="mt-3">
          Anonymous reports can limit follow-up. If you choose to provide a safe
          contact method, it is stored separately in encrypted form. Technical
          metadata may still be processed by the service.
        </p>
      </div>
      <ReportForm />
    </main>
  );
}
