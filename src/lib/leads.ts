import type { EnquiryInput, EnquiryResult } from "@/content/enquiry";

// Browser-side client for the CPA leads API. The site key is a public, origin-bound key:
// the API only accepts it from the allowed website origins (CORS + Origin check), so it is
// safe to ship in the static bundle. Both values are inlined at build time from .env.production.
const LEADS_API_URL = process.env.NEXT_PUBLIC_LEADS_API_URL ?? "https://clp.cpaleasing.com/api/v1/leads";
const LEADS_SITE_KEY = process.env.NEXT_PUBLIC_LEADS_SITE_KEY ?? "";

export const leadsConfigured = LEADS_SITE_KEY.length > 0;

// API error keys → form field ids.
const FIELD_MAP: Record<string, string> = {
  name: "fullName",
  email: "email",
  phone: "phone",
  message: "message",
};

function composeMessage(input: EnquiryInput): string {
  const lines = [`Interest: ${input.interest}`];
  if (input.organisation) lines.push(`Organisation: ${input.organisation}`);
  return `${lines.join("\n")}\n\n${input.message}`;
}

export async function submitLead(input: EnquiryInput, honeypot: string): Promise<EnquiryResult> {
  if (!leadsConfigured) return { status: "unconfigured" };

  try {
    const response = await fetch(LEADS_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Site-Key": LEADS_SITE_KEY },
      body: JSON.stringify({
        type: "quote",
        name: input.fullName,
        email: input.email,
        phone: input.phone,
        message: composeMessage(input),
        website: honeypot, // honeypot: real visitors leave it empty
      }),
    });

    if (response.status === 201) return { status: "accepted" };

    if (response.status === 400) {
      const body = (await response.json().catch(() => ({}))) as { errors?: Record<string, string> };
      const fields = Object.keys(body.errors ?? {})
        .map((key) => FIELD_MAP[key])
        .filter((field): field is string => Boolean(field));
      if (fields.length > 0) return { status: "invalid", fields };
    }
    return { status: "rejected" };
  } catch {
    return { status: "rejected" };
  }
}
