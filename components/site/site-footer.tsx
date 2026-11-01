import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <p className="site-footer-brand">
          DigiSafe AI
          <span>
            Advocacy for Youth and Vulnerable Development Initiative
          </span>
        </p>
        <nav aria-label="Footer navigation" className="site-footer-nav">
          <Link className="hover:text-foreground" href="/help-now">
            Get help now
          </Link>
          <Link className="hover:text-foreground" href="/learn">
            Learn
          </Link>
          <Link className="hover:text-foreground" href="/privacy">
            Privacy
          </Link>
          <Link className="hover:text-foreground" href="/about">
            About
          </Link>
        </nav>
      </div>
    </footer>
  );
}
