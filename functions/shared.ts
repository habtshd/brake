import {
  MAX_PROJECT_DETAILS,
  MAX_FULL_NAME,
  MAX_EMAIL,
  normalizeMultiline,
  normalizeWhitespace,
  validateContactInput,
  escapeHtml,
  toCsvCell,
  truncate,
  getClientIp
} from "../lib/contact";
import { createSignedToken, verifySignedToken, isExpired } from "../lib/crypto";

type D1Database = any;

type Env = {
  DB: D1Database;
  RESEND_API_KEY: string;
  CONTACT_FROM_EMAIL: string;
  CONTACT_TO_EMAIL: string;
  SITE_URL: string;
  SESSION_SECRET: string;
  ADMIN_PASSWORD: string;
  ADMIN_SESSION_TTL_SECONDS?: string;
  RATE_LIMIT_PER_HOUR?: string;
};

export {
  MAX_PROJECT_DETAILS,
  MAX_FULL_NAME,
  MAX_EMAIL,
  normalizeMultiline,
  normalizeWhitespace,
  validateContactInput,
  escapeHtml,
  toCsvCell,
  truncate,
  getClientIp,
  createSignedToken,
  verifySignedToken,
  isExpired
};

export type { Env };

export function json(data: unknown, init: ResponseInit = {}) {
  return Response.json(data, {
    headers: {
      "Cache-Control": "no-store",
      ...(init.headers ?? {})
    },
    ...init
  });
}

export function text(body: string, init: ResponseInit = {}) {
  return new Response(body, {
    ...init,
    headers: {
      "Cache-Control": "no-store",
      ...(init.headers ?? {})
    }
  });
}

export function badRequest(message: string, errors?: Record<string, string>) {
  return json({ error: message, errors }, { status: 400 });
}

export function unauthorized(message = "Unauthorized") {
  return json({ error: message }, { status: 401 });
}

export function forbidden(message = "Forbidden") {
  return json({ error: message }, { status: 403 });
}

export function notFound(message = "Not found") {
  return json({ error: message }, { status: 404 });
}

export function tooManyRequests(message = "Too many requests") {
  return json({ error: message }, { status: 429 });
}

export function internalError(message = "Internal server error") {
  return json({ error: message }, { status: 500 });
}

export function getCookie(request: Request, name: string) {
  const cookie = request.headers.get("Cookie");
  if (!cookie) return null;
  const parts = cookie.split(/;\s*/);
  for (const part of parts) {
    const [key, ...rest] = part.split("=");
    if (key === name) return rest.join("=");
  }
  return null;
}

export function buildCookie(
  name: string,
  value: string,
  {
    maxAge,
    httpOnly = true,
    sameSite = "Lax",
    secure = true,
    path = "/"
  }: {
    maxAge: number;
    httpOnly?: boolean;
    sameSite?: "Lax" | "Strict" | "None";
    secure?: boolean;
    path?: string;
  }
) {
  const parts = [`${name}=${value}`, `Path=${path}`, `Max-Age=${maxAge}`, `SameSite=${sameSite}`];
  if (httpOnly) parts.push("HttpOnly");
  if (secure) parts.push("Secure");
  return parts.join("; ");
}

export async function sendResendEmail({
  apiKey,
  from,
  to,
  replyTo,
  subject,
  html,
  text: plainText
}: {
  apiKey: string;
  from: string;
  to: string | string[];
  replyTo?: string;
  subject: string;
  html: string;
  text: string;
}) {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      from,
      to,
      reply_to: replyTo,
      subject,
      html,
      text: plainText
    })
  });

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new Error(`Resend error: ${response.status} ${body}`);
  }

  return response.json().catch(() => ({}));
}

export async function verifyCsrf(request: Request, secret: string, cookieName: string, headerName: string) {
  const token = request.headers.get(headerName);
  const cookie = getCookie(request, cookieName);
  if (!token || !cookie || token !== cookie) return false;
  const payload = await verifySignedToken(token, secret);
  if (!payload?.exp || isExpired(Number(payload.exp))) return false;
  return true;
}

export function getJsonBody(request: Request, maxBytes = 20_000) {
  const length = Number(request.headers.get("content-length") ?? "0");
  if (Number.isFinite(length) && length > maxBytes) {
    throw new Error("Request body too large");
  }
  return request.json();
}

export function getAdminSessionSecret(env: Env) {
  return env.SESSION_SECRET || "change-me";
}

export function getAdminSessionMaxAge(env: Env) {
  return Number(env.ADMIN_SESSION_TTL_SECONDS || "604800");
}

export function getRateLimitPerHour(env: Env) {
  return Number(env.RATE_LIMIT_PER_HOUR || "5");
}
