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
