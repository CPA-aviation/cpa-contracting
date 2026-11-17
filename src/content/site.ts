export const phoneDisplay = "+971 52 781 9949";
export const phoneHref = "tel:+971527819949";
export const emailDisplay = "cpacontractingllc@gmail.com";
export const emailHref = "mailto:cpacontractingllc@gmail.com";
export const officeAddress = "Office No. 707, Burlington Tower, Business Bay, Dubai, UAE";

export const nav = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/building-contracting", label: "Building Contracting" },
  { href: "/road-contracting", label: "Road Contracting" },
  { href: "/approach", label: "Approach" },
  { href: "/leadership", label: "Leadership" },
  { href: "/contact", label: "Contact" },
] as const;

export const interests = [
  "Building Contracting",
  "Road Contracting",
  "General",
] as const;

export type Interest = (typeof interests)[number];

export const copy = {
  wordmark: "C P A CONTRACTING",
  legalName: "C P A CONTRACTING L.L.C",
  skip: "Skip to content",
  openMenu: "Open menu",
  closeMenu: "Close menu",
  primaryCta: "Request an enquiry",
  secondaryCta: "View our approach",
  footerLegal:
    "C P A CONTRACTING L.L.C · Dubai, United Arab Emirates · Registered 2026",
  footerMeta: "Licence No. 1641004",
  independence: "This website is for C P A CONTRACTING L.L.C only.",
  hero: {
    headline: "Building and road contracting.",
    support:
      "C P A CONTRACTING L.L.C is a Dubai company, licensed for Building Contracting and Road Contracting.",
  },
  services: {
    eyebrow: "Licensed activities",
    headline: "Two licensed activities.",
    support:
      "The Dubai commercial licence lists Building Contracting and Road Contracting. Those are the only services published on this site.",
    building: {
      title: "Building Contracting",
      body: "Building Contracting is a licensed activity of C P A CONTRACTING L.L.C. This site does not add building specialisms beyond that licence.",
    },
    road: {
      title: "Road Contracting",
      body: "Road Contracting is a licensed activity of C P A CONTRACTING L.L.C. This site does not add road specialisms beyond that licence.",
    },
  },
  company: {
    headline: "C P A CONTRACTING L.L.C",
    lead: "A limited liability company in Dubai, licensed for Building Contracting and Road Contracting.",
    body: [
      "C P A CONTRACTING L.L.C is a standalone company. This website does not represent a CPA Group and it does not represent any other company.",
      "The Dubai Department of Economy and Tourism licence authorises two activities: Building Contracting and Road Contracting. The site does not publish work, plant, staff numbers, or certifications that are not on that licence.",
    ],
    facts: [
      ["Legal form", "Limited Liability Company (L.L.C)"],
      ["Registered", "2026"],
      ["Licence No.", "1641004"],
      ["Commercial Register No.", "2900890"],
      ["Licensed activities", "Building Contracting; Road Contracting"],
    ] as const,
  },
  approach: {
    eyebrow: "Enquiry",
    headline: "Ask within the licence.",
    support:
      "The approach page describes how to enquire. It is not a project portfolio and it is not a construction method statement.",
    read: "Read the approach",
    title: "Our Approach",
    lead: "Four steps for an enquiry. These steps are not a construction method and they are not a promise of appointment.",
    steps: [
      {
        title: "Discover",
        body: "Tell us whether the request is Building Contracting or Road Contracting, and where it would be. If it is outside those two activities, this site does not offer it.",
      },
      {
        title: "Mobilise",
        body: "“Mobilise” on this site means the enquiry is clear enough to discuss. It does not mean that people, plant, or a programme are ready.",
      },
      {
        title: "Execute",
        body: "If work goes ahead, it follows a written agreement. This page does not describe how a site is run.",
      },
      {
        title: "Handover",
        body: "Records of completion follow that written agreement. None are published here.",
      },
    ],
    closing: "There is no project portfolio on this site.",
  },
  leadership: {
    headline: "Leadership",
    lead: "The company is led by its two Promoters.",
    people: [
      {
        name: "Mr. Karun Arora",
        title: "Promoter",
        image: "/images/leadership/karun-arora.jpg",
      },
      {
        name: "Mr. Vansh Arora",
        title: "Promoter",
        image: "/images/leadership/vansh-arora.jpg",
      },
    ],
    publicLine:
      "Mr. Karun Arora and Mr. Vansh Arora are the Promoters of C P A CONTRACTING L.L.C.",
  },
  contact: {
    headline: "Contact",
    lead: "Call the published number, or send the form. A success message appears only after the server accepts the enquiry.",
    unconfigured:
      "The enquiry form is not connected yet. It cannot confirm receipt. Call +971 52 781 9949.",
    labels: {
      fullName: "Full name",
      organisation: "Organisation",
      email: "Email",
      phone: "Phone",
      interest: "Interest",
      message: "Message",
    },
    submit: "Send enquiry",
    sending: "Sending.",
    accepted: "Your enquiry was accepted.",
    rejected:
      "Your enquiry was not accepted. It has not been confirmed as received. You can try again or call +971 52 781 9949.",
    invalid: "Check the highlighted fields and try again.",
    required: "Required",
    privacy:
      "By sending this form you ask the company to receive this enquiry.",
  },
  drawingCaption: "Illustrative drawing · Not to scale · Not a company project",
} as const;

