"use client";

import { useCallback, useEffect, useRef } from "react";
import Script from "next/script";

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

export function resetTurnstile() {
  window.turnstile?.reset();
}

export function TurnstileWidget() {
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | null>(null);

  const mount = useCallback(() => {
    if (!siteKey || !containerRef.current || !window.turnstile) return;
    if (widgetId.current) return;

    widgetId.current = window.turnstile.render(containerRef.current, {
      sitekey: siteKey,
      theme: "auto",
    });
  }, [siteKey]);

  useEffect(() => {
    mount();

    return () => {
      if (widgetId.current && window.turnstile) {
        window.turnstile.remove(widgetId.current);
      }
      widgetId.current = null;
    };
  }, [mount]);

  if (!siteKey) return null;

  return (
    <>
      <Script
        id="cf-turnstile-script"
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
        strategy="afterInteractive"
        onReady={mount}
      />
      <div ref={containerRef} className="min-h-[65px]" />
    </>
  );
}