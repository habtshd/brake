import { buildCookie, json } from "../../shared";

export async function onRequestPost() {
  return json(
    { success: true },
    {
      headers: {
        "Set-Cookie": buildCookie("brake_admin_session", "", {
          maxAge: 0,
          secure: true,
          sameSite: "Lax"
        })
      }
    }
  );
}
