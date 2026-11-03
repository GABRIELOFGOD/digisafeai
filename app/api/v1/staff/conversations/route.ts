import { authorizeAdminApi } from "@/lib/auth/admin-api";
import { connectToDatabase } from "@/lib/db/mongoose";
import { listConversationSummaries } from "@/features/companion/chat.service";

export async function GET(request: Request) {
  const authorization = await authorizeAdminApi(request);
  if ("response" in authorization) return authorization.response;

  const pageValue = new URL(request.url).searchParams.get("page") ?? "1";
  const page = Number(pageValue);
  if (!Number.isSafeInteger(page) || page < 1) {
    return Response.json({ error: "Invalid archive page." }, { status: 400 });
  }

  try {
    await connectToDatabase();
    const archive = await listConversationSummaries(page);
    return Response.json(archive, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    console.error(
      "Companion archive could not be loaded.",
      error instanceof Error ? error.name : "UnknownError",
    );
    return Response.json(
      { error: "The conversation archive could not be loaded." },
      { status: 503 },
    );
  }
}
