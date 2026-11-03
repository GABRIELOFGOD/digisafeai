import { getAdminSession } from "@/lib/auth/admin-session";
import { isTrustedSameOrigin } from "@/lib/security/same-origin";

export async function authorizeAdminApi(request: Request, mutation = false) {
  if (mutation && !isTrustedSameOrigin(request)) {
    return {
      response: Response.json(
        { error: "Request origin was not accepted." },
        { status: 403 },
      ),
    };
  }

  const session = await getAdminSession(request.headers);
  if (!session) {
    return {
      response: Response.json(
        { error: "Administrator access required." },
        { status: 403 },
      ),
    };
  }

  return { session };
}
