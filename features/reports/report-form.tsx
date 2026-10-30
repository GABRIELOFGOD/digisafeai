"use client";

import { useState } from "react";
import { reportCategories } from "@/features/reports/report.schema";
import { Button } from "@/components/ui/button";

const categoryLabels: Record<(typeof reportCategories)[number], string> = {
  bullying: "Bullying, cyberbullying or intimidation",
  threats_coercion: "Threats, blackmail, extortion or coercion",
  sexual_messages_or_exposure:
    "Unwanted sexual messages, harassment or exposure",
  image_based_abuse: "Threats to share or sharing of an intimate image",
  grooming_or_exploitation: "Grooming, exploitation or suspicious adult contact",
  physical_or_sexual_abuse: "Physical abuse, sexual abuse or other violence",
  discrimination_or_stalking:
    "Discrimination, stalking or other behaviour that feels unsafe",
  other_or_unsure: "Something else / I am not sure",
};

type ContactMethod = "phone" | "email";

type FormValues = {
  reportAbout: "myself" | "someone_else" | "";
  category: (typeof reportCategories)[number] | "";
  description: string;
  approximateDate: string;
  generalLocation: string;
  onlinePlatform: string;
  immediateDanger: "yes" | "no" | "";
  safeContactMethod: ContactMethod | "";
  safeContactValue: string;
};

const initialFormValues: FormValues = {
  reportAbout: "",
  category: "",
  description: "",
  approximateDate: "",
  generalLocation: "",
  onlinePlatform: "",
  immediateDanger: "",
  safeContactMethod: "",
  safeContactValue: "",
};

type SubmissionResponse = {
  referenceCode?: string;
  error?: string;
  fieldErrors?: Record<string, string[] | undefined>;
};

