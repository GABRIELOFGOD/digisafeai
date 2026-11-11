import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  HeartHandshake,
  MessageCircle,
  ShieldCheck,
} from "lucide-react";
import Projects from "./projects";
import { AnimatedStat } from "./animated-stat";
import { FeaturedBlogs } from "@/features/blogs/featured-blogs";
import ProblemAwareness from "./problem-awareness";

const features = [
  {
    title: "Report a concern",
    description: "Share what happened in a guided report, with no account needed.",
    href: "/report",
    status: "Available",
    icon: ShieldCheck,
  },
  {
    title: "Talk to the AI companion",
    description: "The AI companion is functional with safeguarding and privacy reviews.",
    href: "/companion",
    status: "Safety companion",
    icon: MessageCircle,
  },
  {
    title: "Get help now",
    description: "Read urgent guidance and see what support information is available.",
    href: "/help-now",
    status: "Guidance",
    icon: HeartHandshake,
  },
  {
    title: "Learn about online safety",
    description: "Explore practical guidance for safer and more respectful online experiences.",
    href: "/learn",
    status: "Learning",
    icon: BookOpen,
  },
];

export function HomePage() {
  return (
    <main id="main-content" className="mx-auto flex w-[calc(100%-2.5rem)] max-w-[70rem] flex-1 flex-col gap-10 py-8 pb-[3.75rem]">
      <section className="grid min-h-[min(39rem,68vh)] grid-cols-[1.1fr_0.9fr] items-center gap-8 py-4 pb-8 max-[860px]:min-h-0 max-[860px]:grid-cols-[1fr_0.75fr] max-[700px]:grid-cols-1 max-[700px]:gap-3 max-[700px]:pt-4 max-[700px]:pb-6">
        <div className="max-w-[38rem]">
          <p className="mb-4 text-[0.82rem] font-bold uppercase tracking-[0.14em] text-primary">Child/Teen protection · Digital safety · Support</p>
          <h1 className="m-0 text-[2.5rem] font-bold leading-[1.05] text-[var(--public-deep)] sm:text-5xl lg:text-6xl">Speak up. Find support. Stay safe <span className="text-primary">Online</span>.</h1>
          <p className="mt-5 max-w-[39rem] text-lg leading-7 text-muted-foreground">
            <span className="font-semibold light:text-black dark:text-primary">DigiSafe AI</span> offers confidential support, trusted information, reporting pathways, and resources for teenagers affected by digital threats, physical abuse/violence and image based sexual abuse.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 font-semibold text-primary-foreground no-underline transition-transform hover:-translate-y-px hover:bg-primary/90" href="/report">
              Report something <ArrowRight aria-hidden="true" size={18} />
            </Link>
            <Link className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-border bg-card px-5 py-3 font-semibold text-primary no-underline transition-colors hover:bg-secondary" href="/help-now">
              Get help now
            </Link>
          </div>
        </div>
        <Link
          aria-label="Learn about the DigiSafe AI companion"
          className="relative grid aspect-square w-full max-w-[25rem] place-items-center justify-self-center text-foreground no-underline max-[700px]:mt-2 max-[700px]:w-[min(72vw,18rem)]"
          href="/companion"
        >
          <span aria-hidden="true" className="absolute inset-[6%] animate-pulse rounded-full border border-border motion-reduce:animate-none" />
          <span aria-hidden="true" className="absolute aspect-square w-[67%] animate-pulse rounded-full bg-[radial-gradient(circle_at_32%_28%,#ffffffa8,transparent_38%),radial-gradient(circle_at_50%_50%,#fca5a5,var(--primary)_60%,#7f1d1d)] shadow-[0_2rem_5rem_color-mix(in_srgb,var(--primary)_40%,transparent)] motion-reduce:animate-none" />
          <span className="absolute bottom-[3%] rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold shadow-md">Talk to DigiSafe AI</span>
        </Link>
      </section>

      <section className="w-full flex flex-col md:flex-row border divide-border justify-between">
        <div className="px-8 py-4 flex justify-center items-center flex-col">
          <span className="text-2xl font-bold">
            <AnimatedStat value={300} suffix="+" />
          </span>
          <p className="text-sm text-muted-foreground">
            Users
          </p>
        </div>
        <div className="px-8 py-4 flex justify-center items-center flex-col">
          <span className="text-2xl font-bold">
            <AnimatedStat value={50} suffix="+" />
          </span>
          <p className="text-sm text-muted-foreground">
            People accessed digital resources
          </p>
        </div>
        <div className="px-8 py-4 flex justify-center items-center flex-col">
          <span className="text-2xl font-bold">
            <AnimatedStat value={5} />
          </span>
          <p className="text-sm text-muted-foreground">
            Awareness sessions delivered
          </p>
        </div>
        <div className="px-8 py-4 flex justify-center items-center flex-col">
          <span className="text-2xl font-bold">
            <AnimatedStat value={1000} suffix="+" />
          </span>
          <p className="text-sm text-muted-foreground">
            Teenagers and students reached
          </p>
        </div>
      </section>

      <section className="bg-muted px-6 py-8 md:px-10 md:py-12 lg:px-16">
        <div className="grid items-center gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="overflow-hidden rounded-[1.5rem] border border-border bg-background shadow-sm">
            <div className="aspect-video w-full bg-muted">
              <iframe
                src="https://drive.google.com/file/d/1S5MBJ27x1RA7TEeoCCP0sexb-VcQHOGZ/preview"
                title="Nigerian police awareness video about online nudity among secondary school students"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="h-full w-full border-0"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">
              Online safety alert
            </p>
            <h2 className="text-3xl font-extrabold text-foreground md:text-4xl">
              The problem is real. Teenagers and adolescent girls need safe, trusted support.
            </h2>
            <p className="text-base leading-7 text-muted-foreground">
              A Nigerian policewoman, <span className="font-semibold text-foreground">Divisional Police Officer (DPO), Omosetemi Agbede-Zuokumor</span>, recently gained widespread attention for raising a public alarm regarding digital safety, cybercrime, and online exploitation among some secondary school students.
            </p>
            <p className="text-base leading-7 text-muted-foreground">
              She highlighted a growing concern: teenagers in secondary schools using the internet in harmful ways, including sharing of nude or explicit images and content. This kind of digital misuse can damage a person’s dignity, mental wellbeing, reputation, and future opportunities.
            </p>
            <p className="text-base leading-7 text-muted-foreground">
              DigiSafe AI exists to help teenagers, adolescents girls, young people respond early, report what is unsafe, and find guidance before harm escalates. The goal is not shame or blame, it is protection, education, and support against online abuse.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Link href="/report" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 font-semibold text-primary-foreground no-underline hover:bg-primary/90">
                Report a concern
              </Link>
              <Link href="/learn" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-border bg-card px-5 py-3 font-semibold text-primary no-underline hover:bg-secondary">
                Learn more
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section
        aria-labelledby="features-heading"
        className="relative left-1/2 ml-[-50vw] w-screen bg-muted px-[max(1.25rem,calc((100vw-70rem)/2))] py-6"
      >
        <div className="mb-5">
          <h2 className="m-0 text-[1.75rem] font-semibold text-[var(--public-deep)]" id="features-heading">Choose what feels right for you</h2>
          <p className="mt-2 text-muted-foreground leading-relaxed">
            You can explore at your own pace. Sharing a concern is always your
            choice.
          </p>
        </div>
        <ul className="m-0 grid list-none grid-cols-4 gap-3.5 p-0 max-[860px]:grid-cols-2 max-[420px]:gap-2.5">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <li key={feature.title}>
                <Link className="group/link relative flex h-full min-h-[13.5rem] flex-col items-start rounded-xl border border-border bg-card p-[1.1rem] text-foreground no-underline transition-all hover:-translate-y-[3px] hover:border-primary hover:shadow-lg motion-reduce:transition-none max-[700px]:min-h-[13rem] max-[700px]:p-4" href={feature.href}>
                  <span aria-hidden="true" className="grid size-[2.6rem] place-items-center rounded-xl bg-secondary text-primary">
                    <Icon size={21} />
                  </span>
                  <span className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground">
                    <span className="size-[0.45rem] rounded-full bg-[#237a57]" />
                    {feature.status}
                  </span>
                  <span className="mt-2 text-base font-bold text-[var(--public-deep)]">{feature.title}</span>
                  <span className="mt-1 text-sm leading-6 text-muted-foreground">
                    {feature.description}
                  </span>
                  <ArrowRight
                    aria-hidden="true"
                    className="absolute bottom-4 right-4 text-primary opacity-0 transition-all group-hover/link:translate-x-0.5 group-hover/link:opacity-100 group-focus-visible/link:opacity-100 motion-reduce:transition-none"
                    size={18}
                  />
                </Link>
              </li>
            );
          })}
        </ul>
      </section>
      <Projects />
      <FeaturedBlogs />
      <ProblemAwareness />
    </main>
  );
}
