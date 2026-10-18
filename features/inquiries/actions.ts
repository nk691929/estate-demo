"use server";

import { getSupabase } from "@/lib/supabase/client";
import { after } from "next/server";

import { sendLeadAlert } from "@/lib/notifications";
import { verifyTurnstile } from "@/lib/turnstile";

export type InquiryInput = {
  name: string;
  phone: string;
  message: string;
  propertyId: string;
  propertyTitle: string;
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

export async function submitInquiry(
  input: InquiryInput
): Promise<InquiryResult> {
  // A real person never sees or fills the hidden field. Pretend it worked.
  if (input.trap && input.trap.trim() !== "") return { ok: true };

  const name = input.name.trim().slice(0, 100);
  const phone = input.phone.trim().slice(0, 30);

  if (name.length < 2 || !isValidPhone(phone)) {
    return { ok: false, error: "Please check your name and phone number." };
  }

  if (!(await verifyTurnstile(input.turnstileToken))) {
    return {
      ok: false,
      error: "The security check failed. Please try again.",
    };
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
    return { ok: false, error: failureMessage(error) };
  }

  after(() =>
    sendLeadAlert({
      name,
      phone,
      message: input.message,
      propertyTitle: input.propertyTitle,
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
    return {
      ok: false,
      error: "The security check failed. Please try again.",
    };
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