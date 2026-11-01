import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  HeartHandshake,
  MessageCircle,
  ShieldCheck,
} from "lucide-react";

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
    description: "The companion is being prepared with safeguarding and privacy reviews.",
    href: "/companion",
    status: "In development",
    icon: MessageCircle,
    statusClass: "feature-status-planned",
  },
  {
    title: "Get help now",
    description: "Read urgent guidance and see what support information is available.",
    href: "/help-now",
    status: "Guidance",
    icon: HeartHandshake,
    statusClass: "feature-status-planned",
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
    <main id="main-content" className="public-main">
      <section className="home-hero">
        <div className="home-hero-copy">
          <p className="eyebrow">Child protection · Digital safety · Support</p>
          <h1>Speak up. Find support. Stay safer.</h1>
          <p className="home-hero-description">
            A calm place for students to share a concern, explore their options,
            and find a next step. You don’t need an account to report.
          </p>
          <div className="home-hero-actions">
            <Link className="button-primary" href="/report">
              Report something <ArrowRight aria-hidden="true" size={18} />
            </Link>
            <Link className="button-secondary" href="/help-now">
              Get help now
            </Link>
          </div>
          <p className="home-hero-note">
            DigiSafe AI is not an emergency service and cannot dispatch
            responders.
          </p>
        </div>
        <Link
          aria-label="Learn about the DigiSafe AI companion"
          className="home-orb-link"
          href="/companion"
        >
          <span aria-hidden="true" className="home-orb-ring" />
          <span aria-hidden="true" className="home-orb" />
          <span className="home-orb-caption">Support is being prepared</span>
        </Link>
      </section>

      <section
        aria-labelledby="features-heading"
        className="home-features"
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
      <aside className="safety-note">
        <ShieldCheck aria-hidden="true" size={21} />
        <p>
          DigiSafe AI is an initiative of AYVDI. The AI companion is not
          available yet, and no content here replaces support from trained
          people. What happened is not your fault.
        </p>
      </aside>
    </main>
  );
}
