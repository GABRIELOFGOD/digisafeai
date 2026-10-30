import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="border-b border-border bg-card">
      <div className="mx-auto flex min-h-16 w-full max-w-6xl items-center justify-between px-5 sm:px-8">
        <Link
          aria-label="DigiSafe AI home"
          className="text-lg font-bold tracking-tight text-primary"
          href="/"
        >
          DigiSafe AI
        </Link>
        <nav aria-label="Main navigation" className="flex flex-wrap gap-x-4 gap-y-2">
          <Link
            className="text-sm font-semibold text-primary underline-offset-4 hover:underline"
            href="/report"
          >
            Report
          </Link>
          <Link
            className="text-sm font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
            href="/help-now"
          >
            Help
          </Link>
          <Link
            className="text-sm font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
            href="/learn"
          >
            Learn
          </Link>
          <Link
            className="text-sm font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
            href="/companion"
          >
            AI
          </Link>
        </nav>
      </div>
    </header>
  );
}
