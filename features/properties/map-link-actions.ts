"use server";

import { extractCoordinates } from "@/lib/map-link";
import { createAuthClient } from "@/lib/supabase/server";

const ALLOWED_HOSTS = new Set([
  "maps.app.goo.gl",
  "goo.gl",
  "www.google.com",
  "google.com",
  "maps.google.com",
]);

const MAX_HOPS = 5;

export async function resolveMapLink(
  input: string
): Promise<{ ok: true; lat: number; lng: number } | { ok: false; error: string }> {
  const supabase = await createAuthClient();
  const { data: auth } = await supabase.auth.getClaims();

  if (!auth?.claims) {
    return { ok: false, error: "Please sign in again." };
  }

  let current: URL;
  try {
    current = new URL(String(input).trim().slice(0, 500));
  } catch {
    return { ok: false, error: "That does not look like a link." };
  }

  for (let hop = 0; hop < MAX_HOPS; hop++) {
    if (current.protocol !== "https:" || !ALLOWED_HOSTS.has(current.hostname)) {
      return { ok: false, error: "Only Google Maps links are supported." };
    }

    const found = extractCoordinates(current.toString());
    if (found) return { ok: true, lat: found.lat, lng: found.lng };

    let response: Response;
    try {
      response = await fetch(current, {
        redirect: "manual",
        headers: { "User-Agent": "Mozilla/5.0 (compatible; location-lookup)" },
        signal: AbortSignal.timeout(5000),
      });
    } catch {
      return { ok: false, error: "Could not open that link. Try again." };
    }

    const next = response.headers.get("location");
    if (!next) break;

    try {
      current = new URL(next, current);
    } catch {
      break;
    }
  }

  return {
    ok: false,
    error: "Could not read a location from that link. Click the map instead.",
  };
}