"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

type ContactDetailsValue = {
  method: "phone" | "email";
  value: string;
};

function isContactDetailsValue(value: unknown): value is ContactDetailsValue {
  return (
    typeof value === "object" &&
    value !== null &&
    "method" in value &&
    (value.method === "phone" || value.method === "email") &&
    "value" in value &&
    typeof value.value === "string"
  );
}

export function ContactDetails({ reportId }: { reportId: string }) {
  const [contact, setContact] = useState<ContactDetailsValue | null>(null);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function revealContact() {
    setMessage("");
    setIsLoading(true);

    try {
      const response = await fetch(
        `/api/v1/staff/cases/${reportId}/contact`,
        { cache: "no-store" },
      );
      const result: unknown = await response.json();

      if (!response.ok || !isContactDetailsValue(result)) {
        setMessage(
          typeof result === "object" &&
            result !== null &&
            "error" in result &&
            typeof result.error === "string"
            ? result.error
            : "Contact details could not be retrieved.",
        );
        return;
      }

      setContact(result);
    } catch {
      setMessage("Contact details could not be retrieved.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section className="mt-8 rounded-xl border border-border bg-card p-5 sm:p-6">
      <h2 className="text-lg font-semibold">Safe contact details</h2>
      {contact ? (
        <p className="mt-3 break-all">
          {contact.method === "phone" ? "Phone" : "Email"}: {contact.value}
        </p>
      ) : (
        <>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Contact details are optional and encrypted separately. Viewing
            them is recorded in the case access audit trail.
          </p>
          <Button
            className="mt-4"
            disabled={isLoading}
            onClick={revealContact}
            type="button"
            variant="outline"
          >
            {isLoading ? "Loading…" : "View safe contact"}
          </Button>
        </>
      )}
      {message && (
        <p className="mt-3 text-sm text-destructive" role="alert">
          {message}
        </p>
      )}
    </section>
  );
}
