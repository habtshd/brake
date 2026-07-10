import {
  getCookie,
  isExpired,
  notFound,
  json,
  text,
  toCsvCell,
  truncate,
  verifySignedToken,
  unauthorized
} from "../../../shared";

const TABLE = "contact_messages";

async function requireAdmin(request: Request, env: any) {
  const token = getCookie(request, "brake_admin_session");
  if (!token) return false;
  const payload = await verifySignedToken(token, env.SESSION_SECRET);
  return Boolean(payload && !isExpired(Number(payload.exp)) && payload.role === "admin");
}

export async function onRequestGet({ request, env }: any) {
  if (!(await requireAdmin(request, env))) return unauthorized();

  const url = new URL(request.url);
  const search = url.searchParams.get("search")?.trim() ?? "";
  const status = url.searchParams.get("status")?.trim() ?? "";
  const format = url.searchParams.get("format")?.trim() ?? "";

  const where: string[] = [];
  const bindings: string[] = [];

  if (search) {
    where.push("(full_name LIKE ? OR email LIKE ? OR project_details LIKE ?)");
    const like = `%${search}%`;
    bindings.push(like, like, like);
  }

  if (status && ["new", "read", "replied"].includes(status)) {
    where.push("status = ?");
    bindings.push(status);
  }

  const query = `SELECT id, full_name, email, project_details, created_at, status
                 FROM ${TABLE}
                 ${where.length ? `WHERE ${where.join(" AND ")}` : ""}
                 ORDER BY created_at DESC`;

  const { results } = await env.DB.prepare(query).bind(...bindings).all();
  const messages: Array<{
    id: number;
    fullName: string;
    email: string;
    projectDetails: string;
    createdAt: string;
    status: string;
  }> = (results ?? []).map((row: any) => ({
    id: Number(row.id),
    fullName: row.full_name,
    email: row.email,
    projectDetails: row.project_details,
    createdAt: row.created_at,
    status: row.status
  }));

  if (format === "csv") {
    const lines = [
      ["id", "fullName", "email", "projectDetails", "createdAt", "status"].join(","),
      ...messages.map((message) =>
        [
          toCsvCell(message.id),
          toCsvCell(message.fullName),
          toCsvCell(message.email),
          toCsvCell(truncate(message.projectDetails, 500)),
          toCsvCell(message.createdAt),
          toCsvCell(message.status)
        ].join(",")
      )
    ];

    return text(lines.join("\n"), {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="brake-messages.csv"`
      }
    });
  }

  return json({ success: true, messages });
}
