import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

const plannedFeatures = [
  {
    title: "Talk to the AI companion",
    description:
      "A calm, age-appropriate way to explore options and reach human support.",
  },
  {
    title: "Find verified help",
    description:
      "A directory of child-protection and support services verified by AYVDI.",
  },
  {
    title: "Learn about digital safety",
    description:
      "Practical, age-appropriate information about safer and more respectful online experiences.",
  },
];

export function HomePage() {
  return (
    <main id="main-content" className="flex-1">
      <section className="border-b border-border bg-card">
        <div className="mx-auto w-full max-w-6xl px-5 py-12 sm:px-8 sm:py-20">
          <div
            aria-live="polite"
            className="mb-10 rounded-xl border border-primary/20 bg-secondary px-5 py-4 text-sm leading-6 text-secondary-foreground"
          >
            DigiSafe AI is for sharing safeguarding concerns and learning about
            digital safety. It is not an emergency service and cannot dispatch
            responders.
          </div>

          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.16em] text-primary">
            Child protection · Digital safety · Support
          </p>
          <h1 className="max-w-3xl text-4xl font-semibold leading-tight tracking-tight sm:text-6xl">
            A safer place to find your next step.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
            DigiSafe AI is being developed to help secondary school students
            understand their options, learn about digital safety, and reach
            appropriate human support.
          </p>
          <Link className={`${buttonVariants({ size: "lg" })} mt-8`} href="/report">
            Report a concern
          </Link>
        </div>
      </section>

      <section
        aria-labelledby="planned-features-heading"
        className="mx-auto w-full max-w-6xl px-5 py-12 sm:px-8 sm:py-16"
      >
        <div className="mb-7 max-w-2xl">
          <h2
            className="text-2xl font-semibold tracking-tight"
            id="planned-features-heading"
          >
            What DigiSafe AI is being built to offer
          </h2>
          <p className="mt-3 leading-7 text-muted-foreground">
            Reporting is available. The AI companion, verified help directory,
            and learning resources are still being developed.
          </p>
        </div>

        <ul className="grid gap-4 md:grid-cols-3">
          {plannedFeatures.map((feature) => (
            <li
              className="rounded-2xl border border-border bg-card p-6"
              key={feature.title}
            >
              <h3 className="text-lg font-semibold">{feature.title}</h3>
              <p className="mt-3 leading-7 text-muted-foreground">
                {feature.description}
              </p>
              <p className="mt-5 text-sm font-medium text-primary">
                In development
              </p>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
