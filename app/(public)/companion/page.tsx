import type { Metadata } from "next";
import { CompanionChat } from "@/features/companion/companion-chat";

export const metadata: Metadata = {
  title: "AI support companion",
};

export default function CompanionPage() {
  return (
    <main className="mx-auto w-[calc(100%-2.5rem)] max-w-[70rem] flex-1 py-8 pb-15" id="main-content">
      <header className="mx-auto w-full max-w-[48rem] [&>h1]:m-0 [&>h1]:text-[2.4rem] [&>h1]:font-bold [&>h1]:leading-tight [&>h1]:text-[var(--public-deep)] [&>p]:text-muted-foreground [&>p]:leading-7 [&_h2]:text-[var(--public-deep)] [&_h2]:text-xl [&_h2]:font-bold">
        <p className="mb-4 text-[0.82rem] font-bold uppercase tracking-[0.14em] text-primary">AI support companion</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
          Talk with Digisafe AI
        </h1>
        <p className="mt-5 leading-7 text-muted-foreground">
          A supportive guide for child protection, online safety, and digital
          wellbeing. You can chat without giving your name.
        </p>
      </header>
      <CompanionChat />
    </main>
  );
}
