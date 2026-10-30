import "server-only";
import { getAuthEnv } from "@/lib/env";

export function isTrustedSameOrigin(request: Request) {
  const origin = request.headers.get("origin");

  if (!origin) {
    return false;
  }

  try {
    return (
      new URL(origin).origin === new URL(getAuthEnv().BETTER_AUTH_URL).origin
    );
  } catch {
    return false;
  }
}
