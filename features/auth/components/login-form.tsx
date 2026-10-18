"use client";

import { useState } from "react";

import { signIn } from "../actions";

import { useRouter } from "next/navigation";


const fieldClass =
  "h-11 w-full rounded-lg border border-foreground/20 bg-background px-3 text-sm outline-none focus:border-foreground";

export function LoginForm() {
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const router = useRouter();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const data = new FormData(form);
    setSending(true);
    setError(null);

    const result = await signIn({
      email: String(data.get("email") ?? ""),
      password: String(data.get("password") ?? ""),
    });

    if (result.ok) {
      form.reset();
      setSending(false);
      router.replace("/admin");
      return;
    }

    setError(result.error);
    setSending(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        name="email"
        type="email"
        placeholder="Email"
        autoComplete="email"
        className={fieldClass}
      />
      <input
        name="password"
        type="password"
        placeholder="Password"
        autoComplete="current-password"
        className={fieldClass}
      />

      {error && <p className="text-sm text-red-500">{error}</p>}

      <button
        type="submit"
        disabled={sending}
        className="h-11 w-full rounded-lg bg-foreground font-medium text-background transition hover:opacity-80 disabled:opacity-50"
      >
        {sending ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}