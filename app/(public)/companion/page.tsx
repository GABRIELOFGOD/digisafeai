import type { Metadata } from "next";
import { CompanionChat } from "@/features/companion/companion-chat";

export const metadata: Metadata = {
  title: "AI support companion",
};

export default function CompanionPage() {
  return (
    <main className="public-main" id="main-content">
      <header className="public-prose">
        <p className="eyebrow">AI support companion</p>
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
