"use server";

import { getSupabase } from "@/lib/supabase/client";

export type InquiryInput = {
  name: string;
  phone: string;
  message: string;
  propertyId: string;
  propertyTitle: string;
};

export type ContactInput = {
  name: string;
  phone: string;
  email: string;
  message: string;
};

export type InquiryResult = { ok: true } | { ok: false; error: string };

const GENERIC_ERROR =
  "Something went wrong. Please try again or contact us on WhatsApp.";

function isValidPhone(phone: string) {
  return phone.replace(/\D/g, "").length >= 10;
}

export async function submitInquiry(
  input: InquiryInput
): Promise<InquiryResult> {
  const name = input.name.trim().slice(0, 100);
  const phone = input.phone.trim().slice(0, 30);

  if (name.length < 2 || !isValidPhone(phone)) {
    return { ok: false, error: "Please check your name and phone number." };
  }

  const { error } = await getSupabase().from("leads").insert({
    name,
    phone,
    message: input.message.trim().slice(0, 2000),
    source: "property",
    property_id: input.propertyId,
    property_title: input.propertyTitle,
  });

  if (error) {
    console.error("Could not save inquiry:", error.message);
    return { ok: false, error: GENERIC_ERROR };
  }

  return { ok: true };
}

export async function submitContact(
  input: ContactInput
): Promise<InquiryResult> {
  const name = input.name.trim().slice(0, 100);
  const phone = input.phone.trim().slice(0, 30);
  const message = input.message.trim().slice(0, 2000);

  if (name.length < 2 || !isValidPhone(phone) || message.length < 5) {
    return { ok: false, error: "Please check your details and message." };
  }

  const { error } = await getSupabase().from("leads").insert({
    name,
    phone,
    email: input.email.trim().slice(0, 200) || null,
    message,
    source: "contact",
  });

  if (error) {
    console.error("Could not save contact message:", error.message);
    return { ok: false, error: GENERIC_ERROR };
  }

  return { ok: true };
}