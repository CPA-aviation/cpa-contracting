"use client";

import { useState, type FormEvent } from "react";
import { submitEnquiry } from "@/app/actions";
import type { EnquiryResult } from "@/content/enquiry";
import { copy, interests, type Interest } from "@/content/site";

export function EnquiryForm({
  configured,
  defaultInterest = "Building Contracting",
}: {
  configured: boolean;
  defaultInterest?: Interest;
}) {
  const [state, setState] = useState<EnquiryResult>(
    configured ? { status: "idle" } : { status: "unconfigured" },
  );

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!configured) {
      setState({ status: "unconfigured" });
      return;
    }
    const data = new FormData(event.currentTarget);
    setState({ status: "submitting" });
    const result = await submitEnquiry({
      fullName: String(data.get("fullName") ?? ""),
      organisation: String(data.get("organisation") ?? ""),
      email: String(data.get("email") ?? ""),
      phone: String(data.get("phone") ?? ""),
      interest: String(data.get("interest") ?? "") as Interest,
      message: String(data.get("message") ?? ""),
    });
    setState(result);
  }

  const invalid = state.status === "invalid" ? state.fields : [];
  const locked = !configured || state.status === "submitting" || state.status === "accepted";

  return (
    <form className="form" onSubmit={onSubmit} noValidate aria-describedby="enquiry-status">
      <div className="form-row">
        <Field id="fullName" name="fullName" label={copy.contact.labels.fullName} required disabled={locked} invalid={invalid.includes("fullName")} />
        <Field id="organisation" name="organisation" label={copy.contact.labels.organisation} disabled={locked} />
      </div>
      <div className="form-row">
        <Field id="email" name="email" type="email" label={copy.contact.labels.email} required disabled={locked} invalid={invalid.includes("email")} hint="The email address for the reply." />
        <Field id="phone" name="phone" type="tel" label={copy.contact.labels.phone} disabled={locked} />
      </div>
      <div className="field">
        <label htmlFor="interest">
          {copy.contact.labels.interest} <span className="meta">{copy.contact.required}</span>
        </label>
        <select
          id="interest"
          name="interest"
          required
          disabled={locked}
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
      <Field id="message" name="message" label={copy.contact.labels.message} required disabled={locked} invalid={invalid.includes("message")} multiline />
      <p id="enquiry-status" className={noticeClass(state)} role="status">{noticeText(state)}</p>
      {configured ? <p className="form-note">{copy.contact.privacy}</p> : null}
      <button className="button" type="submit" disabled={locked} aria-describedby="enquiry-status">
        {state.status === "submitting" ? copy.contact.sending : copy.contact.submit}
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
  return "The form sends only when a server destination is configured.";
}

function Field({
  id, name, label, type = "text", required = false, disabled = false, invalid = false, multiline = false, hint,
}: {
  id: string;
  name: string;
  label: string;
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
