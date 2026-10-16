"use server";

export type InquiryInput = {
  name: string;
  phone: string;
  message: string;
  propertyTitle: string;
};

export type InquiryResult = { ok: true } | { ok: false; error: string };

export async function submitInquiry(
  input: InquiryInput
): Promise<InquiryResult> {
  const name = input.name.trim();
  const phone = input.phone.trim();

  if (name.length < 2 || phone.replace(/\D/g, "").length < 10) {
    return { ok: false, error: "Please check your name and phone number." };
  }

  // Demo only: later this line saves to the database / sends an email.
  console.log("New inquiry:", {
    name,
    phone,
    message: input.message.trim(),
    property: input.propertyTitle,
    receivedAt: new Date().toISOString(),
  });

  return { ok: true };
}

export type ContactInput = {
  name: string;
  phone: string;
  email: string;
  message: string;
};

export async function submitContact(
  input: ContactInput
): Promise<InquiryResult> {
  const name = input.name.trim();
  const phone = input.phone.trim();
  const message = input.message.trim();

  if (
    name.length < 2 ||
    phone.replace(/\D/g, "").length < 10 ||
    message.length < 5
  ) {
    return { ok: false, error: "Please check your details and message." };
  }

  console.log("New contact message:", {
    name,
    phone,
    email: input.email.trim(),
    message,
    receivedAt: new Date().toISOString(),
  });

  return { ok: true };
}