export type ContactMessageInput = {
  fullName: string;
  email: string;
  projectDetails: string;
};

export type ContactMessageRecord = ContactMessageInput & {
  id: number;
  status: "new" | "read" | "replied";
  createdAt: string;
};

export const MAX_FULL_NAME = 100;
export const MAX_EMAIL = 180;
export const MAX_PROJECT_DETAILS = 4000;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function normalizeWhitespace(input: string) {
  return input.replace(/\u0000/g, "").replace(/\s+/g, " ").trim();
}

export function normalizeMultiline(input: string) {
  return input
    .replace(/\u0000/g, "")
    .replace(/\r\n/g, "\n")
    .replace(/[ \t]+\n/g, "\n")
    .trim();
}

export function validateContactInput(input: Partial<ContactMessageInput>) {
  const errors: Record<string, string> = {};
  const fullName = normalizeWhitespace(String(input.fullName ?? ""));
  const email = normalizeWhitespace(String(input.email ?? "")).toLowerCase();
  const projectDetails = normalizeMultiline(String(input.projectDetails ?? ""));

  if (!fullName) errors.fullName = "Full name is required.";
  else if (fullName.length > MAX_FULL_NAME) errors.fullName = "Full name is too long.";

  if (!email) errors.email = "Email is required.";
  else if (email.length > MAX_EMAIL) errors.email = "Email is too long.";
  else if (!EMAIL_RE.test(email)) errors.email = "Enter a valid email address.";

  if (!projectDetails) errors.projectDetails = "Project details are required.";
  else if (projectDetails.length > MAX_PROJECT_DETAILS) {
    errors.projectDetails = "Project details are too long.";
  }

  const sanitized: ContactMessageInput = {
    fullName,
    email,
    projectDetails
  };

  return {
    ok: Object.keys(errors).length === 0,
    errors,
    sanitized
  };
}

export function escapeHtml(text: string) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function truncate(text: string, max = 120) {
  return text.length > max ? `${text.slice(0, max - 1)}…` : text;
}

export function toCsvCell(value: string | number | null | undefined) {
  const stringValue = String(value ?? "");
  return `"${stringValue.replace(/"/g, '""')}"`;
}

export function getClientIp(request: Request) {
  const forwarded = request.headers.get("cf-connecting-ip") || request.headers.get("x-forwarded-for");
  if (!forwarded) return "unknown";
  return forwarded.split(",")[0]?.trim() || "unknown";
}

