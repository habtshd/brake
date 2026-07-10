import {
  badRequest,
  buildCookie,
  createSignedToken,
  getJsonBody,
  getAdminSessionMaxAge,
  getAdminSessionSecret,
  json,
  unauthorized
} from "../../shared";

export async function onRequestPost({ request, env }: any) {
  const body = await getJsonBody(request).catch(() => null);
  const password = String(body?.password ?? "").trim();

  if (!password) return badRequest("Password is required.");
  if (!env.ADMIN_PASSWORD || password !== env.ADMIN_PASSWORD) return unauthorized("Invalid password.");

  const token = await createSignedToken(
    {
      role: "admin",
      exp: Date.now() + getAdminSessionMaxAge(env) * 1000
    },
    getAdminSessionSecret(env)
  );

  return json(
    { success: true },
    {
      headers: {
        "Set-Cookie": buildCookie("brake_admin_session", token, {
          maxAge: getAdminSessionMaxAge(env),
          secure: true,
          sameSite: "Lax"
        })
      }
    }
  );
}
