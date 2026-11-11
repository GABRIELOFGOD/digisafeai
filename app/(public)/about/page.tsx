import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About DigiSafe AI",
};

export default function AboutPage() {
  return (
    <main className="mx-auto w-[calc(100%-2.5rem)] max-w-[70rem] flex-1 py-8 pb-15" id="main-content">
      <div className="mx-auto w-full max-w-[48rem] [&>h1]:m-0 [&>h1]:text-[2.4rem] [&>h1]:font-bold [&>h1]:leading-tight [&>h1]:text-[var(--public-deep)] [&>p]:text-muted-foreground [&>p]:leading-7 [&_h2]:text-[var(--public-deep)] [&_h2]:text-xl [&_h2]:font-bold">
      <p className="mb-4 text-[0.82rem] font-bold uppercase tracking-[0.14em] text-primary">
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
      </div>
    </main>
  );
}
