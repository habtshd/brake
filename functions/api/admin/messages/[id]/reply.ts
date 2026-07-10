import {
  badRequest,
  escapeHtml,
  getCookie,
  getJsonBody,
  internalError,
  isExpired,
  json,
  sendResendEmail,
  unauthorized,
  verifySignedToken
} from "../../../../shared";

const TABLE = "contact_messages";

async function requireAdmin(request: Request, env: any) {
  const token = getCookie(request, "brake_admin_session");
  if (!token) return false;
  const payload = await verifySignedToken(token, env.SESSION_SECRET);
  return Boolean(payload && !isExpired(Number(payload.exp)) && payload.role === "admin");
}

export async function onRequestPost({ request, env, params, waitUntil }: any) {
  if (!(await requireAdmin(request, env))) return unauthorized();

  const id = Number(params.id);
  const body = await getJsonBody(request).catch(() => null);
  const replyText = String(body?.replyText ?? "").trim();
  if (!replyText) return badRequest("Reply text is required.");

  const row = await env.DB.prepare(
    `SELECT id, full_name, email, project_details, created_at, status
     FROM ${TABLE}
     WHERE id = ?`
  )
    .bind(id)
    .first();

  if (!row) {
    return json({ error: "Message not found." }, { status: 404 });
  }

  try {
    if (env.RESEND_API_KEY && env.CONTACT_FROM_EMAIL) {
      await sendResendEmail({
        apiKey: env.RESEND_API_KEY,
        from: env.CONTACT_FROM_EMAIL,
        to: row.email,
        replyTo: env.CONTACT_FROM_EMAIL,
        subject: `Re: Brake.net inquiry from ${row.full_name}`,
        html: `<p>${escapeHtml(replyText).replace(/\n/g, "<br/>")}</p>`,
        text: replyText
      });
    }

    await env.DB.prepare(`UPDATE ${TABLE} SET status = 'replied' WHERE id = ?`).bind(id).run();

    return json({ success: true });
  } catch (error) {
    console.error("Reply send error:", error);
    return internalError("Could not send reply.");
  }
}
