import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Get help now",
};

export default function HelpNowPage() {
  return (
    <main className="mx-auto w-[calc(100%-2.5rem)] max-w-[70rem] flex-1 py-8 pb-15" id="main-content">
      <div className="mx-auto w-full max-w-[48rem] [&>h1]:m-0 [&>h1]:text-[2.4rem] [&>h1]:font-bold [&>h1]:leading-tight [&>h1]:text-[var(--public-deep)] [&>p]:text-muted-foreground [&>p]:leading-7 [&_h2]:text-[var(--public-deep)] [&_h2]:text-xl [&_h2]:font-bold">
      <p className="mb-4 text-[0.82rem] font-bold uppercase tracking-[0.14em] text-primary">
        Get help now
      </p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
        Support and urgent situations
      </h1>
      <div className="mt-6 rounded-xl border border-border bg-card p-5 leading-7 sm:p-6">
        <h2 className="font-semibold">Emergency help</h2>
        <p className="mt-2 text-muted-foreground">
          DigiSafe AI cannot dispatch emergency help. If someone is in
          immediate danger, contact local emergency services or a trusted
          adult now. For AYVDI safeguarding support, call{" "}
          <a className="font-semibold text-primary underline-offset-4 hover:underline" href="tel:+2348108302763">
            +234 810 830 2763
          </a>
          .
        </p>
      </div>
      <section className="mt-8">
        <h2 className="text-xl font-semibold">Verified support contacts</h2>
        <p className="mt-3 leading-7 text-muted-foreground">
          AYVDI is preparing a directory of child-protection and support
          services. Verified phone numbers, hours, and coverage have not yet
          been published here. Check back for confirmed information.
        </p>
      </section>
      <section className="mt-8">
        <h2 className="text-xl font-semibold">Share a concern</h2>
        <p className="mt-3 leading-7 text-muted-foreground">
          If you would like to share a concern with our team,
          you can use the guided report form below. Do not include or upload intimate
          images.
        </p>
        <Link
          className="mt-4 inline-flex font-semibold text-primary underline-offset-4 hover:underline"
          href="/report"
        >
          Go to the report form
        </Link>
      </section>
      </div>
    </main>
  );
}
