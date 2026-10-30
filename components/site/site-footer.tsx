import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-5 py-6 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <p>
          DigiSafe AI · Advocacy for Youth and Vulnerable Development Initiative
        </p>
        <nav aria-label="Footer navigation" className="flex flex-wrap gap-4">
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
