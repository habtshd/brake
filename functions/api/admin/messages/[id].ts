import {
  getCookie,
  isExpired,
  json,
  notFound,
  unauthorized,
  verifySignedToken
} from "../../../shared";

const TABLE = "contact_messages";

async function requireAdmin(request: Request, env: any) {
  const token = getCookie(request, "brake_admin_session");
  if (!token) return false;
  const payload = await verifySignedToken(token, env.SESSION_SECRET);
  return Boolean(payload && !isExpired(Number(payload.exp)) && payload.role === "admin");
}

export async function onRequestGet({ request, env, params }: any) {
  if (!(await requireAdmin(request, env))) return unauthorized();
  const id = Number(params.id);
  const row = await env.DB.prepare(
    `SELECT id, full_name, email, project_details, created_at, status
     FROM ${TABLE}
     WHERE id = ?`
  )
    .bind(id)
    .first();
  if (!row) return notFound();
  return json({
    success: true,
    message: {
      id: Number(row.id),
      fullName: row.full_name,
      email: row.email,
      projectDetails: row.project_details,
      createdAt: row.created_at,
      status: row.status
    }
  });
}

export async function onRequestPatch({ request, env, params }: any) {
  if (!(await requireAdmin(request, env))) return unauthorized();
  const id = Number(params.id);
  const body = await request.json().catch(() => ({}));
  const status = String(body.status ?? "");
  if (!["new", "read", "replied"].includes(status)) {
    return json({ error: "Invalid status." }, { status: 400 });
  }

  await env.DB.prepare(`UPDATE ${TABLE} SET status = ? WHERE id = ?`)
    .bind(status, id)
    .run();

  return json({ success: true });
}

export async function onRequestDelete({ request, env, params }: any) {
  if (!(await requireAdmin(request, env))) return unauthorized();
  const id = Number(params.id);
  await env.DB.prepare(`DELETE FROM ${TABLE} WHERE id = ?`).bind(id).run();
  return json({ success: true });
}
