"use client";

import { useState, type FormEvent } from "react";
import type { EnquiryResult } from "@/content/enquiry";
import { copy, emailDisplay, interests, type Interest } from "@/content/site";
import { leadsConfigured, submitLead } from "@/lib/leads";

export function EnquiryForm({
  defaultInterest = "Building Contracting",
}: {
  defaultInterest?: Interest;
}) {
  const [state, setState] = useState<EnquiryResult>({ status: "idle" });
  const [mailtoHref, setMailtoHref] = useState<string | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const fullName = String(data.get("fullName") ?? "").trim();
    const organisation = String(data.get("organisation") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const phone = String(data.get("phone") ?? "").trim();
    const interest = String(data.get("interest") ?? "") as Interest;
    const message = String(data.get("message") ?? "").trim();
    const honeypot = String(data.get("website") ?? "");

    const invalidFields: string[] = [];
    if (!fullName) invalidFields.push("fullName");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) invalidFields.push("email");
    if (!interest) invalidFields.push("interest");
    if (!message) invalidFields.push("message");

    if (invalidFields.length > 0) {
      setState({ status: "invalid", fields: invalidFields });
      return;
    }

    setState({ status: "submitting" });
    setMailtoHref(null);

    // Email draft with the same details, used when the leads API is not configured
    // or does not accept the enquiry.
    const subject = encodeURIComponent(`Project Enquiry: ${interest} — ${fullName}`);
    const body = encodeURIComponent(
      `Full Name: ${fullName}\n` +
      `Organisation: ${organisation || "Not specified"}\n` +
      `Email: ${email}\n` +
      `Phone: ${phone || "Not specified"}\n` +
      `Licensed Activity: ${interest}\n\n` +
      `Project Scope & Requirements:\n${message}\n\n` +
      `---\nSent via C P A CONTRACTING L.L.C website enquiry form`
    );
    const mailLink = `mailto:${emailDisplay}?subject=${subject}&body=${body}`;

    // 1. Send to the CPA leads API.
    if (leadsConfigured) {
      const result = await submitLead({ fullName, organisation, email, phone, interest, message }, honeypot);
      if (result.status === "accepted") form.reset();
      if (result.status === "rejected") setMailtoHref(mailLink);
      setState(result);
      return;
    }

    // 2. Leads API not configured in this build: open a prefilled email draft instead.
    setMailtoHref(mailLink);
    window.location.href = mailLink;
    setState({ status: "accepted" });
  }

  const invalid = state.status === "invalid" ? state.fields : [];
  const isSubmitting = state.status === "submitting";

  return (
    <form className="form" onSubmit={onSubmit} noValidate aria-describedby="enquiry-status">
      <div className="form-row">
        <Field
          id="fullName"
          name="fullName"
          label={copy.contact.labels.fullName}
          placeholder="e.g. Karun Arora"
          required
          disabled={isSubmitting}
          invalid={invalid.includes("fullName")}
        />
        <Field
          id="organisation"
          name="organisation"
          label={copy.contact.labels.organisation}
          placeholder="e.g. Developer / Infrastructure Group"
          disabled={isSubmitting}
        />
      </div>
      <div className="form-row">
        <Field
          id="email"
          name="email"
          type="email"
          label={copy.contact.labels.email}
          placeholder="name@company.com"
          required
          disabled={isSubmitting}
          invalid={invalid.includes("email")}
          hint="The email address for the reply."
        />
        <Field
          id="phone"
          name="phone"
          type="tel"
          label={copy.contact.labels.phone}
          placeholder="+971 50 123 4567"
          disabled={isSubmitting}
        />
      </div>
      <div className="field">
        <label htmlFor="interest">
          {copy.contact.labels.interest} <span className="meta">{copy.contact.required}</span>
        </label>
        <select
          id="interest"
          name="interest"
          required
          disabled={isSubmitting}
          defaultValue={defaultInterest}
          aria-invalid={invalid.includes("interest") || undefined}
          aria-describedby={invalid.includes("interest") ? "interest-error" : undefined}
        >
          {interests.map((item) => (
            <option key={item} value={item}>{item}</option>
          ))}
        </select>
        {invalid.includes("interest") ? <span id="interest-error" className="field-error">{copy.contact.invalid}</span> : null}
      </div>
      <Field
        id="message"
        name="message"
        label={copy.contact.labels.message}
        placeholder="Provide your project location in Dubai, scope of works, and timeline..."
        required
        disabled={isSubmitting}
        invalid={invalid.includes("message")}
        multiline
      />

      {/* Honeypot for spam bots: hidden from people and assistive tech, must stay empty. */}
      <div className="sr-only" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" defaultValue="" />
      </div>

      {state.status !== "idle" && (
        <div id="enquiry-status" className={noticeClass(state)} role="status">
          <p style={{ margin: 0 }}>{noticeText(state)}</p>
          {(state.status === "accepted" || state.status === "rejected") && mailtoHref && (
            <p style={{ margin: "0.5rem 0 0", fontSize: "0.8125rem" }}>
              {state.status === "rejected" ? "Or send it by email instead:" : "Did your email client not open?"}{" "}
              <a href={mailtoHref} style={{ color: "inherit", textDecoration: "underline", fontWeight: 600 }}>
                Click here to dispatch directly to {emailDisplay}
              </a>
            </p>
          )}
        </div>
      )}

      <p className="form-note">{copy.contact.privacy}</p>
      <button className="button" type="submit" disabled={isSubmitting} aria-describedby="enquiry-status">
        {isSubmitting ? copy.contact.sending : copy.contact.submit}
      </button>
    </form>
  );
}

function noticeClass(state: EnquiryResult) {
  if (state.status === "accepted") return "notice notice-ok";
  if (state.status === "rejected" || state.status === "invalid") return "notice notice-bad";
  return "notice";
}

function noticeText(state: EnquiryResult) {
  if (state.status === "accepted") return copy.contact.accepted;
  if (state.status === "rejected") return copy.contact.rejected;
  if (state.status === "invalid") return copy.contact.invalid;
  if (state.status === "unconfigured") return copy.contact.unconfigured;
  if (state.status === "submitting") return copy.contact.sending;
  return "";
}

function Field({
  id,
  name,
  label,
  placeholder,
  type = "text",
  required = false,
  disabled = false,
  invalid = false,
  multiline = false,
  hint,
}: {
  id: string;
  name: string;
  label: string;
  placeholder?: string;
  type?: string;
  required?: boolean;
  disabled?: boolean;
  invalid?: boolean;
  multiline?: boolean;
  hint?: string;
}) {
  const describedBy = [hint ? `${id}-hint` : null, invalid ? `${id}-error` : null].filter(Boolean).join(" ") || undefined;
  const control = {
    id,
    name,
    placeholder,
    required,
    disabled,
    "aria-invalid": invalid || undefined,
    "aria-describedby": describedBy,
  };
  return (
    <div className="field">
      <label htmlFor={id}>
        {label} {required ? <span className="meta">{copy.contact.required}</span> : null}
      </label>
      {multiline ? <textarea {...control} /> : <input {...control} type={type} />}
      {hint ? <span id={`${id}-hint`} className="meta">{hint}</span> : null}
      {invalid ? <span id={`${id}-error`} className="field-error">{copy.contact.invalid}</span> : null}
    </div>
  );
}
