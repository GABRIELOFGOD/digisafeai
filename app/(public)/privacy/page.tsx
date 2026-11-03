import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy information",
};

export default function PrivacyPage() {
  return (
    <main className="public-main public-prose" id="main-content">
      <p className="eyebrow">
        Privacy
      </p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
        How report information is handled
      </h1>
      <p className="mt-5 leading-7 text-muted-foreground">
        You can submit a report without creating an account or giving your
        name. Sharing a safe contact method is optional. If you share one, it is
        encrypted and stored separately from the report description.
      </p>
      <section className="mt-8 space-y-6">
        <div>
          <h2 className="text-lg font-semibold">AI companion conversations</h2>
          <p className="mt-2 leading-7 text-muted-foreground">
            If you choose to use Digisafe AI, your messages and the AI replies
            are saved with a unique conversation code and can be reviewed by
            authorised AYVDI administrators. Conversations remain saved until
            an administrator deletes them. Your messages are sent to OpenAI to
            generate replies; OpenAI processes them under its applicable
            service terms. Do not share names, addresses, passwords, or
            intimate images in the chat.
          </p>
        </div>
        <div>
          <h2 className="text-lg font-semibold">Who can access a report?</h2>
          <p className="mt-2 leading-7 text-muted-foreground">
            Report details are stored for review by authorised AYVDI
            safeguarding staff. Access to case details and optional contact
            information is recorded.
          </p>
        </div>
        <div>
          <h2 className="text-lg font-semibold">Limits of anonymity</h2>
          <p className="mt-2 leading-7 text-muted-foreground">
            Anonymous reporting can limit follow-up. DigiSafe AI cannot promise
            absolute anonymity because hosting, network, or security systems
            may process technical metadata.
          </p>
        </div>
        <div>
          <h2 className="text-lg font-semibold">Images and sensitive details</h2>
          <p className="mt-2 leading-7 text-muted-foreground">
            Do not upload or send nude or sexually explicit images. A short
            description is enough; graphic details are not required.
          </p>
        </div>
        <div className="rounded-xl border border-border bg-muted p-5">
          <h2 className="font-semibold">Policy details to be confirmed</h2>
          <p className="mt-2 leading-7 text-muted-foreground">
            AYVDI must approve the lawful basis, retention and deletion
            process, privacy contact, and data-protection arrangements,
            including OpenAI data-processing terms, before production rollout.
            This page does not replace a reviewed privacy notice.
          </p>
        </div>
      </section>
    </main>
  );
}
