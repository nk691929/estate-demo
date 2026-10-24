"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Script from "next/script";
import { MessageCircle, Phone } from "lucide-react";

import { siteConfig } from "@/config/site";

type TurnstileApi = {
  render: (container: HTMLElement, options: Record<string, unknown>) => string;
  reset: (widgetId?: string) => void;
  remove: (widgetId: string) => void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

type Status = "loading" | "ready" | "slow" | "error";

const SLOW_AFTER_MS = 15000;

export function resetTurnstile() {
  window.turnstile?.reset();
}

export function TurnstileWidget({ whatsappText }: { whatsappText?: string }) {
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | null>(null);
  const [status, setStatus] = useState<Status>("loading");

  const mount = useCallback(() => {
    if (!siteKey || !containerRef.current || !window.turnstile) return;
    if (widgetId.current) return;

    widgetId.current = window.turnstile.render(containerRef.current, {
      sitekey: siteKey,
      theme: "auto",
      callback: () => setStatus("ready"),
      "error-callback": () => setStatus("error"),
      "unsupported-callback": () => setStatus("error"),
      "expired-callback": () => setStatus("loading"),
    });
  }, [siteKey]);

  useEffect(() => {
    mount();

    const timer = window.setTimeout(() => {
      setStatus((current) => (current === "loading" ? "slow" : current));
    }, SLOW_AFTER_MS);

    return () => {
      window.clearTimeout(timer);
      if (widgetId.current && window.turnstile) {
        window.turnstile.remove(widgetId.current);
      }
      widgetId.current = null;
    };
  }, [mount]);

  if (!siteKey) return null;

  const whatsappHref = `https://wa.me/${siteConfig.whatsapp}${
    whatsappText ? `?text=${encodeURIComponent(whatsappText)}` : ""
  }`;

  return (
    <div className="space-y-3">
      <Script
        id="cf-turnstile-script"
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
        strategy="afterInteractive"
        onReady={mount}
        onError={() => setStatus("error")}
      />

      <div ref={containerRef} className="min-h-[65px]" />

      {(status === "slow" || status === "error") && (
        <div
          role="status"
          className="rounded-lg border border-yellow-500/40 bg-yellow-500/5 p-3 text-sm"
        >
          <p>
            {status === "error"
              ? "The security check could not load, so this form may not send. You can reach us directly:"
              : "The security check is taking longer than usual. If it does not finish, you can reach us directly:"}
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-lg bg-green-600 px-3 py-2 font-medium text-white transition hover:bg-green-700"
            >
              <MessageCircle className="size-4" />
              WhatsApp
            </a>
            <a
              href={`tel:${siteConfig.phone.replace(/\s/g, "")}`}
              className="flex items-center gap-2 rounded-lg border border-foreground/20 px-3 py-2 transition hover:bg-foreground/5"
            >
              <Phone className="size-4" />
              Call us
            </a>
          </div>
        </div>
      )}
    </div>
  );
}