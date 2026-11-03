import { headers } from "next/headers";
import { z } from "zod";
import { ReportModel } from "@/features/reports/report.model";
import { getAdminSession } from "@/lib/auth/admin-session";
import { getAuth } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db/mongoose";
import { isTrustedSameOrigin } from "@/lib/security/same-origin";

const createAdminSchema = z
  .object({
    name: z.string().trim().min(2).max(100),
    email: z.string().trim().email().max(254),
    password: z.string().min(12).max(128),
  })
  .strict();

export async function GET() {
  const session = await getAdminSession(await headers());

  if (!session) {
    return Response.json({ error: "Administrator access required." }, { status: 403 });
  }

  await connectToDatabase();
  const users = await ReportModel.db
    .collection("user")
    .find(
      { role: "admin", banned: { $ne: true } },
      { projection: { _id: 1, name: 1, email: 1, createdAt: 1 } },
    )
    .sort({ name: 1 })
    .toArray();

  return Response.json({
    admins: users.map((user) => ({
      id: String(user._id),
      name: typeof user.name === "string" ? user.name : "",
      email: typeof user.email === "string" ? user.email : "",
      createdAt:
        user.createdAt instanceof Date ? user.createdAt.toISOString() : null,
    })),
  });
}

export async function POST(request: Request) {
  if (!isTrustedSameOrigin(request)) {
    return Response.json({ error: "Request origin was not accepted." }, { status: 403 });
  }

  const requestHeaders = await headers();
  const session = await getAdminSession(requestHeaders);

  if (!session) {
    return Response.json({ error: "Administrator access required." }, { status: 403 });
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }

  const result = createAdminSchema.safeParse(payload);
  if (!result.success) {
    return Response.json(
      { error: "Enter a name, valid email, and password with at least 12 characters." },
      { status: 400 },
    );
  }

  try {
    const created = await getAuth().api.createUser({
      body: { ...result.data, role: "admin" },
      headers: requestHeaders,
    });

    return Response.json(
      {
        admin: {
          id: created.user.id,
          name: created.user.name,
          email: created.user.email,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error(
      "Administrator account creation failed.",
      error instanceof Error ? error.name : "UnknownError",
    );
    return Response.json(
      { error: "The administrator account could not be created." },
      { status: 400 },
    );
  }
}
