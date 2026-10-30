import "server-only";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getAuth } from "@/lib/auth";

export async function getStaffSession(requestHeaders: Headers) {
  const session = await getAuth().api.getSession({ headers: requestHeaders });

  if (
    !session ||
    (session.user.role !== "admin" &&
      session.user.role !== "safeguarding_officer")
  ) {
    return null;
  }

  return session;
}

export async function requireStaffSession() {
  const session = await getStaffSession(await headers());

  if (!session) {
    redirect("/staff/login");
  }

  return session;
}
