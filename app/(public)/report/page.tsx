import type { Metadata } from "next";
import { ReportForm } from "@/features/reports/report-form";

export const metadata: Metadata = {
  title: "Report a concern",
  description: "Share a safeguarding concern with DigiSafe AI.",
};

export default function ReportPage() {
  return (
    <main className="public-main" id="main-content">
      <header className="report-intro">
        <p className="eyebrow">
        Report a concern
        </p>
        <h1>You can share what happened in your own words.</h1>
        <p>
          You do not need to create an account or provide your name. Only share
          details you feel comfortable sharing.
        </p>
        <div className="report-note">
          <p>
            Reports are reviewed and acted on by AYVDi safeguarding team.
          </p>
          <p>
            Anonymous reports can limit follow-up. If you choose to provide
            safe contact details, it is stored separately in encrypted form.
          </p>
          <p>
            Please do not upload or send nude or private images. A description
            in your own words is enough.
          </p>
        </div>
      </header>
      <ReportForm />
    </main>
  );
}
