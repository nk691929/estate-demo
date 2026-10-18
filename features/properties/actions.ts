"use server";

import { updateTag } from "next/cache";

import { createAuthClient } from "@/lib/supabase/server";
import { parsePropertyForm, type PropertyFormValues } from "./validation";

export type SaveResult = { ok: true } | { ok: false; error: string };

export async function updateProperty(
  id: string,
  values: PropertyFormValues
): Promise<SaveResult> {
  const parsed = parsePropertyForm(values);
  if (!parsed.ok) return parsed;

  const supabase = await createAuthClient();
  const { data: auth } = await supabase.auth.getClaims();

  if (!auth?.claims) {
    return { ok: false, error: "Please sign in again." };
  }

  const { data, error } = await supabase
    .from("properties")
    .update(parsed.data)
    .eq("id", id)
    .select("slug");

  if (error || !data || data.length === 0) {
    return { ok: false, error: "Could not save changes." };
  }

  updateTag("properties");
  updateTag(`property-${data[0].slug}`);

  return { ok: true };
}

const MAX_IMAGES = 12;

const ALLOWED_IMAGE_PREFIXES = [
  "/images/",
  `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/property-images/`,
];

export async function updatePropertyImages(
  id: string,
  images: string[]
): Promise<SaveResult> {
  if (!Array.isArray(images) || images.length < 1 || images.length > MAX_IMAGES) {
    return { ok: false, error: `A property needs 1 to ${MAX_IMAGES} photos.` };
  }

  const valid = images.every(
    (src) =>
      typeof src === "string" &&
      !src.includes("..") &&
      ALLOWED_IMAGE_PREFIXES.some((prefix) => src.startsWith(prefix))
  );
  if (!valid) return { ok: false, error: "Invalid photo address." };

  const supabase = await createAuthClient();
  const { data: auth } = await supabase.auth.getClaims();

  if (!auth?.claims) {
    return { ok: false, error: "Please sign in again." };
  }

  const { data, error } = await supabase
    .from("properties")
    .update({ images })
    .eq("id", id)
    .select("slug");

  if (error || !data || data.length === 0) {
    return { ok: false, error: "Could not save photos." };
  }

  updateTag("properties");
  updateTag(`property-${data[0].slug}`);

  return { ok: true };
}