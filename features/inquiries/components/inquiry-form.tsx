"use client";

import { useState } from "react";

import { submitInquiry } from "../actions";

import {
  TurnstileWidget,
  resetTurnstile,
} from "@/components/security/turnstile-widget";

type Errors = { name?: string; phone?: string };

const fieldClass =
  "h-11 w-full rounded-lg border border-foreground/20 bg-background px-3 text-sm outline-none focus:border-foreground";

export function InquiryForm({
  propertyId,
  propertyTitle,
}: {
  propertyId: string;
  propertyTitle: string;
}) {
  const [errors, setErrors] = useState<Errors>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const data = new FormData(event.currentTarget);
    const name = String(data.get("name") ?? "").trim();
    const phone = String(data.get("phone") ?? "").trim();
    const message = String(data.get("message") ?? "");

    const nextErrors: Errors = {};
    if (name.length < 2) nextErrors.name = "Please enter your name";
    if (phone.replace(/\D/g, "").length < 10)
      nextErrors.phone = "Enter a valid phone number";

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    const turnstileToken = String(data.get("cf-turnstile-response") ?? "");
    if (process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && !turnstileToken) {
      setServerError("Please wait for the security check to finish, then try again.");
      return;
    }

    setStatus("sending");
    setServerError(null);

    const result = await submitInquiry({
      name,
      phone,
      message,
      propertyId,
      trap: String(data.get("site_notes") ?? ""),
      turnstileToken,
    });

    resetTurnstile();

    if (result.ok) {
      setStatus("sent");
    } else {
      setStatus("idle");
      setServerError(result.error);
    }
  }

  if (status === "sent") {
    return (
      <div className="rounded-lg bg-green-600/10 p-4 text-sm">
        <p className="font-semibold">Thank you!</p>
        <p className="mt-1 text-foreground/70">
          We received your inquiry about this property and will contact you
          shortly.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-3">
      <div
        aria-hidden="true"
        className="absolute -left-[9999px] h-0 w-0 overflow-hidden"
      >
        <label>
          Site notes
          <input name="site_notes" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <p className="font-semibold">Send an inquiry</p>

      <div>
        <input name="name" placeholder="Your name" className={fieldClass} />
        {errors.name && (
          <p className="mt-1 text-xs text-red-500">{errors.name}</p>
        )}
      </div>

      <div>
        <input
          name="phone"
          type="tel"
          placeholder="Phone number"
          className={fieldClass}
        />
        {errors.phone && (
          <p className="mt-1 text-xs text-red-500">{errors.phone}</p>
        )}
      </div>

      <textarea
        name="message"
        rows={3}
        defaultValue={`Hello, I am interested in: ${propertyTitle}`}
        className="w-full rounded-lg border border-foreground/20 bg-background px-3 py-2 text-sm outline-none focus:border-foreground"
      />

      {serverError && <p className="text-xs text-red-500">{serverError}</p>}

      <TurnstileWidget whatsappText={`Hello, I am interested in: ${propertyTitle}`} />

      <button
        type="submit"
        disabled={status === "sending"}
        className="h-11 w-full rounded-lg bg-foreground font-medium text-background transition hover:opacity-80 disabled:opacity-50"
      >
        {status === "sending" ? "Sending..." : "Send inquiry"}
      </button>
    </form>
  );
}