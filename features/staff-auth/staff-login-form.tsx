"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

export function StaffLoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage("");
    setIsSubmitting(true);

    try {
      const result = await authClient.signIn.email({ email, password });

      if (result.error) {
        setErrorMessage("Sign-in failed. Check your details and try again.");
        return;
      }

      router.replace("/staff/dashboard");
      router.refresh();
    } catch {
      setErrorMessage("Sign-in is temporarily unavailable. Try again later.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="mt-7 space-y-5" onSubmit={handleSubmit}>
      <div className="space-y-2">
        <label className="font-medium" htmlFor="staff-email">
          Work email
        </label>
        <input
          autoComplete="username"
          className="min-h-11 w-full rounded-md border border-input bg-background px-3 py-2"
          id="staff-email"
          onChange={(event) => setEmail(event.target.value)}
          required
          type="email"
          value={email}
        />
      </div>
      <div className="space-y-2">
        <label className="font-medium" htmlFor="staff-password">
          Password
        </label>
        <input
          autoComplete="current-password"
          className="min-h-11 w-full rounded-md border border-input bg-background px-3 py-2"
          id="staff-password"
          onChange={(event) => setPassword(event.target.value)}
          required
          type="password"
          value={password}
        />
      </div>
      {errorMessage && (
        <p className="text-sm text-destructive" role="alert">
          {errorMessage}
        </p>
      )}
      <Button className="w-full" disabled={isSubmitting} type="submit">
        {isSubmitting ? "Signing in…" : "Sign in"}
      </Button>
    </form>
  );
}
