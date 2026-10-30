import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About DigiSafe AI",
};

export default function AboutPage() {
  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-5 py-12 sm:px-8 sm:py-16" id="main-content">
      <p className="text-sm font-semibold uppercase tracking-[0.14em] text-primary">
        About
      </p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
        Child protection and digital safety
      </h1>
      <p className="mt-5 leading-7 text-muted-foreground">
        DigiSafe AI is an initiative of Advocacy for Youth and Vulnerable
        Development Initiative (AYVDI). The platform is being developed to help
        secondary school students share safeguarding concerns, learn about
        digital safety, and find appropriate human support.
      </p>
      <p className="mt-4 leading-7 text-muted-foreground">
        Automated tools are intended to support navigation and information.
        They do not replace trained safeguarding professionals or make
        consequential decisions about a child.
      </p>
    </main>
  );
}
