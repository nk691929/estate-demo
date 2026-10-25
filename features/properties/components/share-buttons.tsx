"use client";

import { useEffect, useState } from "react";
import { Check, Link2, MessageCircle, Share2 } from "lucide-react";

const buttonClass =
  "flex items-center gap-2 rounded-full border border-foreground/20 px-4 py-2 text-sm transition hover:bg-foreground/5";

export function ShareButtons({ url, title }: { url: string; title: string }) {
  const [copied, setCopied] = useState(false);
  const [canShare, setCanShare] = useState(false);

  useEffect(() => {
    setCanShare(
      typeof navigator !== "undefined" && typeof navigator.share === "function"
    );
  }, []);

  const whatsappHref = `https://wa.me/?text=${encodeURIComponent(`${title}\n${url}`)}`;

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt("Copy this link:", url);
    }
  }

  async function shareNatively() {
    try {
      await navigator.share({ title, url });
    } catch {
      // The visitor closed the share sheet. Nothing to do.
    }
  }

  return (
    <div className="mt-4 flex flex-wrap items-center gap-2">
      <a
        href={whatsappHref}
        target="_blank"
        rel="noopener noreferrer"
        className={buttonClass}
      >
        <MessageCircle className="size-4" />
        Share on WhatsApp
      </a>

      <button type="button" onClick={copyLink} className={buttonClass}>
        {copied ? <Check className="size-4" /> : <Link2 className="size-4" />}
        {copied ? "Link copied" : "Copy link"}
      </button>

      {canShare && (
        <button type="button" onClick={shareNatively} className={buttonClass}>
          <Share2 className="size-4" />
          Share
        </button>
      )}
    </div>
  );
}