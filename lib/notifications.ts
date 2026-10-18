import "server-only";

import { Resend } from "resend";

import { siteConfig } from "@/config/site";

export type LeadAlert = {
  name: string;
  phone: string;
  email?: string | null;
  message: string;
  propertyTitle?: string | null;
  source: "property" | "contact";
};

const oneLine = (value: string, max = 200) =>
  value.replace(/[\r\n]+/g, " ").trim().slice(0, max);

export async function sendLeadAlert(lead: LeadAlert): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.LEAD_ALERT_EMAIL;

  // Alerts are optional. Without both values we simply skip.
  if (!apiKey || !to) return;

  try {
    const resend = new Resend(apiKey);

    const subject =
      lead.source === "property" && lead.propertyTitle
        ? `New inquiry: ${oneLine(lead.propertyTitle, 120)}`
        : `New message from ${oneLine(lead.name, 80)}`;

    const body = [
      `Name: ${oneLine(lead.name)}`,
      `Phone: ${oneLine(lead.phone, 40)}`,
      lead.email ? `Email: ${oneLine(lead.email)}` : null,
      lead.propertyTitle ? `Property: ${oneLine(lead.propertyTitle)}` : null,
      "",
      "Message:",
      lead.message.slice(0, 1000),
      "",
      `Open the dashboard: ${siteConfig.url}/admin/leads`,
    ]
      .filter((line) => line !== null)
      .join("\n");

    const { error } = await resend.emails.send({
      from: `${siteConfig.name} <onboarding@resend.dev>`,
      to: [to],
      subject,
      text: body,
    });

    if (error) console.error("Lead alert failed:", error.message);
  } catch (error) {
    console.error("Lead alert failed:", error);
  }
}