import type { Metadata } from "next";
import { StaffLoginForm } from "@/features/staff-auth/staff-login-form";

export const metadata: Metadata = {
  title: "Staff sign in",
  robots: { index: false, follow: false },
};

export default function StaffLoginPage() {
  return (
    <main className="flex min-h-[70vh] flex-1 items-center justify-center px-5 py-12">
      <section className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.14em] text-primary">
          Restricted workspace
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight">
          Staff sign in
        </h1>
        <p className="mt-3 leading-7 text-muted-foreground">
          This area is for authorised AYVDI safeguarding personnel.
        </p>
        <StaffLoginForm />
      </section>
    </main>
  );
}
