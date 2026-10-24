"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ImagePlus, Star, Trash2 } from "lucide-react";

import { getBrowserSupabase } from "@/lib/supabase/browser";
import { updatePropertyImages } from "../actions";

const BUCKET = "property-images";
const MAX_BYTES = 10 * 1024 * 1024;
const MAX_IMAGES = 12;

const extensions: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

type Message = { type: "ok" | "error"; text: string };

export function PropertyImages({
  propertyId,
  initialImages,
}: {
  propertyId: string;
  initialImages: string[];
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [images, setImages] = useState<string[]>(initialImages);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<Message | null>(null);

  async function persist(next: string[]) {
    const result = await updatePropertyImages(propertyId, next);

    if (!result.ok) {
      setMessage({ type: "error", text: result.error });
      return false;
    }

    setImages(next);
    setMessage({ type: "ok", text: "Saved. The website shows the new photos." });
    return true;
  }

  async function handleFiles(event: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    event.target.value = "";
    if (files.length === 0) return;

    if (images.length + files.length > MAX_IMAGES) {
      setMessage({ type: "error", text: `A property can have up to ${MAX_IMAGES} photos.` });
      return;
    }

    const bad = files.find((file) => !extensions[file.type] || file.size > MAX_BYTES);
    if (bad) {
      setMessage({
        type: "error",
        text: `${bad.name}: use a JPG, PNG or WebP photo under 10 MB.`,
      });
      return;
    }

    setBusy(true);
    setMessage(null);

    const supabase = getBrowserSupabase();
    const uploaded: string[] = [];
    let uploadError: string | null = null;

    for (const file of files) {
      const path = `${propertyId}/${crypto.randomUUID()}.${extensions[file.type]}`;

      const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
        contentType: file.type,
        cacheControl: "31536000",
      });

      if (error) {
        uploadError = `Could not upload ${file.name}. Please try again.`;
        break;
      }

      uploaded.push(supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl);
    }

    if (uploaded.length > 0) {
      const saved = await persist([...images, ...uploaded]);
      if (saved && uploadError) setMessage({ type: "error", text: uploadError });
    } else if (uploadError) {
      setMessage({ type: "error", text: uploadError });
    }

    setBusy(false);
  }

  async function makeCover(src: string) {
    setBusy(true);
    setMessage(null);
    await persist([src, ...images.filter((item) => item !== src)]);
    setBusy(false);
  }

  async function remove(src: string) {
    if (!window.confirm("Remove this photo permanently?")) return;
    setBusy(true);
    setMessage(null);
    await persist(images.filter((item) => item !== src));
    setBusy(false);
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {images.map((src, index) => (
          <div
            key={src}
            className="overflow-hidden rounded-xl border border-foreground/10"
          >
            <div className="relative aspect-[4/3]">
              <Image
                src={src}
                alt={`Photo ${index + 1}`}
                fill
                sizes="(min-width: 640px) 33vw, 50vw"
                className="object-cover"
              />
              {index === 0 && (
                <span className="absolute left-2 top-2 rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-semibold uppercase text-black">
                  Cover
                </span>
              )}
            </div>
            <div className="flex gap-2 p-2">
              {index !== 0 && (
                <button
                  type="button"
                  onClick={() => makeCover(src)}
                  disabled={busy}
                  className="flex flex-1 items-center justify-center gap-1 rounded-lg border border-foreground/20 py-1.5 text-xs transition hover:bg-foreground/5 disabled:opacity-40"
                >
                  <Star className="size-3.5" />
                  Make cover
                </button>
              )}
              <button
                type="button"
                onClick={() => remove(src)}
                disabled={busy || images.length === 1}
                aria-label={`Remove photo ${index + 1}`}
                className="flex items-center justify-center rounded-lg border border-foreground/20 px-3 py-1.5 text-xs transition hover:bg-foreground/5 disabled:opacity-40"
              >
                <Trash2 className="size-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        onChange={handleFiles}
        className="hidden"
      />

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={busy || images.length >= MAX_IMAGES}
          className="flex h-11 items-center gap-2 rounded-lg bg-foreground px-5 text-sm font-medium text-background transition hover:opacity-80 disabled:opacity-50"
        >
          <ImagePlus className="size-4" />
          {busy ? "Working..." : "Add photos"}
        </button>

        {message && (
          <span
            className={`text-sm ${message.type === "ok" ? "text-green-500" : "text-red-500"}`}
          >
            {message.text}
          </span>
        )}
      </div>
    </div>
  );
}