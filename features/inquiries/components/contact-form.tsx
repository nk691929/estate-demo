"use client";

import { useState } from "react";

import { submitContact } from "../actions";

type Errors = { name?: string; phone?: string; message?: string };

const fieldClass =
  "h-11 w-full rounded-lg border border-foreground/20 bg-background px-3 text-sm outline-none focus:border-foreground";

export function ContactForm() {
  const [errors, setErrors] = useState<Errors>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const data = new FormData(event.currentTarget);
    const name = String(data.get("name") ?? "").trim();
    const phone = String(data.get("phone") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const message = String(data.get("message") ?? "").trim();

    const nextErrors: Errors = {};
    if (name.length < 2) nextErrors.name = "Please enter your name";
    if (phone.replace(/\D/g, "").length < 10)
      nextErrors.phone = "Enter a valid phone number";
    if (message.length < 5) nextErrors.message = "Please write a short message";

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setStatus("sending");
    setServerError(null);

    const result = await submitContact({ name, phone, email, message });

    if (result.ok) {
      setStatus("sent");
    } else {
      setStatus("idle");
      setServerError(result.error);
    }
  }

  if (status === "sent") {
    return (
      <div className="rounded-2xl bg-green-600/10 p-8 text-center">
        <p className="text-xl font-semibold">Message sent!</p>
        <p className="mt-2 text-foreground/70">
          Thank you for reaching out. We will get back to you shortly.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="space-y-4 rounded-2xl border border-foreground/10 p-6"
    >
      <h2 className="text-xl font-semibold">Send us a message</h2>

      <div>
        <input name="name" placeholder="Your name" className={fieldClass} />
        {errors.name && (
          <p className="mt-1 text-xs text-red-500">{errors.name}</p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
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
        <input
          name="email"
          type="email"
          placeholder="Email (optional)"
          className={fieldClass}
        />
      </div>

      <div>
        <textarea
          name="message"
          rows={5}
          placeholder="How can we help you?"
          className="w-full rounded-lg border border-foreground/20 bg-background px-3 py-2 text-sm outline-none focus:border-foreground"
        />
        {errors.message && (
          <p className="mt-1 text-xs text-red-500">{errors.message}</p>
        )}
      </div>

      {serverError && <p className="text-sm text-red-500">{serverError}</p>}

      <button
        type="submit"
        disabled={status === "sending"}
        className="h-11 w-full rounded-lg bg-foreground font-medium text-background transition hover:opacity-80 disabled:opacity-50"
      >
        {status === "sending" ? "Sending..." : "Send message"}
      </button>
    </form>
  );
}