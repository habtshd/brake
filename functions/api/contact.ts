import {
  badRequest,
  forbidden,
  getClientIp,
  getJsonBody,
  getRateLimitPerHour,
  internalError,
  json,
  normalizeMultiline,
  normalizeWhitespace,
  sendResendEmail,
  validateContactInput,
  verifyCsrf,
  MAX_FULL_NAME,
  MAX_EMAIL,
  MAX_PROJECT_DETAILS,
  escapeHtml
} from "../shared";

const TABLE = "contact_messages";
const RATE_TABLE = "contact_rate_limits";

function getOrigin(request: Request) {
  return request.headers.get("Origin") || request.headers.get("Referer") || "";
}

function isAllowedOrigin(request: Request, siteUrl?: string) {
  if (!siteUrl) return true;
  const origin = getOrigin(request);
  if (!origin) return false;
  return origin.startsWith(siteUrl);
}

export async function onRequestPost({ request, env, waitUntil }: any) {
  try {
    if (!isAllowedOrigin(request, env.SITE_URL)) {
      return forbidden("Invalid request origin.");
    }

    if (!(await verifyCsrf(request, env.SESSION_SECRET, "brake_contact_csrf", "X-CSRF-Token"))) {
      return forbidden("Invalid security token.");
    }

    const body = await getJsonBody(request);
    const honeypot = normalizeWhitespace(String(body.honeypot ?? ""));
    if (honeypot) {
      return badRequest("Submission rejected.");
    }

    const { ok, errors, sanitized } = validateContactInput({
      fullName: body.fullName,
      email: body.email,
      projectDetails: body.projectDetails
    });

    if (!ok) {
      return badRequest("Please correct the highlighted fields.", errors);
    }

    const ip = getClientIp(request);
    const now = new Date();
    const windowStart = new Date(now.getTime() - 60 * 60 * 1000).toISOString();
    const limit = getRateLimitPerHour(env);

    const recent = await env.DB.prepare(
      `SELECT COUNT(*) as count
       FROM ${TABLE}
       WHERE created_at >= ? AND ip_address = ?`
    )
      .bind(windowStart, ip)
      .first();

    if ((recent?.count ?? 0) >= limit) {
      return new Response(JSON.stringify({ error: "Too many submissions. Please wait and try again." }), {
        status: 429,
        headers: { "Content-Type": "application/json" }
      });
    }

    const createdAt = now.toISOString();
    const insert = await env.DB.prepare(
      `INSERT INTO ${TABLE} (full_name, email, project_details, created_at, status, ip_address)
       VALUES (?, ?, ?, ?, 'new', ?)
       RETURNING id`
    )
      .bind(sanitized.fullName, sanitized.email, sanitized.projectDetails, createdAt, ip)
      .first();

    const submissionId = insert?.id;
    if (!submissionId) {
      throw new Error("Database insert failed");
    }

    const subject = `Brake.net inquiry from ${sanitized.fullName}`;
    const prettyDate = new Intl.DateTimeFormat("en", {
      dateStyle: "medium",
      timeStyle: "short",
      timeZone: "Africa/Addis_Ababa"
    }).format(now);

    const html = `
      <h2>New contact submission</h2>
      <p><strong>Name:</strong> ${escapeHtml(sanitized.fullName)}</p>
      <p><strong>Email:</strong> ${escapeHtml(sanitized.email)}</p>
      <p><strong>Submitted:</strong> ${escapeHtml(prettyDate)}</p>
      <p><strong>Details:</strong></p>
      <pre style="white-space:pre-wrap;font-family:inherit">${escapeHtml(sanitized.projectDetails)}</pre>
    `;

    const plainText = [
      `Name: ${sanitized.fullName}`,
      `Email: ${sanitized.email}`,
      `Submitted: ${prettyDate}`,
      "",
      sanitized.projectDetails
    ].join("\n");

    const emailTasks: Promise<unknown>[] = [];

    if (env.RESEND_API_KEY && env.CONTACT_TO_EMAIL && env.CONTACT_FROM_EMAIL) {
      emailTasks.push(
        sendResendEmail({
          apiKey: env.RESEND_API_KEY,
          from: env.CONTACT_FROM_EMAIL,
          to: env.CONTACT_TO_EMAIL,
          replyTo: sanitized.email,
          subject,
          html,
          text: plainText
        })
      );
    }

    if (env.RESEND_API_KEY && env.CONTACT_FROM_EMAIL) {
      emailTasks.push(
        sendResendEmail({
          apiKey: env.RESEND_API_KEY,
          from: env.CONTACT_FROM_EMAIL,
          to: sanitized.email,
          subject: "We received your Brake.net message",
          html: `
            <p>Thanks for reaching out to Brake.net.</p>
            <p>We received your message and will review it shortly.</p>
          `,
          text: "Thanks for reaching out to Brake.net. We received your message and will review it shortly."
        })
      );
    }

    waitUntil(Promise.allSettled(emailTasks));

    return json(
      {
        success: true,
        message: "Your message has been submitted successfully.",
        id: submissionId
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Contact submission error:", error);
    return internalError("Unable to send your message right now.");
  }
}