export function ReportForm() {
  const [values, setValues] = useState(initialFormValues);
  const [step, setStep] = useState<"details" | "review" | "submitted">(
    "details",
  );
  const [fieldErrors, setFieldErrors] = useState<
    Record<string, string[] | undefined>
  >({});
  const [errorMessage, setErrorMessage] = useState("");
  const [referenceCode, setReferenceCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function update<K extends keyof FormValues>(key: K, value: FormValues[K]) {
    setValues((current) => ({ ...current, [key]: value }));
    setFieldErrors((current) => ({ ...current, [key]: [] }));
  }

  async function submitReport() {
    setIsSubmitting(true);
    setErrorMessage("");
    setFieldErrors({});

    const payload = {
      reportAbout: values.reportAbout,
      category: values.category,
      description: values.description,
      approximateDate: values.approximateDate || undefined,
      generalLocation: values.generalLocation || undefined,
      onlinePlatform: values.onlinePlatform || undefined,
      immediateDanger: values.immediateDanger === "yes",
      ...(values.safeContactMethod && values.safeContactValue.trim()
        ? {
            safeContact: {
              method: values.safeContactMethod,
              value: values.safeContactValue,
            },
          }
        : {}),
    };

    try {
      const response = await fetch("/api/v1/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = (await response.json()) as SubmissionResponse;

      if (!response.ok || !result.referenceCode) {
        setErrorMessage(
          result.error ??
            "Your report could not be confirmed as saved. Please do not assume it was received.",
        );
        setFieldErrors(result.fieldErrors ?? {});
        setStep("details");
        return;
      }

      setReferenceCode(result.referenceCode);
      setStep("submitted");
    } catch {
      setErrorMessage(
        "Your report could not be confirmed as saved. Please do not assume it was received.",
      );
      setStep("details");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (step === "submitted") {
    return (
      <section
        aria-labelledby="report-submitted-heading"
        className="mt-8 rounded-2xl border border-border bg-card p-6 sm:p-8"
        role="status"
      >
        <p className="text-sm font-semibold text-primary">Report saved</p>
        <h2
          className="mt-2 text-2xl font-semibold"
          id="report-submitted-heading"
        >
          Thank you for sharing this.
        </h2>
        <p className="mt-3 leading-7 text-muted-foreground">
          Your report has been saved. This does not mean a staff member has
          reviewed it yet. Keep this reference code if you need to refer to your
          report later.
        </p>
        <p className="mt-5 rounded-lg bg-muted px-4 py-3 font-mono text-lg font-semibold tracking-wider">
          {referenceCode}
        </p>
        <p className="mt-4 text-sm leading-6 text-muted-foreground">
          If you did not provide a safe contact method, the team may not be able
          to ask follow-up questions.
        </p>
      </section>
    );
  }

  if (step === "review") {
    return (
      <section
        aria-labelledby="review-report-heading"
        className="mt-8 rounded-2xl border border-border bg-card p-6 sm:p-8"
      >
        <p className="text-sm font-semibold text-primary">Step 2 of 2</p>
        <h2
          className="mt-2 text-2xl font-semibold"
          id="review-report-heading"
        >
          Review before sending
        </h2>
        <p className="mt-3 leading-7 text-muted-foreground">
          Check that you are comfortable sharing these details. You can go back
          and change them before submitting.
        </p>
        <dl className="mt-6 space-y-4">
          <div>
            <dt className="text-sm font-medium text-muted-foreground">
              Reporting about
            </dt>
            <dd className="mt-1">
              {values.reportAbout === "myself" ? "Myself" : "Someone else"}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-muted-foreground">
              Concern
            </dt>
            <dd className="mt-1">
              {values.category ? categoryLabels[values.category] : ""}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-muted-foreground">
              Description
            </dt>
            <dd className="mt-1 whitespace-pre-wrap">{values.description}</dd>
          </div>
          {values.approximateDate && (
            <div>
              <dt className="text-sm font-medium text-muted-foreground">
                Approximate date
              </dt>
              <dd className="mt-1">{values.approximateDate}</dd>
            </div>
          )}
          {values.generalLocation && (
            <div>
              <dt className="text-sm font-medium text-muted-foreground">
                General location
              </dt>
              <dd className="mt-1">{values.generalLocation}</dd>
            </div>
          )}
          {values.onlinePlatform && (
            <div>
              <dt className="text-sm font-medium text-muted-foreground">
                Online platform
              </dt>
              <dd className="mt-1">{values.onlinePlatform}</dd>
            </div>
          )}
          <div>
            <dt className="text-sm font-medium text-muted-foreground">
              Immediate danger
            </dt>
            <dd className="mt-1">
              {values.immediateDanger === "yes" ? "Yes" : "No"}
            </dd>
          </div>
          {values.safeContactMethod && values.safeContactValue && (
            <div>
              <dt className="text-sm font-medium text-muted-foreground">
                Safe contact
              </dt>
              <dd className="mt-1">
                {values.safeContactMethod === "phone" ? "Phone" : "Email"} added
              </dd>
            </div>
          )}
        </dl>
        {errorMessage && (
          <p className="mt-6 rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive" role="alert">
            {errorMessage}
          </p>
        )}
        <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
          <Button
            disabled={isSubmitting}
            onClick={() => setStep("details")}
            type="button"
            variant="outline"
          >
            Go back and edit
          </Button>
          <Button disabled={isSubmitting} onClick={submitReport} type="button">
            {isSubmitting ? "Submitting…" : "Submit report"}
          </Button>
        </div>
      </section>
    );
  }

  return (
    <form
      className="mt-8 space-y-8 rounded-2xl border border-border bg-card p-6 sm:p-8"
      onSubmit={(event) => {
        event.preventDefault();
        setErrorMessage("");
        if (values.safeContactMethod && !values.safeContactValue.trim()) {
          setFieldErrors({
            safeContact: ["Enter the safe contact detail or choose no contact."],
          });
          return;
        }
        setStep("review");
      }}
    >
      <p className="text-sm font-semibold text-primary">Step 1 of 2</p>

      {errorMessage && (
        <p className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive" role="alert">
          {errorMessage}
        </p>
      )}

      <fieldset className="space-y-3">
        <legend className="text-base font-semibold">
          Are you reporting something that happened to you or to someone else?
        </legend>
        {(["myself", "someone_else"] as const).map((value) => (
          <label className="flex items-center gap-3" key={value}>
            <input
              checked={values.reportAbout === value}
              name="reportAbout"
              onChange={() => update("reportAbout", value)}
              required
              type="radio"
              value={value}
            />
            <span>{value === "myself" ? "Something that happened to me" : "A concern about someone else"}</span>
          </label>
        ))}
        {fieldErrors.reportAbout?.[0] && (
          <p className="text-sm text-destructive">{fieldErrors.reportAbout[0]}</p>
        )}
      </fieldset>

      <div className="space-y-2">
        <label className="font-semibold" htmlFor="category">
          What is the concern?
        </label>
        <select
          className="min-h-11 w-full rounded-md border border-input bg-background px-3 py-2"
          id="category"
          onChange={(event) =>
            update(
              "category",
              event.target.value as FormValues["category"],
            )
          }
          required
          value={values.category}
        >
          <option value="">Choose a concern</option>
          {reportCategories.map((category) => (
            <option key={category} value={category}>
              {categoryLabels[category]}
            </option>
          ))}
        </select>
        {fieldErrors.category?.[0] && (
          <p className="text-sm text-destructive">{fieldErrors.category[0]}</p>
        )}
      </div>

      <div className="space-y-2">
        <label className="font-semibold" htmlFor="description">
          Tell us what happened, in your own words
        </label>
        <p className="text-sm leading-6 text-muted-foreground" id="description-help">
          A short description is enough. Do not include graphic details or
          send images. You can say “I am not sure”.
        </p>
        <textarea
          aria-describedby="description-help"
          className="min-h-36 w-full rounded-md border border-input bg-background px-3 py-2"
          id="description"
          maxLength={4000}
          onChange={(event) => update("description", event.target.value)}
          required
          value={values.description}
        />
        {fieldErrors.description?.[0] && (
          <p className="text-sm text-destructive">{fieldErrors.description[0]}</p>
        )}
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <label className="font-semibold" htmlFor="approximateDate">
            Approximate date (optional)
          </label>
          <input
            className="min-h-11 w-full rounded-md border border-input bg-background px-3 py-2"
            id="approximateDate"
            maxLength={40}
            onChange={(event) => update("approximateDate", event.target.value)}
            value={values.approximateDate}
          />
          {fieldErrors.approximateDate?.[0] && (
            <p className="text-sm text-destructive">{fieldErrors.approximateDate[0]}</p>
          )}
        </div>
        <div className="space-y-2">
          <label className="font-semibold" htmlFor="generalLocation">
            General location (optional)
          </label>
          <input
            className="min-h-11 w-full rounded-md border border-input bg-background px-3 py-2"
            id="generalLocation"
            maxLength={120}
            onChange={(event) => update("generalLocation", event.target.value)}
            value={values.generalLocation}
          />
          {fieldErrors.generalLocation?.[0] && (
            <p className="text-sm text-destructive">{fieldErrors.generalLocation[0]}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <label className="font-semibold" htmlFor="onlinePlatform">
          Online platform involved (optional)
        </label>
        <input
          className="min-h-11 w-full rounded-md border border-input bg-background px-3 py-2"
          id="onlinePlatform"
          maxLength={120}
          onChange={(event) => update("onlinePlatform", event.target.value)}
          value={values.onlinePlatform}
        />
        {fieldErrors.onlinePlatform?.[0] && (
          <p className="text-sm text-destructive">{fieldErrors.onlinePlatform[0]}</p>
        )}
      </div>

      <fieldset className="space-y-3">
        <legend className="text-base font-semibold">
          Are you in immediate danger right now?
        </legend>
        {(["yes", "no"] as const).map((value) => (
          <label className="flex items-center gap-3" key={value}>
            <input
              checked={values.immediateDanger === value}
              name="immediateDanger"
              onChange={() => update("immediateDanger", value)}
              required
              type="radio"
              value={value}
            />
            <span>{value === "yes" ? "Yes" : "No"}</span>
          </label>
        ))}
        <p className="text-sm leading-6 text-muted-foreground">
          DigiSafe AI cannot dispatch emergency responders.
        </p>
        {fieldErrors.immediateDanger?.[0] && (
          <p className="text-sm text-destructive">{fieldErrors.immediateDanger[0]}</p>
        )}
      </fieldset>

      <fieldset className="space-y-3">
        <legend className="text-base font-semibold">
          Would you like to provide a safe way for the team to contact you?
        </legend>
        <p className="text-sm leading-6 text-muted-foreground">
          This is optional. Only provide details that are safe for the team to
          use. They are stored separately and encrypted.
        </p>
        <div className="grid gap-3 sm:grid-cols-[10rem_1fr]">
          <label className="sr-only" htmlFor="safeContactMethod">
            Contact method
          </label>
          <select
            className="min-h-11 rounded-md border border-input bg-background px-3 py-2"
            id="safeContactMethod"
            onChange={(event) =>
              setValues((current) => ({
                ...current,
                safeContactMethod: event.target.value as FormValues["safeContactMethod"],
                safeContactValue: event.target.value
                  ? current.safeContactValue
                  : "",
              }))
            }
            value={values.safeContactMethod}
          >
            <option value="">No contact</option>
            <option value="phone">Phone</option>
            <option value="email">Email</option>
          </select>
          <label className="sr-only" htmlFor="safeContactValue">
            Safe contact detail
          </label>
          <input
            autoComplete="off"
            className="min-h-11 rounded-md border border-input bg-background px-3 py-2"
            disabled={!values.safeContactMethod}
            id="safeContactValue"
            maxLength={200}
            onChange={(event) => update("safeContactValue", event.target.value)}
            required={Boolean(values.safeContactMethod)}
            type={values.safeContactMethod === "email" ? "email" : "tel"}
            value={values.safeContactValue}
          />
        </div>
        {fieldErrors.safeContact?.[0] && (
          <p className="text-sm text-destructive">{fieldErrors.safeContact[0]}</p>
        )}
      </fieldset>

      <p className="text-sm leading-6 text-muted-foreground">
        By continuing, you confirm that you have read the information above.
        Anonymous reporting can limit follow-up. Technical metadata may still
        exist.
      </p>
      <Button className="w-full sm:w-auto" type="submit">
        Review report
      </Button>
    </form>
  );
}
