import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Learn about digital safety",
};

const guidance = [
  {
    title: "Boundaries and consent",
    points: [
      "You can say no to a request or conversation that makes you uncomfortable.",
      "Someone pressuring, threatening, or repeatedly ignoring your boundaries is not respecting your choice.",
      "You do not have to handle a difficult situation alone.",
    ],
  },
  {
    title: "Threats involving intimate images",
    points: [
      "Do not send more images or forward an intimate image to prove what happened.",
      "If it is safe, note the account or platform involved and ask a safeguarding service for help.",
      "You are not to blame for someone else's threat or decision to share an image.",
    ],
  },
  {
    title: "Cyberbullying and online harassment",
    points: [
      "You can block or report an account if doing so is safe for you.",
      "Consider saving relevant messages or account details without redistributing harmful images.",
      "Tell someone who can help and explain if you are worried about retaliation.",
    ],
  },
  {
    title: "Help-seeking and supporting a friend",
    points: [
      "Listen without blaming, pressuring, or asking for graphic details.",
      "Do not promise to keep a safety concern secret from everyone.",
      "Help the person find a safeguarding service or safe adult they choose.",
    ],
  },
];

export default function LearnPage() {
  return (
    <main className="mx-auto w-[calc(100%-2.5rem)] max-w-[70rem] flex-1 py-8 pb-15" id="main-content">
      <div className="mx-auto w-full max-w-[48rem] [&>h1]:m-0 [&>h1]:text-[2.4rem] [&>h1]:font-bold [&>h1]:leading-tight [&>h1]:text-[var(--public-deep)] [&>p]:text-muted-foreground [&>p]:leading-7 [&_h2]:text-[var(--public-deep)] [&_h2]:text-xl [&_h2]:font-bold">
      <p className="mb-4 text-[0.82rem] font-bold uppercase tracking-[0.14em] text-primary">
        Learning centre
      </p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
        Digital safety, one step at a time
      </h1>
      <p className="mt-4 max-w-2xl leading-7 text-muted-foreground">
        These short guides introduce ways to think about online safety and
        getting support. They are general information, not a substitute for
        individual safeguarding advice.
      </p>
      <div className="mt-8 grid gap-5 md:grid-cols-2">
        {guidance.map((topic) => (
          <section
            className="rounded-2xl border border-border bg-card p-6"
            key={topic.title}
          >
            <h2 className="text-xl font-semibold">{topic.title}</h2>
            <ul className="mt-4 list-disc space-y-3 pl-5 leading-7 text-muted-foreground">
              {topic.points.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </section>
        ))}
      </div>
      <p className="mt-8 text-sm leading-6 text-muted-foreground">
        AYVDI should review this information with safeguarding specialists
        before production use.
      </p>
      </div>
    </main>
  );
}
