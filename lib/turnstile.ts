import "server-only";

type SiteverifyResponse = {
  success: boolean;
  "error-codes"?: string[];
};

export async function verifyTurnstile(
  token: string | null | undefined
): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;

  if (!secret) {
    // Not configured: allowed while developing, refused in production.
    if (process.env.NODE_ENV === "production") {
      console.error("TURNSTILE_SECRET_KEY is not set. Refusing the request.");
      return false;
    }
    return true;
  }

  if (!token) return false;

  try {
    const response = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        body: new URLSearchParams({ secret, response: token }),
        signal: AbortSignal.timeout(5000),
      }
    );

    const result = (await response.json()) as SiteverifyResponse;

    if (!result.success) {
      console.warn("Turnstile rejected a token:", result["error-codes"]);
    }

    return result.success === true;
  } catch (error) {
    console.error("Turnstile verification failed:", error);
    return false;
  }
}