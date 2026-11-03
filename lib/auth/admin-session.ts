import "server-only";
import { getStaffSession } from "@/lib/auth/staff-session";

export async function getAdminSession(requestHeaders: Headers) {
  const session = await getStaffSession(requestHeaders);
  return session?.user.role === "admin" ? session : null;
}
