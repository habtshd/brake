import { createSignedToken, buildCookie, json, getAdminSessionSecret } from "../../shared";

export async function onRequestGet({ env }: any) {
  const token = await createSignedToken(
    {
      nonce: crypto.randomUUID(),
      exp: Date.now() + 60 * 60 * 1000
    },
    getAdminSessionSecret(env)
  );

  return json(
    { csrfToken: token },
    {
      headers: {
        "Set-Cookie": buildCookie("brake_contact_csrf", token, {
          maxAge: 60 * 60,
          secure: true,
          sameSite: "Lax"
        })
      }
    }
  );
}

