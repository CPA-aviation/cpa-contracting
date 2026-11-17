import type { Interest } from "@/content/site";

export type EnquiryInput = {
  fullName: string;
  organisation: string;
  email: string;
  phone: string;
  interest: Interest;
  message: string;
};

export type EnquiryResult =
  | { status: "idle" }
  | { status: "submitting" }
  | { status: "unconfigured" }
  | { status: "accepted" }
  | { status: "rejected" }
  | { status: "invalid"; fields: string[] };
