"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";

type AdminAccount = {
  id: string;
  name: string;
  email: string;
  createdAt: string | null;
};

export function AdminManager({
  initialAdmins,
}: {
  initialAdmins: AdminAccount[];
}) {
  const [admins, setAdmins] = useState(initialAdmins);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function loadAdmins() {
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/v1/staff/admins", {
        cache: "no-store",
      });
      const result = (await response.json()) as {
        admins?: AdminAccount[];
        error?: string;
      };
      if (!response.ok || !Array.isArray(result.admins)) {
        throw new Error(result.error ?? "Administrator accounts could not be loaded.");
      }
      setAdmins(result.admins);
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Administrator accounts could not be loaded.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  async function createAdmin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch("/api/v1/staff/admins", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const result = (await response.json()) as { error?: string };
      if (!response.ok) {
        throw new Error(result.error ?? "Administrator account could not be created.");
      }
      setName("");
      setEmail("");
      setPassword("");
      setMessage("Administrator account created.");
      await loadAdmins();
    } catch (createError) {
      setError(
        createError instanceof Error
          ? createError.message
          : "Administrator account could not be created.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <section className="rounded-xl border border-border bg-card p-5 sm:p-6">
        <h2 className="text-xl font-semibold">Add an administrator</h2>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          New administrators can manage reports, projects, blog posts, and
          administrator accounts. Use a unique password and share it securely.
        </p>
        <form className="mt-5 space-y-4" onSubmit={createAdmin}>
          <label className="block space-y-2 text-sm font-medium">
            Full name
            <input
              autoComplete="name"
              className="min-h-11 w-full rounded-md border border-input bg-background px-3 py-2"
              maxLength={100}
              minLength={2}
              onChange={(event) => setName(event.target.value)}
              required
              value={name}
            />
          </label>
          <label className="block space-y-2 text-sm font-medium">
            Work email
            <input
              autoComplete="email"
              className="min-h-11 w-full rounded-md border border-input bg-background px-3 py-2"
              onChange={(event) => setEmail(event.target.value)}
              required
              type="email"
              value={email}
            />
          </label>
          <label className="block space-y-2 text-sm font-medium">
            Temporary password
            <input
              autoComplete="new-password"
              className="min-h-11 w-full rounded-md border border-input bg-background px-3 py-2"
              minLength={12}
              onChange={(event) => setPassword(event.target.value)}
              required
              type="password"
              value={password}
            />
            <span className="block font-normal text-muted-foreground">
              At least 12 characters. Do not reuse a password from another
              account.
            </span>
          </label>
          {error && (
            <p className="text-sm text-destructive" role="alert">
              {error}
            </p>
          )}
          {message && (
            <p className="text-sm text-primary" role="status">
              {message}
            </p>
          )}
          <Button disabled={isSaving} type="submit">
            {isSaving ? "Creating…" : "Create administrator"}
          </Button>
        </form>
      </section>

      <section className="rounded-xl border border-border bg-card p-5 sm:p-6">
        <h2 className="text-xl font-semibold">Administrators</h2>
        {isLoading ? (
          <p className="mt-4 text-sm text-muted-foreground" aria-live="polite">
            Loading administrator accounts…
          </p>
        ) : admins.length === 0 ? (
          <p className="mt-4 text-sm text-muted-foreground">
            No active administrators were found.
          </p>
        ) : (
          <ul className="mt-4 divide-y divide-border">
            {admins.map((admin) => (
              <li className="py-4" key={admin.id}>
                <p className="font-medium">{admin.name}</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {admin.email}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
