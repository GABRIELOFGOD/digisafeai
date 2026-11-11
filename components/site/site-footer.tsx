import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex min-h-[5.2rem] w-[calc(100%-2.5rem)] max-w-[70rem] items-center justify-between gap-x-8 gap-y-4 py-[1.15rem] text-[0.85rem] text-muted-foreground max-[700px]:w-[calc(100%-2rem)] max-[700px]:flex-col max-[700px]:items-start max-[700px]:py-[calc(1.1rem+env(safe-area-inset-bottom,0px))]">
        <p className="my-0 flex flex-col gap-[0.15rem] font-semibold text-[var(--public-deep)]">
          DigiSafe AI
          <span className="text-[0.78rem] font-normal text-muted-foreground">
            An initiative of Advocacy for Youth and Vulnerable Development Initiative (AYVDI)
          </span>
        </p>
        <nav aria-label="Footer navigation" className="flex flex-wrap gap-x-4 gap-y-2">
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
