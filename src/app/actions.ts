"use server";

import { interests, type Interest } from "@/content/site";
import type { EnquiryInput, EnquiryResult } from "@/content/enquiry";

function isInterest(value: string): value is Interest {
  return interests.some((item) => item === value);
}

export async function submitEnquiry(input: EnquiryInput): Promise<EnquiryResult> {
  const endpoint = process.env.ENQUIRY_ENDPOINT;
  if (!endpoint) return { status: "unconfigured" };

  const fields: string[] = [];
  if (input.fullName.trim().length === 0) fields.push("fullName");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email.trim())) fields.push("email");
  if (!isInterest(input.interest)) fields.push("interest");
  if (input.message.trim().length === 0) fields.push("message");
  if (fields.length > 0) return { status: "invalid", fields };

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "content-type": "application/json", accept: "application/json" },
      body: JSON.stringify({
        fullName: input.fullName.trim(),
        organisation: input.organisation.trim(),
        email: input.email.trim(),
        phone: input.phone.trim(),
        interest: input.interest,
        message: input.message.trim(),
      }),
    });
    const body = (await response.json().catch(() => ({}))) as { accepted?: boolean };
    if (response.ok && body.accepted === true) return { status: "accepted" };
    return { status: "rejected" };
  } catch {
    return { status: "rejected" };
  }
}
