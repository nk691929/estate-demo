"use server";

import { after } from "next/server";

import { sendLeadAlert } from "@/lib/notifications";
import { getAdminSupabase } from "@/lib/supabase/admin";
import { verifyTurnstile } from "@/lib/turnstile";
import { getSupabase } from "@/lib/supabase/client";

export type InquiryInput = {
  name: string;
  phone: string;
  message: string;
  propertyId: string;
  trap?: string;
  turnstileToken?: string;
};

export type ContactInput = {
  name: string;
  phone: string;
  email: string;
  message: string;
  trap?: string;
  turnstileToken?: string;
};

export type InquiryResult = { ok: true } | { ok: false; error: string };

const GENERIC_ERROR =
  "Something went wrong. Please try again or contact us on WhatsApp.";
const TOO_MANY_ERROR =
  "You have sent several messages recently. Please wait a while, or contact us on WhatsApp.";

function isValidPhone(phone: string) {
  return phone.replace(/\D/g, "").length >= 10;
}

function failureMessage(error: { message: string }) {
  return error.message.includes("Too many submissions")
    ? TOO_MANY_ERROR
    : GENERIC_ERROR;
}

async function insertLead(row: Record<string, unknown>) {
  try {
    const { error } = await getAdminSupabase().from("leads").insert(row);
    return error;
  } catch (caught) {
    return {
      message: caught instanceof Error ? caught.message : "Unknown error",
    };
  }
}

export async function submitInquiry(
  input: InquiryInput
): Promise<InquiryResult> {
  if (input.trap && input.trap.trim() !== "") return { ok: true };

  const name = input.name.trim().slice(0, 100);
  const phone = input.phone.trim().slice(0, 30);

  if (name.length < 2 || !isValidPhone(phone)) {
    return { ok: false, error: "Please check your name and phone number." };
  }

  if (!(await verifyTurnstile(input.turnstileToken))) {
    return { ok: false, error: "The security check failed. Please try again." };
  }

  // The browser only tells us which property. The server decides what its title is.
  const lookup = await getSupabase()
    .from("properties")
    .select("id, title")
    .eq("id", String(input.propertyId).slice(0, 64))
    .maybeSingle();

  if (lookup.error) {
    console.error("Could not look up property:", lookup.error.message);
    return { ok: false, error: GENERIC_ERROR };
  }

  if (!lookup.data) {
    return {
      ok: false,
      error: "This property is no longer available. Please contact us on WhatsApp.",
    };
  }

  const property = lookup.data as { id: string; title: string };

  const error = await insertLead({
    name,
    phone,
    message: input.message.trim().slice(0, 2000),
    source: "property",
    property_id: property.id,
    property_title: property.title,
  });

  if (error) {
    console.error("Could not save inquiry:", error.message);
    return { ok: false, error: failureMessage(error) };
  }

  after(() =>
    sendLeadAlert({
      name,
      phone,
      message: input.message,
      propertyTitle: property.title,
      source: "property",
    })
  );

  return { ok: true };
}

export async function submitContact(
  input: ContactInput
): Promise<InquiryResult> {
  if (input.trap && input.trap.trim() !== "") return { ok: true };

  const name = input.name.trim().slice(0, 100);
  const phone = input.phone.trim().slice(0, 30);
  const message = input.message.trim().slice(0, 2000);

  if (name.length < 2 || !isValidPhone(phone) || message.length < 5) {
    return { ok: false, error: "Please check your details and message." };
  }

  if (!(await verifyTurnstile(input.turnstileToken))) {
    return { ok: false, error: "The security check failed. Please try again." };
  }

  const error = await insertLead({
    name,
    phone,
    email: input.email.trim().slice(0, 200) || null,
    message,
    source: "contact",
  });

  if (error) {
    console.error("Could not save contact message:", error.message);
    return { ok: false, error: failureMessage(error) };
  }

  after(() =>
    sendLeadAlert({
      name,
      phone,
      email: input.email,
      message,
      source: "contact",
    })
  );

  return { ok: true };
}