/** Drawing-sheet references used as section labels (a drafting convention, not project data). */
export const sheets = {
  home: "Sheet 00 — General arrangement",
  building: "Sheet 01 — Building Contracting",
  road: "Sheet 02 — Road Contracting",
  company: "Sheet 03 — Company",
  approach: "Sheet 04 — Enquiry sequence",
  leadership: "Sheet 05 — Management",
  contact: "Sheet 06 — Contact",
} as const;

export const pages = {
  about: {
    eyebrow: "Company",
    headline: copy.company.headline,
    lead: copy.company.lead,
    body: copy.company.body,
    independence: copy.independence,
    description: copy.company.lead,
  },
  building: {
    index: "01",
    headline: "Building Contracting",
    lead: "A licensed activity of C P A CONTRACTING L.L.C in Dubai.",
    body: [
      "C P A CONTRACTING L.L.C may be asked about Building Contracting. Scope and commercial terms, if any, are set in a written agreement. They are not set by this page.",
      "This page does not publish projects, clients, method statements, plant, or staff numbers.",
    ],
    sendTitle: "What you can send",
    send: [
      "Say that the request is for Building Contracting.",
      "Give the location in the message.",
      "Wait for a reply by telephone or through the form’s accepted response.",
      "Treat any later engagement as subject to a written agreement.",
    ],
    description:
      "Building Contracting is a licensed activity of C P A CONTRACTING L.L.C in Dubai. This page does not add projects, methods, plant, or staff numbers.",
  },
  road: {
    index: "02",
    headline: "Road Contracting",
    lead: "A licensed activity of C P A CONTRACTING L.L.C in Dubai.",
    body: [
      "C P A CONTRACTING L.L.C may be asked about Road Contracting. Scope and commercial terms, if any, are set in a written agreement. They are not set by this page.",
      "This page does not publish projects, clients, method statements, plant, or staff numbers.",
    ],
    sendTitle: "What you can send",
    send: [
      "Say that the request is for Road Contracting.",
      "Give the location in the message.",
      "Wait for a reply by telephone or through the form’s accepted response.",
      "Treat any later engagement as subject to a written agreement.",
    ],
    description:
      "Road Contracting is a licensed activity of C P A CONTRACTING L.L.C in Dubai. This page does not add projects, clients, or operational claims.",
  },
  approach: {
    eyebrow: copy.approach.eyebrow,
    headline: copy.approach.title,
    lead: copy.approach.lead,
    steps: copy.approach.steps,
    closing: copy.approach.closing,
    description: copy.approach.lead,
  },
  leadership: {
    headline: copy.leadership.headline,
    lead: copy.leadership.lead,
    people: copy.leadership.people,
    note: "Promoters of C P A CONTRACTING L.L.C.",
    publicLine: copy.leadership.publicLine,
    description: copy.leadership.publicLine,
  },
  contact: {
    headline: copy.contact.headline,
    lead: copy.contact.lead,
    description: "Call +971 52 781 9949, email cpacontractingllc@gmail.com, or visit Office No. 707, Burlington Tower, Business Bay, Dubai, UAE.",
  },
} as const;
