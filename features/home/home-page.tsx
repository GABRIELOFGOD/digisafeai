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
    statusClass: "feature-status-live",
  },
  {
    title: "Talk to the AI companion",
    description: "The AI companion is functional with safeguarding and privacy reviews.",
    href: "/companion",
    status: "Safety companion",
    icon: MessageCircle,
    statusClass: "feature-status-live",
  },
  {
    title: "Get help now",
    description: "Read urgent guidance and see what support information is available.",
    href: "/help-now",
    status: "Guidance",
    icon: HeartHandshake,
    statusClass: "feature-status-live",
  },
  {
    title: "Learn about online safety",
    description: "Explore practical guidance for safer and more respectful online experiences.",
    href: "/learn",
    status: "Learning",
    icon: BookOpen,
    statusClass: "feature-status-live",
  },
];

export function HomePage() {
  return (
    <main id="main-content" className="public-main flex flex-col gap-10">
      <section className="home-hero">
        <div className="home-hero-copy">
          <p className="eyebrow">Child/Teen protection · Digital safety · Support</p>
          <h1>Speak up. Find support. Stay safe <span className="text-primary">Online</span>.</h1>
          <p className="home-hero-description">
            <span className="font-semibold light:text-black dark:text-primary">DigiSafe AI</span> offers confidential support, trusted information, reporting pathways, and resources for teenagers affected by digital threats, physical abuse/violence and image based sexual abuse.
          </p>
          <div className="home-hero-actions">
            <Link className="button-primary" href="/report">
              Report something <ArrowRight aria-hidden="true" size={18} />
            </Link>
            <Link className="button-secondary" href="/help-now">
              Get help now
            </Link>
          </div>
          {/* <p className="home-hero-note">
            DigiSafe AI is not an emergency service and cannot dispatch
            responders.
          </p> */}
        </div>
        <Link
          aria-label="Learn about the DigiSafe AI companion"
          className="home-orb-link"
          href="/companion"
        >
          <span aria-hidden="true" className="home-orb-ring" />
          <span aria-hidden="true" className="home-orb" />
          <span className="home-orb-caption">Talk to DigiSafe AI</span>
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
              <Link href="/report" className="button-primary">
                Report a concern
              </Link>
              <Link href="/learn" className="button-secondary">
                Learn more
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section
        aria-labelledby="features-heading"
        className="home-features bg-muted px-40 py-20"
      >
        <div className="home-section-heading">
          <h2 id="features-heading">Choose what feels right for you</h2>
          <p>
            You can explore at your own pace. Sharing a concern is always your
            choice.
          </p>
        </div>
        <ul className="feature-grid">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <li key={feature.title}>
                <Link className="feature-card" href={feature.href}>
                  <span aria-hidden="true" className="feature-icon">
                    <Icon size={21} />
                  </span>
                  <span className="feature-status">
                    <span className={feature.statusClass} />
                    {feature.status}
                  </span>
                  <span className="feature-title">{feature.title}</span>
                  <span className="feature-description">
                    {feature.description}
                  </span>
                  <ArrowRight
                    aria-hidden="true"
                    className="feature-arrow"
                    size={18}
                  />
                </Link>
              </li>
            );
          })}
        </ul>
      </section>
      {/* <aside className="safety-note">
        <ShieldCheck aria-hidden="true" size={21} />
        <p>
          DigiSafe AI is an initiative of AYVDI. The AI companion is not
          available yet, and no content here replaces support from trained
          people. What happened is not your fault.
        </p>
      </aside> */}

      <Projects />
      <FeaturedBlogs />
      <ProblemAwareness />
    </main>
  );
}
