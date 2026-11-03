import { authorizeAdminApi } from "@/lib/auth/admin-api";
import {
  companionChatCodePattern,
  getConversation,
} from "@/features/companion/chat.service";
import { CompanionConversationModel } from "@/features/companion/chat.model";
import { connectToDatabase } from "@/lib/db/mongoose";

type ConversationRouteContext = {
  params: Promise<{ chatCode: string }>;
};

export async function GET(
  request: Request,
  { params }: ConversationRouteContext,
) {
  const authorization = await authorizeAdminApi(request);
  if ("response" in authorization) return authorization.response;

  const { chatCode } = await params;
  if (!companionChatCodePattern.test(chatCode)) {
    return Response.json({ error: "Conversation not found." }, { status: 404 });
  }

  try {
    await connectToDatabase();
    const conversation = await getConversation(chatCode);
    if (!conversation) {
      return Response.json({ error: "Conversation not found." }, { status: 404 });
    }

    return Response.json({ conversation }, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    console.error(
      "Companion conversation could not be loaded.",
      error instanceof Error ? error.name : "UnknownError",
    );
    return Response.json(
      { error: "The conversation could not be loaded." },
      { status: 503 },
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: ConversationRouteContext,
) {
  const authorization = await authorizeAdminApi(request, true);
  if ("response" in authorization) return authorization.response;

  const { chatCode } = await params;
  if (!companionChatCodePattern.test(chatCode)) {
    return Response.json({ error: "Conversation not found." }, { status: 404 });
  }

  try {
    await connectToDatabase();
    const result = await CompanionConversationModel.deleteOne({ chatCode });
    if (result.deletedCount === 0) {
      return Response.json({ error: "Conversation not found." }, { status: 404 });
    }

    return new Response(null, { status: 204 });
  } catch (error) {
    console.error(
      "Companion conversation could not be deleted.",
      error instanceof Error ? error.name : "UnknownError",
    );
    return Response.json(
      { error: "The conversation could not be deleted." },
      { status: 503 },
    );
  }
}
