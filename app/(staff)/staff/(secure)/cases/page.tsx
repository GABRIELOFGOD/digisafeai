import type { Metadata } from "next";
import { CaseQueue } from "@/features/cases/case-queue";

export const metadata: Metadata = {
  title: "Case queue",
  robots: { index: false, follow: false },
};

type CasesPageProps = {
  searchParams: Promise<{
    page?: string;
    status?: string;
    category?: string;
    urgency?: string;
    q?: string;
  }>;
};

export default function CasesPage({ searchParams }: CasesPageProps) {
  return <CaseQueue searchParams={searchParams} />;
}
