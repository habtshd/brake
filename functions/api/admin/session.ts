import { getCookie, json, isExpired, verifySignedToken, unauthorized } from "../../shared";

export async function onRequestGet({ request, env }: any) {
  const token = getCookie(request, "brake_admin_session");
  if (!token) return unauthorized();

  const payload = await verifySignedToken(token, env.SESSION_SECRET);
  if (!payload || isExpired(Number(payload.exp)) || payload.role !== "admin") {
    return unauthorized();
  }

  return json({ authenticated: true });
}
